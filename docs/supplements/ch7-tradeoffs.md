<!-- Chèn vào: SAU section 7.4 (Token Blacklist), TRƯỚC bài tập Chương 7 -->

## 7.5. Lỗi thường gặp và Trade-offs

### 7.5.1. JWT_SECRET không load — ConfigModule chưa khởi tạo

Đây là lỗi nghiêm trọng nhất liên quan đến authentication trong NestJS, vì nó gây crash toàn bộ ứng dụng ngay khi khởi động. Error message xuất hiện dưới dạng:

```
TypeError: JwtStrategy requires a secret or key
    at new JwtStrategy (jwt.strategy.ts:10:5)
```

Nguyên nhân nằm ở thứ tự khai báo modules trong `AppModule`. `JwtStrategy` cần đọc `JWT_SECRET` từ biến môi trường khi được khởi tạo. Nếu `ConfigModule` — module chịu trách nhiệm load file `.env` vào `process.env` — chưa được khởi tạo trước `AuthModule`, thì tại thời điểm `JwtStrategy` chạy constructor, `process.env.JWT_SECRET` vẫn là `undefined`.

Giải pháp là đảm bảo `ConfigModule.forRoot()` luôn đứng đầu tiên trong mảng imports. Trong dự án TodoList Collaboration, `app.module.ts` đã được cấu hình đúng:

```typescript
// backend/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,                      // ← Đứng ĐẦU TIÊN
      envFilePath: ['.env.local', '.env'], // Load theo thứ tự ưu tiên
    }),
    AuthModule,     // Khởi tạo SAU ConfigModule → JWT_SECRET đã có
    MailModule,
    PrismaModule,
    UserModule,
    // ...
  ],
})
export class AppModule {}
```

Ngoài ra, `JwtStrategy` trong dự án cũng có thêm một lớp bảo vệ — kiểm tra và throw error rõ ràng nếu secret không tồn tại, thay vì để Passport throw error khó hiểu:

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
constructor(private prisma: PrismaService, private config: ConfigService) {
  const secret = config.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_SECRET is not defined. Set JWT_SECRET in .env or environment.');
  }

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: secret,
    passReqToCallback: true,
  });
}
```

Bài học rút ra là các infrastructure modules (`ConfigModule`, `PrismaModule`) phải luôn được import trước các feature modules (`AuthModule`, `UserModule`) — thứ tự trong mảng `imports` quyết định thứ tự khởi tạo.

### 7.5.2. Trade-off: Access Token ngắn hạn vs dài hạn

Thời gian sống (TTL — Time To Live) của access token là quyết định thiết kế quan trọng ảnh hưởng trực tiếp đến bảo mật và trải nghiệm người dùng. Bảng dưới đây phân tích hai chiến lược đối lập:

| Tiêu chí | **Ngắn hạn (15 phút)** | **Dài hạn (7 ngày)** |
|----------|-------------------------|----------------------|
| **Bảo mật** | Cao — token bị đánh cắp chỉ dùng được 15 phút | Thấp — kẻ tấn công có 7 ngày khai thác |
| **Trải nghiệm UX** | Cần silent refresh — phức tạp hơn cho frontend | Đơn giản — user hiếm khi bị logout bất ngờ |
| **Độ phức tạp** | Cần implement refresh token rotation | Không cần refresh token |
| **Token Blacklist** | Bảng blacklist nhỏ (token hết hạn nhanh) | Bảng blacklist rất lớn theo thời gian |
| **Phù hợp cho** | Ứng dụng chứa dữ liệu nhạy cảm | Ứng dụng ít rủi ro bảo mật |

Dự án TodoList Collaboration chọn chiến lược **access token 15 phút kết hợp refresh token 7 ngày**. Đây là cách tiếp cận cân bằng: access token ngắn hạn giảm thiểu thiệt hại khi bị đánh cắp, trong khi refresh token dài hạn đảm bảo user không phải đăng nhập lại thường xuyên. Khi access token hết hạn, frontend gọi `POST /api/v1/auth/refresh` với refresh token để nhận access token mới — quá trình này diễn ra "im lặng" (silent refresh), user không nhận thấy.

```typescript
// backend/src/modules/auth/auth.service.ts — generateTokens()
const [accessToken, refreshToken] = await Promise.all([
  this.jwtService.signAsync(payload, {
    secret: jwtSecret,
    expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '15m', // ← 15 phút
  }),
  this.jwtService.signAsync(payload, {
    secret: jwtRefreshSecret,
    expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d', // ← 7 ngày
  }),
]);
```

Ngoài ra, refresh token được lưu vào database (bảng `refresh_tokens`) và có cơ chế revoke — khi user logout hoặc đổi mật khẩu, tất cả refresh tokens đều bị thu hồi, buộc kẻ tấn công phải có credentials mới để lấy token mới.

### 7.5.3. Khi nào KHÔNG dùng APP_GUARD global

Dự án TodoList Collaboration đăng ký `JwtAuthGuard` ở cấp global thông qua `APP_GUARD` trong `AppModule`:

```typescript
// backend/src/app.module.ts
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
```

Cách tiếp cận này có ưu điểm rõ ràng: **mọi endpoint đều được bảo vệ mặc định** — developer không thể vô tình quên đặt guard và để lộ endpoint. Tuy nhiên, một số endpoint cần được truy cập công khai mà không cần JWT: `register`, `login`, `refresh`, `forgot-password`, `reset-password`.

Giải pháp là sử dụng custom decorator `@Public()` để đánh dấu các endpoint không cần xác thực:

```typescript
// backend/src/modules/auth/decorators/public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Sử dụng trong AuthController:
@Public()            // ← Bỏ qua JWT check
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
```

`JwtAuthGuard` kiểm tra metadata `isPublic` trước khi thực hiện xác thực. Nếu endpoint được đánh dấu `@Public()`, guard bỏ qua JWT check và cho request đi qua:

```typescript
// backend/src/modules/auth/guards/jwt-auth.guard.ts
canActivate(context: ExecutionContext) {
  const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (isPublic) {
    return true; // ← Bỏ qua JWT check
  }

  return super.canActivate(context); // ← Chạy JWT verify bình thường
}
```

Triết lý thiết kế ở đây là **secure by default, opt-out explicitly** — mặc định bảo mật, chỉ mở ra khi có lý do rõ ràng. Mỗi endpoint public đều phải được developer chủ động đánh dấu `@Public()`, giảm thiểu rủi ro để lộ endpoint nhạy cảm do sơ suất.
