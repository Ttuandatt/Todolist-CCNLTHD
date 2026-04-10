import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  // Constructor Injection — NestJS tự động inject các service:
  // JwtService: tạo/verify JWT token
  // PrismaService: truy cập DB
  // MailService: gửi email
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  // ══════════════════════════════════════════════════════════════════════════════════════
  // REGISTER — Đăng ký tài khoản mới
  // ══════════════════════════════════════════════════════════════════════════════════════
  async register(dto: RegisterDto) {
    // Bước 1: Kiểm tra email đã tồn tại chưa
    // findUnique tìm theo field có @unique trong schema
    // Trả null nếu không tìm thấy
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Nếu tồn tại → throw error
    // ConflictException → HTTP 409 Conflict
    // HttpExceptionFilter sẽ bắt và format response chuẩn
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Bước 2: Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10); // Tham số 10 = salt rounds (số vòng lặp hash)

    // Bước 3: Tạo user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.fullname,
        displayName: dto.displayName,
      },
    });

    // Bước 4: Tạo access token + refresh token
    const tokens = await this.generateTokens(user.id, user.email);

    // Bước 5:  Trả về tokens + thông tin user (KHÔNG trả password)
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
      },
      tokens,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════════════
  // LOGIN — Đăng nhập
  // ══════════════════════════════════════════════════════════════════════════════════════
  async login(dto: LoginDto) {
    // Bước 1: Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is not correct');
      // Không nói rõ "email không tồn tại" → tránh lộ thông tin user nào đã đăng ký
      // Đây là best practice bảo mật
    }

    // Bước 2: So sánh password
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    // bcrypt.compare:
    //   1. Rút salt từ trong hash
    //   2. Hash password nhập vào với cùng salt
    //   3. So sánh 2 hash → true nếu khớp
    if (!passwordMatch) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    // Bước 3: Cập nhật lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Bước 4: Tạo tokens + trả về
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
      },
      tokens,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════════════
  // REFRESH TOKEN — Lấy access token mới
  // ══════════════════════════════════════════════════════════════════════════════════════
  async refreshToken(dto: RefreshTokenDto) {
    // Bước 1: Tìm refresh token trong DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });

    // Không tìm thấy token trong DB
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Token đã hết hạn (theo cột expiresAt trong DB)
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Token đã bị revoke trước đó
    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Bước 2: Verify chữ ký + hạn sử dụng của JWT refresh token
    const jwtRefreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined. Set JWT_REFRESH_SECRET in .env or environment.',
      );
    }

    try {
      await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: jwtRefreshSecret,
      });
    } catch (error) {
      // JWT không hợp lệ hoặc đã hết hạn theo claim exp
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Bước 3: Revoke refresh token cũ trong DB
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Bước 4: Tạo access token + refresh token mới
    const tokens = await this.generateTokens(storedToken.userId, '');

    return tokens;
  }

  // ══════════════════════════════════════════════════════════════════════════════════════
  // LOGOUT — Đăng xuất
  // ══════════════════════════════════════════════════════════════════════════════════════
  async logout(userId: string, accessToken: string) {
    // Bước 1: Revoke tất cả refresh tokens còn hiệu lực của user
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Bước 2: Đưa access token hiện tại vào blacklist (InvalidatedToken)
    // Dùng jwtService.decode để lấy exp (Unix timestamp, giây)
    const decoded: any = this.jwtService.decode(accessToken) || {};
    let expiresAt = new Date();

    if (decoded && typeof decoded.exp === 'number') {
      expiresAt = new Date(decoded.exp * 1000);
    }

    await this.prisma.invalidatedToken.create({
      data: {
        token: accessToken,
        expiresAt,
        reason: 'LOGOUT',
      },
    });

    return { message: 'Logout successfully' };
  }

  // ═══════════════════════════════════════════
  // FORGOT PASSWORD — Yêu cầu reset mật khẩu
  // ═══════════════════════════════════════════
  async forgotPassword(dto: ForgotPasswordDto) {
    // Bước 1: Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Nếu không tìm thấy → throw error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Bước 2: Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Bước 3: Lưu reset token vào DB với thời hạn 15p
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), //reset token expires in 15 minutes
      },
    });

    // Bước 4: Gửi email chứa link reset password
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordResetEmail(user.email, user.name, resetLink);

    return { message: 'Reset password email sent' };
  }

  // ═══════════════════════════════════════════
  // RESET PASSWORD — Đặt lại mật khẩu
  // ═══════════════════════════════════════════
  async resetPassword(dto: ResetPasswordDto) {
    // Bước 1: Tìm token trong DB
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });

    if (
      !passwordReset ||
      passwordReset.usedAt ||
      passwordReset.expiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
      // 3 trường hợp reject:
      //   - Token không tồn tại trong DB
      //   - Token đã được dùng (usedAt !== null)
      //   - Token đã hết hạn (expiresAt < now)
    }

    // Bước 2: Hash password mới
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Bước 3: Cập nhật password + đánh dấu token đã dùng (dùng transaction)
    await this.prisma.$transaction([
      // $transaction — chạy nhiều queries trong 1 transaction
      // Nếu một query lỗi → TẤT CẢ đều rollback → đảm bảo data consistency
      this.prisma.user.update({
        where: { id: passwordReset.userId }, // Tìm user theo userId từ passwordReset
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.update({
        where: { id: passwordReset.id }, // Tìm token reset theo id
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  // ═══════════════════════════════════════════
  // HELPER: Tạo cặp Access Token + Refresh Token
  // ═══════════════════════════════════════════
  private async generateTokens(userId: string, email: string) {
    // Payload — dữ liệu sẽ được nhúng VÀO TRONG token
    // Ai có token đều đọc được payload (base64 decode) → KHÔNG đặt data nhạy cảm
    const payload = { sub: userId, email: email };
    // 'sub' = subject — convention của JWT spec, đại diện cho "ai sở hữu token này"

    // Tạo 2 token song song bằng Promise.all (nhanh hơn tạo tuần tự)
    const jwtSecret = this.config.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error(
        'JWT secrets are not defined. Set JWT_SECRET and JWT_REFRESH_SECRET in .env or environment.',
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      // Access Token: sống ngắn (15m), dùng secret chính
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: (this.config.get<string>('JWT_EXPIRES_IN') || '15m') as any,
      }),
      // Refresh Token: sống dài (7d), dùng secret riêng
      this.jwtService.signAsync(payload, {
        secret: jwtRefreshSecret,
        expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
      }),
    ]);

    // Lưu refresh token vào DB — để có thể revoke khi logout
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 900 giây = 15 phút — cho frontend biết khi nào cần refresh
    };
  }
}
