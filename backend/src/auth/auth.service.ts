import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  // Constructor Injection — NestJS tự động inject hai service:
  // PrismaService: truy cập DB
  // JwtService: tạo/verify JWT token
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
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

    // Nếu không tìm thấy → token không tồn tại hoặc đã bị thu hồi
    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token or token has expired',
      );
    }

    // Bước 2: Verify JWT signature của refresh token
    try {
      await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Bước 3: Revoke token cũ
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Bước 4: Tạo access token + refresh token mới
    const tokens = await this.generateTokens(storedToken.userId, '');

    // Bước 5: Trả về tokens
    return tokens;
  }

  // ══════════════════════════════════════════════════════════════════════════════════════
  // LOGOUT — Đăng xuất
  // ══════════════════════════════════════════════════════════════════════════════════════
  async logout(userId: string, accessToken: string) {
    // Bước 1: Revoke TẤT CẢ refresh tokens của user này
    await this.prisma.refreshToken.updateMany({
      // updateMany — cập nhật nhiều records cùng lúc
      where: { userId: userId, revokedAt: null }, // revokedAt: null = chỉ revoke những token chưa bị revoke
      data: { revokedAt: new Date() },
    });

    // Bước 2: ═══ TOKEN BLACKLIST ═══
    // Thêm access token hiện tại vào bảng InvalidatedToken
    // → Token bị vô hiệu hóa TỨC THÌ, mọi request tiếp theo bị reject 401
    if (accessToken) {
      try {
        // Decode token để lấy thời gian hết hạn (exp)
        const decoded = this.jwtService.decode(accessToken);
        await this.prisma.invalidatedToken.create({
          data: {
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000),
            // exp là Unix timestamp (giây) → nhân 1000 thành millisecond
            // Lưu expiresAt để sau này cron job dọn dẹp records đã hết hạn
            reason: 'LOGOUT',
          },
        });
      } catch {
        // Nếu decode token thất bại → ignore, không làm gì cả
      }
    }

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

    // TODO: Gửi email chứa link reset (sẽ implement khi có email service)
    // Link có dạng: https://app.com/reset-password?token=<resetToken>
    console.log(`[DEV] Reset token for ${dto.email}: ${resetToken}`);

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
