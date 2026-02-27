# 🚀 Hướng dẫn Code — Phase 1: Auth Module

## Tổng quan Phase 1

### Chúng ta đang làm gì?
Xây dựng **hệ thống xác thực hoàn chỉnh** — cho phép user đăng ký, đăng nhập, nhận JWT token, và sử dụng token đó để truy cập các API được bảo vệ. Đây là module quan trọng nhất vì **mọi module khác đều phụ thuộc vào Auth** (cần biết "ai đang gọi API?").

### Cần đạt được gì?
Sau Phase 1, hệ thống sẽ có:
1. ✅ `POST /auth/register` — đăng ký tài khoản mới (hash password bằng bcrypt)
2. ✅ `POST /auth/login` — đăng nhập, trả access token + refresh token
3. ✅ `POST /auth/refresh` — lấy access token mới khi hết hạn
4. ✅ `POST /auth/logout` — đăng xuất (revoke refresh token)
5. ✅ `POST /auth/forgot-password` — yêu cầu reset password
6. ✅ `POST /auth/reset-password` — đặt lại mật khẩu bằng token
7. ✅ `JwtAuthGuard` — bảo vệ mọi route (trừ route public)
8. ✅ `@CurrentUser()` — decorator lấy thông tin user đang đăng nhập

### Kỹ thuật sử dụng
- **bcrypt**: Hash password một chiều — không ai (kể cả admin) đọc được password gốc
- **JWT (JSON Web Token)**: Chuỗi mã hóa chứa thông tin user, gắn trong header mỗi request
- **Passport.js**: Thư viện xác thực phổ biến nhất Node.js, NestJS tích hợp qua `@nestjs/passport`
- **Strategy pattern**: Passport hỗ trợ nhiều "chiến lược" xác thực — ta dùng JWT Strategy
- **DTO + class-validator**: Validate dữ liệu đầu vào tự động (đã setup ở Phase 0)

### Flow tổng quát
```
┌─────────────────────────────────────────────────────────────────────┐
│  REGISTER: email+password+name → hash password → save DB → JWT      │
│  LOGIN:    email+password → tìm user → so sánh hash → JWT           │
│  ACCESS:   JWT trong header → verify → lấy user → cho phép          │
│  REFRESH:  refreshToken → verify → tạo cặp token mới                │
│  LOGOUT:   revoke refreshToken trong DB                             │
└─────────────────────────────────────────────────────────────────────┘
```

> 💡 Những kỹ thuật này bạn đã viết trong **Chương 7** (Authentication & Authorization) của báo cáo!

---

## Bước 1: Thêm JWT secret vào .env

📁 **File:** `.env` (thêm vào cuối file)

### Tại sao?
JWT cần một **secret key** để ký (sign) và xác minh (verify) token. Key này phải được giữ bí mật — nếu bị lộ, ai cũng có thể tạo token giả.

### Giải thích
- `JWT_SECRET`: Chuỗi bí mật để ký access token. Nên dùng chuỗi dài, ngẫu nhiên
- `JWT_EXPIRES_IN`: Thời gian sống của access token. `15m` = 15 phút — ngắn để bảo mật
- `JWT_REFRESH_SECRET`: Secret riêng cho refresh token (tách khỏi access token cho an toàn)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token sống lâu hơn (7 ngày) — dùng để lấy access token mới

### Code

```env
# JWT Configuration
JWT_SECRET=todolist-collab-super-secret-key-2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=todolist-collab-refresh-secret-key-2026
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Bước 2: Tạo DTOs (Data Transfer Objects)

### Tại sao?
DTO định nghĩa "dữ liệu nào được phép gửi lên" và "validate ra sao". Nhờ `ValidationPipe` đã setup ở Phase 0, NestJS tự động validate mọi request body theo DTO.

### Kỹ thuật
- **class-validator decorators**: `@IsEmail()`, `@IsString()`, `@MinLength()`, `@Matches()` — gắn lên property để khai báo rule
- **Mỗi endpoint 1 DTO** — giữ rõ ràng, dễ bảo trì
- **Tại sao dùng class chứ không phải interface?** → Interface bị xóa khi compile sang JS. Class tồn tại runtime → `ValidationPipe` mới đọc được decorators

---

### 2a. Register DTO

📁 **File:** `src/auth/dto/register.dto.ts`

```typescript
// class-validator cung cấp các decorator để validate dữ liệu
// Khi client gửi request body, ValidationPipe sẽ:
//   1. Tạo instance của RegisterDto từ JSON body
//   2. Chạy tất cả decorators để kiểm tra
//   3. Nếu vi phạm → throw BadRequestException tự động
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  // @IsEmail() kiểm tra chuỗi có đúng format email không
  // {} = options mặc định, { message: '...' } = lỗi tùy chỉnh thay vì message tiếng Anh
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  // @MinLength(8) → reject nếu password ngắn hơn 8 ký tự
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số',
  })
  // @Matches(regex) → validate bằng regex:
  //   (?=.*[a-z]) = phải có ít nhất 1 chữ thường
  //   (?=.*[A-Z]) = phải có ít nhất 1 chữ HOA
  //   (?=.*\d)    = phải có ít nhất 1 chữ SỐ
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  // @IsNotEmpty() → reject chuỗi rỗng "" (khác với @IsString() chỉ check kiểu)
  name: string;
}
```

---

### 2b. Login DTO

📁 **File:** `src/auth/dto/login.dto.ts`

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  // Không cần validate password format ở login — chỉ cần không rỗng
  // Vì password sẽ được so sánh hash, nếu sai thì sai thôi
  password: string;
}
```

---

### 2c. Refresh Token DTO

📁 **File:** `src/auth/dto/refresh-token.dto.ts`

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}
```

---

### 2d. Forgot Password DTO

📁 **File:** `src/auth/dto/forgot-password.dto.ts`

```typescript
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}
```

---

### 2e. Reset Password DTO

📁 **File:** `src/auth/dto/reset-password.dto.ts`

```typescript
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  // Token nhận từ email reset — sẽ được verify trong service

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số',
  })
  // Validate password mới giống như register — đảm bảo mật khẩu mới cũng mạnh
  newPassword: string;
}
```

---

## Bước 3: Tạo JWT Strategy

📁 **File:** `src/auth/strategies/jwt.strategy.ts`

### Tại sao?
Passport.js dùng **Strategy pattern** — mỗi cách xác thực (JWT, Google OAuth, GitHub...) là một "chiến lược" riêng. Ta cần bảo Passport: "Khi nhận được JWT token, hãy xác minh và trích xuất thông tin user như thế nào".

### Kỹ thuật
- `PassportStrategy(Strategy)` — class trừu tượng từ NestJS, kết hợp NestJS DI với Passport.js
- `ExtractJwt.fromAuthHeaderAsBearerToken()` — tự động rút token từ header `Authorization: Bearer xxx`
- Method `validate(payload)` — được gọi SAU KHI Passport verify token thành công. Giá trị trả về sẽ được gắn vào `request.user`

### Code

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// PassportStrategy — lớp trung gian giữa NestJS và Passport.js
// Nó giúp Strategy hoạt động trong hệ thống DI của NestJS

import { ExtractJwt, Strategy } from 'passport-jwt';
// Strategy — JWT Strategy gốc từ thư viện passport-jwt
// ExtractJwt — helper cung cấp các cách rút JWT từ request

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // PassportStrategy(Strategy) trả về một class
  // JwtStrategy kế thừa class đó → tự động đăng ký vào Passport
  // Tên strategy mặc định là 'jwt' (sẽ dùng với AuthGuard('jwt'))

  constructor() {
    super({
      // Cấu hình cho JWT Strategy:

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Bảo Passport: "Lấy token từ header Authorization: Bearer <token>"
      // Có nhiều cách khác: fromBodyField(), fromUrlQueryParameter()...
      // Nhưng Bearer header là chuẩn phổ biến nhất cho REST API

      ignoreExpiration: false,
      // false = NẾU token hết hạn → tự động reject, throw UnauthorizedException
      // true = bỏ qua hết hạn (KHÔNG NÊN dùng trong production)

      secretOrKey: process.env.JWT_SECRET,
      // Secret key dùng để VERIFY token — phải khớp với key đã dùng khi SIGN
      // Lấy từ .env để không hardcode trong code
    });
  }

  // Method này được gọi TỰ ĐỘNG bởi Passport SAU KHI:
  //   1. Rút token từ header ✅
  //   2. Verify chữ ký bằng secret ✅
  //   3. Kiểm tra hết hạn ✅
  // → Nếu tất cả OK, Passport gọi validate() với payload đã decode
  //
  // payload chứa dữ liệu ta đã đặt vào khi sign token (ở AuthService)
  // Ví dụ: { sub: 'user-uuid', email: 'john@example.com', iat: ..., exp: ... }
  async validate(payload: { sub: string; email: string }) {
    // Giá trị return từ validate() sẽ được GẮN VÀO request.user
    // → Controller có thể truy cập user qua @Req() hoặc @CurrentUser()
    return { id: payload.sub, email: payload.email };
    // Trả về object gọn: chỉ giữ id và email
    // Có thể query DB ở đây để lấy full user info, nhưng sẽ chậm hơn
  }
}
```

---

## Bước 4: Tạo JwtAuthGuard

📁 **File:** `src/auth/guards/jwt-auth.guard.ts`

### Tại sao?
Guard quyết định "request này có được phép vào Controller không?". `JwtAuthGuard` kiểm tra JWT token — nếu hợp lệ thì cho qua, không thì trả 401.

### Kỹ thuật
- `AuthGuard('jwt')` — kích hoạt JWT Strategy đã tạo ở Bước 3
- Kế thừa để custom thêm logic (ví dụ: hỗ trợ `@Public()` decorator)

### Code

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// AuthGuard('jwt') — Guard có sẵn từ @nestjs/passport
// Nó tự động gọi JWT Strategy → verify token → gắn user vào request

import { Reflector } from '@nestjs/core';
// Reflector — dùng để ĐỌC metadata từ decorators
// Ở đây ta đọc metadata 'isPublic' để biết route có cần auth không

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
// Hằng số key cho metadata — định nghĩa ở Bước 5

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Kế thừa AuthGuard('jwt') — tự động có logic verify JWT

  constructor(private reflector: Reflector) {
    super();
    // super() gọi constructor của AuthGuard('jwt')
    // Reflector được inject qua DI để đọc metadata
  }

  // Override method canActivate để thêm logic @Public()
  canActivate(context: ExecutionContext) {
    // reflector.getAllAndOverride đọc metadata 'isPublic' từ:
    //   1. Method handler (ưu tiên) — decorator trên từng route
    //   2. Class (controller) — decorator trên cả controller
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),  // Kiểm tra decorator trên method trước
      context.getClass(),    // Rồi kiểm tra trên class
    ]);

    // Nếu route được đánh dấu @Public() → bỏ qua JWT check, cho qua luôn
    if (isPublic) {
      return true;
    }

    // Nếu không phải public → chạy logic JWT verify mặc định
    // AuthGuard('jwt') sẽ gọi JwtStrategy.validate()
    return super.canActivate(context);
  }
}
```

---

## Bước 5: Tạo Custom Decorators

### Tại sao?
- `@Public()`: Đánh dấu route không cần JWT (ví dụ register, login)
- `@CurrentUser()`: Rút thông tin user từ `request.user` cho gọn — thay vì `@Req() req` rồi `req.user`

---

### 5a. Public Decorator

📁 **File:** `src/auth/decorators/public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
// SetMetadata — gắn metadata lên route handler
// Metadata này sẽ được đọc bởi JwtAuthGuard qua Reflector

// Hằng số key — dùng chung giữa decorator và guard để "nói cùng ngôn ngữ"
export const IS_PUBLIC_KEY = 'isPublic';

// CustomDecorator: @Public() gắn metadata { isPublic: true } lên route
// JwtAuthGuard sẽ kiểm tra metadata này → nếu true thì bỏ qua JWT verify
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Cách dùng:
// @Public()                    ← gắn decorator
// @Post('register')
// register(@Body() dto) {...}  ← route này KHÔNG cần JWT
```

---

### 5b. CurrentUser Decorator

📁 **File:** `src/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// createParamDecorator — tạo decorator cho THAM SỐ method (giống @Body(), @Param())
// Khác với SetMetadata (gắn metadata), createParamDecorator TRẢ VỀ GIÁ TRỊ cho tham số

export const CurrentUser = createParamDecorator(
  // data = giá trị truyền vào decorator, ví dụ @CurrentUser('email') thì data = 'email'
  // ctx = ExecutionContext, dùng để lấy request object
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // request.user được gắn bởi JwtStrategy.validate() ở Bước 3
    // user = { id: 'uuid', email: 'john@example.com' }

    // Nếu truyền tên field cụ thể → trả field đó
    // Nếu không → trả toàn bộ user object
    return data ? user?.[data] : user;

    // Ví dụ:
    // @CurrentUser() user        → user = { id: '...', email: '...' }
    // @CurrentUser('id') userId  → userId = '...'
    // @CurrentUser('email') email → email = '...'
  },
);
```

---

## Bước 6: Viết AuthService (Logic chính)

📁 **File:** `src/auth/auth.service.ts` (viết lại hoàn toàn)

### Tại sao?
Đây là **trái tim** của Auth Module — chứa toàn bộ business logic: hash password, tạo JWT, verify token, xử lý refresh...

### Kỹ thuật
- `bcrypt.hash(password, 10)`: Hash password với salt round = 10 (~100ms). Số càng cao càng an toàn nhưng càng chậm
- `bcrypt.compare(plain, hash)`: So sánh password người dùng nhập với hash trong DB — trả true/false
- `JwtService.signAsync(payload, options)`: Tạo JWT token từ payload + secret + expiration
- `crypto.randomBytes(32)`: Tạo token ngẫu nhiên cho reset password — an toàn hơn UUID

### Code

```typescript
import {
  Injectable,
  ConflictException,       // 409 — email đã tồn tại
  UnauthorizedException,   // 401 — sai password hoặc token
  NotFoundException,       // 404 — không tìm thấy user
  BadRequestException,     // 400 — token hết hạn hoặc đã dùng
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// JwtService — service từ @nestjs/jwt, cung cấp signAsync() và verifyAsync()

import { PrismaService } from '../prisma/prisma.service';
// PrismaService — truy cập database (đã tạo từ trước, @Global nên không cần import module)

import * as bcrypt from 'bcrypt';
// bcrypt — thư viện hash password tiêu chuẩn
// import * as bcrypt = import toàn bộ module (vì bcrypt không có default export)

import * as crypto from 'crypto';
// crypto — module built-in Node.js, dùng tạo token ngẫu nhiên cho reset password

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
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ═══════════════════════════════════════════
  // REGISTER — Đăng ký tài khoản mới
  // ═══════════════════════════════════════════
  async register(dto: RegisterDto) {
    // Bước 1: Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // findUnique tìm theo field có @unique trong schema
    // Trả null nếu không tìm thấy

    if (existingUser) {
      throw new ConflictException('Email đã được đăng ký');
      // ConflictException → HTTP 409 Conflict
      // HttpExceptionFilter sẽ bắt và format response chuẩn
    }

    // Bước 2: Hash password bằng bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // Tham số 10 = salt rounds (số vòng lặp hash)
    // Kết quả: "$2b$10$..." — chuỗi hash 60 ký tự, KHÔNG THỂ giải mã ngược
    // Mỗi lần hash cùng password sẽ ra kết quả KHÁC NHAU (nhờ random salt)

    // Bước 3: Tạo user mới trong DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,  // Lưu hash, KHÔNG BAO GIỜ lưu password gốc
        name: dto.name,
      },
    });

    // Bước 4: Tạo cặp token (access + refresh)
    const tokens = await this.generateTokens(user.id, user.email);

    // Bước 5: Trả về tokens + thông tin user (KHÔNG trả password)
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
      },
    };
  }

  // ═══════════════════════════════════════════
  // LOGIN — Đăng nhập
  // ═══════════════════════════════════════════
  async login(dto: LoginDto) {
    // Bước 1: Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      // Không nói rõ "email không tồn tại" → tránh lộ thông tin user nào đã đăng ký
      // Đây là best practice bảo mật
    }

    // Bước 2: So sánh password
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    // bcrypt.compare:
    //   1. Rút salt từ trong hash
    //   2. Hash password nhập vào với cùng salt
    //   3. So sánh 2 hash → true nếu khớp

    if (!passwordMatches) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      // Cùng message với "không tìm thấy email" → attacker không biết bước nào sai
    }

    // Bước 3: Cập nhật lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Bước 4: Tạo tokens + trả về
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
      },
    };
  }

  // ═══════════════════════════════════════════
  // REFRESH TOKEN — Lấy access token mới
  // ═══════════════════════════════════════════
  async refreshToken(dto: RefreshTokenDto) {
    // Bước 1: Tìm refresh token trong DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });

    // Kiểm tra token có tồn tại, chưa bị revoke, chưa hết hạn
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    // Bước 2: Verify JWT signature của refresh token
    try {
      await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Bước 3: Revoke token cũ (mỗi refresh token chỉ dùng 1 lần)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });
    // Tại sao revoke? → "Token Rotation" — chống replay attack
    // Nếu attacker đánh cắp refresh token, user dùng lại sẽ phát hiện bị revoke

    // Bước 4: Tạo cặp token mới
    const tokens = await this.generateTokens(storedToken.userId, '');

    return tokens;
  }

  // ═══════════════════════════════════════════
  // LOGOUT — Đăng xuất
  // ═══════════════════════════════════════════
  async logout(userId: string) {
    // Revoke TẤT CẢ refresh tokens của user này
    await this.prisma.refreshToken.updateMany({
      where: { userId: userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    // updateMany — cập nhật nhiều records cùng lúc
    // revokedAt: null = chỉ revoke những token chưa bị revoke
    // → Sau khi logout, mọi refresh token đều vô hiệu, user phải login lại

    return { message: 'Đăng xuất thành công' };
  }

  // ═══════════════════════════════════════════
  // FORGOT PASSWORD — Yêu cầu reset mật khẩu
  // ═══════════════════════════════════════════
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Luôn trả success message — KHÔNG tiết lộ email có tồn tại hay không
    // → Bảo mật: attacker không enumerate được email nào đã đăng ký
    if (!user) {
      return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' };
    }

    // Tạo token ngẫu nhiên bằng crypto
    const resetToken = crypto.randomBytes(32).toString('hex');
    // randomBytes(32) → 32 bytes ngẫu nhiên → toString('hex') → 64 ký tự hex
    // An toàn hơn UUID vì hoàn toàn ngẫu nhiên, không đoán được

    // Lưu token vào DB với thời hạn 1 giờ
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ
        // Date.now() trả millisecond hiện tại
        // + 60 * 60 * 1000 = + 3,600,000 ms = + 1 giờ
      },
    });

    // TODO: Gửi email chứa link reset (sẽ implement khi có email service)
    // Link có dạng: https://app.com/reset-password?token=<resetToken>
    console.log(`[DEV] Reset token cho ${dto.email}: ${resetToken}`);

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' };
  }

  // ═══════════════════════════════════════════
  // RESET PASSWORD — Đặt lại mật khẩu
  // ═══════════════════════════════════════════
  async resetPassword(dto: ResetPasswordDto) {
    // Bước 1: Tìm token trong DB
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });

    if (!passwordReset || passwordReset.usedAt || passwordReset.expiresAt < new Date()) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
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
        where: { id: passwordReset.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.update({
        where: { id: passwordReset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Đặt lại mật khẩu thành công' };
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
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token: sống ngắn (15m), dùng secret chính
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      // Refresh Token: sống dài (7d), dùng secret riêng
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    ]);

    // Lưu refresh token vào DB — để có thể revoke khi logout
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 900 giây = 15 phút — cho frontend biết khi nào cần refresh
    };
  }
}
```

---

## Bước 7: Viết AuthController

📁 **File:** `src/auth/auth.controller.ts` (viết lại hoàn toàn)

### Tại sao?
Controller nhận request từ client, gọi Service xử lý, trả response. Mỗi method = 1 endpoint.

### Kỹ thuật
- `@Public()` — đánh dấu route không cần JWT
- `@Body()` — tự động parse JSON body + validate theo DTO
- `@CurrentUser('id')` — lấy userId từ JWT token (chỉ dùng cho route cần auth)
- `@HttpCode(HttpStatus.OK)` — set HTTP status code (POST mặc định trả 201, nhưng login nên trả 200)

### Code

```typescript
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
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
// Tất cả routes trong controller này bắt đầu bằng /auth
// Kết hợp global prefix → /api/v1/auth/...
export class AuthController {
  constructor(private authService: AuthService) {}
  // DI: NestJS tự inject AuthService vào constructor

  // ── POST /api/v1/auth/register ──
  @Public()  // Không cần JWT — ai cũng có thể đăng ký
  @Post('register')
  // @Post mặc định trả HTTP 201 Created — đúng cho register (tạo resource mới)
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
  @HttpCode(HttpStatus.OK)  // Override: trả 200 thay vì 201 (login không tạo resource mới)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ── POST /api/v1/auth/refresh ──
  @Public()  // Refresh không cần access token (vì access token đã hết hạn!)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  // ── POST /api/v1/auth/logout ──
  // KHÔNG có @Public() → cần JWT token
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') userId: string) {
    // @CurrentUser('id') rút userId từ JWT payload (đã decode bởi JwtStrategy)
    return this.authService.logout(userId);
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
```

---

## Bước 8: Cập nhật AuthModule + AppModule

### Tại sao?
Module là "trung tâm đăng ký" — NestJS cần biết Controller nào, Service nào, Guard nào thuộc module nào.

---

### 8a. AuthModule

📁 **File:** `src/auth/auth.module.ts` (viết lại)

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// JwtModule — module từ @nestjs/jwt, cung cấp JwtService cho DI

import { PassportModule } from '@nestjs/passport';
// PassportModule — kích hoạt Passport.js trong NestJS

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// JwtStrategy PHẢI được đăng ký là provider → NestJS mới tạo instance và Passport mới nhận

@Module({
  imports: [
    PassportModule,
    // Đăng ký Passport — cho phép dùng AuthGuard('jwt')

    JwtModule.register({}),
    // Đăng ký JwtModule — cung cấp JwtService
    // {} = không truyền config mặc định ở đây
    // Vì ta truyền secret + expiresIn riêng cho từng signAsync() call trong AuthService
    // → Linh hoạt hơn: access token và refresh token có secret/expiry khác nhau
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // JwtStrategy là provider → NestJS tạo instance → Passport tự đăng ký strategy 'jwt'
  exports: [AuthService],
  // Export AuthService để module khác có thể dùng (ví dụ: UserModule cần verify)
})
export class AuthModule {}
```

---

### 8b. AppModule — Đăng ký Global Guard

📁 **File:** `src/app.module.ts` (sửa lại)

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// APP_GUARD — special token để đăng ký Guard GLOBAL qua module system
// Khác với app.useGlobalGuards(): dùng APP_GUARD cho phép Guard dùng DI (inject Reflector)

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Cách đăng ký Global Guard qua DI:
    //   provide: APP_GUARD = bảo NestJS "đây là guard global"
    //   useClass: JwtAuthGuard = dùng class JwtAuthGuard
    //
    // Tại sao không dùng app.useGlobalGuards() trong main.ts?
    // → Vì JwtAuthGuard cần inject Reflector (để đọc @Public() metadata)
    // → app.useGlobalGuards() không hỗ trợ DI, chỉ APP_GUARD mới hỗ trợ
  ],
})
export class AppModule {}
```

---

## Bước 9: Chạy Database Migration

### Tại sao?
Schema Prisma đã có 16 entities nhưng DB thực tế chưa có tables. Migration tạo SQL và chạy trên DB.

### Lệnh

```bash
npx prisma migrate dev --name init
```
- `migrate dev` — tạo migration file + chạy trên DB
- `--name init` — đặt tên migration là "init"

Sau khi chạy xong, NestJS sẽ tự restart (watch mode).

---

## Bước 10: Test

### Hành động
1. Chạy `npm run start:dev` (nếu chưa chạy)
2. Mở `http://localhost:3333/api-docs`

### Test thứ tự:

**Test 1: Register**
- `POST /api/v1/auth/register`
- Body: `{ "email": "test@example.com", "password": "Password123", "name": "Test User" }`
- Kỳ vọng: 201 + accessToken + refreshToken + user info

**Test 2: Login**
- `POST /api/v1/auth/login`
- Body: `{ "email": "test@example.com", "password": "Password123" }`
- Kỳ vọng: 200 + tokens

**Test 3: Logout (cần auth)**
- Copy accessToken từ bước 2
- Bấm nút 🔒 Authorize trên Swagger → paste token
- `POST /api/v1/auth/logout`
- Kỳ vọng: 200 + "Đăng xuất thành công"

**Test 4: Register validation error**
- `POST /api/v1/auth/register`
- Body: `{ "email": "invalid", "password": "123", "name": "" }`
- Kỳ vọng: 400 + validation errors

---

## Checklist Phase 1

- [ ] Thêm JWT config vào `.env`
- [ ] Tạo 5 DTO files trong `src/auth/dto/`
- [ ] Tạo `src/auth/strategies/jwt.strategy.ts`
- [ ] Tạo `src/auth/guards/jwt-auth.guard.ts`
- [ ] Tạo `src/auth/decorators/public.decorator.ts`
- [ ] Tạo `src/auth/decorators/current-user.decorator.ts`
- [ ] Viết lại `src/auth/auth.service.ts` (6 methods + helper)
- [ ] Viết lại `src/auth/auth.controller.ts` (6 endpoints)
- [ ] Cập nhật `src/auth/auth.module.ts` (JwtModule, PassportModule, JwtStrategy)
- [ ] Cập nhật `src/app.module.ts` (APP_GUARD global)
- [ ] Chạy `npx prisma migrate dev --name init`
- [ ] Test trên Swagger UI: register → login → logout → validation error

---

> **Khi hoàn thành Phase 1, báo tôi để tiếp tục sang Phase 2 (User Module).** Phase 2 sẽ nhẹ hơn — chỉ 4 endpoints: get profile, update profile, change password, upload avatar.
