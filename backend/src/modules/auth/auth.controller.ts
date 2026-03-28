import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Headers, // Thêm Headers decorator để lấy Authorization header
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} // DI: NestJS tự inject AuthService vào constructor

  // ── POST /api/v1/auth/register ──
  @Public() // Không cần JWT — ai cũng có thể đăng ký
  @Post('register') // @Post mặc định trả HTTP 201 Created — đúng cho register (tạo resource mới)
  register(@Body() dto: RegisterDto) {
    // @Body() + RegisterDto:
    //   1. Parse JSON body thành RegisterDto instance
    //   2. ValidationPipe chạy decorators (@IsEmail, @MinLength...)
    //   3. Nếu lỗi → throw BadRequestException tự động
    //   4. Nếu OK → dto được truyền vào method
    return this.authService.register(dto);
  }

  // ── POST /api/v1/auth/login ──
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Override: trả 200 thay vì 201 (login không tạo resource mới)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ── POST /api/v1/auth/refresh ──
  @Public() // Refresh không cần access token (vì access token đã hết hạn!)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  // ── POST /api/v1/auth/logout ──
  // KHÔNG có @Public() → cần JWT token
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser('id') userId: string,
    @Headers('authorization') auth: string,
    // @Headers('authorization') lấy nguyên header "Bearer xxx". Cần trích xuất token để thêm vào blacklist
  ) {
    const accessToken = auth?.replace('Bearer ', ''); // Bỏ prefix "Bearer " để lấy raw JWT token
    return this.authService.logout(userId, accessToken);
  }

  // ── POST /api/v1/auth/forgot-password ──
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // ── POST /api/v1/auth/reset-password ──
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
