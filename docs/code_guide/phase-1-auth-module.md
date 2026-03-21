# Code Guide — Phase 1: Auth Module 🚀

> Ngày tạo: 2026-03-01
>
> Chào mừng đến với trái tim của hệ thống! Nếu ứng dụng là một tòa nhà, thì Auth Module chính là **quản lý tòa nhà kiêm bảo vệ**. Mọi module khác đều sẽ hỏi Auth: "Ê, người gọi API này là ai vậy? Có thẻ (JWT) không hợp lệ không?".

---

## Tổng quan — Ta sẽ làm gì ở Phase 1?

Mục tiêu rất rõ ràng: xây dựng **hệ thống xác thực hoàn chỉnh**:
1. ✅ `POST /auth/register` — đăng ký tài khoản (tự động hash password 🔒)
2. ✅ `POST /auth/login` — đăng nhập, cấp "thẻ ra vào" (access token) + "vé gian hạn" (refresh token)
3. ✅ `POST /auth/refresh` — lấy "thẻ ra vào" mới khi thẻ cũ hết hạn
4. ✅ `POST /auth/logout` — đăng xuất (thu hồi thẻ ngay lập tức 🛑)
5. ✅ `POST /auth/forgot-password` & `reset-password` — quên/đổi mật khẩu
6. ✅ `JwtAuthGuard` — bảo vệ mọi route (trừ route công khai)
7. ✅ `@CurrentUser()` — lấy nhanh thông tin "ai đang thao tác?"

### Kỹ thuật sử dụng
- **bcrypt**: Băm mật khẩu một chiều — bảo vệ user kể cả khi database bị hack.
- **JWT (JSON Web Token)**: "Thẻ ra vào" xách tay, không cần lưu trong database.
- **Passport.js**: Thư viện xác thực "quốc dân" của Node.js, dùng kèm **Strategy pattern**.

> 💡 Nhớ lại **Chương 7 (Authentication & Authorization)** trong báo cáo chưa? Đây chính là lúc biến lý thuyết thành code!

---

## Bước 1: Thêm JWT secret vào .env 🔑

📁 **File:** `.env` (thêm vào cuối file)

### Tại sao?
Để JWT an toàn, Server phải ký nó bằng một **khóa bí mật (secret key)**. Giống như mộc đỏ của công ty — nếu bị lộ, ai cũng tự đóng mộc giả được.

```env
# JWT Configuration
JWT_SECRET=todolist-collab-super-secret-key-2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=todolist-collab-refresh-secret-key-2026
JWT_REFRESH_EXPIRES_IN=7d
```

> **Hỏi nhanh:** Tại sao phải tách riêng `JWT_SECRET` và `JWT_REFRESH_SECRET`? Vì Access token sống ngắn (15m), dùng liên tục. Refresh token sống dài (7d), chỉ dùng khi xin token mới. Tách chiết ra giúp giảm rủi ro nếu một khóa bị lộ.

---

## Bước 2: Tạo DTOs — Cửa khẩu kiểm duyệt 🛂

### Tại sao?
Đừng bao giờ tin user! Họ có thể gửi email sai format, password quá ngắn, hoặc cố nhét thêm cờ `{ role: "admin" }` để hack. DTO + ValidationPipe (từ Phase 0) sẽ chặn bắt mọi lỗi từ cửa.

### 2a. Register DTO
📁 **File:** `src/auth/dto/register.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty()
  // Regex bắt buộc: 1 HOA, 1 thường, 1 số, 1 ký tự đặc biệt (@$!%*?&)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Fullname should not be empty' })
  fullname!: string;  // Tên field là fullname → sẽ map sang user.name trong service
}
```

### 2b. Các DTO còn lại
Tương tự, ta tạo nhanh các cửa khẩu khác. (Không rườm rà, tập trung vào rule):

📁 **File:** `src/auth/dto/login.dto.ts`
```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' }) email!: string;
  @IsString() @IsNotEmpty({ message: 'Mật khẩu trống' }) password!: string;
}
// Tại sao Login không check regex password? Vì login chỉ cần "gửi gì so nấy", nếu sai thì báo sai thôi.
```

📁 **File:** `src/auth/dto/refresh-token.dto.ts`
```typescript
import { IsNotEmpty, IsString } from 'class-validator';
export class RefreshTokenDto {
  @IsString() @IsNotEmpty() refreshToken!: string;
}
```

📁 **File:** `src/auth/dto/forgot-password.dto.ts`
```typescript
import { IsEmail } from 'class-validator';
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' }) email!: string;
}
```

📁 **File:** `src/auth/dto/reset-password.dto.ts`
```typescript
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
export class ResetPasswordDto {
  @IsString() @IsNotEmpty() token!: string;
  // Regex cực mạnh giống RegisterDto để đảm bảo pass mới luôn an toàn
  @IsString() @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: 'Mật khẩu mới yếu' })
  newPassword!: string;
}
```

---

## Bước 3: JWT Strategy & Guard — "Máy quét thẻ" 💳

### Xin giới thiệu: JwtStrategy
Passport.js hỏi ta: "Làm sao tôi biết thẻ (token) này là thật?". Đây là lúc ta lập trình "máy quét".

📁 **File:** `src/auth/strategies/jwt.strategy.ts`
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Hướng dẫn Passport cách lấy token: lấy từ header 'Authorization: Bearer xxx'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,                // Hết hạn = reject ngay
      secretOrKey: process.env.JWT_SECRET!,   // Khóa giải mã
      passReqToCallback: true,                // Chuyền nguyên request vào để check blacklist
    });
  }

  // Hàm validate chạy SAU KHI token đã được verify chữ ký + hạn dùng thành công
  async validate(req: Request, payload: { sub: string; email: string }) {
    // ═══ TOKEN BLACKLIST CHECK ═══
    // Rút thẻ ra coi nó có bị "đình chỉ" (logout rồi) không?
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    if (token) {
      const isInvalidated = await this.prisma.invalidatedToken.findUnique({ where: { token } });
      if (isInvalidated) throw new UnauthorizedException('Token đã bị thu hồi');
    }

    // Giá trị trả ra ở đây sẽ được dán thẳng vào `request.user`
    return { id: payload.sub, email: payload.email };
  }
}
```

### Bảo vệ tự động: JwtAuthGuard
📁 **File:** `src/auth/guards/jwt-auth.guard.ts`

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); } // Gọi AuthGuard gốc

  // Mọi request đều phải chạy qua cửa canActivate này
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Coi phương thức có cờ @Public() không?
      context.getClass(),   // Coi cả class có cờ không?
    ]);

    // Nếu route được đánh dấu công khai → thả cửa cho qua
    if (isPublic) return true;

    // Còn không → gọi máy quét JWT (super.canActivate)
    return super.canActivate(context);
  }
}
```

---

## Bước 4: Chế tạo Decorator — Tiện ích rút gọn 🛠️

Ta cần cờ `@Public()` để chọc lủng Guard (dùng cho đăng nhập, đăng ký), và `@CurrentUser()` để moi user data nhanh thay vì móc từ `request.user`.

📁 **File:** `src/auth/decorators/public.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
// Bất cứ ai gắn @Public() sẽ bị dán kèm metadata isPublic = true
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

📁 **File:** `src/auth/decorators/current-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Data này do JwtStrategy.validate nhét vào
    // Khách gọi @CurrentUser('id') → trả ra 'uuid-123'
    // Gọi @CurrentUser() báo không → trả nguyên obj { id, email }
    return data ? user?.[data] : user;
  },
);
```

---

## Bước 5: AuthService — Bộ não xử lý nghiệp vụ 🧠

Đây là nơi chứa toàn bộ logic Auth. Chuẩn bị tinh thần, file này hơi dài nhưng logic rất rõ ràng. Từng method map với từng chức năng.

📁 **File:** `src/auth/auth.service.ts`

```typescript
import {
  Injectable, ConflictException, UnauthorizedException,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto'; // Giả sử bạn tạo index.ts cho dto

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // 1️⃣ Đăng ký mới
  async register(dto: RegisterDto) {
    // Coi chừng trụng email!
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email đã được đăng ký');

    // Băm nát password (salt=10 vòng)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, name: dto.fullname },
    });

    return {
      tokens: await this.generateTokens(user.id, user.email),
      user: { id: user.id, email: user.email, name: user.name, status: user.status },
    }; // Luôn che giấu password nha!
  }

  // 2️⃣ Đăng nhập
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Thông tin không chính xác'); 
    // Trick: đừng nói rõ sai email hay sai pass, kẻo hacker scan được user nào đã reg

    const passMatch = await bcrypt.compare(dto.password, user.password);
    if (!passMatch) throw new UnauthorizedException('Thông tin không chính xác');

    // Mốc thời gian login mới
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return {
      tokens: await this.generateTokens(user.id, user.email),
      user: { id: user.id, email: user.email, name: user.name, status: user.status },
    };
  }

  // 3️⃣ Cấp lại token (Refresh)
  async refreshToken(dto: RefreshTokenDto) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: dto.refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token hết hạn hoặc vô hiệu');
    }

    try {
      await this.jwtService.verifyAsync(dto.refreshToken, { secret: process.env.JWT_REFRESH_SECRET! });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Token Rotation: Dùng xong rút phép ngay (revoke) chống Reply Attack
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    return await this.generateTokens(stored.userId, '');
  }

  // 4️⃣ Đăng xuất
  async logout(userId: string, accessToken?: string) {
    // Cắt đuôi refresh
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // 🛑 DẬP TẮT LẬP TỨC TRUY CẬP (Blacklist)
    if (accessToken) {
      try {
        const decoded = this.jwtService.decode(accessToken) as { exp: number };
        await this.prisma.invalidatedToken.create({
          data: {
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000), // Note: exp trong JWT là giây!
            reason: 'LOGOUT',
          },
        });
      } catch { /* Bỏ qua nếu decode xịt */ }
    }
    return { message: 'Đã thoát' };
  }

  // 5️⃣ Quên Password
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Không thấy ai mang email này');

    // Tạo mã hex ngẫu nhiên cực mạnh
    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Gạch tên sau 15 phút
      },
    });

    console.log(`[DEV] Reset token for ${dto.email}: ${resetToken}`); // Chờ Phase gửi mail
    return { message: 'Kiểm tra hộp thư' };
  }

  // 6️⃣ Reset Password
  async resetPassword(dto: ResetPasswordDto) {
    const resetInfo = await this.prisma.passwordReset.findUnique({ where: { token: dto.token } });
    if (!resetInfo || resetInfo.usedAt || resetInfo.expiresAt < new Date()) {
      throw new BadRequestException('Mã đổi vô hiệu hoặc đã dùng');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    // ⚔️ Transaction: đổi pass + gạch token cùng 1 lượt — all or nothing
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: resetInfo.userId }, data: { password: hashed } }),
      this.prisma.passwordReset.update({ where: { id: resetInfo.id }, data: { usedAt: new Date() } }),
    ]);

    return { message: 'Xong phim! Mật khẩu đã đổi' };
  }

  // 🛠️ Hàm nội bộ: Sinh mẻ Token mới
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email }; // 'sub' (subject) = chủ thẻ
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any, // Cast any để chiều lib ms
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
      }),
    ]);

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    return { accessToken, refreshToken, expiresIn: 900 }; // Frontend xài expiresIn để đếm ngược
  }
}
```

---

## Bước 6: AuthController — Chóp bu giao tiếp 🗣️

📁 **File:** `src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto'; // Giả sử index.ts
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth') // Ghép với tiền tố /api/v1 -> /api/v1/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // Mở toang cửa cho đăng ký
  @Post('register')
  register(@Body() dto: RegisterDto) { return this.authService.register(dto); }

  @Public() 
  @Post('login')
  @HttpCode(HttpStatus.OK) // Thay vì trả 201 Created cứng ngắc
  login(@Body() dto: LoginDto) { return this.authService.login(dto); }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: RefreshTokenDto) { return this.authService.refreshToken(dto); }

  // KHÔNG PUBLIC → Cần Auth. Lôi User ID ra xài qua @CurrentUser
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') userId: string, @Headers('authorization') auth: string) {
    const accessToken = auth?.replace('Bearer ', '');
    return this.authService.logout(userId, accessToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) { return this.authService.forgotPassword(dto); }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) { return this.authService.resetPassword(dto); }
}
```

---

## Bước 7: Nối điện (Modules) 🔌

Các mảng nhỏ xong xuôi nhưng hệ thống chưa thấy nhau. Cần đăng ký vào Module.

### 7a. Khúc AuthModule
📁 **File:** `src/auth/auth.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule, 
    JwtModule.register({}), // Không gắn config cứng để dịch vụ tự biên tự diễn Secret
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ❗ Có cái JwtStratgy hệ thống Passport mới nhận
  exports: [AuthService], // Cho mấy đứa khác (VD UserModule) vay xài
})
export class AuthModule {}
```

### 7b. Khúc AppModule (Lõi tổ)
📁 **File:** `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Lan tỏa .env ra toàn thôn
    AuthModule,
    PrismaModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 🛡️ Bật khiên toàn cầu
  ],
})
export class AppModule {}
```

---

## Bước 8: Kiểm Định Hệ Thống 🧪

### Chuẩn bị:
- `docker compose up -d`
- `npx prisma migrate dev --name init` (Đẩy schema lên DB PostgreSQL)
- `npm run start:dev`

### Kịch bản Test:
1. **Reg nick:** Bơm JSON Register vào `/api/v1/auth/register` → Thấy Token (Mã 201). **Password yếu sẽ ăn Mã 400!**
2. **Login:** Đẩy email/pass vào `/api/v1/auth/login` → Lấy chùm Access/Refresh (Mã 200). Đẩy láo nháo ra 401.
3. **Thoát gấp:** Ném token lên Swagger bấm Authorize. Gõ `/api/v1/auth/logout`.
4. **Hậu quả Blacklist:** Vẫn dùng mã vỡ cũ gõ thêm chày cối `/api/v1/auth/logout` lần 2 → Nó sút MÃ 401 **"Token bị thu hồi"**. Ngon ơ!

---

## Checklist Phase 1 ✅
- [ ] Thêm biến `.env`
- [ ] Soạn đủ 5 DTO ngạnh cửa
- [ ] JwtStrategy chặn token (kèm test blacklist)
- [ ] JwtAuthGuard làm lính gác
- [ ] Hai Decorator `@Public()` + `@CurrentUser()`
- [ ] Code AuthService + AuthController
- [ ] Wire mớ bòng bong vào 2 file Module
- [ ] Bơm Migrate và Test dứt điểm!

---

## Q&A: Trò chuyện ngoài lề

**Q: Ủa cái `this.prisma.invalidatedToken.create(...)` là SQL gì mà ngộ vậy?**  
Rất dễ, Prisma mượt mà ôm SQL lại. Dịch sơ mâm: `this.prisma` (Gọi dịch vụ) -> `.invalidatedToken` (Chọn bảng DB đã viết ở @@map schema) -> `.create` (Lệnh INSERT INTO). Nó tương đương `INSERT INTO invalidated_tokens (...) VALUES (...)`. Nhập sao nuốt vậy!

**Q: Sao Guard nó biết route nào cần block? Cớ gì tui xài Public ngỏm qua?**  
Nhờ anh cò `Reflector`. Guard nhòm ngó cây phả hệ (Class -> Handler), thấy có cái cờ đỏ tên `isPublic` móc bởi Decorator `@Public()`, nó tự auto cho thả chốt lọt! Không cờ → Quét!

> **Đỉnh chóp rồi Phase 1 xong!** Gọi tôi ngay để băng tiếp sang **Phase 2 (User Module)**. Cái này quá muỗi, get profile, đổi màu đổi mạng nhẹ nhàng!
