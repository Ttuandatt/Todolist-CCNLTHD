# NHẬT KÝ LÀM VIỆC
**Tên đề tài:** Tìm hiểu công nghệ Nest.js
**Các thành viên:**
- Phan Cảnh Tuấn Đạt
- Nguyễn Hoàng Mai Vy
- Huỳnh Văn Phú
- Trần Khánh Huyền

---

> **31.01.2026 — Yêu cầu của thầy**
> - Thể hiện kỹ thuật đặc thù của công nghệ
> - Liệt kê các kỹ thuật trong báo cáo
> - Thế mạnh, khác biệt, đặc trưng của framework → showcase ra các ví dụ trong codebase
> - Mỗi lựa chọn được đưa ra nên có so sánh với các lựa chọn khác và lý do tại sao chọn cái này thay vì cái kia

---

## Giai đoạn chuẩn bị: 12/01 - 01/02

**Tóm tắt (3 tuần đầu dự án):**
- Lập nhóm, thống nhất đề tài "Tìm hiểu công nghệ NestJS", chọn ứng dụng minh họa (TodoList Collaboration)
- Phân chia tìm hiểu công nghệ: Đạt (NestJS core), Vy (TypeScript nâng cao), Phú (JWT/bcrypt), Huyền (Docker/PostgreSQL)
- Viết tài liệu phân tích yêu cầu: 145 câu hỏi phỏng vấn, 40+ User Stories, 60 Use Cases, 72 chức năng (MoSCoW), NFR
- Setup codebase: khởi tạo NestJS project, cấu hình Prisma, tạo skeleton modules
- Họp nhóm: 17/01, 24/01, 31/01

---

## Tuần 1: 02/02 - 08/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành tài liệu phân tích yêu cầu (Requirements, User Stories, Use Cases, Features List, NFR)
- Tìm hiểu TypeScript, JWT, Docker

**Công việc sẽ làm ở tuần này:**
- Thiết kế ERD và Data Dictionary
- Vẽ các sơ đồ phân tích (Class Diagram, Sequence Diagram, Activity Diagram)
- Tạo Prisma schema
- Viết API Specification

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Thiết kế ERD (13 entities), Data Dictionary, Prisma schema, API Specification (53 endpoints) |
| Vy | Vẽ Class Diagram: mapping ERD → NestJS modules. Review Data Dictionary |
| Phú | Vẽ Sequence Diagram: các luồng chính (Register, Login, Create Task, Assign Task) |
| Huyền | Vẽ Activity Diagram: workflow Task lifecycle, Authentication flow |

**Buổi họp nhóm 1:**
- Thời gian: 21h 07/02/2026
- Nội dung:
  - Review ERD (13 entities, 5 enums, indexes, relations, cascade delete)
  - Review API Specification: 53 endpoints cho 10 modules
  - Phân chia viết nội dung báo cáo các chương
  - Thống nhất phân công: Ch3&6 → Huyền, Ch4&5 → Đạt+Vy, Ch7 → Phú

**Các công việc đang vướng mắc:**
- ERD khá phức tạp (13 entities, nhiều quan hệ many-to-many) → cần review kỹ trước khi tạo Prisma schema
- Chưa thống nhất format viết báo cáo (style code blocks, giải thích inline hay paragraph)

---

## Tuần 2: 09/02 - 15/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành ERD, Data Dictionary, Class/Sequence/Activity Diagram
- Tạo Prisma schema (13 models, 5 enums)
- Viết API Specification (53 endpoints)
- Phân công viết báo cáo theo chương

**Công việc sẽ làm ở tuần này:**
- Vẽ DFD, BFD, hoàn thiện sơ đồ còn lại
- Tạo WBS, Gantt Chart
- Bắt đầu viết nội dung các chương báo cáo

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Vẽ DFD, BFD. Tạo WBS, Gantt Chart. Bắt đầu viết Ch1 (Giới thiệu NestJS) & Ch5 (Database/Prisma) |
| Vy | Bắt đầu viết Ch4 (Kiến trúc NestJS — phần Controllers). Nghiên cứu thêm về Dependency Injection |
| Phú | Nghiên cứu sâu JWT flow, Passport.js Strategy pattern. Bắt đầu viết Ch7 (Authentication) |
| Huyền | Nghiên cứu Docker setup, Nest CLI. Bắt đầu viết Ch3 (Cài đặt môi trường) |

**Buổi họp nhóm 1:**
- Thời gian: 21h 10/02/2026 (Thứ 2)
- Nội dung:
  - Review DFD, BFD đã vẽ
  - Thống nhất format viết báo cáo: dùng code blocks kèm giải thích diễn giải (không dùng inline comment)
  - Phân chia chi tiết nội dung từng chương
  - Cập nhật worklog

**Các công việc đang vướng mắc:**
- Chương 1 cần tìm nguồn chính thức về lịch sử NestJS (năm ra đời, tác giả Kamil Myśliwiec)
- Format viết báo cáo chưa thống nhất giữa các thành viên → cần template chuẩn

---

## Tuần 3: 16/02 - 22/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành DFD, BFD, WBS, Gantt Chart
- Bắt đầu viết nội dung Ch1, Ch3, Ch4, Ch5, Ch7

**Công việc sẽ làm ở tuần này:**
- Tiếp tục viết và hoàn thiện các chương báo cáo
- Fact-check nội dung kỹ thuật theo tài liệu chính thức NestJS
- Thay thế code comments bằng đoạn văn giải thích diễn giải

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Viết Ch4 (Providers/DI, Modules — phần so sánh tight/loose coupling). Review & fact-check Ch6, Ch7 |
| Vy | Viết Ch4 (Controllers — decorators, routing). Review Ch5 (Prisma CRUD, migrations) |
| Phú | Viết Ch7 (JWT flow, bcrypt hash, AuthService register/login, JwtStrategy, Guards) |
| Huyền | Viết Ch3 (Node.js, Nest CLI, Docker PostgreSQL, cấu trúc thư mục). Bắt đầu viết Ch6 (Request Lifecycle, Pipes) |

**Buổi họp nhóm 1:**
- Thời gian: 21h 17/02/2026 (Thứ 2)
- Nội dung:
  - Review nội dung báo cáo lần 1: đọc chéo giữa các thành viên
  - Đạt review Ch3 (Huyền) và Ch7 (Phú)
  - Vy review Ch6 (Huyền)
  - Thống nhất phong cách viết: diễn giải thay vì inline comments trong code blocks
  - Fact-check nội dung theo tài liệu chính thức NestJS

**Các công việc đang vướng mắc:**
- Ch4 khá dài (Controllers + Providers + Modules) → chia nhỏ phần viết giữa Đạt và Vy
- Phong cách viết code blocks khác nhau giữa các thành viên → cần rewrite thống nhất
- Ch7 cần xác nhận flow logout có blacklist token hay không → chờ thiết kế chi tiết

---

## Tuần 4: 23/02 - 01/03

**Công việc đã làm ở tuần trước:**
- Hoàn thiện nội dung Ch3, Ch4, Ch5, Ch6, Ch7
- Fact-check nội dung kỹ thuật
- Thống nhất phong cách viết diễn giải

**Công việc sẽ làm ở tuần này:**
- Tối ưu thứ tự chương cho logic sư phạm
- Review tổng thể báo cáo trên Google Docs
- Refactor cấu trúc folder tài liệu
- Bắt đầu code backend (Phase 0 — Shared Infrastructure)

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Tối ưu thứ tự chương (Ch6 trước Ch7). Refactor folder docs/. Review PRD (15 tài liệu). Bổ sung 3 entities mới (Invitation, RefreshToken, PasswordReset). Fix Prisma 7. Code Phase 0: Interceptors, Filters, main.ts |
| Vy | Review báo cáo trên Google Docs (69 trang): kiểm tra nội dung Ch4, Ch5. Cập nhật cross-references sau khi đổi thứ tự chương |
| Phú | Review Ch7 sau khi đổi thứ tự (thành Ch7 sau Ch6). Cập nhật nội dung authentication flow cho phù hợp thứ tự mới |
| Huyền | Review Ch3, Ch6 trên Google Docs. Cập nhật section numbers sau khi đổi thứ tự chương |

**Buổi họp nhóm 1:**
- Thời gian: 21h 24/02/2026 (Thứ 2)
- Nội dung:
  - Thông báo đổi thứ tự chương: Kỹ thuật nâng cao (Ch6) trước Authentication (Ch7) — giải thích Guards/Decorators lý thuyết trước khi áp dụng thực tế
  - Review tổng thể báo cáo: 69 trang, xác định phần còn thiếu (Ch2, Ch8-11)
  - Review PRD readiness: phát hiện thiếu 3 bảng hỗ trợ auth flow
  - Demo Phase 0: Swagger UI, response format chuẩn, logging
  - Lên kế hoạch implementation: 7 phases, 10 modules, 53 endpoints

**Các công việc đang vướng mắc:**
- Thay đổi thứ tự chương ảnh hưởng cross-references ở nhiều chỗ → cần rà soát toàn bộ
- Prisma 7 thay đổi config format (xóa `url = env()`) → cần test lại kết nối DB
- Ch2 (TypeScript cơ bản) chưa ai viết → cần phân công bổ sung

---

## Tuần 5: 02/03 - 08/03

**Công việc đã làm ở tuần trước:**
- Tối ưu thứ tự chương, cập nhật cross-references
- Review tổng thể báo cáo (69 trang)
- Bổ sung 3 entities mới vào Prisma schema (13 → 16 entities)
- Hoàn thành Phase 0 — Shared Infrastructure

**Công việc sẽ làm ở tuần này:**
- Code Phase 1 — Auth Module (JWT, bcrypt, refresh token, token blacklist)
- Bổ sung kiến thức nền tảng TypeScript vào báo cáo
- Tạo API testing collection
- Test API endpoints

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Thiết kế Token Blacklist. Cập nhật PRD (Data Dictionary, API Spec, Prisma schema). Code Phase 1 Auth Module (Bước 1-9): DTOs, JwtStrategy, JwtAuthGuard, decorators, AuthService, AuthController, AuthModule, AppModule, Migration. Fix ConfigModule + expiresIn type. Sync guide. Tạo Hoppscotch collection |
| Vy | Test API endpoints trên Hoppscotch/Swagger (register, login, refresh, logout). Review code AuthService & AuthController |
| Phú | Review authentication flow: kiểm tra Token Blacklist logic, JwtStrategy validate, bcrypt usage. Đối chiếu với nội dung Ch7 |
| Huyền | Bổ sung section "Kiến thức nền tảng TypeScript" vào Ch6 (const/let, async/await, Prisma query syntax). Review Ch3 lần cuối |

**Buổi họp nhóm 1:**
- Thời gian: 21h 03/03/2026 (Thứ 2)
- Nội dung:
  - Demo Phase 0 hoàn chỉnh: Swagger UI, TransformResponseInterceptor, HttpExceptionFilter, LoggingInterceptor
  - Trình bày thiết kế Token Blacklist: cơ chế, database schema, flow logout
  - Planning Phase 1: review code guide, phân chia review/test
  - Demo server startup: 6 routes mapped, database connected
  - Cập nhật worklog nhóm & cá nhân

**Các công việc đang vướng mắc:**
- `@nestjs/jwt` v11+ thay đổi type `expiresIn` → cần cast `as any` (workaround)
- `ConfigModule` chưa có trong guide ban đầu → đã sửa, cần đồng bộ lại tài liệu
- Ch2 (TypeScript cơ bản) vẫn chưa viết → cần ưu tiên ở tuần tới
- Chưa test forgot-password và reset-password flow (cần email service mock)

---

## Tuần 6: 09/03 - 15/03

**Công việc đã làm ở tuần trước:**
- Hoàn thành Phase 1 Auth Module (Bước 1–9): DTOs, JwtStrategy, JwtAuthGuard, AuthService, AuthController, migration 17 tables
- Thiết kế và tích hợp Token Blacklist vào toàn bộ auth flow
- Tạo Hoppscotch collection, fix lỗi ConfigModule và expiresIn type

**Công việc đã làm ở tuần này:**
- Hoàn thành bàn giao Phase 1, chuẩn bị bắt đầu Phase 2
- Lên kế hoạch phân công implementation toàn nhóm (Phases 3–10)
- Thiết lập quy trình làm việc chuẩn cho giai đoạn code

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Viết code guide Phase 2. Viết `code_guide_rule.md`. Tạo `TASK_ASSIGNMENT.md` (phân công phases 3–10, git workflow, timeline 4 tuần). Cập nhật worklog nhóm |
| Vy | Đọc `TASK_ASSIGNMENT.md`, nắm rõ scope Phase 3. Ôn lại Prisma relations (WorkspaceMember, Invitation) |
| Phú | Đọc `TASK_ASSIGNMENT.md`, nắm rõ scope Phase 4+5. Nghiên cứu RBAC Guard pattern trong NestJS |
| Huyền | Đọc `TASK_ASSIGNMENT.md`, nắm rõ scope Phase 6+7. Setup Redis + Bull trên máy local (`docker-compose up redis`) |

**Công việc sẽ làm ở tuần tới:**
- Đạt: Code Phase 2 (User Module), setup git workflow `develop` + `feature/*`, review PR Vy
- Vy: Bắt đầu Phase 3 — `WorkspaceModule` CRUD + invite system
- Phú: Chuẩn bị DTOs cho Task Module, đọc code Vy để hiểu WorkspaceMember structure
- Huyền: Bắt đầu Phase 6 — setup `EventsGateway`, WebSocket rooms

**Các công việc đang vướng mắc:**
- Ch2 (TypeScript cơ bản) vẫn chưa viết → chưa có người phụ trách rõ ràng
- Chưa test `forgot-password` + `reset-password` flow (cần email service mock)
- Git workflow chưa bài bản (chỉ có nhánh `main`) → Đạt sẽ setup `develop` + hướng dẫn nhóm trong tuần tới

---

## Tuần 7: 16/03 - 22/03

**Công việc đã làm ở tuần trước:**
- Đạt: Viết code guide Phase 2, `code_guide_rule.md`, `TASK_ASSIGNMENT.md` (phân công phases 3–10, git workflow, timeline)
- Vy: Nắm rõ scope Phase 3, ôn Prisma relations
- Phú: Nghiên cứu RBAC Guard pattern, nắm scope Phase 4+5
- Huyền: Setup Redis + Bull local, nắm scope Phase 6+7

**Công việc đã làm ở tuần này:**

| Thành viên | Công việc |
|:---|:---|
| Đạt | Hoàn thành **Phase 2 — User Module** (4 endpoints: `GET/PATCH /users/me`, `change-password`, `upload avatar`): UserController, UserService, Multer config, 2 DTOs, Prisma migration `add_display_name_bio_to_user`. Viết **78 test cases** (`02-user-module-test-cases.md`) + `TEST_DATA_STRATEGY.md`. Viết **`report_writing_rule.md`** (10 mục). Viết **Chương 8** (7 Sequence Diagrams Mermaid, ERD chi tiết, thiết kế bảo mật). Viết **Chương 9** (triển khai Auth + User modules). Viết **Workspace Suite Design Spec**. Viết **Phase 3 Code Guide** (~1442 dòng). Chạy migration `workspace-suite-sync`. Tạo 3 implementation plans. Bắt đầu Phase 3 skeleton (4 files: config, types, decorators) |
| Vy | Bắt đầu **Phase 3** trên nhánh `feature/(dat-vy)-workspace-module` |
| Phú | Chuẩn bị **Phase 4+5** (Task/Project Modules) |
| Huyền | Chuẩn bị **Phase 6+7** (WebSocket/Realtime, Notifications) |

**Công việc sẽ làm ở tuần tới:**
- Đạt: Hoàn thành Phase 3 skeleton (Bước 3-7: PermissionService, ContextInterceptor, các module), fix BUG-U-001, review PR Vy
- Vy: Tiếp tục Phase 3 — WorkspaceMember + WorkspaceInvite endpoints
- Phú: Bắt đầu Phase 4 — Task Module (CRUD + assignment)
- Huyền: Tiếp tục Phase 6 — `EventsGateway`, WebSocket rooms

**Các công việc đang vướng mắc:**
- BUG-U-001: Multer fileFilter upload `.txt` trả HTTP 500 thay vì 400 → cần fix trước khi merge
- Ch2 (TypeScript cơ bản) vẫn chưa viết → cần phân công rõ ràng
- Branch structure chưa chuẩn (`feature` nhánh từ `main` thay vì `develop`) → Đạt có plan fix, chờ confirm

---

## Tuần 8: 23/03 - 29/03

**Công việc đã làm ở tuần trước:**
- Đạt hoàn tất Phase 2 và bàn giao skeleton Phase 3.
- Vy bắt đầu code WorkspaceModule.
- Phú chuẩn bị DTO/permission cho Task Module.
- Huyền setup hạ tầng realtime/Redis.

**Công việc đã làm ở tuần này:**

| Thành viên | Công việc |
|:---|:---|
| Đạt | Review code Workspace/Task, hỗ trợ merge cấu hình Prisma & TransformInterceptor sau khi tách module; chuẩn bị checklist cải thiện bảo mật chung (rate limit, captcha) để đội triển khai tuần tới. |
| Vy | Hoàn thiện toàn bộ **Workspace Module**: CRUD + invite/accept, quản lý role (change role, kick, leave), validate quyền OWNER/ADMIN, cập nhật Hoppscotch collection và tài liệu API. Tạo draft PR `feature/(dat-vy)-workspace-module`. |
| Phú | Triển khai **Task Module**: toàn bộ endpoint CRUD, filter nâng cao (status/priority/label/dueDate/pagination), status transition, assign/unassign, label attach/detach, subtask CRUD. Viết test flow tự kiểm bằng Hoppscotch, chuẩn bị update RBAC guard cho tuần sau. |
| Huyền | Nhận nhiệm vụ xây các module còn thiếu: Comments, Label Catalog, Notifications, Dashboard/Search, Activity Log, OAuth integration. Lên outline kiến trúc common layer (throttling middleware, standard response formatter, feature flags) và khảo sát storage cho attachments. |

**Công việc sẽ làm ở tuần tới:**
- Vy: bổ sung chuyển quyền Owner, activity log, vai trò "viewer", và quota invite theo spec mới.
- Phú: thêm attachments, drag-drop reorder, duplicate/move task và time tracking; mở rộng FilterTaskDto multi-status + caching.
- Huyền: bắt đầu Comment + Notification module, dựng Label CRUD workspace-level, chuẩn bị OAuth Google/GitHub và dashboard APIs.
- Đạt: hoàn thiện Phase 3 remaining steps (PermissionService, ContextInterceptor), review & merge PRs, chuẩn hóa branch workflow (`develop` + feature branches) và hỗ trợ viết Ch2.

**Buổi họp nhóm:**
- Thời gian: 21h 25/03/2026 (Thứ Tư)
- Nội dung: rà lại backlog còn thiếu (Comment, Label, Notification, Dashboard), phân công cải tiến module hiện có (Auth/User/Workspace/Project/Task), thống nhất quy trình test Hoppscotch + checklist review trước khi mở PR.

**Các công việc đang vướng mắc:**
- Chưa có storage service chuẩn cho file đính kèm → Huyền đề xuất nghiên cứu S3-compatible trước khi Phú triển khai attachments.
- Ch2 (TypeScript cơ bản) vẫn để trống → Đạt sẽ draft, các thành viên review bổ sung ví dụ.
- Chưa có chuẩn logging/activity log cho workspace → cần thống nhất format trước khi Vy/Huyền xây module mới.
