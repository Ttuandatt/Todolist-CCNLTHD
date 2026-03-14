# PHÂN CÔNG NHIỆM VỤ — TODOLIST COLLABORATION

> **Cập nhật:** 14/03/2026
> **Trạng thái hiện tại:** Phase 0 ✅ | Phase 1 ✅ | Phase 2 🔄 (Đạt đang làm)
> **Timeline còn lại:** ~4 tuần

---

## TỔNG QUAN PHÂN CÔNG

| Thành viên | Phase phụ trách | Trọng tâm |
|------------|-----------------|-----------|
| **Đạt** | Phase 0, 1, 2 (done/in-progress) + **Phase 3 (hỗ trợ Vy)** + Phase 10 + Technical Lead | Infrastructure, Auth, User, Dashboard/Search, Code Review |
| **Vy** | Phase 3 *(Đạt hỗ trợ)* | Workspace Module + Project Module + Label Module |
| **Phú** | Phase 4 + Phase 5 | Task Module + RBAC + Comments + Activity Log |
| **Huyền** | Phase 6 + Phase 7 | WebSocket + Notifications + File Attachments + Deployment |

---

## SƠ ĐỒ DEPENDENCY (phải làm theo thứ tự này)

```
Phase 0, 1, 2 (Đạt) ← NỀN TẢNG — phải xong trước
        ↓
Phase 3 (Vy) ← WorkspaceModule phải có trước khi ai làm Task/Comment
        ↓
Phase 4 + 5 (Phú) ← Task cần có Workspace + Project
        ↓
Phase 6 + 7 (Huyền) ← WebSocket cần có Task + Comment events
        ↓
Phase 10 (Đạt) ← Dashboard/Search cần tất cả modules
```

> **Quan trọng:** Vy phải hoàn thành `WorkspaceModule` + `ProjectModule` (CRUD cơ bản) trước khi Phú bắt đầu `TaskModule`.

---

---

# ĐẠT — Phase 2 (wrap up) + Phase 10 + Technical Lead

## Trạng thái: Phase 0 ✅ | Phase 1 ✅ | Phase 2 🔄

### Phase 2 — User Module (hoàn thiện)

**Việc còn lại:**
- [ ] Test lại toàn bộ 4 endpoints với Hoppscotch
- [ ] Xác nhận static file serve `/uploads/avatars/` hoạt động
- [ ] Viết code guide cho Phase 3, 4, 5 (template để Vy, Phú follow)

**Endpoints đã có:**
```
GET  /api/v1/users/me
PATCH /api/v1/users/me
POST /api/v1/users/me/change-password
POST /api/v1/users/me/avatar
```

---

### Phase 10 — Dashboard + Search

**Thực hiện sau khi Phú hoàn thành Phase 4 (Task Module)**

**Việc cần làm:**

**Backend:**
- [ ] `GET /api/v1/me/tasks` — tất cả tasks được assign cho mình (cross-workspace)
- [ ] `GET /api/v1/me/tasks?filter=today` — tasks due hôm nay
- [ ] `GET /api/v1/me/tasks?filter=overdue` — tasks quá hạn
- [ ] `GET /api/v1/projects/:id/tasks/search?q=keyword` — full-text search trong project
- [ ] Advanced filter: kết hợp `status + priority + assigneeId + labelIds + dueDate`

**Frontend:**
- [ ] Trang "My Tasks" — bảng tasks của mình, group theo workspace
- [ ] Dashboard widgets: overdue count, due today count, in-progress count
- [ ] Search bar + kết quả search real-time (debounce 300ms)
- [ ] Advanced filter panel (sidebar filter)

**Đạt được:**
- User có thể xem tất cả công việc của mình từ một chỗ
- Search tìm được task theo title/description trong vòng < 500ms
- Filter kết hợp nhiều điều kiện hoạt động đúng

---

### Hỗ trợ Vy — Phase 3: Workspace + Project Module

- [ ] Viết code guide Phase 3 (chuẩn format như Phase 1, 2) để Vy follow từng bước
- [ ] Pair-program với Vy ở các phần phức tạp: **invite system** (tạo token, xác thực token), **cascade delete** workspace
- [ ] Review code Vy viết trước khi tạo PR — chú ý: query `WorkspaceMember` đúng chưa, có bị lộ data không
- [ ] Hỗ trợ debug khi Vy gặp lỗi Prisma relations hoặc Guard

---

### Technical Lead — xuyên suốt dự án

- [ ] Viết code guide cho Phase 3 (Workspace) — Vy follow
- [ ] Viết code guide cho Phase 4 (Task) — Phú follow
- [ ] Review PR của Vy, Phú, Huyền trước khi merge vào `main`
- [ ] Giữ `Prisma schema` là nguồn sự thật — review mọi migration trước khi chạy
- [ ] Cập nhật `WORKLOG_NHOM.md` hàng tuần
- [ ] Frontend Auth UI (Login, Register pages — đã làm song song Phase 1)

---

---

# VY — Phase 3: Workspace + Project + Label Module

## Mục tiêu tổng quan

Xây dựng backbone của ứng dụng: **Workspace** là container lớn nhất, **Project** là nơi chứa tasks, **Label** là hệ thống nhãn dùng chung trong workspace. Đây là CRUD chuẩn nhất trong codebase — áp dụng trực tiếp kiến thức Controllers + Modules đã viết trong báo cáo.

## Điều kiện bắt đầu

- Phase 2 (User Module) đã xong: có `JwtAuthGuard`, `@CurrentUser()`, `PrismaService`
- Đọc code guide Phase 3 (Đạt viết)

---

## Công việc Backend

### Bước 1: WorkspaceModule (làm trước)

**Tạo các file:**
```
backend/src/modules/workspace/
├── workspace.module.ts
├── workspace.controller.ts
├── workspace.service.ts
└── dto/
    ├── create-workspace.dto.ts
    └── update-workspace.dto.ts
```

**Endpoints cần implement:**

| Method | Endpoint | Mô tả | Role yêu cầu |
|--------|----------|-------|-------------|
| GET | `/workspaces` | Danh sách workspace của mình | Any member |
| POST | `/workspaces` | Tạo workspace mới | Logged in |
| GET | `/workspaces/:id` | Chi tiết workspace (kèm members, projects) | Member |
| PATCH | `/workspaces/:id` | Sửa tên/mô tả | Owner, Admin |
| DELETE | `/workspaces/:id` | Xóa workspace (cascade delete toàn bộ) | Owner only |

**Invite System:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/workspaces/:id/invite` | Tạo invitation record + gửi email mock (log ra console) |
| POST | `/workspaces/accept-invite/:token` | Xác nhận lời mời, thêm vào `WorkspaceMember` |
| GET | `/workspaces/:id/members` | Danh sách thành viên |
| PATCH | `/workspaces/:id/members/:userId` | Đổi role (MEMBER ↔ ADMIN) |
| DELETE | `/workspaces/:id/members/:userId` | Kick member |
| DELETE | `/workspaces/:id/leave` | Tự rời workspace |

> **Lưu ý invite:** Chưa cần email thật — log token ra console là đủ cho MVP. Format: `[INVITE] Token: abc123 → newuser@email.com`

**Logic quan trọng:**
- Khi tạo workspace → tự động tạo `WorkspaceMember` record với role `OWNER`
- Khi xóa workspace → Prisma cascade xóa toàn bộ Projects, Tasks, Members
- `GET /workspaces` chỉ trả workspace mà user là thành viên (query qua `WorkspaceMember`)
- Invitation token: dùng `crypto.randomBytes(32).toString('hex')`, expire sau 7 ngày

---

### Bước 2: ProjectModule

**Tạo các file:**
```
backend/src/modules/project/
├── project.module.ts
├── project.controller.ts
├── project.service.ts
└── dto/
    ├── create-project.dto.ts
    └── update-project.dto.ts
```

**Endpoints:**

| Method | Endpoint | Mô tả | Role yêu cầu |
|--------|----------|-------|-------------|
| GET | `/workspaces/:workspaceId/projects` | List projects trong workspace | Member |
| POST | `/workspaces/:workspaceId/projects` | Tạo project | Member |
| GET | `/projects/:id` | Chi tiết project + task count theo status | Member |
| PATCH | `/projects/:id` | Sửa name, description, color | Member |
| DELETE | `/projects/:id` | Xóa project (cascade delete tasks) | Owner, Admin |
| POST | `/projects/:id/archive` | Archive project | Member |
| POST | `/projects/:id/unarchive` | Restore project | Member |

**Logic quan trọng:**
- Khi `GET /projects/:id` → include `taskCountByStatus`: đếm task theo từng status
- Check user có phải member của workspace không trước khi thao tác với project

---

### Bước 3: LabelModule

**Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/workspaces/:workspaceId/labels` | List labels của workspace |
| POST | `/workspaces/:workspaceId/labels` | Tạo label (name + color hex) |
| PATCH | `/labels/:id` | Sửa label |
| DELETE | `/labels/:id` | Xóa label |

---

## Công việc Frontend

**Stack:** React + TypeScript + Zustand + React Query

- [ ] **Layout chính:** Sidebar trái (workspace list + project list), Header (user avatar, notifications bell)
- [ ] **Workspace Switcher:** Dropdown đổi workspace, hiển thị tên + role của mình
- [ ] **Trang Workspace Settings:** Hiển thị members, invite member, đổi role, kick
- [ ] **Trang Projects:** List tất cả projects trong workspace, tạo project mới
- [ ] **Label Manager:** Modal quản lý labels trong workspace settings

---

## Đạt được khi hoàn thành Phase 3

- [ ] `POST /workspaces` tạo được workspace, tự thành OWNER
- [ ] `POST /workspaces/:id/invite` tạo invitation, log token ra console
- [ ] `POST /workspaces/accept-invite/:token` join workspace thành công
- [ ] `PATCH /workspaces/:id/members/:userId` đổi role hoạt động
- [ ] `POST /workspaces/:workspaceId/projects` tạo project trong workspace
- [ ] `GET /projects/:id` trả `taskCountByStatus` (dù tất cả = 0 lúc này)
- [ ] Toàn bộ endpoints trả lỗi 403 khi user không có đủ quyền
- [ ] Test được trên Hoppscotch với ít nhất 2 user accounts

---

---

# PHÚ — Phase 4 + 5: Task Module + RBAC + Comments + Activity Log

## Mục tiêu tổng quan

Phase 4 xây **core của ứng dụng** — Task là thực thể được thao tác nhiều nhất. Phase 5 thêm lớp **collaboration** và **security** — RBAC guard, comments, và activity log. Phú đã viết sâu về Guards/JWT trong báo cáo → đây là phần áp dụng thực tế trực tiếp.

## Điều kiện bắt đầu

- Vy đã hoàn thành `WorkspaceModule` + `ProjectModule` (CRUD cơ bản)
- Có `WorkspaceMember` table với `role` field
- Đọc code guide Phase 4 (Đạt viết)

---

## Công việc Backend — Phase 4: Task Module

### Bước 1: TaskModule CRUD

**Tạo các file:**
```
backend/src/modules/task/
├── task.module.ts
├── task.controller.ts
├── task.service.ts
└── dto/
    ├── create-task.dto.ts
    ├── update-task.dto.ts
    └── filter-task.dto.ts
```

**Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/projects/:projectId/tasks` | List tasks với filter + sort + pagination |
| POST | `/projects/:projectId/tasks` | Tạo task mới |
| GET | `/tasks/:id` | Chi tiết task (kèm subtasks, assignees, labels, comments count) |
| PATCH | `/tasks/:id` | Cập nhật bất kỳ field nào |
| DELETE | `/tasks/:id` | Xóa task (cascade xóa subtasks) |
| PATCH | `/tasks/:id/status` | Chuyển status: TODO → IN_PROGRESS → REVIEW → DONE |
| POST | `/tasks/:id/assign` | Assign member vào task |
| DELETE | `/tasks/:id/assign/:userId` | Unassign member |
| POST | `/tasks/:id/labels` | Gắn label vào task |
| DELETE | `/tasks/:id/labels/:labelId` | Gỡ label |

**Subtasks:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/tasks/:id/subtasks` | Tạo subtask (parent_id = taskId) |
| PATCH | `/tasks/:subtaskId/complete` | Toggle complete subtask |

**Query params cho `GET /projects/:projectId/tasks`:**
```
?status=TODO,IN_PROGRESS
?priority=HIGH,URGENT
?assigneeId=uuid
?labelIds=uuid1,uuid2
?dueDate=overdue|today|week|none
?sortBy=createdAt|dueDate|priority|position
?sortOrder=asc|desc
?page=1&limit=20
?search=keyword  (search title)
```

**Logic quan trọng:**
- `position` field: dùng float (ví dụ: 1.0, 2.0, 3.0) để dễ reorder khi drag-drop sau này
- Khi tạo task → `position` = max(position) + 1 trong project đó
- Subtask: `parent_id` trỏ vào task cha, không cho phép nested quá 1 cấp
- `GET /tasks/:id` phải include: `subtasks[]`, `assignees[]`, `labels[]`, `_count.comments`

---

### Bước 2: RBAC Guard — Phase 5 (làm trước Comments)

**Tạo:**
```
backend/src/common/guards/
├── workspace-role.guard.ts
└── workspace-member.guard.ts

backend/src/common/decorators/
└── require-role.decorator.ts
```

**Permission matrix:**

| Action | Owner | Admin | Member | Viewer |
|--------|-------|-------|--------|--------|
| Xem workspace, projects, tasks | ✅ | ✅ | ✅ | ✅ |
| Tạo/sửa task, comment | ✅ | ✅ | ✅ | ❌ |
| Xóa task của người khác | ✅ | ✅ | ❌ | ❌ |
| Sửa/xóa project | ✅ | ✅ | ❌ | ❌ |
| Mời/kick member | ✅ | ✅ | ❌ | ❌ |
| Đổi role member | ✅ | ❌ | ❌ | ❌ |
| Xóa workspace | ✅ | ❌ | ❌ | ❌ |

**Cách dùng (sau khi viết xong):**
```typescript
@UseGuards(JwtAuthGuard, WorkspaceRoleGuard)
@RequireRole('ADMIN')  // minimum role
async deleteProject() { ... }
```

**Áp dụng guard vào:**
- Tất cả endpoints của Task (đã viết ở bước 1)
- Thông báo Vy để áp dụng vào Workspace + Project endpoints

---

### Bước 3: Comment Module

**Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/tasks/:taskId/comments` | List comments (có pagination) |
| POST | `/tasks/:taskId/comments` | Thêm comment |
| PATCH | `/comments/:id` | Sửa comment (chỉ author) |
| DELETE | `/comments/:id` | Xóa comment (author hoặc Admin/Owner) |

**Logic:**
- Mention: detect `@username` trong content → extract user IDs → dùng cho notification (Huyền sẽ dùng sau)
- `updatedAt` phải khác `createdAt` → hiển thị "(edited)" trên UI

---

### Bước 4: Activity Log

**Tạo:**
```
backend/src/modules/activity/
├── activity.module.ts
└── activity.service.ts  (không cần controller riêng)
```

**Tự động ghi log khi:**
- Task được tạo / xóa / cập nhật status / assign / unassign
- Comment được thêm / xóa
- Member được thêm / kick khỏi workspace
- Project được tạo / archive

**Endpoint:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/workspaces/:id/activities` | Lịch sử hoạt động, sort theo thời gian mới nhất |

**Format record:**
```json
{
  "action": "TASK_STATUS_CHANGED",
  "entityType": "TASK",
  "entityId": "uuid",
  "actorId": "uuid",
  "metadata": {
    "from": "TODO",
    "to": "IN_PROGRESS",
    "taskTitle": "Fix login bug"
  }
}
```

---

## Công việc Frontend — Phase 4+5

- [ ] **Task List View:** Bảng tasks trong project, hiển thị title, status, priority, assignee, due date
- [ ] **Task Detail Modal/Page:** Mở ra khi click task — xem subtasks, comments, attachments, activity
- [ ] **Kanban Board View:** Cột theo status (TODO | IN_PROGRESS | REVIEW | DONE), kéo thả task giữa các cột dùng [dnd-kit](https://dndkit.com/)
- [ ] **Task Create/Edit Form:** Modal tạo/sửa task với đầy đủ fields
- [ ] **Comment Section:** List comments + form thêm comment trong Task Detail
- [ ] **Label Selector:** Chọn labels khi tạo/sửa task

---

## Đạt được khi hoàn thành Phase 4 + 5

- [ ] `POST /projects/:id/tasks` tạo task, tự động set `position`
- [ ] `GET /projects/:id/tasks?status=TODO&priority=HIGH` filter đúng
- [ ] `PATCH /tasks/:id/status` chuyển status hoạt động
- [ ] `POST /tasks/:id/subtasks` tạo subtask, `PATCH /tasks/:subtaskId/complete` toggle
- [ ] `WorkspaceRoleGuard` reject 403 khi user không đủ role
- [ ] `POST /tasks/:id/comments` thêm comment, `PATCH /comments/:id` chỉ author mới sửa được
- [ ] `GET /workspaces/:id/activities` trả lịch sử hoạt động đúng thứ tự
- [ ] Kanban board kéo thả được giữa các cột, `position` update đúng sau khi drop

---

---

# HUYỀN — Phase 6 + 7: WebSocket + Notifications + File Upload + Deployment

## Mục tiêu tổng quan

Phase 6+7 là phần **showcase kỹ thuật đặc trưng NestJS** nhất — WebSocket Gateway là điểm khác biệt lớn so với Express. Huyền đã viết Ch3 (môi trường, Docker) và Ch6 (Pipes, Request Lifecycle) — đây là lúc áp dụng thực tế phần setup + xây thêm real-time và notifications.

## Điều kiện bắt đầu

- Phú đã hoàn thành Task Module + Comment Module
- Biết events nào cần emit (task update, comment, notification)

---

## Công việc Backend — Phase 6: WebSocket Gateway

### Bước 1: Setup WebSocket

**Cài package:**
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

**Tạo:**
```
backend/src/modules/events/
├── events.module.ts
├── events.gateway.ts
└── events.service.ts
```

**Room strategy:**
```
workspace:{workspaceId}   → broadcast khi có member join/leave, project thay đổi
project:{projectId}       → broadcast khi task thay đổi trong project
task:{taskId}             → broadcast khi có comment mới trong task
user:{userId}             → gửi notification riêng tư cho 1 user
```

**Events cần emit:**

| Event name | Trigger khi | Payload |
|------------|-------------|---------|
| `task:created` | Task mới được tạo | `{ task, projectId }` |
| `task:updated` | Task được sửa (status, assign, priority...) | `{ taskId, changes }` |
| `task:deleted` | Task bị xóa | `{ taskId, projectId }` |
| `comment:created` | Comment mới | `{ comment, taskId }` |
| `member:joined` | Member accept invite | `{ user, workspaceId }` |
| `notification:new` | Notification mới cho user | `{ notification }` |

**WebSocket Authentication:**
- Client gửi JWT trong `auth.token` khi connect
- Gateway verify token → lấy userId → join room `user:{userId}`
- Reject connection nếu token invalid

**Cách emit từ Service khác (ví dụ TaskService):**
```typescript
// TaskService inject EventsGateway và gọi:
this.eventsGateway.emitToProject(projectId, 'task:updated', payload)
```

---

## Công việc Backend — Phase 7: Notifications + File Upload

### Bước 2: Notification Module

**Tạo:**
```
backend/src/modules/notification/
├── notification.module.ts
├── notification.controller.ts
├── notification.service.ts
└── dto/create-notification.dto.ts
```

**Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/notifications` | List notifications của mình (paginated) |
| PATCH | `/notifications/:id/read` | Đánh dấu đã đọc |
| PATCH | `/notifications/read-all` | Đánh dấu tất cả đã đọc |
| GET | `/notifications/unread-count` | Số notification chưa đọc |
| PATCH | `/notifications/preferences` | Bật/tắt từng loại notification |

**Các trigger tạo notification:**

| Loại | Khi nào | Người nhận |
|------|---------|------------|
| `TASK_ASSIGNED` | Task được assign | Người được assign |
| `TASK_COMMENTED` | Comment mới trong task | Assignees + task creator |
| `MENTIONED` | Bị @mention trong comment | Người bị mention |
| `DUE_DATE_REMINDER` | 1 ngày trước due date | Assignees của task |
| `WORKSPACE_INVITE` | Được mời vào workspace | Người được mời |

**Due Date Reminder — Bull Queue:**

```bash
npm install @nestjs/bull bull
npm install -D @types/bull
```

- Setup `BullModule` với Redis
- Tạo `ReminderProcessor` — chạy cron mỗi ngày lúc 8:00 sáng
- Query tất cả tasks có `dueDate = tomorrow` + có assignees → tạo notification
- Emit `notification:new` qua WebSocket cho từng assignee

---

### Bước 3: File Attachment Module

> Multer pattern đã có từ Phase 2 (avatar upload) — reuse và mở rộng

**Endpoints:**

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/tasks/:taskId/attachments` | Upload file (max 10MB, multipart/form-data) |
| GET | `/tasks/:taskId/attachments` | List attachments của task |
| DELETE | `/attachments/:id` | Xóa attachment (chỉ uploader hoặc Admin) |

**Allowed file types:** image/*, application/pdf, .doc, .docx, .xls, .xlsx, .zip, .txt

**Storage:** Lưu vào `uploads/attachments/` trong dev (giống avatar)

---

## Công việc Frontend — Phase 6+7

- [ ] **Socket.io client setup:** Kết nối khi login, disconnect khi logout
- [ ] **Real-time updates:** Khi nhận `task:updated` → update Zustand store → UI tự re-render không cần refresh
- [ ] **Notification Bell:** Icon ở header, hiển thị badge số unread, dropdown list notifications
- [ ] **Notification Item:** Click vào → navigate đến task liên quan + mark as read
- [ ] **File Upload UI:** Drag & drop hoặc click to upload trong Task Detail, hiển thị progress bar, list files đã upload

---

## Công việc DevOps

**Docker Compose hoàn chỉnh (`docker-compose.yml` ở root):**
```yaml
services:
  backend:    NestJS app (build từ Dockerfile)
  frontend:   React app (build từ Dockerfile)
  postgres:   PostgreSQL 15
  redis:      Redis 7 (cho Bull queue)
```

- [ ] `Dockerfile` cho backend (multi-stage build: build → production)
- [ ] `Dockerfile` cho frontend (build React → serve với nginx)
- [ ] `.env.example` đầy đủ tất cả biến môi trường
- [ ] Viết hướng dẫn deploy 1 lệnh: `docker-compose up --build`

---

## Đạt được khi hoàn thành Phase 6 + 7

- [ ] Client connect WebSocket với JWT thành công
- [ ] Khi User A đổi status task → User B (cùng project) thấy cập nhật ngay, không cần F5
- [ ] Khi User A comment → User B nhận notification mới trong vòng < 1 giây
- [ ] `POST /tasks/:id/attachments` upload file 10MB thành công
- [ ] `GET /notifications/unread-count` trả đúng số notification chưa đọc
- [ ] Due date reminder job chạy đúng giờ, tạo notification cho đúng assignees
- [ ] `docker-compose up --build` chạy được toàn bộ stack (backend + frontend + db + redis)

---

---

# QUY TRÌNH LÀM VIỆC NHÓM

## Git Workflow

### Cấu trúc nhánh

```
main
 └── develop
      ├── feature/vy-workspace-module
      ├── feature/vy-project-module
      ├── feature/vy-label-module
      ├── feature/phu-task-module
      ├── feature/phu-rbac-guard
      ├── feature/phu-comments
      ├── feature/phu-activity-log
      ├── feature/huyen-websocket
      ├── feature/huyen-notifications
      ├── feature/huyen-file-upload
      └── feature/dat-dashboard-search
```

| Nhánh | Mục đích | Ai được merge vào |
|-------|----------|------------------|
| `main` | Code production-ready, đã test | Chỉ Đạt merge từ `develop` |
| `develop` | Integration — nơi các feature gặp nhau | Merge từ `feature/*` sau khi Đạt approve PR |
| `feature/*` | Từng tính năng cụ thể | Người phụ trách tự làm |

---

### Lần đầu clone repo (mỗi thành viên làm 1 lần)

```bash
# 1. Clone repo về máy
git clone <repo-url>
cd CCNLTHD

# 2. Chuyển sang develop (không bao giờ làm việc trực tiếp trên main)
git checkout develop

# 3. Kiểm tra đang ở đúng nhánh chưa
git branch
# Kết quả phải thấy: * develop
```

---

### Bắt đầu làm tính năng mới

```bash
# 1. Luôn pull develop mới nhất trước khi tạo nhánh
git checkout develop
git pull origin develop

# 2. Tạo nhánh feature từ develop
git checkout -b feature/ten-branch

# Ví dụ cụ thể:
git checkout -b feature/vy-workspace-module
git checkout -b feature/phu-task-module
git checkout -b feature/huyen-websocket
```

---

### Trong lúc làm việc — commit thường xuyên

```bash
# Xem trạng thái hiện tại
git status

# Stage file cụ thể (khuyến nghị — không dùng git add .)
git add src/modules/workspace/workspace.service.ts
git add src/modules/workspace/workspace.controller.ts
git add src/modules/workspace/dto/

# Hoặc stage toàn bộ thay đổi trong thư mục module
git add src/modules/workspace/

# Commit với message rõ ràng
git commit -m "feat: implement workspace CRUD endpoints"

# Push nhánh lên remote lần đầu
git push -u origin feature/vy-workspace-module

# Push các lần sau (đã có tracking)
git push
```

---

### Cập nhật code mới nhất từ develop vào nhánh đang làm

> Làm điều này **mỗi ngày** hoặc trước khi tạo PR — tránh conflict lớn

```bash
# Đang ở nhánh feature của mình, muốn lấy code mới từ develop
git fetch origin
git rebase origin/develop

# Nếu có conflict:
# 1. Mở file bị conflict, sửa tay phần <<<<<< ======= >>>>>>>
# 2. Stage file đã sửa
git add <file-da-sua>
# 3. Tiếp tục rebase
git rebase --continue

# Sau khi rebase, push phải dùng --force-with-lease (an toàn hơn --force)
git push --force-with-lease
```

---

### Hoàn thành tính năng — tạo Pull Request

```bash
# 1. Đảm bảo code sạch và đã test
npm run start:dev   # không có lỗi

# 2. Pull develop mới nhất, rebase lần cuối
git fetch origin
git rebase origin/develop

# 3. Push lên remote
git push

# 4. Lên GitHub → New Pull Request
#    - Base: develop  ←  Compare: feature/ten-branch
#    - Title: rõ ràng, ví dụ: "feat: Workspace Module (CRUD + Invite System)"
#    - Assign reviewer: Đạt
#    - Mô tả: liệt kê endpoints đã làm, cách test
```

---

### Sau khi PR được approve và merge

```bash
# Quay về develop, pull code mới (đã có feature của mình)
git checkout develop
git pull origin develop

# Xóa nhánh feature cũ (không cần nữa)
git branch -d feature/vy-workspace-module

# Tạo nhánh mới cho feature tiếp theo
git checkout -b feature/vy-project-module
```

---

### Tình huống: đang làm dở, cần lấy code mới của người khác gấp

```bash
# Lưu tạm công việc đang làm (chưa commit)
git stash

# Pull/rebase
git fetch origin
git rebase origin/develop

# Lấy lại công việc đang làm
git stash pop
```

---

### Các lệnh kiểm tra thường dùng

```bash
# Xem đang ở nhánh nào, trạng thái file
git status

# Xem lịch sử commit gọn
git log --oneline -10

# Xem tất cả nhánh (local + remote)
git branch -a

# Xem thay đổi chưa stage
git diff

# Xem thay đổi đã stage (chuẩn bị commit)
git diff --staged

# Hủy thay đổi 1 file chưa stage (cẩn thận — không khôi phục được)
git checkout -- <tên-file>
```

---

## Commit Convention

**Format:** `<type>: <mô tả ngắn>`

| Type | Dùng khi |
|------|---------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `refactor` | Refactor code, không thêm tính năng hay sửa bug |
| `test` | Thêm/sửa test |
| `docs` | Cập nhật tài liệu |
| `chore` | Cài package, config, không liên quan logic |

**Ví dụ:**
```bash
git commit -m "feat: implement workspace CRUD endpoints"
git commit -m "feat: add invite member system with token"
git commit -m "feat: add WorkspaceRoleGuard"
git commit -m "fix: task position not updating after drag"
git commit -m "fix: cascade delete not working on workspace remove"
git commit -m "refactor: extract workspace permission check to service"
git commit -m "chore: install @nestjs/websockets socket.io"
git commit -m "test: add workspace service unit tests"
```

**Quy tắc:**
- Dùng tiếng Anh, động từ nguyên thể (`implement`, `add`, `fix` — không phải `implemented`, `added`)
- Mô tả đủ để đọc 6 tháng sau vẫn hiểu
- 1 commit = 1 việc — không nhét nhiều thứ không liên quan vào cùng commit

---

## Checklist trước khi tạo PR

- [ ] Code chạy được (`npm run start:dev` không có lỗi)
- [ ] Đã test tất cả endpoints liên quan bằng Hoppscotch/Swagger
- [ ] Không có `console.log` debug còn sót (trừ invite token log)
- [ ] DTO có đầy đủ validation decorators (`@IsString()`, `@IsEmail()`...)
- [ ] Prisma migration đã chạy (`npx prisma migrate dev`) và không conflict
- [ ] Đã rebase với `develop` mới nhất trước khi push PR

---

## Timeline ước tính

| Tuần | Vy | Phú | Huyền | Đạt |
|------|----|-----|-------|-----|
| **Tuần 6** *(hiện tại)* | Phase 3: WorkspaceModule *(Đạt hỗ trợ)* | Đọc code Vy, chuẩn bị Task DTOs | Setup Redis + Bull locally | Wrap up Phase 2, viết code guide Phase 3, pair-program với Vy |
| Tuần 7 | Phase 3: ProjectModule + LabelModule | Phase 4: Task CRUD + Subtask | Phase 6: WebSocket Gateway | Review PR Vy, viết code guide Phase 5 |
| Tuần 8 | Frontend: Workspace/Project UI | Phase 5: RBAC + Comments + ActivityLog | Phase 7: Notifications + File Upload | Phase 10: Dashboard + Search |
| Tuần 9 | Frontend: UI polish | Frontend: Kanban + Task UI | Frontend: Realtime sync + Notification UI + Docker | Integration test + Bug fix |

---

## Liên hệ khi bị block

- **Prisma schema thay đổi** → báo Đạt trước khi chạy migration
- **Không hiểu endpoint cần trả gì** → xem [docs/PRD/14-API_SPECIFICATION.md](PRD/14-API_SPECIFICATION.md)
- **Không biết field nào trong DB** → xem [docs/PRD/06-ERD.md](PRD/06-ERD.md) và [docs/PRD/07-DATA_DICTIONARY.md](PRD/07-DATA_DICTIONARY.md)
- **Muốn emit WebSocket event từ service của mình** → hỏi Huyền sau khi Phase 6 xong
