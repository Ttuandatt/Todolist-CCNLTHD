# BỔ SUNG TRADE-OFFS & LỖI THƯỜNG GẶP (Chương 4–7)

> **Hướng dẫn dán vào báo cáo:** Thêm các section dưới đây vào **cuối mỗi chương tương ứng**, trước phần "Tổng kết".

---

## Bổ sung cho CHƯƠNG 4 — Các khái niệm cơ bản

### 4.8. Lỗi thường gặp và Trade-offs

#### Lỗi 1: Circular Dependency (Phụ thuộc vòng tròn)

**Vấn đề:** Module A import Module B, Module B lại import Module A. NestJS sẽ báo lỗi:
```
Nest cannot create the AuthModule instance.
The module at index [1] of the AuthModule "imports" array is undefined.
```

**Ví dụ trong thực tế:** `AuthModule` cần `UserService` để tìm user khi đăng nhập. `UserModule` cần `AuthService` để kiểm tra quyền. Nếu import nhau thành vòng tròn sẽ gây crash.

**Giải pháp:** Dùng `forwardRef()`:
```typescript
// auth.module.ts
imports: [forwardRef(() => UserModule)]

// auth.service.ts
constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) {}
```

**Tốt hơn:** Tái cấu trúc để loại bỏ phụ thuộc vòng tròn — thường là dấu hiệu thiết kế module chưa tốt.

#### Lỗi 2: Provider không được inject vì quên khai báo

**Vấn đề:** Inject `MailService` vào `AuthService` nhưng `MailModule` chưa được import vào `AuthModule`. NestJS báo:
```
Nest can't resolve dependencies of the AuthService (?).
Please make sure that the argument MailService at index [2] is available in the AuthModule context.
```

**Giải pháp:** Kiểm tra 3 điều kiện:
1. `MailService` phải có `@Injectable()`
2. `MailModule` phải `exports: [MailService]`
3. `AuthModule` phải `imports: [MailModule]`

#### Trade-off: Provider Scope — Singleton vs Request

Theo mặc định, tất cả Provider trong NestJS là **Singleton** — được tạo một lần và tái sử dụng. Đây là lựa chọn tối ưu cho hầu hết trường hợp.

| Scope | Khi tạo | Tái sử dụng | Khi dùng |
|-------|---------|------------|---------|
| `DEFAULT` (Singleton) | Lần đầu | Cho mọi request | 99% trường hợp |
| `REQUEST` | Mỗi request | Không | Cần dữ liệu riêng mỗi request (tenant isolation) |
| `TRANSIENT` | Mỗi lần inject | Không | Stateful providers cần instance riêng |

**Lưu ý:** `REQUEST` scope làm giảm hiệu năng đáng kể — tránh dùng trừ khi thực sự cần thiết.

---

## Bổ sung cho CHƯƠNG 5 — Prisma & Database

### 5.11. Lỗi thường gặp và Trade-offs

#### Vấn đề N+1 Query — Cạm bẫy phổ biến nhất

**Vấn đề:** Khi lấy danh sách tasks kèm thông tin người được giao, nếu không cẩn thận sẽ tạo ra N+1 queries — 1 query lấy tasks, rồi N queries riêng lấy assignees của mỗi task.

```typescript
// ❌ SAI — N+1 queries
const tasks = await this.prisma.task.findMany({ where: { projectId } });
for (const task of tasks) {
  task.assignees = await this.prisma.taskAssignment.findMany({
    where: { taskId: task.id }
  });
}
```

**Giải pháp:** Dùng `include` để Prisma tự join trong một query duy nhất:
```typescript
// ✅ ĐÚNG — 1 query duy nhất
const tasks = await this.prisma.task.findMany({
  where: { projectId },
  include: {
    assignments: {
      include: { user: { select: { id: true, name: true, avatar: true } } }
    },
    labels: { include: { label: true } },
    _count: { select: { subtasks: true } }
  }
});
```

#### Trade-off: `include` vs `select`

| | `include` | `select` |
|--|----------|---------|
| **Mục đích** | Thêm relations vào kết quả | Chỉ lấy fields cụ thể |
| **Performance** | Có thể fetch nhiều data không cần thiết | Tối ưu hơn, chỉ lấy đúng fields |
| **Dùng khi** | Cần toàn bộ data của relation | Biết chính xác fields cần dùng |
| **Ví dụ trong đồ án** | Lấy task kèm assignees | `getProfile()` — loại bỏ password |

#### Khi nào KHÔNG nên dùng Prisma Migrate

- **Production database có data quan trọng:** Luôn backup trước khi chạy migrate
- **Rename column:** Prisma sẽ DROP + ADD thay vì RENAME — mất data. Cần viết custom migration SQL
- **Schema quá phức tạp:** Một số database-specific features (partitioning, triggers) cần raw SQL

```bash
# Tạo migration rỗng để viết SQL tùy chỉnh
npx prisma migrate dev --name rename_column --create-only
# Sau đó edit file migration.sql trước khi apply
```

---

## Bổ sung cho CHƯƠNG 6 — Kỹ thuật nâng cao

### 6.5. Lỗi thường gặp và Trade-offs

#### Khi nào KHÔNG dùng ValidationPipe global

`ValidationPipe` với `whitelist: true` loại bỏ mọi field không khai báo trong DTO. Điều này gây vấn đề với:

- **File upload:** `multipart/form-data` không phải JSON — không cần ValidationPipe
- **Webhook endpoint:** Payload từ bên ngoài có thể có nhiều field động

**Giải pháp:** Tắt validation cho endpoint cụ thể:
```typescript
@Post('webhook')
@UsePipes(new ValidationPipe({ whitelist: false })) // Override global pipe
handleWebhook(@Body() payload: any) { ... }
```

#### Trade-off: Interceptor vs Middleware

Cả hai đều có thể xử lý request/response, nhưng có sự khác biệt:

| | Interceptor | Middleware |
|--|------------|-----------|
| **Vị trí** | Sau Guards, trước Controller | Trước Guards |
| **Truy cập DI** | Có (inject Services) | Có (nhưng cần thiết lập thêm) |
| **Xử lý response** | Có (dùng RxJS pipe) | Không |
| **Dùng khi** | Transform response, logging có context | CORS, parsing, rate limiting |

**Trong đồ án:** `TransformResponseInterceptor` và `LoggingInterceptor` dùng Interceptor vì cần xử lý cả response. CORS được cấu hình qua Express middleware.

#### Lỗi thường gặp với Interceptor: Không xử lý lỗi đúng cách

```typescript
// ❌ SAI — chỉ wrap thành công, lỗi bị bỏ qua
intercept(context, next) {
  return next.handle().pipe(
    map(data => ({ success: true, data }))
  );
}

// ✅ ĐÚNG — lỗi được xử lý bởi ExceptionFilter riêng
// Interceptor chỉ xử lý response thành công
// ExceptionFilter xử lý lỗi
```

---

## Bổ sung cho CHƯƠNG 7 — Authentication & Authorization

### 7.8. Lỗi thường gặp và Trade-offs

#### Lỗi 1: JWT_SECRET không được load

**Vấn đề:** `JwtStrategy requires a secret or key` khi khởi động.

**Nguyên nhân:** `ConfigModule` chưa được load trước `AuthModule`, hoặc file `.env` không tồn tại.

**Giải pháp:** Đảm bảo `ConfigModule.forRoot({ isGlobal: true })` là import đầu tiên trong `AppModule`. Kiểm tra file `.env` tồn tại và có `JWT_SECRET`.

#### Lỗi 2: Token vẫn hợp lệ sau logout

**Vấn đề kinh điển của JWT:** JWT là stateless — server không lưu session. Một khi token được phát, không có cách nào "thu hồi" nó trước khi hết hạn... trừ khi dùng blacklist.

**Giải pháp trong đồ án:** `InvalidatedToken` table — lưu token đã logout, kiểm tra trong `JwtStrategy.validate()`:

```typescript
// jwt.strategy.ts — kiểm tra blacklist mỗi request
async validate(req: Request, payload: { sub: string; email: string }) {
  const token = req?.headers?.authorization?.replace('Bearer ', '');
  if (token) {
    const isInvalidated = await this.prisma.invalidatedToken.findUnique({
      where: { token }
    });
    if (isInvalidated) throw new UnauthorizedException('Token is invalidated');
  }
  return { id: payload.sub, email: payload.email };
}
```

**Trade-off:** Mỗi request authenticated đều tốn 1 DB query để kiểm tra blacklist. Với traffic cao, có thể dùng Redis để lưu blacklist trong memory thay vì PostgreSQL.

#### Trade-off: Access Token ngắn vs dài hạn

| | Access Token ngắn (15m) | Access Token dài (7d) |
|--|------------------------|----------------------|
| **Bảo mật** | Cao — token bị lộ tự hết hạn nhanh | Thấp hơn |
| **UX** | Cần refresh thường xuyên | Đăng nhập lâu hơn |
| **Phức tạp** | Cần Refresh Token + auto-refresh logic | Đơn giản hơn |
| **Dùng khi** | Production, dữ liệu nhạy cảm | Prototype, học tập |

**Trong đồ án:** Access Token 15 phút + Refresh Token 15 ngày — cân bằng giữa bảo mật và UX.

#### Khi nào KHÔNG dùng APP_GUARD global

Đăng ký `JwtAuthGuard` là `APP_GUARD` có nghĩa là **toàn bộ API đều cần JWT**. Điều này đúng trong hầu hết trường hợp, nhưng cần chú ý:

- Endpoint `POST /auth/register`, `POST /auth/login` phải có `@Public()` — nếu quên, user không thể đăng ký/đăng nhập
- Endpoint Swagger UI cũng cần được exclude khỏi authentication
- Health check endpoint (`GET /health`) thường cần public để load balancer kiểm tra

```typescript
// Đánh dấu route là public — bỏ qua JwtAuthGuard
@Public()
@Post('register')
register(@Body() dto: RegisterDto) { ... }
```
