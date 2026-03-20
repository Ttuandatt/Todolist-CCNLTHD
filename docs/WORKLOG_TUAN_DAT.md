# NHẬT KÝ LÀM VIỆC CÁ NHÂN
## Phan Cảnh Tuấn Đạt
### Đề tài: Tìm hiểu công nghệ NestJS — Ứng dụng TodoList Collaboration

---

## Giai đoạn chuẩn bị: 12/01 - 01/02

**Tóm tắt (3 tuần đầu dự án):**
- Họp nhóm lần đầu, thống nhất đề tài, xác định phạm vi dự án
- Tạo repository GitHub (Ttuandatt/Todolist-CCNLTHD)
- Nghiên cứu tổng quan NestJS: kiến trúc Module-Controller-Service, Dependency Injection, Decorators
- Cài đặt môi trường: Node.js, NestJS CLI, Docker Desktop, PostgreSQL
- Khởi tạo project NestJS, cấu hình Prisma ORM, tạo skeleton modules
- Viết tài liệu phân tích yêu cầu: 145 câu hỏi, 40+ User Stories, 60 Use Cases, 72 chức năng (MoSCoW), NFR

---

## Tuần 1: 02/02 - 08/02

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

## Tuần 2: 09/02 - 15/02

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

## Tuần 3: 16/02 - 22/02

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

## Tuần 4: 23/02 - 01/03

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

## Tuần 5: 02/03 - 08/03

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

---

## Tuần 6: 09/03 - 15/03

**Kết quả thực hiện trong tuần:**
- Viết code guide **Phase 2 — User Module** (`docs/code_guide/phase-2-user-module.md`): hướng dẫn từng bước implement 4 endpoints (GET/PATCH `/users/me`, change-password, upload avatar), giải thích kỹ thuật Multer, Prisma select, bcrypt verify
- Viết **`code_guide_rule.md`** — quy tắc chuẩn viết code guide cho cả nhóm: format, cách giải thích, cách viết bước-by-bước
- Lập kế hoạch phân công toàn nhóm — tạo **`TASK_ASSIGNMENT.md`**:
  - Phân chia rõ Phase 3 (Vy), Phase 4+5 (Phú), Phase 6+7 (Huyền)
  - Liệt kê chi tiết endpoints, logic quan trọng, checklist đạt được cho từng người
  - Bổ sung quy trình Git Workflow đầy đủ: cấu trúc nhánh, lệnh từng bước, commit convention
  - Timeline 4 tuần còn lại (Tuần 6–9)
- Cập nhật `WORKLOG_NHOM.md` — thêm nội dung worklog nhóm đang thiếu
- Chuẩn bị setup git workflow bài bản: tạo nhánh `develop`, nhánh `feature/*`

**Công việc tuần tới:**
- Hoàn thành Phase 2 — User Module: code + test 4 endpoints
- Setup git workflow: tạo `develop`, tạo `feature/dat-user-module`, tạo PR sau khi xong
- Review PR của Vy (WorkspaceModule) sau khi Vy hoàn thành
- Viết code guide Phase 5 (RBAC + Comments) để Phú follow

---

## Tuần 7: 16/03 - 22/03

**Kết quả thực hiện trong tuần:**
- Hoàn thành code **Phase 2 — User Module** trên nhánh `feature/dat-user-module`:
  - Tạo `UserController` (4 endpoints: `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/change-password`, `POST /users/me/avatar`)
  - Viết `UserService` hoàn chỉnh: `profileSelect` (11 fields, loại bỏ password), `getProfile`, `updateProfile`, `changePassword` (transaction: hash + revoke tokens), `uploadAvatar` (xóa file cũ + cập nhật DB)
  - Cấu hình Multer (`multer.config.ts`): `diskStorage`, `fileFilter` (chỉ JPEG/PNG/GIF), giới hạn 5MB, tên file random `avatar-{timestamp}-{random}.{ext}`
  - Cập nhật `UserModule` (import MulterModule), `AppModule`, `main.ts` (static assets `/uploads/`)
  - Tạo Prisma migration `add_display_name_bio_to_user`: thêm 2 fields `displayName`, `bio` vào bảng `users`
  - Tạo 2 DTOs: `UpdateProfileDto` (@IsOptional, @MaxLength 50/160), `ChangePasswordDto` (3 fields + @Matches regex password)
- Viết tài liệu test:
  - `02-user-module-test-cases.md`: 78 test cases (19 unit UserService, 5 unit UserController, 27 integration, 11 boundary, 16 security)
  - `TEST_DATA_STRATEGY.md`: quy chuẩn factory functions, fixtures, cleanup, mock data, helper functions
- Tạo **`report_writing_rule.md`** — quy tắc viết báo cáo học thuật: 10 mục (nguyên tắc chung, cấu trúc chương, đoạn văn, trình bày code, bảng/hình, trích dẫn, typography, template, lỗi thường gặp, checklist)
- Viết **Chương 8: Phân tích và thiết kế hệ thống** (`08-system-analysis-design-chapter.md`):
  - 8.1 Tổng quan dự án + Biểu đồ Use Case (Mermaid: 2 actors, 10 use cases)
  - 8.2 Kiến trúc hệ thống (sơ đồ module, sơ đồ phụ thuộc — Mermaid)
  - 8.3 Thiết kế CSDL + **ERD Mermaid** (tổng quan 17 bảng + chi tiết 4 bảng Auth/User với fields)
  - 8.4 Thiết kế API (quy ước RESTful, 10 endpoints, response chuẩn hóa, validation)
  - 8.5 **7 Sequence Diagrams Mermaid** (Register, Login, Refresh Token Rotation, Logout Blacklist, Get Profile qua Guard, Change Password Transaction, Upload Avatar Multer)
  - 8.6 Thiết kế bảo mật (Dual Token, Blacklist, Rotation, Global Guard, bcrypt, OWASP)
  - 8.7 Thiết kế File Upload + 8.8 Cấu hình Global
- Viết **Chương 9: Triển khai chi tiết các module** (`09-module-implementation-chapter.md`):
  - 9.1 Module Authentication (8 mục: cấu trúc, DTOs, Service 6 methods, Controller 6 endpoints, Guard, Strategy, Custom Decorators, Module config)
  - 9.2 Module User (6 mục: cấu trúc, DTOs, Service 5 methods, Multer config, Controller 4 endpoints, Module config)
  - 9.3 Luồng hoạt động tổng thể (request lifecycle end-to-end)
  - Thiết kế extensible: module mới thêm vào 9.3, 9.4, ...
- Viết **Workspace Suite Design Spec** (`docs/superpowers/specs/2026-03-19-workspace-suite-design.md`): spec kỹ thuật đầy đủ cho Phase 3 — 3 module (Workspace, WorkspaceMember, WorkspaceInvite), phân quyền Owner/Admin/Member, 16+ endpoints, activity logging, giới hạn config-driven
- Viết **Phase 3 Code Guide** (`docs/code_guide/phase-3-workspace-module.md`, ~1442 dòng): hướng dẫn 7 bước implement Workspace Suite với giải thích "Tại sao" từng kỹ thuật (registerAs config, permission layer, WorkspaceContextInterceptor, custom decorators, DTOs, tests)
- Cập nhật **Prisma Schema** cho Phase 3: chạy migration `workspace-suite-sync` — thêm enum `InvitationStatus` (PENDING/ACCEPTED/EXPIRED/REVOKED), enum `ActivityLogAction` (8 hành động), refactor model `WorkspaceInvite` với đầy đủ fields (status, token, revokedAt, acceptedAt, expiresAt)
- Tạo **3 implementation plans** cho Phase 3:
  - `2026-03-19-workspace-impl-update.md`: plan cập nhật schema + annotations code guide
  - `2026-03-19-workspace-doc-refresh.md`: plan đồng bộ tài liệu PRD (8 files, 6 tasks)
  - `2026-03-19-branch-structure-fix.md`: plan fix cấu trúc nhánh `main → develop → feature/*`
- Bắt đầu **Phase 3 skeleton code** (Bước 1 + shared layer):
  - `backend/src/common/config/workspace-limits.config.ts`: config giới hạn đọc từ `.env` dùng `registerAs` (maxWorkspacesPerUser, maxMembersPerWorkspace, inviteExpiryDays)
  - `backend/src/types/express.d.ts`: TypeScript declaration augmentation — dạy TypeScript biết `request.workspaceContext` tồn tại
  - `backend/src/workspace/types/workspace-context.type.ts`: type `WorkspaceContextPayload` (workspace + membership + permissions object)
  - `backend/src/workspace/decorators/workspace.decorator.ts`: 2 custom decorators — `@WorkspaceContext` (lấy toàn bộ context) và `@WorkspaceId` (lấy workspace ID đã validate)

**Công việc tuần tới:**
- Hoàn thành Phase 3 skeleton code (Bước 3-7): WorkspacePermissionService, WorkspaceContextInterceptor, WorkspaceModule, WorkspaceMemberModule, WorkspaceInviteModule
- Fix BUG-U-001: Multer fileFilter upload .txt trả HTTP 500 thay vì 400
- Test Phase 2 hoàn chỉnh trên Hoppscotch (10 endpoints Auth + User)
- Review PR của Vy (Workspace Module) khi sẵn sàng
- Hoàn thiện nội dung Chương 2, Chương 10-11 cho báo cáo
