# Chương 9: Triển khai chi tiết các module

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ biết cách triển khai module Authentication hoàn chỉnh với sáu luồng nghiệp vụ (register, login, refresh, logout, forgot/reset password), xây dựng module User với các tính năng quản lý hồ sơ, thay đổi mật khẩu an toàn, và file upload bằng Multer — tất cả dựa trên nền tảng thiết kế đã phân tích ở **Chương 8**.

---

## 9.1. Module Authentication

### 9.1.1. Cấu trúc module

Auth Module chịu trách nhiệm toàn bộ quy trình xác thực — từ đăng ký tài khoản đến đăng xuất. Cấu trúc thư mục phản ánh nguyên tắc phân tách trách nhiệm:

```
src/auth/
├── auth.module.ts              ← Khai báo module
├── auth.controller.ts          ← 6 API endpoints
├── auth.service.ts             ← Business logic
├── dto/
│   ├── register.dto.ts         ← Validate đăng ký
│   ├── login.dto.ts            ← Validate đăng nhập
│   ├── refresh-token.dto.ts    ← Validate refresh token
│   ├── forgot-password.dto.ts  ← Validate email
│   └── reset-password.dto.ts   ← Validate đặt lại mật khẩu
├── guards/
│   └── jwt-auth.guard.ts       ← Guard + @Public() support
├── strategies/
│   └── jwt.strategy.ts         ← Passport JWT + Blacklist check
└── decorators/
    ├── current-user.decorator.ts
    └── public.decorator.ts
```

### 9.1.2. DTOs — Validate dữ liệu đầu vào

DTO (Data Transfer Object) kết hợp với `ValidationPipe` toàn cục (đã thiết kế ở **Chương 8**) tạo thành tuyến phòng thủ đầu tiên — mọi dữ liệu không hợp lệ bị reject ngay lập tức với lỗi 400 trước khi chạm đến controller.

```typescript
// src/auth/dto/register.dto.ts
export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Fullname should not be empty' })
  fullname: string;

  @IsString()
  @IsNotEmpty({ message: 'Display name should not be empty' })
  displayName: string;
}
```

Decorator `@Matches()` trên field `password` sử dụng bốn *lookahead assertions* — `(?=.*[a-z])`, `(?=.*[A-Z])`, `(?=.*\d)`, `(?=.*[@$!%*?&])` — để kiểm tra đồng thời bốn điều kiện mà không ảnh hưởng đến thứ tự ký tự. Quy tắc này tuân theo khuyến nghị OWASP, đảm bảo mật khẩu có đủ entropy để chống tấn công từ điển.

Các DTOs còn lại tuân theo nguyên tắc **tối thiểu hóa bề mặt tấn công** — mỗi DTO chỉ chấp nhận đúng những fields cần thiết:

```typescript
// src/auth/dto/login.dto.ts — chỉ cần email + password
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
```

`LoginDto` không validate độ mạnh password vì mật khẩu đã được validate khi đăng ký. `RefreshTokenDto` chỉ chứa field `refreshToken`, `ForgotPasswordDto` chỉ chứa `email`, và `ResetPasswordDto` chứa `token` kèm `newPassword` (có cùng regex validate như `RegisterDto`).

### 9.1.3. Auth Service — Business Logic

`AuthService` là trung tâm nghiệp vụ, chứa logic cho sáu luồng xác thực. Service inject hai dependencies qua constructor — `JwtService` để tạo/verify JWT tokens và `PrismaService` để truy cập database:

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  // ...
}
```

#### Luồng Register

```typescript
// src/auth/auth.service.ts
async register(dto: RegisterDto) {
  // Bước 1: Kiểm tra email trùng lặp
  const existingUser = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

  // Bước 2: Hash mật khẩu
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // Bước 3: Tạo user trong database
  const user = await this.prisma.user.create({
    data: {
      email: dto.email,
      password: hashedPassword,
      name: dto.fullname,
      displayName: dto.displayName,
    },
  });

  // Bước 4: Tạo cặp Access Token + Refresh Token
  const tokens = await this.generateTokens(user.id, user.email);

  // Bước 5: Trả về thông tin user (KHÔNG bao gồm password)
  return {
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, status: user.status },
    tokens,
  };
}
```

Năm bước tuần tự đảm bảo tính toàn vẹn: kiểm tra trùng email trước (tránh lỗi unique constraint từ database), hash mật khẩu (không bao giờ lưu plain text), tạo user, tạo tokens, và trả về response đã lọc bỏ field `password`. `ConflictException` (HTTP 409) được sử dụng thay vì 400 vì đây là xung đột dữ liệu, không phải lỗi validation.

#### Luồng Login

```typescript
// src/auth/auth.service.ts
async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (!user) {
    throw new UnauthorizedException('Email or password is not correct');
  }

  const passwordMatch = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedException('Email or password is not correct');
  }

  // Cập nhật lastLoginAt
  await this.prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await this.generateTokens(user.id, user.email);
  return {
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, status: user.status },
    tokens,
  };
}
```

Thông báo lỗi cho cả trường hợp sai email lẫn sai password đều giống nhau — *"Email or password is not correct"*. Đây là best practice bảo mật: nếu trả về hai thông báo khác nhau, kẻ tấn công có thể lợi dụng để liệt kê (enumerate) danh sách email đã đăng ký trong hệ thống.

#### Luồng Refresh Token

```typescript
// src/auth/auth.service.ts
async refreshToken(dto: RefreshTokenDto) {
  // Bước 1: Tìm và validate refresh token trong database
  const storedToken = await this.prisma.refreshToken.findUnique({
    where: { token: dto.refreshToken },
  });
  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    throw new UnauthorizedException('Invalid refresh token or token has expired');
  }

  // Bước 2: Verify JWT signature
  try {
    await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET as string,
    });
  } catch {
    throw new UnauthorizedException('Invalid refresh token');
  }

  // Bước 3: Token Rotation — thu hồi token cũ
  await this.prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  // Bước 4: Tạo cặp token mới
  const tokens = await this.generateTokens(storedToken.userId, '');
  return tokens;
}
```

Bước 1 thực hiện kiểm tra ba tầng: token phải tồn tại, chưa bị thu hồi (`revokedAt` là `null`), và chưa hết hạn. Bước 2 verify chữ ký JWT bằng `JWT_REFRESH_SECRET` — secret key riêng biệt, khác với `JWT_SECRET` dùng cho access token. Bước 3 áp dụng **Token Rotation**: thu hồi token cũ trước khi cấp token mới — nếu refresh token bị đánh cắp, kẻ tấn công chỉ có thể dùng đúng một lần.

#### Luồng Logout và Token Blacklist

```typescript
// src/auth/auth.service.ts
async logout(userId: string, accessToken: string) {
  // Bước 1: Thu hồi TẤT CẢ refresh tokens
  await this.prisma.refreshToken.updateMany({
    where: { userId: userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  // Bước 2: Đưa access token vào blacklist
  if (accessToken) {
    try {
      const decoded = this.jwtService.decode(accessToken) as { exp: number };
      await this.prisma.invalidatedToken.create({
        data: {
          token: accessToken,
          expiresAt: new Date(decoded.exp * 1000), // Unix timestamp → JS Date
          reason: 'LOGOUT',
        },
      });
    } catch {
      // Decode thất bại → bỏ qua
    }
  }

  return { message: 'Logout successfully' };
}
```

Bước 1 thu hồi mọi refresh tokens — user không thể lấy access token mới. Bước 2 giải quyết vấn đề "vô hiệu hóa tức thì" access token bằng cách đưa vào bảng `InvalidatedToken`. Field `expiresAt` tính từ claim `exp` trong JWT payload (nhân 1000 vì `exp` là Unix timestamp tính bằng giây, còn JavaScript `Date` cần millisecond), cho phép cron job dọn dẹp records đã hết hạn.

#### Luồng Forgot Password và Reset Password

```typescript
// src/auth/auth.service.ts
async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Tạo token ngẫu nhiên 32 bytes = 64 ký tự hex (CSPRNG)
  const resetToken = crypto.randomBytes(32).toString('hex');

  await this.prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    },
  });

  // TODO: Gửi email chứa link reset
  return { message: 'Reset password email sent' };
}
```

`crypto.randomBytes(32)` tạo token từ Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) của hệ điều hành — an toàn hơn `Math.random()` vì không thể dự đoán. Token có thời hạn 15 phút, đủ để user kiểm tra email nhưng không quá dài để bị khai thác.

```typescript
// src/auth/auth.service.ts
async resetPassword(dto: ResetPasswordDto) {
  const passwordReset = await this.prisma.passwordReset.findUnique({
    where: { token: dto.token },
  });
  if (!passwordReset || passwordReset.usedAt || passwordReset.expiresAt < new Date()) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

  // Transaction: cập nhật password + đánh dấu token đã dùng
  await this.prisma.$transaction([
    this.prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    }),
    this.prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { message: 'Password reset successfully' };
}
```

`$transaction` (đã trình bày ở **Chương 5**) đảm bảo cả hai thao tác thành công hoặc cả hai rollback — tránh tình huống mật khẩu được cập nhật nhưng token chưa bị đánh dấu, cho phép dùng lại token.

#### Helper generateTokens

```typescript
// src/auth/auth.service.ts
private async generateTokens(userId: string, email: string) {
  const payload = { sub: userId, email: email };

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

  // Lưu refresh token vào database
  await this.prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
  });

  return { accessToken, refreshToken, expiresIn: 900 };
}
```

`Promise.all()` tạo hai token song song — tối ưu hiệu năng vì hai thao tác ký token độc lập. Field `expiresIn: 900` (900 giây = 15 phút) giúp frontend đặt timer tự động gọi `/auth/refresh` trước khi access token hết hạn.

### 9.1.4. Auth Controller — API Endpoints

```typescript
// src/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser('id') userId: string,
    @Headers('authorization') auth: string,
  ) {
    const accessToken = auth?.replace('Bearer ', '');
    return this.authService.logout(userId, accessToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
```

Năm trong sáu endpoints được đánh dấu `@Public()` vì đây là các thao tác thực hiện khi user chưa có hoặc đã hết hạn access token. Chỉ `logout` yêu cầu JWT — để lấy userId và access token cần đưa vào blacklist.

Decorator `@HttpCode(HttpStatus.OK)` override status code mặc định 201 của `@Post()` thành 200 — vì login, refresh, logout không "tạo" resource mới. Riêng `register` giữ nguyên 201 vì thực sự tạo user mới.

Endpoint `logout` kết hợp hai parameter decorators: `@CurrentUser('id')` trích xuất userId từ JWT payload, `@Headers('authorization')` lấy raw header để tách access token ra khỏi prefix "Bearer ".

### 9.1.5. JwtAuthGuard — Guard hỗ trợ @Public()

```typescript
// src/auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Bỏ qua JWT check
    }
    return super.canActivate(context); // Chạy JWT verify
  }
}
```

`Reflector` — inject qua DI — đọc metadata `IS_PUBLIC_KEY` đã được gắn bởi decorator `@Public()`. Method `getAllAndOverride` kiểm tra theo thứ tự ưu tiên: method handler trước, class sau. Nếu tìm thấy, guard trả về `true` ngay — cho phép request đi qua mà không cần JWT.

### 9.1.6. JwtStrategy — Token Blacklist Check

```typescript
// src/auth/strategies/jwt.strategy.ts
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
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    if (token) {
      const isInvalidated = await this.prisma.invalidatedToken.findUnique({
        where: { token },
      });
      if (isInvalidated) {
        throw new UnauthorizedException('Token is invalidated');
      }
    }
    return { id: payload.sub, email: payload.email };
  }
}
```

Tùy chọn `passReqToCallback: true` cho phép method `validate()` nhận object `request` làm tham số đầu tiên — cần thiết để trích xuất raw token và kiểm tra blacklist. Sau khi verify chữ ký JWT thành công, strategy tra cứu token trong bảng `InvalidatedToken`. Nếu tìm thấy, request bị từ chối với 401 — bất kể token vẫn còn hạn theo JWT expiration.

### 9.1.7. Custom Decorators

```typescript
// src/auth/decorators/public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

`@Public()` gắn metadata `{ isPublic: true }` lên route handler. `JwtAuthGuard` dùng `Reflector` đọc metadata này để quyết định bỏ qua JWT check hay không.

```typescript
// src/auth/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user[data] : user;
  },
);
```

`@CurrentUser()` truy cập `request.user` — object được gắn bởi `JwtStrategy.validate()`. Khi truyền tham số (ví dụ `@CurrentUser('id')`), chỉ trả về field tương ứng. Cách thiết kế này biểu đạt rõ ý định trong code, tránh coupling với object `request` của Express.

### 9.1.8. Auth Module — Kết nối thành phần

```typescript
// src/auth/auth.module.ts
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

`JwtModule.register({})` đăng ký với config rỗng — vì `AuthService` truyền secret và expiresIn riêng cho từng `signAsync()` call, cho phép access token và refresh token có cấu hình khác nhau. `AuthService` được export để module khác có thể sử dụng logic xác thực nếu cần.

---

## 9.2. Module User

### 9.2.1. Cấu trúc module

User Module cho phép người dùng đã xác thực quản lý hồ sơ cá nhân. Tất cả endpoints đều yêu cầu JWT — không có endpoint nào được đánh dấu `@Public()`:

```
src/user/
├── user.module.ts          ← Khai báo module + MulterModule
├── user.controller.ts      ← 4 API endpoints
├── user.service.ts         ← Business logic
└── dto/
    ├── update-profile.dto.ts   ← Validate cập nhật profile
    └── change-password.dto.ts  ← Validate đổi mật khẩu
```

So với Auth Module, User Module gọn hơn đáng kể — không cần guards, strategies, hay decorators riêng vì tái sử dụng trực tiếp `JwtAuthGuard` và `@CurrentUser()` từ Auth Module. Đây là minh chứng cho sức mạnh của kiến trúc module hóa.

### 9.2.2. DTOs

```typescript
// src/user/dto/update-profile.dto.ts
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Display name must be at most 50 characters long' })
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Bio must be at most 160 characters long' })
  bio?: string;
}
```

Cả hai fields đều `@IsOptional()` — cho phép client gửi một hoặc cả hai. Giới hạn 50 ký tự cho displayName và 160 ký tự cho bio (tương đương một dòng tweet) buộc người dùng ngắn gọn.

```typescript
// src/user/dto/change-password.dto.ts
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'New password must contain at least one uppercase letter, one number, and one special character',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}
```

Field `currentPassword` chỉ cần `@IsNotEmpty()` — không validate độ mạnh vì đây là mật khẩu đã tồn tại, chỉ cần kiểm tra đúng/sai qua `bcrypt.compare()`. Việc so sánh `newPassword` với `confirmPassword` được thực hiện ở tầng service.

### 9.2.3. User Service — Business Logic

#### profileSelect — Kiểm soát dữ liệu trả về

```typescript
// src/user/user.service.ts
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly profileSelect = {
    id: true, email: true, name: true, displayName: true,
    avatar: true, status: true, bio: true, emailVerified: true,
    lastLoginAt: true, createdAt: true, updatedAt: true,
  } as const;
  // ...
}
```

`profileSelect` định nghĩa chính xác 11 fields được trả về — field `password` không nằm trong danh sách, đảm bảo mật khẩu (dù đã hash) không bao giờ rò rỉ qua API. Object này được tái sử dụng bởi mọi method, đảm bảo response luôn có cấu trúc nhất quán.

#### getProfile — Xem hồ sơ

```typescript
// src/user/user.service.ts
async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: this.profileSelect,
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
```

Luôn kiểm tra user tồn tại dù userId từ JWT đã xác thực — trường hợp user bị xóa giữa lúc token còn hạn vẫn có thể xảy ra.

#### updateProfile — Cập nhật hồ sơ

```typescript
// src/user/user.service.ts
async updateProfile(userId: string, dto: UpdateProfileDto) {
  if (!dto.displayName && !dto.bio) {
    throw new BadRequestException(
      'At least one field (displayName or bio) must be provided for update',
    );
  }

  const updated = await this.prisma.user.update({
    where: { id: userId },
    data: {
      ...(dto.displayName ? { displayName: dto.displayName } : {}),
      ...(dto.bio ? { bio: dto.bio } : {}),
    },
    select: this.profileSelect,
  });
  return updated;
}
```

Kỹ thuật **Partial Update** với spread operator: `...(dto.displayName ? { displayName: dto.displayName } : {})` — nếu field có giá trị, spread vào object `data`; nếu không, spread object rỗng. Đảm bảo khi client chỉ gửi `{ bio: "New bio" }`, field `displayName` không bị ghi đè thành `undefined`.

Kiểm tra đầu vào ngăn chặn body rỗng `{}` — vì cả hai fields đều `@IsOptional()`, DTO cho phép body rỗng đi qua. Kiểm tra ở service tránh gọi `prisma.user.update` với `data` rỗng.

#### changePassword — Thay đổi mật khẩu (4 tầng kiểm tra)

```typescript
// src/user/user.service.ts
async changePassword(userId: string, dto: ChangePasswordDto) {
  // Tầng 1: Mật khẩu mới khớp xác nhận
  if (dto.newPassword !== dto.confirmPassword) {
    throw new BadRequestException('New password and confirm password do not match');
  }

  // Tầng 2: Tìm user
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Tầng 3: Xác minh mật khẩu hiện tại
  const matches = await bcrypt.compare(dto.currentPassword, user.password);
  if (!matches) {
    throw new BadRequestException('Invalid current password');
  }

  // Tầng 4: Mật khẩu mới phải khác mật khẩu cũ
  const isSame = await bcrypt.compare(dto.newPassword, user.password);
  if (isSame) {
    throw new BadRequestException('New password cannot be the same as current password');
  }

  // Transaction: cập nhật password + thu hồi tất cả refresh tokens
  const hashed = await bcrypt.hash(dto.newPassword, 10);
  await this.prisma.$transaction([
    this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    }),
    this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  return { message: 'Password changed successfully' };
}
```

Bốn tầng kiểm tra đều có lý do bảo mật cụ thể. Tầng 1 ngăn lỗi gõ nhầm (user không thấy nội dung field password). Tầng 2 tìm user và chỉ select field `password` — tối ưu truy vấn. Tầng 3 xác minh mật khẩu hiện tại — ngăn kẻ tấn công chiếm access token nhưng không biết mật khẩu. Tầng 4 ngăn "đổi" mật khẩu thành chính mật khẩu cũ — hành vi vô nghĩa.

Sau bốn tầng kiểm tra, `$transaction` thực hiện hai thao tác nguyên tử: cập nhật mật khẩu mới và **thu hồi tất cả refresh tokens** — buộc mọi phiên đăng nhập trên thiết bị khác phải đăng nhập lại.

#### uploadAvatar — Tải ảnh đại diện

```typescript
// src/user/user.service.ts
async uploadAvatar(userId: string, file: Express.Multer.File) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Xóa avatar cũ nếu tồn tại
  if (user.avatar) {
    const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
    await fs.unlink(oldPath).catch(() => {}); // Bỏ qua lỗi ENOENT
  }

  const updated = await this.prisma.user.update({
    where: { id: userId },
    data: { avatar: file.filename },
    select: this.profileSelect,
  });
  return updated;
}
```

Khi thay avatar, file cũ được xóa để tránh tích tụ file rác. `.catch(() => {})` bắt lỗi ENOENT (file not found) âm thầm — trường hợp file đã bị xóa thủ công không nên gián đoạn luồng upload mới. Method chỉ lưu `file.filename` (tên file random từ Multer) vào database — đường dẫn đầy đủ được ghép khi cần qua static file serving.

### 9.2.4. Cấu hình Multer

```typescript
// src/common/config/multer.config.ts
const avatarDir = join(process.cwd(), 'uploads', 'avatars');
if (!existsSync(avatarDir)) {
  mkdirSync(avatarDir, { recursive: true });
}

export const avatarMulterConfig = {
  storage: diskStorage({
    destination: avatarDir,
    filename: (_req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error('Only image/jpeg, image/png, image/gif files are allowed!'), false);
    }
    callback(null, true);
  },
};
```

Ba quy tắc bảo mật: tên file random chống path traversal (loại bỏ hoàn toàn original filename), giới hạn 5MB chống DoS, lọc MIME type chặn file thực thi và SVG chứa script.

### 9.2.5. User Controller

```typescript
// src/user/user.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Patch('me/change-password')
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(userId, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
    })) file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(userId, file);
  }
}
```

`@UseGuards(JwtAuthGuard)` ở cấp class là tường minh dù đã có Global Guard — best practice để code tự mô tả. `FileInterceptor('avatar', avatarMulterConfig)` xử lý file upload từ field `avatar` trong multipart form-data. `ParseFilePipe` với `MaxFileSizeValidator` thêm tầng validate ở cấp NestJS (ngoài Multer).

### 9.2.6. User Module

```typescript
// src/user/user.module.ts
@Module({
  imports: [MulterModule.register(avatarMulterConfig)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

`MulterModule.register(avatarMulterConfig)` là Dynamic Module (đã giới thiệu ở **Chương 4**) — cung cấp dependencies cho `FileInterceptor`. `UserModule` không cần import `PrismaModule` (đã `@Global()`) hay `AuthModule` (guard đăng ký global qua `APP_GUARD`).

---

## 9.3. Luồng hoạt động tổng thể

Để hiểu cách tất cả thành phần phối hợp, hãy xem xét luồng khi user cập nhật tên hiển thị — một thao tác đi qua mọi tầng xử lý.

Client gửi `PATCH /api/v1/users/me` với body `{ "displayName": "Daniel" }` và header `Authorization: Bearer eyJhbG...`. Request đi qua **Global Prefix** `api/v1`, đến **JwtAuthGuard** — guard kiểm tra metadata `@Public()` trên method `updateProfile`, không tìm thấy, nên kích hoạt **JwtStrategy**. Strategy verify chữ ký JWT, kiểm tra blacklist, rồi gắn `{ id, email }` vào `request.user`.

Tiếp theo, **ValidationPipe** tạo `UpdateProfileDto` từ body, chạy `@IsOptional()`, `@IsString()`, `@MaxLength(50)` — field lạ bị reject nhờ `forbidNonWhitelisted`. Sau validation, **UserController** dùng `@CurrentUser('id')` lấy userId, `@Body()` lấy DTO, rồi chuyển cho **UserService**.

Service kiểm tra ít nhất một field có giá trị, gọi `prisma.user.update` với partial data, trả về profile 11 fields. Response đi qua **TransformResponseInterceptor** thành `{ success: true, data: {...}, timestamp }` và gửi về client. Nếu bất kỳ tầng nào lỗi, **HttpExceptionFilter** format thành `{ success: false, statusCode, message }`.

---

## 9.4. Tổng kết

Chương này đã triển khai chi tiết hai module nền tảng của dự án TodoList Collaboration. Auth Module với sáu luồng nghiệp vụ — register, login, refresh token, logout (kèm Token Blacklist), forgot password, và reset password — cung cấp hạ tầng xác thực hoàn chỉnh. User Module với bốn tính năng — xem hồ sơ, cập nhật profile (Partial Update), thay đổi mật khẩu (4 tầng kiểm tra), và upload avatar (Multer) — tận dụng trọn vẹn hạ tầng xác thực mà không cần viết thêm guard hay strategy.

Điểm xuyên suốt cả hai module là nguyên tắc **defense in depth** (phòng thủ nhiều tầng): DTO validate đầu vào, Guard kiểm tra authentication, Service kiểm tra business rules, và Transaction đảm bảo tính toàn vẹn dữ liệu. Mỗi tầng hoạt động độc lập — lỗi ở bất kỳ tầng nào đều được bắt và trả về response chuẩn nhờ HttpExceptionFilter.

Khi các module tiếp theo (Workspace, Project, Task) được phát triển, chúng sẽ được bổ sung vào chương này dưới dạng mục 9.3, 9.4, 9.5 — tuân theo cùng cấu trúc: DTOs → Service → Controller → Module.
