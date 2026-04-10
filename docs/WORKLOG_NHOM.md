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
- Hoàn thiện các sơ đồ phân tích còn lại theo phân công
- Bắt đầu viết nội dung các chương báo cáo

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Hoàn thiện các sơ đồ phân tích được giao. Bắt đầu viết Ch1 (Giới thiệu NestJS) & Ch5 (Database/Prisma) |
| Vy | Bắt đầu viết Ch4 (Kiến trúc NestJS — phần Controllers). Nghiên cứu thêm về Dependency Injection |
| Phú | Nghiên cứu sâu JWT flow, Passport.js Strategy pattern. Bắt đầu viết Ch7 (Authentication) |
| Huyền | Nghiên cứu Docker setup, Nest CLI. Bắt đầu viết Ch3 (Cài đặt môi trường) |

**Buổi họp nhóm 1:**
- Thời gian: 21h 10/02/2026 (Thứ 2)
- Nội dung:
  - Review các sơ đồ phân tích đã vẽ
  - Thống nhất format viết báo cáo: dùng code blocks kèm giải thích diễn giải (không dùng inline comment)
  - Phân chia chi tiết nội dung từng chương
  - Cập nhật worklog

**Các công việc đang vướng mắc:**
- Chương 1 cần tìm nguồn chính thức về lịch sử NestJS (năm ra đời, tác giả Kamil Myśliwiec)
- Format viết báo cáo chưa thống nhất giữa các thành viên → cần template chuẩn

---

## Tuần 3: 16/02 - 22/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành các sơ đồ phân tích đã lên kế hoạch
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
| Huyền | Đọc `TASK_ASSIGNMENT.md`, nắm rõ scope Phase 6+7. Chuẩn bị Docker Compose mẫu có Redis và nghiên cứu Bull queue ở mức tài liệu/thử nghiệm (chưa tích hợp vào backend chính). |

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
- Huyền: Chuẩn bị Docker Compose mẫu có Redis và nghiên cứu Bull queue ở mức tài liệu/thử nghiệm (chưa tích hợp vào backend chính)

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
- Huyền bắt đầu setup hạ tầng realtime (EventsGateway/WebSocket) và nghiên cứu Redis cho các use case queue/caching (chưa tích hợp Redis vào code backend).

**Công việc đã làm ở tuần này:**

| Thành viên | Công việc |
|:---|:---|
| Đạt | Review code Workspace/Task, hỗ trợ merge cấu hình Prisma & TransformInterceptor sau khi tách module; chuẩn bị checklist cải thiện bảo mật chung (rate limit, captcha) để đội triển khai tuần tới. |
| Vy | Hoàn thiện toàn bộ **Workspace Module**: CRUD + invite/accept, quản lý role (change role, kick, leave), validate quyền OWNER/ADMIN, cập nhật Hoppscotch collection và tài liệu API. Tạo draft PR `feature/(dat-vy)-workspace-module`. |
| Phú | Triển khai **Task Module**: toàn bộ endpoint CRUD, filter nâng cao (status/priority/label/dueDate/pagination), status transition, assign/unassign, label attach/detach, subtask CRUD. Viết test flow tự kiểm bằng Hoppscotch, chuẩn bị update RBAC guard cho tuần sau. (Các tính năng nâng cao như drag-drop reorder, duplicate/move task, attachments, caching mới dừng ở mức ý tưởng/thảo luận, chưa implement đầy đủ trong code.) |
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

---

## Tuần 9: 30/03 - 05/04

**Công việc đã làm ở tuần trước:**
- Hoàn thành Phase 2 (User Module) và skeleton Phase 3 (Workspace Suite)
- Vy hoàn thiện Workspace Module CRUD + invite/role, Phú triển khai Task Module, Huyền chuẩn bị các module Comments/Notification/Label
- Cập nhật Hoppscotch collection, chuẩn hóa tài liệu PRD và code guide cho Workspace/Task

**Công việc đã làm ở tuần này:**

| Thành viên | Công việc |
|:---|:---|
| Đạt | Hoàn thành Phase 3 skeleton: WorkspacePermissionService, WorkspaceContextInterceptor, WorkspaceModule + WorkspaceMemberModule + WorkspaceInviteModule. Refactor lại guard/permission layer để các module Workspace/Project/Task có thể share chung. Review và merge PR WorkspaceModule (Vy) và TaskModule (Phú) vào develop; fix các lỗi schema, DTO và response format sau merge. Draft lần 1 Chương 2 (Cơ hội nghề nghiệp & thị trường) và cập nhật liên kết chéo giữa các chương. Chuẩn hóa git workflow (main/develop/feature/*), cập nhật TASK_ASSIGNMENT.md cho phù hợp nhánh mới. |
| Vy | Bổ sung các tính năng nâng cao cho WorkspaceModule: chuyển quyền Owner, vai trò Viewer, quota invite mỗi user theo config. Cập nhật API Spec và Hoppscotch collection tương ứng. Fix các edge case: user tự rời workspace khi là Owner cuối cùng, revoke invite hết hạn. Thiết kế schema ActivityLog trong Prisma và thống nhất quy ước log cho các hành động workspace (chưa có module/API Activity Log chạy thực tế). Review lại phần Workspace trong báo cáo (Ch8, Ch9) theo design mới. |
| Phú | Mở rộng TaskModule: bổ sung filter multi-status/multi-priority/paginate chuẩn theo thiết kế hiện tại, hoàn thiện CRUD subtask/assignment/labels và các luồng status transition; time-tracking cơ bản (estimate/actual) thông qua các trường trên Task. Các ý tưởng như attachments (file đính kèm), drag-drop reorder task, duplicate/move task giữa project và caching mới ở mức thiết kế/thảo luận, chưa được triển khai đầy đủ trong code. Chuẩn bị RBAC guard cập nhật cho Task theo permission của WorkspaceMember. Viết checklist test thủ công cho các luồng Task hiện có. |
| Huyền | Bắt đầu CommentsModule và NotificationModule: thiết kế schema, viết API CRUD comment, tích hợp tạo notification khi có comment mới/theo dõi reply. Thiết kế sơ bộ Label Catalog workspace-level và kế hoạch tích hợp với Task (chưa có LabelModule riêng trong code). Khảo sát các lựa chọn storage (S3-compatible, local, Cloudinary) và đề xuất phương án dùng local + interface để dễ thay thế sau (ở mức nghiên cứu/đề xuất). Bắt đầu chuẩn bị OAuth (Google/GitHub) flow ở mức tài liệu/thảo luận và ghi chú vào PRD (chưa code backend OAuth). |

**Buổi họp nhóm:**
- Thời gian: 21h 01/04/2026 (Thứ Tư)
- Nội dung:
  - Demo Workspace + Task flows sau khi merge: tạo workspace, mời thành viên, tạo project, tạo task, gán nhãn, xem các cách sắp xếp theo priority/due date (drag-drop mới dừng ở mức ý tưởng UI)
  - Thống nhất tiêu chuẩn Activity Log và logging format chung cho workspace/project/task
  - Rà lại scope các module còn lại (Comments, Notification, Label, Dashboard/Search, OAuth) và chia deadline chi tiết đến tuần 10
  - Chốt cấu trúc Chương 10–11 (Đánh giá & Hướng phát triển) để cả nhóm bắt đầu thu thập ý kiến và số liệu

**Công việc sẽ làm ở tuần tới:**
- Đạt: Dọn dẹp code sau merge, viết thêm phần mô tả Workspace/Task trong Ch8–9, bổ sung test data và chuẩn bị plan cho e2e testing backend.
- Vy: Tiếp tục hoàn thiện thiết kế Activity Log cho workspace (xác định rõ các hành động cần log, mới dừng ở mức schema/thiết kế, chưa có tính năng Activity Log hiển thị thực tế), tinh chỉnh response để dễ đọc trong Swagger/Hoppscotch, hỗ trợ Huyền tích hợp comment vào workspace/task.
- Phú: Tối ưu query Task (index, pagination, caching đơn giản), bổ sung thêm use case search/filter phức tạp và cập nhật tài liệu test.
- Huyền: Hoàn thiện CommentsModule và NotificationModule, bắt đầu dựng Dashboard/Search APIs và thử nghiệm OAuth login cơ bản với Google.

**Các công việc đang vướng mắc:**
- Storage service dài hạn cho attachments vẫn chưa thống nhất (mới dừng ở local storage + abstraction).
- OAuth cần thêm thời gian để nghiên cứu cấu hình Google/GitHub, redirect URI, bảo mật.
- Chưa có bộ e2e test tự động cho toàn bộ auth + user + workspace + task → mới dừng ở test thủ công.

---

## Tuần 10: 06/04 - 12/04

**Công việc đã làm ở tuần trước:**
- Merge hoàn chỉnh WorkspaceModule và TaskModule vào develop, hoàn thiện skeleton Phase 3
- Khởi động CommentsModule và NotificationModule, thiết kế nhãn workspace-level dựa trên model Label trong Prisma (chưa có LabelModule/backend API riêng) và thống nhất format Activity Log ở mức schema/PRD (chưa có module Activity Log chạy thực tế)
- Chốt cấu trúc Chương 10–11 và kế hoạch e2e testing

**Công việc đã làm ở tuần này:**

| Thành viên | Công việc |
|:---|:---|
| Đạt | Viết và chỉnh sửa nội dung các chương cuối báo cáo: hoàn thiện Chương 2 (Cơ hội nghề nghiệp & thị trường), cập nhật Ch8–9 với thiết kế Workspace/Task/Comment/Notification mới, draft Ch10 (Đánh giá) và Ch11 (Hướng phát triển). Chuẩn hóa lại danh sách tài liệu tham khảo (Ch13). Thiết kế bộ test e2e tổng hợp cho các luồng chính (Auth + User + Workspace + Task) và ghi lại trong docs/testing/ (mới dừng ở mức thiết kế, chưa chạy full e2e). Thực hiện một phần unit test cho các luồng chính theo đúng phân công (Auth/User/Workspace/Task) và chạy test thủ công để kiểm tra lại hành vi trước khi chuẩn bị đóng băng mã nguồn. Hỗ trợ review code Comments/Notification/Label của Huyền và Task nâng cao của Phú. Chuẩn bị slide thuyết trình (outline) dựa trên cấu trúc báo cáo. |
| Vy | Rà soát và tinh chỉnh lại toàn bộ WorkspaceModule sau merge: tối ưu response payload, kiểm tra lại tất cả rule chuyển quyền Owner/role. Chạy test manual toàn bộ luồng workspace (tạo/join/leave/kick/change-role/invite). Rà soát logging có sẵn cho các hành động quan trọng của workspace và ghi nhận lại những hành động cần đưa vào ActivityLog trong tương lai (chưa có module/API Activity Log riêng). Góp ý nội dung Ch8–9 phần Workspace và cập nhật một số hình vẽ sơ đồ nếu cần. |
| Phú | Hoàn thiện TaskModule nâng cao: bổ sung filter kết hợp (status + priority + label + assignee + due date range + search + pagination) theo thiết kế hiện tại, tối ưu truy vấn ở mức Prisma (giảm truy vấn lồng nhau trong các luồng chính). Bổ sung time tracking cơ bản qua trường estimatedHours/actualHours. Chạy bộ test thủ công và ghi lại kết quả vào tài liệu testing. Đề xuất thêm một số ý tưởng future work (analytics, báo cáo năng suất, log lịch sử time tracking) để ghi nhận trong phần Hướng phát triển (chưa implement đầy đủ trong code). |
| Huyền | Hoàn thiện CommentsModule và NotificationModule ở mức backend (CRUD comment, tạo notification khi có comment mới/reply), tích hợp với Task/Workspace theo thiết kế hiện tại. Hoàn thiện các API liên quan đến nhãn/comment/notification phục vụ Dashboard/Search ở mức cơ bản (chưa có module Dashboard/Search riêng). Tiếp tục nghiên cứu OAuth Google login (mới dừng ở mức tài liệu/prototype, chưa tích hợp production). Rà soát lại Ch3, Ch6 và bổ sung một số phần mô tả liên quan đến Docker, realtime, notifications. |

**Buổi họp nhóm:**
- Thời gian: 21h 08/04/2026 (Thứ Tư)
- Nội dung:
  - Review toàn bộ báo cáo từ Phần 1 đến Phần 3, checklist những chỗ cần chỉnh sửa wording, format, hình ảnh
  - Demo nhanh backend: Auth/User/Workspace/Project/Task/Comment/Notification hoạt động end-to-end
  - Thống nhất dàn ý slide thuyết trình, phân công người trình bày từng phần
  - Lên danh sách rủi ro còn lại (bug nhỏ, UI/UX, phần chưa kịp làm) để ghi rõ trong Chương 11

**Công việc sẽ làm ở tuần tới:**
- Tổng rà soát codebase, dọn dẹp TODO/console.log/thừa
- Chạy lại toàn bộ test (unit/e2e/manual) trước khi đóng băng mã nguồn
- Hoàn thiện slide, tập dượt thuyết trình và chuẩn bị phần demo
- In/đóng báo cáo nếu cần theo yêu cầu môn học

**Các công việc đang vướng mắc:**
- Một số tính năng nâng cao (như OAuth hoàn chỉnh, storage S3 thực tế, dashboard analytics sâu) có thể chưa kịp triển khai đầy đủ → ghi rõ trong phần Hướng phát triển.
- Cần thêm thời gian để tinh chỉnh ngôn ngữ báo cáo cho thật mượt, tránh trùng lặp giữa các chương.
