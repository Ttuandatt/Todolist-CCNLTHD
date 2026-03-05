# NHẬT KÝ LÀM VIỆC CÁ NHÂN
## Phan Cảnh Tuấn Đạt
### Đề tài: Tìm hiểu công nghệ NestJS — Ứng dụng TodoList Collaboration

---

## Tuần 1: 12/01 - 18/01

**Kết quả thực hiện trong tuần:**
- Họp nhóm lần đầu, thống nhất chọn đề tài "Tìm hiểu công nghệ NestJS"
- Xác định phạm vi dự án: NestJS backend + PostgreSQL + Prisma ORM
- Tạo repository GitHub cho dự án (Ttuandatt/Todolist-CCNLTHD)
- Nghiên cứu tổng quan NestJS: đọc tài liệu chính thức, xem kiến trúc Module-Controller-Service

**Công việc tuần tới:**
- Cài đặt môi trường phát triển
- Tìm hiểu sâu hơn về kiến trúc NestJS

---

## Tuần 2: 19/01 - 25/01

**Kết quả thực hiện trong tuần:**
- Cài đặt môi trường: Node.js, NestJS CLI, Docker Desktop, PostgreSQL
- Khởi tạo project NestJS bằng `nest new backend`
- Cấu hình Prisma ORM: cài đặt, tạo `schema.prisma`, kết nối PostgreSQL
- Tạo skeleton cho Auth Module, User Module, Prisma Module
- Nghiên cứu Dependency Injection, Decorators, TypeScript fundamentals

**Công việc tuần tới:**
- Bắt đầu viết tài liệu phân tích yêu cầu
- Thiết kế cơ sở dữ liệu

---

## Tuần 3: 26/01 - 01/02

**Kết quả thực hiện trong tuần:**
- Viết tài liệu thu thập yêu cầu (Requirements Gathering): 145 câu hỏi phỏng vấn
- Viết User Stories: 40+ stories với acceptance criteria đầy đủ
- Viết đặc tả Use Cases: 60 use cases với luồng chính và luồng thay thế
- Liệt kê chức năng (Features List): 72 chức năng, phân loại MoSCoW (48 Must, 20 Should, 4 Could)
- Viết yêu cầu phi chức năng (NFR): performance, security, scalability

**Công việc tuần tới:**
- Thiết kế ERD và Data Dictionary
- Vẽ các sơ đồ phân tích

---

## Tuần 4: 02/02 - 08/02

**Kết quả thực hiện trong tuần:**
- Thiết kế ERD: 13 entities (User, Workspace, Project, Task, Subtask, Comment, Label, Notification, ActivityLog...) với đầy đủ thuộc tính và quan hệ
- Viết Data Dictionary: mô tả chi tiết từng field, kiểu dữ liệu, ràng buộc cho 13 bảng
- Vẽ Class Diagram: mapping từ ERD sang NestJS modules (Controller → Service → Entity)
- Vẽ Sequence Diagram: các luồng chính (Register, Login, Create Task, Assign Task...)
- Vẽ Activity Diagram: workflow của Task lifecycle, Authentication flow
- Tạo Prisma schema hoàn chỉnh: 13 models, 5 enums, indexes, relations, cascade delete
- Viết API Specification: 53 endpoints REST API cho 10 modules

**Công việc tuần tới:**
- Hoàn thiện các sơ đồ còn lại (DFD, BFD)
- Bắt đầu viết nội dung báo cáo

---

## Tuần 5: 09/02 - 15/02

**Kết quả thực hiện trong tuần:**
- Vẽ DFD (Data Flow Diagram): luồng dữ liệu giữa User ↔ System ↔ Database
- Vẽ BFD (Business Flow Diagram): quy trình nghiệp vụ quản lý công việc nhóm
- Viết Architecture Document: system design (monolith), technology stack, folder structure
- Tạo WBS (Work Breakdown Structure): phân rã công việc theo phases
- Tạo Gantt Chart CSV cho timeline dự án
- Bắt đầu viết nội dung báo cáo:
  - Chương 1: Giới thiệu chung — Lịch sử Node.js, sự ra đời của NestJS, đặc điểm nổi bật, hệ sinh thái
  - Chương 5: Làm việc với Database — ORM so sánh (TypeORM vs Prisma), Schema design, Migrations, CRUD

**Công việc tuần tới:**
- Viết tiếp các chương về kiến trúc, kỹ thuật nâng cao, authentication
- Review nội dung theo tài liệu chính thức NestJS

---

## Tuần 6: 16/02 - 22/02

**Kết quả thực hiện trong tuần:**
- Viết Chương 3 (Cài đặt môi trường): Node.js, Nest CLI, Docker PostgreSQL, cấu trúc thư mục project
- Viết Chương 4 (Kiến trúc NestJS): TypeScript foundations, Controllers, Providers (DI), Modules
  - Bổ sung đoạn giải thích chi tiết: DI tight/loose coupling, mock testing với jest.fn(), PrismaService lifecycle hooks
- Viết Chương 6 (Kỹ thuật nâng cao): Request Lifecycle, Pipes (ValidationPipe, ParseUUIDPipe), Interceptors (TransformResponse, Logging), Middleware, Exception Filters, Swagger, Custom Decorators
  - Thay thế inline comments trong code blocks bằng đoạn văn giải thích theo phong cách diễn giải
- Viết Chương 7 (Authentication & Authorization): JWT, bcrypt, AuthService (register/login), JwtStrategy, Guards, @CurrentUser decorator
- Fact-check toàn bộ nội dung kỹ thuật theo tài liệu chính thức NestJS (middleware, guards, interceptors)

**Công việc tuần tới:**
- Tối ưu thứ tự chương cho logic sư phạm tốt hơn
- Review tổng thể báo cáo

---

## Tuần 7: 23/02 - 01/03

**Kết quả thực hiện trong tuần:**
- Tối ưu thứ tự chương: đổi Kỹ thuật nâng cao (Ch6) trước Authentication (Ch7) — giải thích Guards/Decorators lý thuyết trước khi áp dụng thực tế
- Cập nhật số chương, section numbers, cross-references giữa Ch6 ↔ Ch7
- Refactor cấu trúc folder `docs/`:
  - Tạo `chapters/` chứa 6 file nội dung chương
  - Tạo `PRD/` chứa 15 file phân tích thiết kế
- Review toàn bộ báo cáo trên Google Docs (69 trang): đánh giá hoàn thiện từng chương, xác định các phần còn thiếu (Ch2, Ch8-11)
- Review PRD readiness: đối chiếu 15 tài liệu PRD với yêu cầu code
  - Phát hiện thiếu 3 bảng hỗ trợ auth flow: Invitation, RefreshToken, PasswordReset
- Bổ sung 3 entities mới vào Prisma schema (13 → 16 entities), validate thành công
- Fix lỗi Prisma 7 compatibility (xóa `url = env()` trong datasource block)
- Lên kế hoạch implementation backend: 7 phases, 10 modules, 53 endpoints, ~56 files
- Hoàn thành Phase 0 — Shared Infrastructure:
  - Tạo `TransformResponseInterceptor`: tự động bọc mọi response theo format chuẩn `{ success, data, timestamp }`
  - Tạo `HttpExceptionFilter`: chuẩn hóa error response với statusCode, message, path
  - Tạo `LoggingInterceptor`: log performance mỗi request `[HTTP] POST /path - Xms`
  - Cấu hình `main.ts`: global prefix `/api/v1`, ValidationPipe, Swagger UI tại `/api-docs`
  - Test thành công: Swagger UI hoạt động, response format đúng chuẩn

**Công việc tuần tới:**
- Code Phase 1 (Auth Module hoàn chỉnh: JWT, bcrypt, refresh token)
- Hoàn thiện nội dung Chương 2, 8, 9, 10-11 cho báo cáo

---

## Tuần 8: 02/03 - 08/03

**Kết quả thực hiện trong tuần:**
- Thiết kế cơ chế **Token Blacklist (InvalidatedToken)**: khi user logout hoặc bị ban, access token bị vô hiệu hóa tức thì qua bảng DB
- Cập nhật tất cả tài liệu PRD cho Token Blacklist:
  - `07-DATA_DICTIONARY.md`: thêm 4 entities mới (Invitation, RefreshToken, PasswordReset, InvalidatedToken), tổng 14 → 18
  - `14-API_SPECIFICATION.md`: bổ sung hành vi logout (revoke refresh + blacklist access token)
  - `prisma/schema.prisma`: thêm model `InvalidatedToken` (entity 17)
  - `phase-1-auth-module.md`: cập nhật JwtStrategy (blacklist check), AuthService.logout (blacklist), AuthController (Headers decorator), thêm Test 4 verify blacklist
- Chạy `npx prisma generate` cập nhật Prisma Client cho model mới
- Code Phase 1 Auth Module — hoàn thành Bước 1 đến Bước 6:
  - Bước 1: Thêm JWT secrets vào `.env`
  - Bước 2: Tạo 5 DTO files (`register`, `login`, `refresh-token`, `forgot-password`, `reset-password`)
  - Bước 3: Tạo `JwtStrategy` với Token Blacklist check (passReqToCallback + check InvalidatedToken)
  - Bước 4: Tạo `JwtAuthGuard` (kiểm tra @Public() metadata qua Reflector)
  - Bước 5: Tạo decorators `@Public()` và `@CurrentUser()`
  - Bước 6: Viết `AuthService` hoàn chỉnh (register, login, refreshToken, logout + blacklist, forgotPassword, resetPassword, generateTokens)
- Bổ sung kiến thức nền tảng vào tài liệu:
  - Chapter 6 (`06-advanced-chapter.md`): thêm section "Kiến thức nền tảng TypeScript" (const/let, async/await, Prisma query syntax)
  - Code guide Phase 1: thêm Q&A Q1-Q8 (JWT secrets, DTO, Passport, Guard, Decorators, async, const, Prisma)
- Code Phase 1 Auth Module — hoàn thành Bước 7 đến Bước 9:
  - Bước 7: Viết `AuthController` (6 endpoints: register, login, refresh, logout, forgot-password, reset-password)
  - Bước 8a: Cập nhật `AuthModule` (imports PassportModule + JwtModule, providers + exports)
  - Bước 8b: Cập nhật `AppModule` (APP_GUARD global JwtAuthGuard)
  - Bước 9: Chạy `npx prisma migrate dev --name init` — tạo 17 tables thành công
- Fix lỗi `JwtStrategy requires a secret or key`: cài `@nestjs/config`, thêm `ConfigModule.forRoot({ isGlobal: true })` vào AppModule
- Fix lỗi TypeScript `expiresIn` type mismatch: thêm `as any` cast cho `@nestjs/jwt` v11+
- Sync guide (`phase-1-auth-module.md`) với code thực tế: 9 điểm lệch (RegisterDto fullname, messages tiếng Anh, regex đặc biệt, ConfigModule, token expiry 15m...)
- Tạo Hoppscotch API collection (`backend/docs/hoppscotch-collection.json`): OpenAPI 3.0 spec, phân nhóm Auth/User/Workspace/Task
- Server khởi động thành công: 6 routes mapped, database connected

**Công việc tuần tới:**
- Hoàn thành Phase 1: Bước 10 (Test toàn bộ trên Hoppscotch/Swagger)
- Code Phase 2: User Module (get profile, update profile, change password, upload avatar)
- Hoàn thiện nội dung Chương 2, 8, 9, 10-11 cho báo cáo
