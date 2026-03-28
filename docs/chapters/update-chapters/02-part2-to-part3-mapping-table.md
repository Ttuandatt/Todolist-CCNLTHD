# BẢNG TỔNG KẾT: MỐI LIÊN HỆ PHẦN 2 → PHẦN 3

> **Hướng dẫn dán vào báo cáo:** Thêm section này vào **đầu Chương 10** hoặc **cuối Chương 8**, đặt tiêu đề "Mối liên hệ giữa Kỹ thuật (Phần 2) và Đồ án (Phần 3)".

---

## Tổng quan

Một trong những yêu cầu cốt lõi của đồ án là tái sử dụng các kỹ thuật đã học ở Phần 2 vào sản phẩm thực tế ở Phần 3. Bảng dưới đây thống kê toàn bộ các kỹ thuật đã được tích hợp, module nào sử dụng, và vấn đề cụ thể mà kỹ thuật đó giải quyết trong đồ án TodoList Collaboration.

---

## Bảng mapping chi tiết

| Kỹ thuật | Chương học | Áp dụng vào module/file | Vấn đề giải quyết trong đồ án |
|----------|-----------|------------------------|-------------------------------|
| **TypeScript — Interface & Type** | Ch4 | Tất cả DTOs, Services, Controllers | Đảm bảo type-safety cho toàn bộ codebase, phát hiện lỗi tại compile-time |
| **TypeScript — Decorators** | Ch4 | `@Controller`, `@Injectable`, `@Module`, `@Get`, `@Post`, `@Body`, `@Param`... | Định nghĩa routing và DI metadata một cách khai báo (declarative) |
| **Modules & @Module decorator** | Ch4 | `AuthModule`, `UserModule`, `WorkspaceModule`, `ProjectModule`, `TaskModule` | Tổ chức code theo domain, tránh spaghetti code |
| **Shared Module (@Global)** | Ch4 | `PrismaModule` — `shared/prisma/` | PrismaService dùng ở mọi module, chỉ cần khai báo một lần ở AppModule |
| **Dependency Injection** | Ch4 | Tất cả Services inject PrismaService, MailService | Loose coupling giữa các tầng, dễ thay thế implementation |
| **Controllers & HTTP Decorators** | Ch4 | 5 controllers, 44 endpoints | Xử lý HTTP request, định nghĩa REST API |
| **Providers & Services** | Ch4 | `AuthService`, `UserService`, `WorkspaceService`, `ProjectService`, `TaskService` | Tách business logic khỏi controller |
| **Lifecycle Hooks** | Ch4 | `PrismaService.onModuleInit()` / `onModuleDestroy()` | Mở/đóng kết nối database đúng thời điểm, tránh connection leak |
| **Prisma — Schema & Models** | Ch5 | `prisma/schema.prisma` — 17 models | Định nghĩa toàn bộ cấu trúc database (User, Workspace, Project, Task...) |
| **Prisma — Relations (1-N)** | Ch5 | `User → Task`, `Workspace → Project → Task` | Mô hình hóa quan hệ phân cấp workspace/project/task |
| **Prisma — Relations (N-N)** | Ch5 | `Task ↔ Label` (qua `TaskLabel`), `Task ↔ User` (qua `TaskAssignment`) | Quản lý nhiều nhãn, nhiều người được giao cho một task |
| **Prisma — CRUD Operations** | Ch5 | Tất cả Services (44 endpoints) | Tạo/đọc/sửa/xóa dữ liệu cho mọi tính năng |
| **Prisma — select (field filtering)** | Ch5 | `UserService.getProfile()` | Không trả password về client, chỉ trả các field cần thiết |
| **Prisma — Transactions** | Ch5 | `AuthService.resetPassword()`, `UserService.changePassword()` | Đảm bảo tính nguyên tử: đổi password và revoke token phải xảy ra cùng nhau |
| **Prisma — Migrations** | Ch5 | `prisma/migrations/` — 4 migrations | Quản lý lịch sử thay đổi schema, deploy database an toàn |
| **ValidationPipe + class-validator** | Ch6 | Tất cả DTOs (25+ DTO classes) | Validate đầu vào trước khi xử lý: email format, password length, UUID format... |
| **ParseUUIDPipe** | Ch6 | Tất cả endpoints có `:id` param | Tự động validate UUID format, trả 400 nếu sai format |
| **Transform Response Interceptor** | Ch6 | Global trong `main.ts` | Chuẩn hóa response format `{success, data, timestamp}` cho toàn bộ API |
| **Logging Interceptor** | Ch6 | Global trong `main.ts` | Ghi log mọi request/response để debug và monitor |
| **HttpException Filter** | Ch6 | Global trong `main.ts` | Chuẩn hóa response lỗi `{success: false, statusCode, message, path}` |
| **File Upload — Multer** | Ch6* | `UserModule` — `POST /users/me/avatar` | Upload và lưu ảnh đại diện người dùng (JPEG/PNG/GIF, tối đa 5MB) |
| **JWT — Access Token** | Ch7 | `AuthService.generateTokens()` | Xác thực user cho mọi protected endpoint (hết hạn sau 15 phút) |
| **JWT — Refresh Token** | Ch7 | `AuthService.refreshToken()` | Tự động cấp lại access token mà không cần đăng nhập lại |
| **JWT Strategy (Passport)** | Ch7 | `JwtStrategy` — `modules/auth/strategies/` | Giải mã và xác minh token từ Authorization header |
| **JwtAuthGuard** | Ch7 | Global qua `APP_GUARD` trong `AppModule` | Bảo vệ toàn bộ API, tự động chặn request không có token |
| **@Public() Decorator** | Ch7 | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`... | Cho phép một số endpoint không cần xác thực |
| **@CurrentUser() Decorator** | Ch7 | Tất cả controllers cần userId | Lấy thông tin user từ JWT payload — không cần query DB thêm |
| **bcrypt** | Ch7 | `AuthService.register()`, `UserService.changePassword()` | Mã hóa mật khẩu an toàn với salt rounds=10 |
| **Token Blacklist** | Ch7* | `AuthService.logout()`, `JwtStrategy.validate()` | Vô hiệu hóa token ngay lập tức khi logout — không cần chờ hết hạn |

*Kỹ thuật được bổ sung vào báo cáo so với kế hoạch ban đầu

---

## Thống kê tích hợp

| Nhóm kỹ thuật | Số kỹ thuật đã học | Số kỹ thuật đã tích hợp | Tỷ lệ |
|--------------|-------------------|------------------------|-------|
| TypeScript cơ bản | 5 | 5 | 100% |
| Kiến trúc NestJS (Module/DI) | 6 | 6 | 100% |
| Prisma ORM | 8 | 8 | 100% |
| Pipes & Interceptors | 5 | 5 | 100% |
| Authentication & JWT | 7 | 7 | 100% |
| **Tổng cộng** | **31** | **31** | **100%** |

---

## Kỹ thuật chưa tích hợp được và lý do

| Kỹ thuật | Lý do chưa tích hợp |
|----------|---------------------|
| WebSocket / Gateway | Phạm vi đồ án tập trung vào REST API. Notification realtime là hướng phát triển tiếp theo |
| RolesGuard (ADMIN/MEMBER) | Kiểm soát quyền cơ bản đã có qua owner check trong service. Role-based authorization là enhancement tiếp theo |
| GraphQL | REST API đủ đáp ứng yêu cầu đồ án. GraphQL sẽ có lợi hơn khi frontend có nhu cầu query linh hoạt |
| Microservices | Đồ án quy mô nhỏ, monolith phù hợp hơn. Microservices là hướng mở rộng khi hệ thống scale |
