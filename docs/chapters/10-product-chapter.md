# Chương 9: Sản phẩm tổng hợp — TodoList Collaboration

Chương này trình bày sản phẩm đồ án hoàn chỉnh, bao gồm cấu trúc mã nguồn, cách các kỹ thuật đã học ở Phần 2 được tích hợp vào từng module, giao diện và kết quả vận hành hệ thống, cũng như hướng dẫn cài đặt và sử dụng.

---

## 9.1. Cấu trúc thư mục mã nguồn

Dự án TodoList Collaboration được tổ chức theo mô hình Infrastructure-separated Architecture, phân tách rõ ràng giữa feature modules (chứa nghiệp vụ) và shared infrastructure (chứa các thành phần dùng chung). Cách tổ chức này giúp developer nhanh chóng xác định vị trí code cần sửa đổi, đồng thời đảm bảo tính nhất quán khi mở rộng hệ thống thêm các module mới.

```
Todolist-CCNLTHD/
├── backend/                              ← NestJS Backend (Node.js)
│   ├── src/
│   │   ├── modules/                      ← Feature modules (nghiệp vụ)
│   │   │   ├── auth/                     ← Xác thực & phân quyền
│   │   │   │   ├── decorators/           ← @Public(), @CurrentUser()
│   │   │   │   ├── dto/                  ← RegisterDto, LoginDto, ...
│   │   │   │   ├── guards/              ← JwtAuthGuard
│   │   │   │   ├── strategies/          ← JwtStrategy (Passport)
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── user/                     ← Quản lý hồ sơ người dùng
│   │   │   ├── workspace/                ← Không gian làm việc nhóm
│   │   │   ├── project/                  ← Dự án trong workspace
│   │   │   ├── task/                     ← Công việc trong project
│   │   │   ├── comment/                  ← Bình luận trong task
│   │   │   ├── notification/             ← Thông báo cho người dùng
│   │   │   └── events/                   ← WebSocket Gateway (real-time)
│   │   ├── shared/                       ← Infrastructure dùng chung
│   │   │   ├── prisma/                   ← PrismaService, PrismaModule
│   │   │   ├── mail/                     ← MailService (Brevo/Mock)
│   │   │   └── common/
│   │   │       ├── config/               ← Multer config (file upload)
│   │   │       ├── filters/              ← HttpExceptionFilter
│   │   │       └── interceptors/         ← Logging, TransformResponse
│   │   ├── app.module.ts                 ← Root module
│   │   └── main.ts                       ← Entry point, bootstrap
│   ├── prisma/
│   │   ├── schema.prisma                 ← 17 models, schema database
│   │   └── migrations/                   ← Lịch sử thay đổi schema
│   ├── uploads/avatars/                  ← Avatar người dùng (static)
│   ├── docker-compose.yml                ← PostgreSQL container
│   └── package.json
├── frontend/                             ← React + TypeScript + Vite
│   └── src/
│       ├── pages/                        ← Login, Register, Dashboard, ...
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── ResetPasswordPage.tsx
│       │   ├── DashboardPage.tsx
│       │   └── ProfileSettingsPage.tsx
│       ├── stores/                       ← Zustand state management
│       │   └── auth.store.ts
│       ├── components/                   ← ProtectedRoute, GuestRoute, Layout
│       ├── lib/                          ← axios instance, validators
│       └── types/                        ← TypeScript type definitions
│           └── api.ts
└── docs/                                 ← Tài liệu dự án
```

Việc tách thư mục `modules/` khỏi `shared/` giúp phân biệt rõ ràng giữa code nghiệp vụ (feature code) và code hạ tầng (infrastructure code). Hệ thống gồm **8 feature modules**: Auth, User, Workspace, Project, Task xử lý nghiệp vụ CRUD chính; Comment và Notification bổ sung tương tác cộng tác; Events cung cấp kênh WebSocket để đẩy dữ liệu real-time tới client. Mỗi feature module tuân theo cấu trúc nhất quán gồm bốn thành phần: DTOs để validate đầu vào, Service chứa business logic, Controller định nghĩa API endpoints, và Module kết nối các thành phần lại với nhau.

Thư mục `shared/prisma/` được đánh dấu `@Global()` vì PrismaService là thành phần nền tảng được sử dụng ở mọi module mà không cần khai báo import lại. `shared/mail/` sử dụng Brevo API để gửi email giao dịch (đặt lại mật khẩu, xác nhận email, chào mừng), hỗ trợ mock mode khi phát triển local. Các filters và interceptors trong `shared/common/` được đăng ký global trong `main.ts`, tự động áp dụng cho toàn bộ API — đảm bảo mọi response đều được chuẩn hóa và mọi request đều được ghi log.

---

## 9.2. Tích hợp kỹ thuật từ Phần 2 vào đồ án

Một trong những yêu cầu cốt lõi của đồ án là các kỹ thuật đã được trình bày ở Phần 2 (lý thuyết) phải được áp dụng trực tiếp vào sản phẩm thực tế. Phần này trình bày cách từng nhóm kỹ thuật được tích hợp vào các module cụ thể trong hệ thống TodoList Collaboration, và vấn đề thực tế mà chúng giải quyết.

### 9.2.1. Nhóm kỹ thuật TypeScript cơ bản (Chương 4)

Toàn bộ codebase của dự án được viết bằng TypeScript, tận dụng hệ thống kiểu dữ liệu mạnh mẽ để phát hiện lỗi tại compile-time thay vì runtime. Interface và Type được sử dụng xuyên suốt trong các DTOs, Services và Controllers để đảm bảo type-safety. Hệ thống Decorators của TypeScript là nền tảng cho toàn bộ cách NestJS hoạt động — từ `@Controller()`, `@Injectable()`, `@Module()` đến `@Get()`, `@Post()`, `@Body()`, `@Param()` — cho phép định nghĩa routing và metadata một cách khai báo (declarative) thay vì mệnh lệnh (imperative).

### 9.2.2. Nhóm kỹ thuật Kiến trúc NestJS (Chương 4)

Hệ thống được tổ chức thành 8 feature modules (Auth, User, Workspace, Project, Task, Comment, Notification, Events), mỗi module đóng gói trọn vẹn một domain nghiệp vụ. Dependency Injection là cơ chế kết nối các tầng: mọi Service đều inject `PrismaService` để truy cập database mà không cần tạo instance thủ công, đảm bảo loose coupling và dễ thay thế implementation. PrismaModule được khai báo là `@Global()` — chỉ cần import một lần tại AppModule mà toàn bộ 8 modules đều sử dụng được. Lifecycle Hooks (`onModuleInit`, `onModuleDestroy`) trong PrismaService đảm bảo kết nối database được mở và đóng đúng thời điểm, tránh connection leak.

### 9.2.3. Nhóm kỹ thuật Prisma ORM (Chương 5)

Toàn bộ tương tác với database PostgreSQL được thực hiện thông qua Prisma ORM với 17 models được định nghĩa trong file `schema.prisma`. Các quan hệ phân cấp One-to-Many (User → Task, Workspace → Project → Task) mô hình hóa cấu trúc workspace/project/task. Quan hệ Many-to-Many thông qua bảng trung gian (`TaskLabel`, `TaskAssignment`) cho phép gắn nhiều nhãn và phân công nhiều người cho một task. Prisma Transactions được sử dụng trong các thao tác cần tính nguyên tử — ví dụ khi đổi mật khẩu, việc hash password mới và revoke tất cả token cũ phải xảy ra cùng nhau hoặc không xảy ra gì cả. Tùy chọn `select` trong `UserService.getProfile()` đảm bảo field `password` không bao giờ bị trả về cho client.

### 9.2.4. Nhóm kỹ thuật Pipes và Interceptors (Chương 6)

`ValidationPipe` kết hợp với `class-validator` được đăng ký global, tự động kiểm tra mọi request đầu vào dựa trên DTO decorators — email phải đúng format, password phải đủ dài, UUID phải đúng chuẩn. `ParseUUIDPipe` validate tham số `:id` trong URL, trả về 400 nếu format sai. `TransformResponseInterceptor` chuẩn hóa toàn bộ response thành format thống nhất `{success, data, timestamp}`. `LoggingInterceptor` ghi log mọi request kèm thời gian xử lý để hỗ trợ debug và monitoring. `HttpExceptionFilter` bắt mọi exception và trả về response lỗi chuẩn `{success: false, statusCode, message, path}`.

Ngoài ra, kỹ thuật File Upload với Multer được áp dụng cho tính năng upload avatar trong UserModule. Multer middleware parse `multipart/form-data`, validate loại file (JPEG/PNG/GIF) và kích thước (tối đa 5MB), sau đó Controller nhận file qua `@UploadedFile()` và Service lưu file ra disk, đồng thời tự động xóa avatar cũ khi upload ảnh mới.

### 9.2.5. Nhóm kỹ thuật Authentication và JWT (Chương 7)

Hệ thống xác thực được xây dựng trên nền JWT với chiến lược Dual Token: Access Token (15 phút) dùng cho mọi request authenticated, và Refresh Token (15 ngày) dùng để cấp lại access token mà không cần đăng nhập lại. `JwtStrategy` tích hợp Passport.js để tự động verify token và trích xuất user identity từ Authorization header. `JwtAuthGuard` được đăng ký là `APP_GUARD` — bảo vệ toàn bộ API theo nguyên tắc "secure by default", chỉ những endpoint được đánh dấu `@Public()` mới cho phép truy cập không cần token.

Đặc biệt, cơ chế Token Blacklist giải quyết hạn chế cố hữu của JWT stateless: khi user logout, access token được lưu vào bảng `InvalidatedToken` và `JwtStrategy.validate()` kiểm tra blacklist trước mỗi request, đảm bảo token bị vô hiệu hóa tức thì. Custom decorators `@Public()` và `@CurrentUser()` giúp code controller sạch sẽ, biểu đạt rõ ý định mà không cần truy cập trực tiếp vào object request của Express. Mật khẩu được mã hóa bằng bcrypt với salt rounds = 10, đảm bảo không bao giờ lưu plaintext password trong database.

### 9.2.6. Nhóm kỹ thuật WebSocket và Giao tiếp thời gian thực (Chương 9)

Module Events sử dụng `@WebSocketGateway()` từ `@nestjs/websockets` kết hợp Socket.IO để thiết lập kênh giao tiếp real-time giữa server và client. `EventsGateway` đăng ký các namespace cho từng loại sự kiện (task updated, comment added, notification new), cho phép client nhận cập nhật tức thì mà không cần polling. `EventsService` đóng vai trò trung gian — các module nghiệp vụ (Task, Comment, Notification) inject `EventsService` và gọi các method như `emitToProject()`, `emitToTask()`, `emitToUser()` để phát sự kiện tới đúng phòng (room) tương ứng.

Module Comment cho phép người dùng bình luận trực tiếp trên task và trả lời bình luận (reply). Khi một comment mới được tạo, `CommentService` đồng thời gọi `EventsService.emitToTask()` để thông báo real-time và `NotificationService.create()` để tạo thông báo cho người sở hữu task.

Module Notification quản lý thông báo cho người dùng. Mỗi khi có sự kiện quan trọng (comment mới, task được giao, thay đổi trạng thái), hệ thống tự động tạo notification và đẩy qua WebSocket tới client bằng `EventsService.emitToUser()`.

### 9.2.7. Nhóm kỹ thuật Gửi email giao dịch

`MailService` trong `shared/mail/` sử dụng Brevo API (trước đây là Sendinblue) để gửi email giao dịch. Hệ thống hỗ trợ ba loại email: đặt lại mật khẩu (password reset), xác nhận email (email verification), và chào mừng thành viên mới (welcome). Mỗi email được thiết kế với HTML template responsive, chứa nút call-to-action và thông tin hết hạn. Khi phát triển local, biến `MAIL_DRIVER=mock` chuyển sang chế độ in email ra console thay vì gửi thật, giúp developer test luồng forgot password mà không cần cấu hình SMTP.

### 9.2.8. Bảng tổng hợp tích hợp

Bảng dưới đây tổng hợp tỷ lệ tích hợp theo từng nhóm kỹ thuật, cho thấy toàn bộ kỹ thuật đã học đều được áp dụng vào đồ án.

| Nhóm kỹ thuật | Số kỹ thuật đã học | Số kỹ thuật đã tích hợp | Tỷ lệ |
|--------------|-------------------|------------------------|-------|
| TypeScript cơ bản (Ch4) | 5 | 5 | 100% |
| Kiến trúc NestJS (Ch4) | 6 | 6 | 100% |
| Prisma ORM (Ch5) | 8 | 8 | 100% |
| Pipes & Interceptors (Ch6) | 5 | 5 | 100% |
| Authentication & JWT (Ch7) | 7 | 7 | 100% |
| WebSocket & Real-time (Ch9) | 3 | 3 | 100% |
| Email giao dịch (Brevo) | 2 | 2 | 100% |
| **Tổng cộng** | **36** | **36** | **100%** |

Bên cạnh các kỹ thuật đã tích hợp, một số kỹ thuật nâng cao như RolesGuard (phân quyền chi tiết theo vai trò), GraphQL và Microservices chưa được đưa vào do giới hạn về phạm vi và thời gian. Các kỹ thuật này được xác định là hướng phát triển trong tương lai, sẽ được trình bày ở Chương 11.

---

## 9.3. Giao diện và kết quả vận hành

Để kiểm chứng hệ thống hoạt động đúng như thiết kế, nhóm thực hiện demo các luồng sử dụng chính thông qua Swagger UI — công cụ tài liệu API tương tác được tích hợp sẵn tại `http://localhost:3333/api-docs`.

### 9.3.1. Luồng demo chính (Happy Path)

Luồng sử dụng hoàn chỉnh từ đầu đến cuối diễn ra qua 10 bước:

1. **Đăng ký tài khoản:** Gửi `POST /auth/register` với fullname, email, password — hệ thống trả về `accessToken` và `refreshToken`.

> *[Dán ảnh: Màn hình Swagger UI — request body và response của POST /auth/register]*

2. **Xác thực:** Click nút Authorize trên Swagger UI, nhập `Bearer <accessToken>` — các request tiếp theo tự động đính kèm token.

> *[Dán ảnh: Màn hình Swagger UI — dialog Authorize với token đã nhập]*

3. **Tạo workspace:** Gửi `POST /workspaces` với tên và mô tả — hệ thống tạo workspace mới, người tạo tự động trở thành Owner.

> *[Dán ảnh: Màn hình Swagger UI — request/response của POST /workspaces]*

4. **Mời thành viên:** Gửi `POST /workspaces/:id/invite` — hệ thống tạo invite link có thời hạn.

> *[Dán ảnh: Màn hình Swagger UI — response chứa invite token/link]*

5. **Tạo project:** Gửi `POST /workspaces/:wsId/projects` — tạo project nằm trong workspace.

> *[Dán ảnh: Màn hình Swagger UI — request/response của POST /workspaces/:wsId/projects]*

6. **Tạo task:** Gửi `POST /projects/:id/tasks` với title, priority, dueDate — task được gắn với project và người tạo.

> *[Dán ảnh: Màn hình Swagger UI — request body với title, priority, dueDate và response 201]*

7. **Cập nhật trạng thái:** Gửi `PATCH /tasks/:id/status` với `status: "IN_PROGRESS"` — task chuyển sang đang thực hiện.

> *[Dán ảnh: Màn hình Swagger UI — response cho thấy status đã đổi sang IN_PROGRESS]*

8. **Tạo subtask:** Gửi `POST /tasks/:id/subtasks` — chia nhỏ task thành các công việc con.

9. **Hoàn thành subtask:** Gửi `PATCH /subtasks/:id/complete` — đánh dấu subtask đã xong.

> *[Dán ảnh: Màn hình Swagger UI — response subtask với isCompleted: true]*

10. **Đăng xuất:** Gửi `POST /auth/logout` — token bị vô hiệu hóa ngay lập tức.

> *[Dán ảnh: Màn hình Swagger UI — response "Logout successfully"]*

### 9.3.2. Kiểm chứng Token Blacklist

Sau khi thực hiện bước 10 (logout), thử sử dụng lại token cũ để truy cập `GET /api/v1/users/me`. Hệ thống trả về response 401 Unauthorized:

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Token is invalidated",
  "path": "/api/v1/users/me",
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

Đây là minh chứng trực tiếp cho cơ chế Token Blacklist đã trình bày ở Chương 7 — token bị vô hiệu hóa ngay lập tức sau logout mà không cần chờ hết hạn tự nhiên (15 phút).

> *[Dán ảnh: Màn hình Swagger UI — request GET /users/me với token đã logout, response 401 "Token is invalidated"]*

### 9.3.3. Kiểm chứng Validation

Khi gửi request đăng ký với dữ liệu sai định dạng (email không hợp lệ, password quá ngắn, thiếu field bắt buộc), `ValidationPipe` tự động kiểm tra và trả về danh sách lỗi chi tiết:

```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "fullname should not be empty"
  ],
  "path": "/api/v1/auth/register",
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

Kết quả này minh chứng cho kỹ thuật Pipes đã trình bày ở Chương 6 — `ValidationPipe` kết hợp `class-validator` decorators trong DTO để validate đầu vào tự động, trả về thông báo lỗi rõ ràng giúp client biết chính xác cần sửa gì.

> *[Dán ảnh: Màn hình Swagger UI — request POST /auth/register với dữ liệu sai, response 400 kèm danh sách lỗi]*

### 9.3.4. Chuẩn hóa Response

Mọi response thành công từ hệ thống đều tuân theo format chuẩn nhờ `TransformResponseInterceptor`:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "vana@example.com",
    "name": "Nguyễn Văn A",
    "displayName": "Van A",
    "avatar": null,
    "status": "ACTIVE"
  },
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

Sự nhất quán này giúp frontend luôn biết cách parse response mà không cần xử lý từng endpoint riêng biệt — kiểm tra `success: true/false` là đủ để phân biệt thành công hay thất bại.

> *[Dán ảnh: Màn hình Swagger UI — response thành công với format chuẩn {success, data, timestamp}]*

---

## 9.4. Hướng dẫn cài đặt và sử dụng

### 9.4.1. Yêu cầu hệ thống

Để cài đặt và vận hành dự án, hệ thống cần đáp ứng các yêu cầu phần mềm sau: Node.js phiên bản 18 trở lên (kiểm tra bằng `node --version`), npm phiên bản 9 trở lên (`npm --version`), Docker Desktop phiên bản 4 trở lên (`docker --version`), và Git phiên bản bất kỳ (`git --version`).

### 9.4.2. Các bước cài đặt

**Bước 1 — Clone repository:**

```bash
git clone https://github.com/Ttuandatt/Todolist-CCNLTHD.git
cd Todolist-CCNLTHD
```

**Bước 2 — Cài đặt dependencies cho Backend:**

```bash
cd backend
npm install
```

**Bước 3 — Tạo file biến môi trường:**

```bash
cp .env.example .env
```

Mở file `.env` và điền các giá trị cần thiết:

```env
# Database (PostgreSQL qua Docker)
DATABASE_URL="postgresql://postgres:123@localhost:5433/CCNLTHD_postgres"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="15d"

# App
PORT=3333
FRONTEND_URL="http://localhost:5173"

# Mail (Brevo — gửi email đặt lại mật khẩu, xác nhận, chào mừng)
# MAIL_DRIVER="mock" → in email ra console (dùng khi phát triển local)
# MAIL_DRIVER="brevo" → gửi email thật qua Brevo API (dùng khi triển khai)
MAIL_DRIVER="mock"
BREVO_API_KEY="your-brevo-api-key"
BREVO_SENDER_EMAIL="noreply@yourdomain.com"
BREVO_SENDER_NAME="TodoList Collaboration"
```

**Bước 4 — Khởi động PostgreSQL bằng Docker:**

```bash
docker compose up -d
```

Kiểm tra container đang chạy bằng `docker ps` — cổng `5433` phải được map đến `5432` bên trong container.

> *[Dán ảnh: Terminal — kết quả docker compose up -d và docker ps hiển thị container đang chạy]*

**Bước 5 — Chạy Database Migration:**

```bash
npx prisma migrate deploy
```

Lệnh này áp dụng toàn bộ migration đã có, tạo các bảng cần thiết trong database.

**Bước 6 — Generate Prisma Client:**

```bash
npx prisma generate
```

**Bước 7 — Khởi động Backend:**

```bash
npm run start:dev
```

Khi thành công, terminal sẽ hiển thị thông báo kết nối database thành công và ứng dụng đã khởi động.

> *[Dán ảnh: Terminal — log khởi động NestJS với dòng "Database connected successfully" và "Nest application successfully started"]*

### 9.4.3. Hướng dẫn sử dụng

Sau khi khởi động thành công, hệ thống cung cấp các điểm truy cập sau:

- **API Base URL:** `http://localhost:3333/api/v1` — endpoint gốc cho mọi request API.
- **Swagger UI:** `http://localhost:3333/api-docs` — giao diện tương tác cho phép test tất cả 44 endpoints, xem request/response schema, và thử nghiệm luồng sử dụng hoàn chỉnh.
- **Prisma Studio:** Chạy `npx prisma studio` rồi truy cập `http://localhost:5555` — giao diện đồ họa để xem, thêm, sửa, xóa dữ liệu trực tiếp trong database, hữu ích cho việc debug và kiểm tra dữ liệu.

Để test API qua Swagger UI, trước tiên gọi `POST /auth/register` hoặc `POST /auth/login` để nhận access token. Sau đó click nút "Authorize" ở góc trên bên phải, nhập `Bearer <token>`, và tất cả request tiếp theo sẽ tự động đính kèm token xác thực.

> *[Dán ảnh: Giao diện Swagger UI — tổng quan danh sách endpoints theo module (Auth, User, Workspace, Project, Task)]*

> *[Dán ảnh: Giao diện Prisma Studio — hiển thị danh sách bảng và dữ liệu mẫu trong database]*

---

## 9.5. Tổng kết

Chương này đã trình bày sản phẩm tổng hợp TodoList Collaboration dưới bốn góc nhìn. Về cấu trúc mã nguồn, dự án được tổ chức theo mô hình Infrastructure-separated Architecture với 8 feature modules (Auth, User, Workspace, Project, Task, Comment, Notification, Events) và 3 shared services dùng chung (Prisma, Mail, Common). Về tích hợp kỹ thuật, toàn bộ 36 kỹ thuật đã học đều được áp dụng vào đồ án, đạt tỷ lệ tích hợp 100% trên 7 nhóm kiến thức — bao gồm cả WebSocket real-time và gửi email giao dịch qua Brevo. Về kết quả vận hành, hệ thống chạy được luồng chính end-to-end với đầy đủ endpoints, có minh chứng cụ thể cho Token Blacklist, Validation và chuẩn hóa Response. Về khả năng triển khai, hướng dẫn cài đặt 7 bước cho phép bất kỳ ai có đủ công cụ đều có thể chạy thử hệ thống trên máy local.
