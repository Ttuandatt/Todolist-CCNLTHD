<p align="center"><b>[TÊN TRƯỜNG]</b></p>
<p align="center"><b>[TÊN KHOA]</b></p>
<p align="center">───────────────────</p>

<br/>

<p align="center"><b>BÁO CÁO CÁ NHÂN</b></p>
<p align="center"><b>ĐỒ ÁN CUỐI KỲ — CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI</b></p>

<br/>

| Thông tin | Nội dung |
|-----------|----------|
| **Họ và tên** | Phan Cảnh Tuấn Đạt |
| **MSSV** | 3122410076 |
| **Email** | pcanhtuandat@gmail.com |
| **SĐT** | 0867829257 |
| **Vai trò** | Nhóm trưởng / Technical Lead |
| **Tên đề tài** | Tìm hiểu công nghệ NestJS |
| **GVHD** | Phạm Thi Vương |

---

## 1. GIỚI THIỆU ĐỀ TÀI VÀ NHÓM

### 1.1. Tổng quan đề tài

Đồ án nghiên cứu và trình bày công nghệ **NestJS** — framework Node.js xây dựng trên TypeScript, sử dụng kiến trúc module hóa với Dependency Injection, lấy cảm hứng từ Angular. Nhóm xây dựng ứng dụng **TodoList Collaboration** (quản lý công việc nhóm) để minh họa các kỹ thuật đặc trưng của NestJS trong thực tế.

Ứng dụng gồm 10 modules, 53 API endpoints, 17 bảng database, sử dụng công nghệ: NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT, Socket.IO, React.

### 1.2. Thành viên nhóm

| STT | Họ tên | MSSV | Vai trò |
|:---:|--------|------|---------|
| 1 | Phan Cảnh Tuấn Đạt | 3122410076 | Nhóm trưởng / Technical Lead |
| 2 | Nguyễn Hoàng Mai Vy | 3122410490 | Thành viên — Phase 3 |
| 3 | Huỳnh Văn Phú | 3122560057 | Thành viên — Phase 4+5 |
| 4 | Trần Khánh Huyền | 3122410156 | Thành viên — Phase 6+7 |

### 1.3. Vai trò cá nhân

Trong đồ án, tôi đảm nhận vai trò **Nhóm trưởng** kiêm **Technical Lead**, chịu trách nhiệm:
- Thiết kế kiến trúc hệ thống và cơ sở dữ liệu
- Xây dựng nền tảng codebase (infrastructure, authentication, user management)
- Viết code guide hướng dẫn từng bước cho các thành viên khác
- Review code và quản lý Git workflow
- Viết phần lớn nội dung báo cáo và review toàn bộ

---

## 2. CÔNG VIỆC ĐÃ THỰC HIỆN

### 2.1. Giai đoạn chuẩn bị (12/01 – 01/02): Khởi tạo dự án

- Họp nhóm lần đầu, thống nhất đề tài "Tìm hiểu công nghệ NestJS", xác định phạm vi dự án
- Tạo repository GitHub (Ttuandatt/Todolist-CCNLTHD)
- Nghiên cứu tổng quan NestJS: kiến trúc Module-Controller-Service, Dependency Injection, Decorators
- Cài đặt môi trường phát triển: Node.js, NestJS CLI, Docker Desktop, PostgreSQL
- Khởi tạo project NestJS, cấu hình Prisma ORM, tạo skeleton modules
- Chủ trì viết tài liệu phân tích yêu cầu: 145 câu hỏi phỏng vấn, 40+ User Stories, 60 Use Cases, 72 chức năng (MoSCoW), NFR

### 2.2. Tuần 1 (02/02 – 08/02): Thiết kế hệ thống

- Thiết kế **ERD**: 13 entities (User, Workspace, Project, Task, Subtask, Comment, Label, Notification, ActivityLog...) với đầy đủ thuộc tính và quan hệ
- Viết **Data Dictionary**: mô tả chi tiết từng field, kiểu dữ liệu, ràng buộc cho 13 bảng
- Tạo **Prisma schema** hoàn chỉnh: 13 models, 5 enums, indexes, relations, cascade delete
- Viết **API Specification**: 53 endpoints REST API cho 10 modules
- Hỗ trợ Vy vẽ Class Diagram, Phú vẽ Sequence Diagram, Huyền vẽ Activity Diagram

### 2.3. Tuần 2 (09/02 – 15/02): Phân tích & bắt đầu viết báo cáo

- Vẽ **DFD** (Data Flow Diagram): luồng dữ liệu giữa User ↔ System ↔ Database
- Vẽ **BFD** (Business Flow Diagram): quy trình nghiệp vụ quản lý công việc nhóm
- Viết **Architecture Document**: system design (monolith), technology stack, folder structure
- Tạo **WBS** (Work Breakdown Structure): phân rã công việc theo phases
- Tạo **Gantt Chart** CSV cho timeline dự án
- Viết nội dung báo cáo:
  - **Chương 1**: Giới thiệu chung — Lịch sử Node.js, sự ra đời NestJS, đặc điểm nổi bật
  - **Chương 5**: Làm việc với Database — So sánh TypeORM vs Prisma, Schema design, Migrations, CRUD

### 2.4. Tuần 3 (16/02 – 22/02): Viết báo cáo chuyên sâu

- Viết **Chương 4** (phần Providers/DI, Modules): giải thích chi tiết Dependency Injection, so sánh tight/loose coupling, mock testing với jest.fn(), PrismaService lifecycle hooks
- Review và **fact-check** toàn bộ nội dung kỹ thuật theo tài liệu chính thức NestJS
- Review Chương 6 (Huyền viết) và Chương 7 (Phú viết)
- Thống nhất phong cách viết: diễn giải thay vì inline comments trong code blocks

### 2.5. Tuần 4 (23/02 – 01/03): Tối ưu báo cáo & bắt đầu code

- **Tối ưu thứ tự chương**: đổi Kỹ thuật nâng cao (Ch6) trước Authentication (Ch7) — giải thích Guards/Decorators lý thuyết trước khi áp dụng thực tế
- Cập nhật số chương, section numbers, cross-references giữa Ch6 ↔ Ch7
- Refactor cấu trúc folder `docs/`: tạo `chapters/`, `PRD/`
- Review tổng thể báo cáo trên Google Docs (69 trang)
- Phát hiện thiếu 3 bảng hỗ trợ auth flow → **bổ sung 3 entities** mới vào Prisma schema (13 → 16 entities): Invitation, RefreshToken, PasswordReset
- Fix lỗi Prisma 7 compatibility
- **Hoàn thành Phase 0 — Shared Infrastructure:**
  - `TransformResponseInterceptor`: tự động bọc response theo format chuẩn `{ success, data, timestamp }`
  - `HttpExceptionFilter`: chuẩn hóa error response
  - `LoggingInterceptor`: log performance mỗi request
  - Cấu hình `main.ts`: global prefix `/api/v1`, ValidationPipe, Swagger UI

### 2.6. Tuần 5 (02/03 – 08/03): Hoàn thành Auth Module

- Thiết kế cơ chế **Token Blacklist (InvalidatedToken)**: vô hiệu hóa access token khi logout/ban
- Cập nhật tất cả tài liệu PRD cho Token Blacklist (Data Dictionary, API Spec, Prisma schema, code guide)
- **Code Phase 1 — Auth Module** hoàn chỉnh (Bước 1–9):
  - 5 DTO files (register, login, refresh-token, forgot-password, reset-password)
  - `JwtStrategy` với Token Blacklist check
  - `JwtAuthGuard` kiểm tra @Public() metadata
  - Decorators `@Public()` và `@CurrentUser()`
  - `AuthService`: register, login, refreshToken, logout + blacklist, forgotPassword, resetPassword, generateTokens
  - `AuthController`: 6 endpoints
  - `AuthModule` + cập nhật `AppModule` (APP_GUARD global)
  - Chạy migration: tạo 17 tables thành công
- Fix lỗi `JwtStrategy requires a secret or key`: cài `@nestjs/config`, cấu hình ConfigModule
- Fix lỗi TypeScript `expiresIn` type mismatch
- Tạo **Hoppscotch API collection**: OpenAPI 3.0 spec cho testing

### 2.7. Tuần 6 (09/03 – 15/03): Code guide & phân công nhóm

- Viết **code guide Phase 2 — User Module**: hướng dẫn từng bước implement 4 endpoints
- Viết **`code_guide_rule.md`**: quy tắc chuẩn viết code guide cho cả nhóm
- Tạo **`TASK_ASSIGNMENT.md`**: phân công chi tiết Phase 3–10 cho từng thành viên, bao gồm:
  - Scope endpoints, logic quan trọng, checklist đạt được cho từng người
  - Quy trình Git Workflow đầy đủ: cấu trúc nhánh, commit convention
  - Timeline 4 tuần còn lại

### 2.8. Tuần 7 (16/03 – 22/03): Phase 2 + Tài liệu chuyên sâu

**Code Phase 2 — User Module** (4 endpoints):
- `UserController`: GET/PATCH `/users/me`, change-password, upload avatar
- `UserService`: profileSelect, getProfile, updateProfile, changePassword (transaction), uploadAvatar
- Cấu hình **Multer**: diskStorage, fileFilter (JPEG/PNG/GIF), giới hạn 5MB
- Prisma migration `add_display_name_bio_to_user`
- 2 DTOs: UpdateProfileDto, ChangePasswordDto

**Viết tài liệu:**
- **78 test cases** cho User Module (19 unit + 5 controller + 27 integration + 11 boundary + 16 security)
- `TEST_DATA_STRATEGY.md`: quy chuẩn factory functions, fixtures, cleanup
- **`report_writing_rule.md`**: 10 mục quy tắc viết báo cáo học thuật
- **Chương 8**: Phân tích và thiết kế hệ thống — Use Case, ERD Mermaid (17 bảng), 7 Sequence Diagrams, thiết kế bảo mật
- **Chương 9**: Triển khai chi tiết Auth Module (8 mục) + User Module (6 mục) + luồng hoạt động tổng thể

**Hỗ trợ Phase 3:**
- Viết **Workspace Suite Design Spec**: spec kỹ thuật cho 3 module, 16+ endpoints
- Viết **Phase 3 Code Guide** (~1.442 dòng): 7 bước implement với giải thích "Tại sao"
- Chạy migration `workspace-suite-sync`
- Tạo Phase 3 skeleton code: config, types, decorators (4 files)
- Tạo 3 implementation plans cho Phase 3

### 2.9. Tuần 8-9 (23/03 – 05/04): Email Service + Hỗ trợ modules

**Tuần 8 — Auth hoàn thiện:**
- Thiết kế **Email Service**: setup SendGrid hoặc mock cho dev
- Implement **Forgot-Password flow**: DTOs, endpoint, token generation, email send
- Implement **Reset-Password flow**: endpoint, validate token TTL, password update
- Implement **Email Verification** (optional): OTP resend flow
- Test email flows trên Hoppscotch: forgot → reset, resend, expired token
- Chuẩn hóa Response Format: đảm bảo tất cả Auth, User endpoints follow TransformInterceptor

**Tuần 9 — Review & Merge + Hỗ trợ:**
- **Review & Merge PRs** (do Đạt as Technical Lead):
  - Review Vy (Phase 3 Workspace Module): Activity Log, Transfer Ownership, Viewer Role validation → merge vào `develop`
  - Review Phú (Phase 4+5 Task Module): RBAC Guards, filter complexity, pagination → merge vào `develop`
  - Review Huyền (Project Module): RBAC, workspace relations → merge vào `develop`

- **Hỗ trợ Huyền — Project Module**:
  - Code review ProjectController + ProjectService (5 CRUD endpoints)
  - Validate RBAC: OWNER/ADMIN only create/update/delete, Member can read
  - Test Project-Workspace relationship + permission checks
  - Guide Hoppscotch testing workflow
  - Support resolve schema conflicts nếu có

- **Tuần 9 Tiếp theo — Ch2 Draft**:
  - Draft Chương 2: TypeScript Basics (const/let, async/await, type annotations, interfaces)
  - Share với team review + bổ sung ví dụ

### 3.1. Code backend

| Sản phẩm | Chi tiết |
|----------|----------|
| Phase 0 — Shared Infrastructure | TransformResponseInterceptor, HttpExceptionFilter, LoggingInterceptor, main.ts config, Swagger UI |
| Phase 1 — Auth Module | 6 endpoints: register, login, refresh, logout, forgot-password, reset-password |
| Phase 2 — User Module | 4 endpoints: get profile, update profile, change password, upload avatar |
| Phase 3 — Skeleton code | 4 files: workspace-limits.config, express.d.ts, workspace-context.type, workspace.decorator |
| Prisma Schema | 17 bảng, 5 enums, indexes, relations, cascade delete, 3 migrations |

### 3.2. Tài liệu phân tích thiết kế (15 tài liệu PRD)

Requirements Gathering, User Stories, Use Cases, Features List, NFR, ERD, Data Dictionary, Class Diagram, Sequence Diagram, Activity Diagram, DFD, BFD, Architecture, API Specification, WBS

### 3.3. Nội dung báo cáo

| Chương | Nội dung | Vai trò |
|--------|----------|---------|
| Chương 1 | Giới thiệu chung | Viết toàn bộ |
| Chương 4 | Kiến trúc NestJS (phần Providers/DI, Modules) | Viết + review phần Controllers (Vy viết) |
| Chương 5 | Làm việc với Database | Viết toàn bộ |
| Chương 8 | Phân tích và thiết kế hệ thống | Viết toàn bộ |
| Chương 9 | Triển khai chi tiết các module | Viết toàn bộ |
| Tất cả chương | Review, fact-check, tối ưu thứ tự | Review toàn bộ |

### 3.4. Tài liệu hỗ trợ nhóm

- `code_guide_rule.md`: quy tắc viết code guide
- `report_writing_rule.md`: quy tắc viết báo cáo
- `TASK_ASSIGNMENT.md`: phân công + Git workflow + timeline
- Code guide Phase 1, 2, 3: hướng dẫn từng bước implement
- `WORKLOG_NHOM.md` + `WORKLOG_TUAN_DAT.md`: nhật ký làm việc
- 78 test cases + TEST_DATA_STRATEGY.md
- Hoppscotch API collection

---

## 4. KỸ NĂNG VÀ KIẾN THỨC ĐÃ HỌC ĐƯỢC

### 4.1. Kỹ thuật

- **NestJS framework**: hiểu sâu kiến trúc Module-Controller-Service, Dependency Injection container, Request Lifecycle, Guards, Interceptors, Pipes, Exception Filters, Custom Decorators
- **TypeScript nâng cao**: Generics, Declaration Augmentation (`express.d.ts`), Utility Types, Strict Mode
- **Prisma ORM**: Schema design, Migrations, Relations (1:1, 1:N, M:N), Cascade operations, Transaction API, Select/Include patterns
- **Authentication**: JWT (Access + Refresh Token), Token Rotation, Token Blacklist, bcrypt hashing, Passport Strategy pattern
- **API Design**: RESTful conventions, response standardization, Swagger/OpenAPI integration, ValidationPipe + class-validator
- **File Upload**: Multer configuration (diskStorage, fileFilter, limits), static file serving

### 4.2. Quản lý dự án

- **Git workflow**: branch strategy (main → develop → feature/*), commit convention, PR review process, rebase workflow
- **Tài liệu kỹ thuật**: viết PRD, API Specification, code guide, test cases
- **Phân công nhóm**: breakdown tasks theo dependency, viết hướng dẫn chi tiết cho members
- **Review code**: đánh giá code quality, security, best practices

---

## 5. KHÓ KHĂN VÀ CÁCH GIẢI QUYẾT

| Khó khăn | Cách giải quyết |
|----------|-----------------|
| Prisma 7 thay đổi config format, gây lỗi kết nối DB | Nghiên cứu changelog Prisma 7, cập nhật datasource block, test lại kết nối |
| `@nestjs/jwt` v11+ thay đổi type `expiresIn`, gây lỗi TypeScript | Cast `as any` (workaround tạm), ghi lại trong code guide để team biết |
| `JwtStrategy requires a secret or key` — config không load được | Cài `@nestjs/config`, thêm `ConfigModule.forRoot({ isGlobal: true })` |
| Multer fileFilter upload file sai định dạng trả HTTP 500 thay vì 400 | Phát hiện bug BUG-U-001, đang fix: bọc error trong BadRequestException |
| ERD phức tạp (17 bảng, nhiều M:N) khó validate | Viết Data Dictionary chi tiết, review qua nhiều vòng, test trực tiếp trên Prisma migrate |
| Phong cách viết báo cáo không thống nhất giữa các thành viên | Tạo `report_writing_rule.md` (10 mục), rewrite lại các đoạn theo format chuẩn |
| Branch structure chưa bài bản (code trên main) | Thiết kế Git workflow, tạo TASK_ASSIGNMENT với hướng dẫn từng lệnh Git |

---

## 6. TỰ ĐÁNH GIÁ

### 6.1. Điểm mạnh
- Hoàn thành đầy đủ các phần được phân công (Phase 0, 1, 2) đúng tiến độ
- Viết tài liệu kỹ thuật chi tiết, giúp các thành viên khác follow được dễ dàng
- Chủ động phát hiện và sửa lỗi kỹ thuật (Prisma 7, JWT config, Token Blacklist)
- Thiết kế hệ thống tổng thể vững, ERD và API Spec được review kỹ

### 6.2. Hạn chế
- Dành nhiều thời gian cho tài liệu, chưa code frontend nhiều
- Một số module backend chưa hoàn thành (Phase 10 — Dashboard/Search)
- Chưa viết unit test thực tế (mới dừng ở test case documentation)

### 6.3. Mức hoàn thành
- Phần báo cáo: **90%** (thiếu Chương 2, 10-11)
- Phần code backend: **70%** (Phase 0, 1, 2 xong; Phase 3 đang hỗ trợ Vy; Phase 10 chờ)
- Phần quản lý nhóm: **95%** (phân công, code guide, workflow đầy đủ)

---

<p align="right"><i>TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026</i></p>

<br/>

<p align="center"><b>Người viết báo cáo</b></p>
<p align="center">(Ký và ghi rõ họ tên)</p>

<br/><br/><br/>

<p align="center"><b>Phan Cảnh Tuấn Đạt</b></p>
