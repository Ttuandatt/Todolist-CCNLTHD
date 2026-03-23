# Chương 7 — Bài tập ứng dụng: Bảo vệ API với JWT Authentication

## 1. Mục tiêu

Vận dụng kiến thức Authentication & Authorization đã học trong Chương 7 để bảo vệ toàn bộ API của dự án TodoList Collaboration. Sau khi hoàn thành, người đọc sẽ:

- Biết cách triển khai hệ thống đăng ký (Register) và đăng nhập (Login) với JWT.
- Hiểu cơ chế hoạt động của Passport Strategy và Guards trong NestJS.
- Tạo được Custom Decorators (`@Public()`, `@CurrentUser()`) để tăng tính tiện dụng.
- Đăng ký Guard toàn cục qua `APP_GUARD` — bảo vệ mọi endpoint mặc định, chỉ mở cho route công khai.
- Phân biệt rõ luồng request có token (200 OK) và không có token (401 Unauthorized).

## 2. Mô tả bài tập

Tiếp tục từ dự án ở Chương 6, bổ sung module **Auth** với JWT Authentication. Mọi endpoint mặc định đều yêu cầu xác thực, chỉ những route được đánh dấu `@Public()` mới cho phép truy cập tự do.

**Yêu cầu cụ thể:**

1. Cài đặt dependencies: `@nestjs/passport`, `passport`, `@nestjs/jwt`, `passport-jwt`, `bcrypt`.
2. Tạo `AuthModule` với hai endpoint chính: `POST /auth/register` và `POST /auth/login`.
3. Mã hóa mật khẩu bằng `bcrypt` trước khi lưu database.
4. Khi đăng nhập/đăng ký thành công, trả về cặp JWT token (access + refresh).
5. Tạo `JwtStrategy` để xác minh token từ header `Authorization: Bearer <token>`.
6. Tạo `JwtAuthGuard` với hỗ trợ `@Public()` decorator — cho phép mở route công khai.
7. Đăng ký `JwtAuthGuard` toàn cục qua `APP_GUARD` trong `AppModule`.
8. Tạo `@CurrentUser()` decorator để lấy thông tin user từ request.
9. Bảo vệ `UserController` — chỉ user đã đăng nhập mới xem/cập nhật hồ sơ.

## 3. Code minh họa

### Bước 1: Cài đặt dependencies

```bash
npm install @nestjs/passport passport @nestjs/jwt passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

- `@nestjs/passport` và `passport` cung cấp framework xác thực linh hoạt.
- `@nestjs/jwt` và `passport-jwt` xử lý việc tạo và kiểm tra JWT token.
- `bcrypt` mã hóa mật khẩu một chiều (không thể giải mã ngược).

### Bước 2: Tạo Auth DTOs

**RegisterDto** — Kiểm tra dữ liệu đăng ký:

```typescript
// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Fullname should not be empty' })
  fullname: string;

  @IsString()
  @IsNotEmpty({ message: 'Display name should not be empty' })
  displayName: string;
}
```

Điểm nổi bật:
- `@Matches()` sử dụng regex để enforce chính sách mật khẩu mạnh: ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.
- `@MinLength(8)` kết hợp `@Matches()` tạo hai lớp kiểm tra — đảm bảo cả độ dài lẫn độ phức tạp.

**LoginDto** — Kiểm tra dữ liệu đăng nhập:

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
```

### Bước 3: Triển khai AuthService

Đây là file thực tế từ dự án TodoList Collaboration (trích đoạn register và login):

```typescript
// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    // Bước 1: Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Bước 2: Hash password với bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Bước 3: Tạo user mới trong database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.fullname,
        displayName: dto.displayName,
      },
    });

    // Bước 4: Tạo cặp token (access + refresh)
    const tokens = await this.generateTokens(user.id, user.email);

    // Bước 5: Trả về thông tin user (KHÔNG trả password) + tokens
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

  async login(dto: LoginDto) {
    // Bước 1: Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email or password is not correct');
      // Không nói rõ "email không tồn tại" → tránh lộ thông tin
    }

    // Bước 2: So sánh password bằng bcrypt
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    // Bước 3: Cập nhật thời gian đăng nhập cuối
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

  // Helper: Tạo cặp Access Token + Refresh Token
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email: email };
    // 'sub' = subject — convention của JWT spec

    // Tạo 2 token song song bằng Promise.all (nhanh hơn tạo tuần tự)
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
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
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 900 giây = 15 phút
    };
  }
}
```

Điểm cần lưu ý:
- `bcrypt.hash(password, 10)` mã hóa mật khẩu với 10 salt rounds — mật khẩu gốc không bao giờ được lưu trực tiếp vào database.
- `bcrypt.compare()` so sánh mật khẩu người dùng nhập với hash đã lưu — rút salt từ trong hash, hash lại, rồi so sánh.
- Message lỗi đăng nhập cố tình không phân biệt "sai email" hay "sai mật khẩu" để tránh lộ thông tin — đây là best practice bảo mật.
- `Promise.all()` tạo access token và refresh token song song — tối ưu hiệu suất.
- JWT payload chứa `sub` (userId) và `email` — thông tin này sẽ được giải mã trong Strategy.

### Bước 4: Tạo AuthController

```typescript
// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()   // Không cần JWT — ai cũng có thể đăng ký
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()   // Không cần JWT — ai cũng có thể đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK)  // Override: trả 200 thay vì 201 (login không tạo resource mới)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Logout — KHÔNG có @Public() → cần JWT token hợp lệ
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser('id') userId: string,
    @Headers('authorization') auth: string,
  ) {
    const accessToken = auth?.replace('Bearer ', '');
    return this.authService.logout(userId, accessToken);
  }
}
```

Điểm cần lưu ý:
- `@Public()` đánh dấu route là công khai — JwtAuthGuard sẽ bỏ qua kiểm tra token cho các route này.
- `@HttpCode(HttpStatus.OK)` override status mặc định 201 của `@Post()` — vì login/logout không tạo resource mới.
- `@CurrentUser('id')` trích xuất `userId` từ `request.user` — chỉ hoạt động khi có JWT token hợp lệ.
- `@Headers('authorization')` lấy header Authorization để trích xuất raw token cho blacklist.

### Bước 5: Tạo `@Public()` Decorator

```typescript
// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

- `SetMetadata(key, value)` gắn metadata `isPublic = true` vào route handler.
- Metadata này sẽ được đọc bởi `JwtAuthGuard` qua `Reflector` để quyết định có bỏ qua JWT check hay không.

### Bước 6: Tạo `@CurrentUser()` Decorator

```typescript
// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // request.user được gắn bởi JwtStrategy.validate()
    // VD: user = { id: 'uuid...', email: 'dat@sgu.edu.vn' }

    // Nếu truyền tên field → trả field đó. Nếu không → trả toàn bộ object.
    return data ? user[data] : user;
  },
);

// Cách dùng:
// @CurrentUser() user        → { id: '...', email: '...' }
// @CurrentUser('id') userId  → 'uuid...'
// @CurrentUser('email') email → 'dat@sgu.edu.vn'
```

- `createParamDecorator` tạo decorator cho tham số method — tương tự `@Body()`, `@Param()`.
- Tham số `data` là giá trị truyền vào decorator: `@CurrentUser('id')` → `data = 'id'`.
- `request.user` được gắn tự động bởi `JwtStrategy.validate()` sau khi token được xác minh.

### Bước 7: Tạo JwtStrategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    // Token Blacklist Check — kiểm tra token đã bị vô hiệu hóa chưa
    const token = req?.headers?.authorization?.replace('Bearer ', '');

    if (token) {
      const isInvalidated = await this.prisma.invalidatedToken.findUnique({
        where: { token },
      });
      if (isInvalidated) {
        throw new UnauthorizedException('Token is invalidated');
      }
    }

    // Giá trị trả về sẽ được gắn vào request.user
    return { id: payload.sub, email: payload.email };
  }
}
```

Điểm cần lưu ý:
- `ExtractJwt.fromAuthHeaderAsBearerToken()` tự động trích xuất token từ header `Authorization: Bearer <token>`.
- `secretOrKey` phải khớp với secret dùng để ký token trong `AuthService.generateTokens()`.
- `passReqToCallback: true` cho phép `validate()` nhận thêm `Request` object — cần thiết để kiểm tra token blacklist.
- Method `validate()` được gọi sau khi Passport xác minh JWT signature hợp lệ — giá trị `{ id, email }` trả về sẽ được gắn vào `request.user`.

### Bước 8: Tạo JwtAuthGuard với hỗ trợ @Public()

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Đọc metadata 'isPublic' từ route handler hoặc controller
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu route được đánh dấu @Public() → bỏ qua JWT check
    if (isPublic) {
      return true;
    }

    // Nếu không phải public → chạy logic JWT verify mặc định
    return super.canActivate(context);
  }
}
```

Điểm quan trọng:
- `Reflector` được inject qua constructor — đây là lý do Guard cần được đăng ký qua `APP_GUARD` thay vì `app.useGlobalGuards()` (xem Bước 9).
- `getAllAndOverride()` đọc metadata từ cả method handler lẫn class — cho phép đặt `@Public()` ở cấp method hoặc cấp controller.
- Logic đơn giản: `@Public()` → cho qua; không có `@Public()` → kiểm tra JWT.

### Bước 9: Cấu hình AuthModule và đăng ký Guard toàn cục

**AuthModule:**

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    // {} = không truyền config mặc định
    // Vì ta truyền secret + expiresIn riêng cho từng signAsync() call
    // → Linh hoạt: access token và refresh token có secret/expiry khác nhau
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Đăng ký Guard toàn cục qua `APP_GUARD` trong AppModule:**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Tại sao dùng APP_GUARD thay vì app.useGlobalGuards() trong main.ts?
    // → Vì JwtAuthGuard cần inject Reflector (để đọc @Public() metadata)
    // → app.useGlobalGuards() không hỗ trợ Dependency Injection
    // → Chỉ APP_GUARD mới cho phép Guard dùng DI
  ],
})
export class AppModule {}
```

Với cách đăng ký này, **mọi endpoint trong toàn bộ ứng dụng** đều yêu cầu JWT token — trừ những route được đánh dấu `@Public()`.

### Bước 10: Bảo vệ UserController

```typescript
// src/user/user.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard) // Bảo vệ TOÀN BỘ endpoints trong controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    // @CurrentUser('id') trích xuất userId từ request.user
    // Không cần @Param('id') — user chỉ xem được hồ sơ của chính mình
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }
}
```

Điểm nổi bật so với Chương 4–6:
- Thay `@Param('id')` bằng `@CurrentUser('id')` — user ID được lấy từ JWT token, không từ URL. Điều này đảm bảo user chỉ thao tác trên dữ liệu của chính mình.
- `@UseGuards(JwtAuthGuard)` ở cấp class — toàn bộ endpoint đều cần token hợp lệ.
- Kết hợp với `APP_GUARD` global, `UserController` được bảo vệ hai lớp (tuy chỉ cần một).

### Bước 11: Kiểm tra luồng hoàn chỉnh bằng Hoppscotch

**Test 1 — Đăng ký tài khoản (Register):**
- **Method:** POST
- **URL:** `http://localhost:3333/api/v1/auth/register`
- **Body:**
```json
{
  "email": "dat@sgu.edu.vn",
  "password": "StrongP@ss1",
  "fullname": "Nguyễn Tuấn Đạt",
  "displayName": "Tuấn Đạt"
}
```
- **Expected:** Status 201 — trả về thông tin user (không có password) + tokens:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "email": "dat@sgu.edu.vn",
      "name": "Nguyễn Tuấn Đạt",
      "avatar": null,
      "status": "ACTIVE"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 900
    }
  },
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch POST /api/v1/auth/register — response 201 với user info và tokens)

**Test 2 — Đăng nhập (Login):**
- **Method:** POST
- **URL:** `http://localhost:3333/api/v1/auth/login`
- **Body:**
```json
{
  "email": "dat@sgu.edu.vn",
  "password": "StrongP@ss1"
}
```
- **Expected:** Status 200 — trả về user info + tokens (response được bọc bởi TransformResponseInterceptor):
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid...", "email": "dat@sgu.edu.vn", ... },
    "tokens": { "accessToken": "eyJhbGc...", "refreshToken": "eyJhbGc...", "expiresIn": 900 }
  },
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch POST /api/v1/auth/login — response 200 với accessToken JWT)

**Test 3 — Truy cập hồ sơ KHÔNG CÓ token (401):**
- **Method:** GET
- **URL:** `http://localhost:3333/api/v1/users/me`
- **Headers:** Không có Authorization
- **Expected:** Status 401 — format lỗi chuẩn hóa từ HttpExceptionFilter:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "path": "/api/v1/users/me",
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch GET /api/v1/users/me không có token — response 401 Unauthorized)

**Test 4 — Truy cập hồ sơ CÓ token (200):**
- **Method:** GET
- **URL:** `http://localhost:3333/api/v1/users/me`
- **Headers:** `Authorization: Bearer eyJhbGc...` (copy accessToken từ Test 2)
- **Expected:** Status 200 — thông tin hồ sơ user được bọc trong response chuẩn hóa:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "email": "dat@sgu.edu.vn",
    "displayName": "Tuấn Đạt",
    "bio": null,
    "status": "ACTIVE",
    ...
  },
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch GET /api/v1/users/me với Bearer token — response 200 với thông tin user)

**Test 5 — Đăng nhập sai mật khẩu (401):**
- **Method:** POST
- **URL:** `http://localhost:3333/api/v1/auth/login`
- **Body:**
```json
{
  "email": "dat@sgu.edu.vn",
  "password": "sai-mat-khau"
}
```
- **Expected:** Status 401 — thông báo chung, không tiết lộ email có tồn tại hay không:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Email or password is not correct",
  "path": "/api/v1/auth/login",
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch POST /api/v1/auth/login sai password — response 401)

**Test 6 — Đăng ký với password yếu (validation lỗi):**
- **Method:** POST
- **URL:** `http://localhost:3333/api/v1/auth/register`
- **Body:**
```json
{
  "email": "test@sgu.edu.vn",
  "password": "123",
  "fullname": "Test User",
  "displayName": "Test"
}
```
- **Expected:** Status 400 — validation từ RegisterDto:
```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "Password must be at least 8 characters",
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ],
  "path": "/api/v1/auth/register",
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch POST /api/v1/auth/register với password yếu — response 400 validation errors)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Triển khai hệ thống xác thực hoàn chỉnh với Register, Login, và Logout.
- Mật khẩu được mã hóa an toàn bằng `bcrypt` — không bao giờ lưu plaintext vào database.
- JWT token (access + refresh) được sinh ra khi đăng nhập/đăng ký, chứa `sub` và `email` trong payload.
- `JwtStrategy` xác minh token và kiểm tra blacklist, `JwtAuthGuard` hỗ trợ `@Public()` để mở route công khai.
- `APP_GUARD` đăng ký Guard toàn cục qua module system — hỗ trợ Dependency Injection đầy đủ (khác với `app.useGlobalGuards()`).
- Custom Decorators (`@Public()`, `@CurrentUser()`) giúp code gọn gàng và dễ đọc.
- `UserController` được bảo vệ — user chỉ xem/cập nhật hồ sơ của chính mình thông qua `@CurrentUser('id')`.

Kết hợp với các cơ chế từ các chương trước — Prisma (Ch.5), Validation + Response chuẩn hóa (Ch.6) — API giờ đây có đầy đủ: kết nối database, kiểm tra dữ liệu đầu vào, format response nhất quán, và bảo mật JWT. Đây là nền tảng hoàn chỉnh để xây dựng các tính năng nghiệp vụ trong phần tiếp theo của đồ án.
