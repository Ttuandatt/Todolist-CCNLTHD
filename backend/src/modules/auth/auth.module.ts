import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // JwtModule — module từ @nestjs/jwt, cung cấp JwtService cho DI
import { PassportModule } from '@nestjs/passport'; // PassportModule — kích hoạt Passport.js trong NestJS
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy'; // JwtStrategy — custom strategy để validate JWT token
import { MailModule } from '../../shared/mail/mail.module'; // MailModule — gửi email


@Module({
  imports: [
    PassportModule, // Đăng ký Passport — cho phép dùng AuthGuard('jwt')
    JwtModule.register({}),
    // Đăng ký JwtModule — cung cấp JwtService
    // {} = không truyền config mặc định ở đây
    // Vì ta truyền secret + expiresIn riêng cho từng signAsync() call trong AuthService
    // → Linh hoạt hơn: access token và refresh token có secret/expiry khác nhau
    MailModule, // Import MailModule để gửi email (forgot-password, welcome, etc.)
  ],
  controllers: [AuthController], // AuthController — xử lý các route /auth/login, /auth/register, ...
  providers: [AuthService, JwtStrategy], // AuthService — business logic. JwtStrategy — custom strategy để validate JWT token
  exports: [AuthService], // Export AuthService để các module khác có thể dùng
})
export class AuthModule {}
