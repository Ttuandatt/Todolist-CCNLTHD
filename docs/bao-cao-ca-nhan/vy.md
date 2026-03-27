<p align="center"><b>[TÊN TRƯỜNG]</b></p>
<p align="center"><b>[TÊN KHOA]</b></p>
<p align="center">───────────────────</p>

<br/>

<p align="center"><b>BÁO CÁO CÁ NHÂN</b></p>
<p align="center"><b>ĐỒ ÁN CUỐI KỲ — CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI</b></p>

<br/>

| Thông tin | Nội dung |
|-----------|----------|
| **Họ và tên** | Nguyễn Hoàng Mai Vy |
| **MSSV** | 3122410490 |
| **Email** | vynguyen08257@gmail.com |
| **SĐT** | 0862498257 |
| **Vai trò** | Thành viên — Phụ trách Phase 3 |
| **Tên đề tài** | Tìm hiểu công nghệ NestJS |
| **GVHD** | Phạm Thi Vương |

---

## 1. GIỚI THIỆU ĐỀ TÀI VÀ NHÓM

### 1.1. Tổng quan đề tài

Đồ án nghiên cứu và trình bày công nghệ **NestJS** — framework Node.js xây dựng trên TypeScript, sử dụng kiến trúc module hóa với Dependency Injection. Nhóm xây dựng ứng dụng **TodoList Collaboration** (quản lý công việc nhóm) để minh họa các kỹ thuật đặc trưng của NestJS trong thực tế.

### 1.2. Thành viên nhóm

| STT | Họ tên | MSSV | Vai trò |
|:---:|--------|------|---------|
| 1 | Phan Cảnh Tuấn Đạt | 3122410076 | Nhóm trưởng / Technical Lead |
| 2 | Nguyễn Hoàng Mai Vy | 3122410490 | Thành viên — Phase 3 |
| 3 | Huỳnh Văn Phú | 3122560057 | Thành viên — Phase 4+5 |
| 4 | Trần Khánh Huyền | 3122410156 | Thành viên — Phase 6+7 |

### 1.3. Vai trò cá nhân

Trong đồ án, tôi phụ trách **Phase 3 — Workspace Module + Project Module + Label Module**, đây là backbone của ứng dụng. Workspace là container lớn nhất chứa Projects và Members, Project là nơi chứa Tasks. Ngoài ra, tôi tham gia viết báo cáo chương Kiến trúc NestJS (phần Controllers) và review các chương khác.

---

## 2. CÔNG VIỆC ĐÃ THỰC HIỆN

### 2.1. Giai đoạn chuẩn bị (12/01 – 01/02): Nghiên cứu công nghệ

- Tham gia họp nhóm, thống nhất đề tài và phạm vi dự án
- Nghiên cứu **TypeScript nâng cao**: Generics, Utility Types, Decorators, Type Guards
- Tìm hiểu cách TypeScript được áp dụng trong NestJS: strict mode, DTO typing, interface patterns
- Đọc tài liệu chính thức NestJS về Controllers, Routing, Request/Response handling

### 2.2. Tuần 1 (02/02 – 08/02): Vẽ sơ đồ thiết kế

- Vẽ **Class Diagram**: mapping từ ERD sang NestJS modules
  - Xác định quan hệ giữa Controller → Service → Entity cho từng module
  - Áp dụng kiến thức Dependency Injection để thiết kế các lớp
- **Review Data Dictionary**: kiểm tra kiểu dữ liệu, ràng buộc, đối chiếu với ERD
- Tham gia họp nhóm review ERD (13 entities) và API Specification (53 endpoints)
- Thống nhất phân công viết báo cáo: nhận phần Chương 4 (Controllers) và Chương 5 (review)

### 2.3. Tuần 2 (09/02 – 15/02): Bắt đầu viết báo cáo

- Bắt đầu viết **Chương 4 — Kiến trúc NestJS (phần Controllers)**:
  - Khái niệm Controller trong NestJS
  - Decorators: @Controller(), @Get(), @Post(), @Param(), @Body(), @Query()
  - Routing: cách NestJS map HTTP requests đến handler methods
  - Request object, Response handling
  - Route parameters và Query parameters
- Nghiên cứu thêm về **Dependency Injection** để hiểu cách Providers hoạt động

### 2.4. Tuần 3 (16/02 – 22/02): Hoàn thiện chương báo cáo

- Hoàn thiện **Chương 4 (phần Controllers)**:
  - Bổ sung ví dụ code từ dự án TodoList Collaboration
  - Thêm giải thích chi tiết từng decorator và cách sử dụng
  - So sánh cách viết Controller trong NestJS vs Express.js
- **Review Chương 5** (Database/Prisma — Đạt viết):
  - Kiểm tra tính chính xác của Prisma CRUD operations
  - Đối chiếu Prisma schema với ERD đã thiết kế
  - Góp ý về cách trình bày migrations
- Tham gia review chéo nội dung báo cáo với các thành viên khác

### 2.5. Tuần 4 (23/02 – 01/03): Review báo cáo tổng thể

- **Review báo cáo trên Google Docs (69 trang)**: kiểm tra nội dung Chương 4 và Chương 5
- Cập nhật **cross-references** sau khi đổi thứ tự chương (Ch6 trước Ch7)
- Kiểm tra tính nhất quán trong cách đánh số section giữa các chương
- Tham gia họp nhóm: review PRD, thống nhất kế hoạch implementation

### 2.6. Tuần 5 (02/03 – 08/03): Test API & review code

- **Test API endpoints** trên Hoppscotch/Swagger:
  - Test register, login, refresh token, logout flow
  - Kiểm tra Token Blacklist hoạt động đúng sau logout
  - Verify response format chuẩn `{ success, data, timestamp }`
- **Review code** AuthService và AuthController:
  - Kiểm tra logic register (hash password, check duplicate email)
  - Kiểm tra login flow (validate credentials, generate tokens)
  - Kiểm tra refresh token rotation
- Ghi nhận các edge cases cần test thêm

### 2.7. Tuần 6 (09/03 – 15/03): Chuẩn bị Phase 3

- Đọc **`TASK_ASSIGNMENT.md`**: nắm rõ scope Phase 3 gồm WorkspaceModule + ProjectModule + LabelModule
- Ôn lại **Prisma relations**: WorkspaceMember (many-to-many giữa User và Workspace), Invitation flow
- Nghiên cứu **invite system**: tạo token với crypto.randomBytes, quản lý trạng thái invitation (PENDING/ACCEPTED/EXPIRED/REVOKED)
- Đọc code Phase 0, 1, 2 của Đạt để hiểu codebase hiện tại

### 2.8. Tuần 7 (16/03 – 22/03): Bắt đầu code Phase 3

- Bắt đầu **Phase 3** trên nhánh `feature/(dat-vy)-workspace-module`:
  - Đọc **Phase 3 Code Guide** (~1.442 dòng) do Đạt viết
  - Tìm hiểu Workspace Suite Design Spec
  - Bắt đầu implement WorkspaceModule CRUD:
    - Tạo cấu trúc file: workspace.module.ts, workspace.controller.ts, workspace.service.ts
    - Viết DTOs: CreateWorkspaceDto, UpdateWorkspaceDto
    - Implement các endpoints: GET /workspaces, POST /workspaces, GET /workspaces/:id
  - Tìm hiểu cách sử dụng WorkspaceContextInterceptor và custom decorators (@WorkspaceContext, @WorkspaceId) từ skeleton code

### 2.9. Tuần 8 (23/03 – 29/03): Hoàn thiện Workspace Module

- Hoàn tất toàn bộ **Workspace CRUD** flow: patch/update/delete, soft rules cho OWNER/ADMIN, validate UUID, tích hợp `CurrentUser` decorator và JwtAuthGuard.
- Viết thêm endpoints **invite flow** (POST invite, POST accept, GET members, PATCH role, DELETE member, DELETE leave) dựa trên WorkspaceService, bảo đảm kiểm tra quyền trước khi gọi Prisma.
- Tối ưu Prisma query cho `findAllForUser` (includes, pagination) và `findOne` (members + role hiện tại) để phục vụ Task module phụ thuộc.
- Cập nhật Hoppscotch collection + tài liệu API để phản ánh request/response mới, tự test toàn bộ luồng từ tạo → mời → đổi quyền → rời workspace.
- Push code, mở draft PR để các thành viên khác review và sử dụng làm nền cho Project/Task modules.

### 2.10. Tuần 9 (30/03 – 05/04): Hoàn thiện Workspace + Bắt đầu Project Module

**Workspace Module enhancement:**
- Implement **Activity Log** (POST events: CREATE, UPDATE, DELETE, INVITE, ACCEPT, REMOVE, CHANGE_ROLE)
- Implement **Transfer Ownership** endpoint (PATCH `/workspaces/:id/transfer-owner`)
- Implement **Viewer Role** + RBAC audit
- Implement **Invite Quota** validation per member
- Test tất cả features, cập nhật Hoppscotch
- Merge PR Phase 3 (Workspace) sau khi Đạt review

**Project Module (Extended Phase 3):**
- Scaffold ProjectController, ProjectService, ProjectModule
- Viết DTOs: CreateProjectDto, UpdateProjectDto, QueryProjectDto
- Implement 5 CRUD endpoints
- Validate workspace relationship + RBAC (OWNER/ADMIN only create)
- Update Hoppscotch collection, prepare PR

**Support Activity:**
- Nhận hỗ trợ từ **Huyền** review Activity Log, Transfer Ownership, Viewer Role
- Nhận hỗ trợ từ **Đạt** review & merge code

### 2.11. Tuần 9 (27/03): Thiết kế Sequence Diagram — Core Flows

- Phối hợp tạo **11 Sequence Diagrams** cho các core flows chính:
  - **Authentication**: User Login (2), Refresh Token (1)
  - **Workspace Management**: Create Workspace (1), Invite & Accept Member (1)
  - **Project Management**: Create Project & Kanban Board (1)
  - **Task Management**: Create, Update, Change Status, Assign, Comment & Notification (5)
  - **Security**: RBAC Permission Check (1)
- Sử dụng **Mermaid syntax** cho UML Sequence Diagram
- Tài liệu đầy đủ: `docs/PRD/10-SEQUENCE_DIAGRAM_CORE_FLOWS.md` (369 dòng)
- Mỗi flow bao gồm:
  - Happy path (case thành công)
  - Alternative paths (alternative cases)
  - Exception handling (error cases)
  - Actor: Frontend, Controllers, Services, Database
- Các diagram này phục vụ:
  - Documentation cho report (Chương 8: System Analysis & Design)
  - Testing reference cho API integration tests
  - Implementation guide cho backend team
  - Communication tool cho team meetings

---

## 3. TỔNG HỢP SẢN PHẨM ĐÃ TẠO

### 3.1. Nội dung báo cáo

| Chương | Nội dung | Vai trò |
|--------|----------|---------|
| Chương 4 | Kiến trúc NestJS — phần Controllers, Decorators, Routing | Viết phần Controllers |
| Chương 5 | Làm việc với Database — Prisma ORM | Review, góp ý |
| Toàn bộ | Review trên Google Docs, cập nhật cross-references | Review |

### 3.2. Sơ đồ thiết kế

- **Class Diagram**: mapping ERD → NestJS modules (Controller → Service → Entity)
- **Sequence Diagram — Core Flows** (11 luồng):
  - **Authentication (2 flows)**: User Login, Refresh Token
  - **Workspace Management (2 flows)**: Create Workspace, Invite & Accept Member
  - **Project Management (1 flow)**: Create Project & View Kanban Board
  - **Task Management (5 flows)**: Create, Update, Change Status, Assign, Comment & Notification
  - **Security (1 flow)**: RBAC Permission Check
  - **Tài liệu**: `docs/PRD/10-SEQUENCE_DIAGRAM_CORE_FLOWS.md` (Mermaid syntax)

### 3.3. Thiết kế hệ thống (Sequence Diagrams)

| Core Flow | UML Diagram | Loại | Ghi chú |
|-----------|-------------|------|---------|
| User Login | sequenceDiagram (happy path + error cases) | Authentication | Check hashed password, generate 2 tokens |
| Refresh Token | sequenceDiagram (token rotation) | Authentication | Validate stored token, revoke old, generate new |
| Create Workspace | sequenceDiagram (ownership assignment) | Workspace Mgmt | Initialize with owner, create first member entry |
| Invite & Accept Member | sequenceDiagram (6-step flow) | Workspace Mgmt | Generate invite token, validate expiry, role assignment |
| Create Project | sequenceDiagram (Kanban board init) | Project Mgmt | Link to workspace, initialize status columns |
| Create Task | sequenceDiagram (field validation) | Task Mgmt | Check project access, assign to user, create status |
| Update Task | sequenceDiagram (field validation + RBAC) | Task Mgmt | Verify assignee permission before update |
| Change Task Status | sequenceDiagram (drag & drop) | Task Mgmt | Validate status transition, trigger notification |
| Assign Task | sequenceDiagram (member permission check) | Task Mgmt | Verify member in workspace, notify assignee |
| Add Comment | sequenceDiagram (comment + notification) | Task Mgmt | Create comment, send notification to task members |
| RBAC Check | sequenceDiagram (role-based gates) | Security | Verify OWNER/ADMIN/EDITOR/VIEWER permissions |

**Tài liệu**: `docs/PRD/10-SEQUENCE_DIAGRAM_CORE_FLOWS.md` (369 dòng, Mermaid syntax)

### 3.4. Code backend (đang thực hiện)

| Module | Endpoints | Trạng thái |
|--------|:---------:|:----------:|
| Workspace CRUD | 5 (GET list, POST create, GET detail, PATCH update, DELETE) | ✅ Hoàn thành |
| Workspace Invite System | 6 (invite, accept, list members, change role, kick, leave) | 🔄 Đang tích hợp |
| Workspace Activity Log | 1 (GET /workspaces/:id/activity) | 🔄 Tuần 9 |
| Workspace Transfer Owner | 1 (PATCH /workspaces/:id/transfer-owner) | 🔄 Tuần 9 |
| Project Module | 5 (GET list, POST create, GET detail, PATCH update, DELETE) | 🔄 Tuần 9 |

### 3.5. Hoạt động hỗ trợ

- Test API endpoints Auth Module trên Hoppscotch
- Review code AuthService, AuthController
- Review nội dung báo cáo, kiểm tra cross-references
- Review Data Dictionary

---

## 4. KỸ NĂNG VÀ KIẾN THỨC ĐÃ HỌC ĐƯỢC

### 4.1. Kỹ thuật

- **NestJS Controllers**: hiểu sâu cách NestJS map HTTP requests, sử dụng decorators (@Controller, @Get, @Post, @Param, @Body, @Query), response handling
- **TypeScript nâng cao**: Generics, Decorators, Type Guards, Interface patterns
- **Prisma ORM**: relations (1:1, 1:N, M:N qua bảng trung gian), cascade operations, schema design
- **Authentication flow**: JWT access/refresh token, Token Blacklist, bcrypt
- **Class Diagram & Sequence Diagram**: thiết kế hệ thống OOP cho NestJS, mapping từ ERD sang code, UML 2.0 notation cho core business flows
- **Mermaid Diagram**: tạo documentation-as-code cho UML (Class, Sequence, Activity diagrams)

### 4.2. Quy trình làm việc

- **Git workflow**: làm việc trên feature branch, commit convention, pull/rebase từ develop
- **Code review**: kiểm tra logic, security, best practices
- **Testing API**: sử dụng Hoppscotch/Swagger để test endpoints
- **Đọc code guide**: follow hướng dẫn từng bước để implement module mới

---

## 5. KHÓ KHĂN VÀ CÁCH GIẢI QUYẾT

| Khó khăn | Cách giải quyết |
|----------|-----------------|
| Prisma relations phức tạp (WorkspaceMember là bảng trung gian M:N) | Đọc kỹ Data Dictionary và Prisma docs, tham khảo code Phase 1+2 của Đạt |
| Chưa quen codebase NestJS ban đầu | Đọc code Phase 0, 1, 2, đọc code guide, hỏi Đạt khi vướng |
| Invite system phức tạp (token, expiry, status management) | Nghiên cứu trước crypto.randomBytes, đọc Workspace Suite Design Spec |
| Phong cách viết báo cáo chưa thống nhất | Theo report_writing_rule.md, review lại bài viết theo format chuẩn |
| Chưa quen Git workflow (branch, rebase) | Đọc hướng dẫn trong TASK_ASSIGNMENT.md, thực hành từng bước |

---

## 6. TỰ ĐÁNH GIÁ

### 6.1. Điểm mạnh
- Hoàn thành đúng tiến độ phần viết báo cáo (Chương 4 phần Controllers)
- Tích cực review và test API endpoints
- Chủ động nghiên cứu trước scope Phase 3 để chuẩn bị tốt cho giai đoạn code

### 6.2. Hạn chế
- Phase 3 mới bắt đầu code, chưa hoàn thành đầy đủ
- Cần thời gian làm quen với codebase và NestJS patterns
- Chưa viết test cases cho phần mình phụ trách

### 6.3. Mức hoàn thành
- Phần báo cáo: **85%** (Chương 4 Controllers xong, review xong)
- Phần code backend: **55%** (workspace module hoàn tất, invite flow đang tích hợp)
- Phần thiết kế: **100%** (Class Diagram + 11 Sequence Diagrams for core flows, review Data Dictionary)

---

<p align="right"><i>TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026</i></p>

<br/>

<p align="center"><b>Người viết báo cáo</b></p>
<p align="center">(Ký và ghi rõ họ tên)</p>

<br/><br/><br/>

<p align="center"><b>Nguyễn Hoàng Mai Vy</b></p>
