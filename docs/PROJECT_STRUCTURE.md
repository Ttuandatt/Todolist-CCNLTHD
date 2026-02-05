# PROJECT STRUCTURE - TODOLIST COLLABORATION API
## Cấu trúc dự án và Checkpoints

> **Phiên bản:** 1.0  
> **Ngày tạo:** 03/02/2026  
> **Tech Stack:** NestJS + Prisma + PostgreSQL + JWT

---

## 📁 CẤU TRÚC THƯ MỤC

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (13 entities)
│   └── migrations/            # Migration files
│
├── src/
│   ├── main.ts                # Entry point
│   ├── app.module.ts          # Root module
│   │
│   ├── prisma/                # Prisma Module (Database Connection)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── auth/                  # Authentication Module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── users/                 # Users Module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── update-profile.dto.ts
│   │       └── change-password.dto.ts
│   │
│   ├── workspaces/            # Workspaces Module
│   │   ├── workspaces.module.ts
│   │   ├── workspaces.controller.ts
│   │   ├── workspaces.service.ts
│   │   ├── members/
│   │   │   ├── members.controller.ts
│   │   │   └── members.service.ts
│   │   └── dto/
│   │       ├── create-workspace.dto.ts
│   │       ├── update-workspace.dto.ts
│   │       └── invite-member.dto.ts
│   │
│   ├── projects/              # Projects Module
│   │   ├── projects.module.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── dto/
│   │       ├── create-project.dto.ts
│   │       └── update-project.dto.ts
│   │
│   ├── tasks/                 # Tasks Module (Core)
│   │   ├── tasks.module.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── subtasks/
│   │   │   ├── subtasks.controller.ts
│   │   │   └── subtasks.service.ts
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       └── update-task-status.dto.ts
│   │
│   ├── comments/              # Comments Module
│   │   ├── comments.module.ts
│   │   ├── comments.controller.ts
│   │   ├── comments.service.ts
│   │   └── dto/
│   │       ├── create-comment.dto.ts
│   │       └── update-comment.dto.ts
│   │
│   ├── labels/                # Labels Module
│   │   ├── labels.module.ts
│   │   ├── labels.controller.ts
│   │   ├── labels.service.ts
│   │   └── dto/
│   │       └── create-label.dto.ts
│   │
│   ├── notifications/         # Notifications Module
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   └── notifications.service.ts
│   │
│   └── common/                # Shared utilities
│       ├── decorators/
│       │   └── current-user.decorator.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── interceptors/
│           └── transform.interceptor.ts
│
├── test/                      # Test files
├── .env                       # Environment variables
├── docker-compose.yml         # Docker config
└── package.json
```

---

## 🔧 MODULES & CHECKPOINTS

### 1. PRISMA MODULE (Database Connection)

**Mục đích:** Cung cấp PrismaService dùng chung cho toàn app

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| 1.1 | PrismaService extends PrismaClient | Service kế thừa từ generated client | ⬜ |
| 1.2 | onModuleInit: connect database | Kết nối DB khi app khởi động | ⬜ |
| 1.3 | onModuleDestroy: disconnect | Ngắt kết nối khi app shutdown | ⬜ |
| 1.4 | @Global() decorator | Module available toàn app | ⬜ |
| 1.5 | Export PrismaService | Cho phép inject vào modules khác | ⬜ |

---

### 2. AUTH MODULE (Authentication)

**Mục đích:** Xác thực người dùng, quản lý JWT tokens

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| **Register** | | | |
| 2.1 | POST /auth/register | Endpoint đăng ký | ⬜ |
| 2.2 | Validate email format | Email phải đúng định dạng | ⬜ |
| 2.3 | Validate password strength | Min 8 ký tự, có chữ + số | ⬜ |
| 2.4 | Check email unique | Trả về lỗi nếu email đã tồn tại | ⬜ |
| 2.5 | Hash password với bcrypt | Không lưu plain text password | ⬜ |
| 2.6 | Trả về user + tokens | accessToken + refreshToken | ⬜ |
| **Login** | | | |
| 2.7 | POST /auth/login | Endpoint đăng nhập | ⬜ |
| 2.8 | Verify email exists | Trả về lỗi chung (không leak info) | ⬜ |
| 2.9 | Verify password với bcrypt | So sánh hash | ⬜ |
| 2.10 | Update lastLoginAt | Ghi nhận thời gian đăng nhập | ⬜ |
| 2.11 | Trả về user + tokens | accessToken + refreshToken | ⬜ |
| **JWT** | | | |
| 2.12 | JwtStrategy | Extract + validate token | ⬜ |
| 2.13 | JwtAuthGuard | Guard bảo vệ routes | ⬜ |
| 2.14 | Access token 15m | Thời hạn ngắn cho bảo mật | ⬜ |
| 2.15 | Refresh token 7d | Thời hạn dài hơn | ⬜ |
| **Error Handling** | | | |
| 2.16 | ConflictException khi email trùng | HTTP 409 | ⬜ |
| 2.17 | UnauthorizedException khi sai password | HTTP 401 | ⬜ |
| 2.18 | BadRequestException khi validation fail | HTTP 400 | ⬜ |

---

### 3. USERS MODULE (User Management)

**Mục đích:** Quản lý thông tin người dùng

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| **Get Profile** | | | |
| 3.1 | GET /users/me | Lấy thông tin user hiện tại | ⬜ |
| 3.2 | Protected route (JwtAuthGuard) | Yêu cầu token | ⬜ |
| 3.3 | Không trả về password | Select specific fields | ⬜ |
| **Update Profile** | | | |
| 3.4 | PATCH /users/me | Cập nhật name, avatar | ⬜ |
| 3.5 | Validate input với DTO | MaxLength, IsOptional | ⬜ |
| 3.6 | Chỉ update user hiện tại | Dùng req.user.id | ⬜ |
| **Change Password** | | | |
| 3.7 | PATCH /users/password | Đổi mật khẩu | ⬜ |
| 3.8 | Verify current password | So sánh với password cũ | ⬜ |
| 3.9 | Validate new password strength | Min 8 ký tự, có chữ + số | ⬜ |
| 3.10 | Hash new password | Lưu hash mới | ⬜ |
| 3.11 | BadRequestException nếu sai password cũ | HTTP 400 | ⬜ |

---

### 4. WORKSPACES MODULE (Workspace Management)

**Mục đích:** Quản lý không gian làm việc nhóm

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| **CRUD Workspace** | | | |
| 4.1 | POST /workspaces | Tạo workspace mới | ⬜ |
| 4.2 | User tạo tự động là OWNER | Gán role OWNER | ⬜ |
| 4.3 | GET /workspaces | Lấy danh sách workspaces của user | ⬜ |
| 4.4 | GET /workspaces/:id | Xem chi tiết workspace | ⬜ |
| 4.5 | PATCH /workspaces/:id | Cập nhật (OWNER/ADMIN only) | ⬜ |
| 4.6 | DELETE /workspaces/:id | Xóa workspace (OWNER only) | ⬜ |
| **Members Management** | | | |
| 4.7 | POST /workspaces/:id/members/invite | Mời thành viên | ⬜ |
| 4.8 | GET /workspaces/:id/members | Danh sách thành viên | ⬜ |
| 4.9 | PATCH /workspaces/:id/members/:userId | Đổi role (OWNER only) | ⬜ |
| 4.10 | DELETE /workspaces/:id/members/:userId | Xóa thành viên | ⬜ |
| 4.11 | POST /workspaces/:id/leave | Rời workspace | ⬜ |
| **Authorization** | | | |
| 4.12 | Kiểm tra user là member | Không cho phép người ngoài | ⬜ |
| 4.13 | Kiểm tra role cho actions | OWNER > ADMIN > MEMBER | ⬜ |
| 4.14 | ForbiddenException khi không đủ quyền | HTTP 403 | ⬜ |

---

### 5. PROJECTS MODULE (Project Management)

**Mục đích:** Quản lý dự án trong workspace

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| **CRUD Project** | | | |
| 5.1 | POST /projects | Tạo project trong workspace | ⬜ |
| 5.2 | Validate workspaceId | User phải là member | ⬜ |
| 5.3 | GET /workspaces/:workspaceId/projects | Danh sách projects | ⬜ |
| 5.4 | GET /projects/:id | Chi tiết project | ⬜ |
| 5.5 | PATCH /projects/:id | Cập nhật project | ⬜ |
| 5.6 | DELETE /projects/:id | Xóa project (OWNER/ADMIN) | ⬜ |
| **Features** | | | |
| 5.7 | PATCH /projects/:id/archive | Lưu trữ project | ⬜ |
| 5.8 | PATCH /projects/:id/restore | Khôi phục project | ⬜ |
| 5.9 | PATCH /projects/:id/pin | Ghim project | ⬜ |
| 5.10 | Filter by status (ACTIVE/ARCHIVED) | Query param | ⬜ |

---

### 6. TASKS MODULE ⭐ (Core Feature)

**Mục đích:** Quản lý công việc - tính năng chính của ứng dụng

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| **CRUD Task** | | | |
| 6.1 | POST /tasks | Tạo task trong project | ⬜ |
| 6.2 | Default status = TODO | Trạng thái mặc định | ⬜ |
| 6.3 | GET /projects/:projectId/tasks | Danh sách tasks | ⬜ |
| 6.4 | GET /tasks/:id | Chi tiết task | ⬜ |
| 6.5 | PATCH /tasks/:id | Cập nhật task | ⬜ |
| 6.6 | DELETE /tasks/:id | Xóa task | ⬜ |
| **Status Management** | | | |
| 6.7 | PATCH /tasks/:id/status | Đổi trạng thái | ⬜ |
| 6.8 | Validate status enum | TODO, IN_PROGRESS, REVIEW, DONE | ⬜ |
| 6.9 | Set completedAt khi DONE | Auto-set timestamp | ⬜ |
| **Assignment** | | | |
| 6.10 | POST /tasks/:id/assignees | Gán user vào task | ⬜ |
| 6.11 | DELETE /tasks/:id/assignees/:userId | Hủy gán | ⬜ |
| 6.12 | Chỉ gán members trong workspace | Validate user | ⬜ |
| **Subtasks** | | | |
| 6.13 | POST /tasks/:id/subtasks | Tạo subtask | ⬜ |
| 6.14 | PATCH /subtasks/:id | Toggle completed | ⬜ |
| 6.15 | DELETE /subtasks/:id | Xóa subtask | ⬜ |
| **Labels** | | | |
| 6.16 | POST /tasks/:id/labels | Gán label | ⬜ |
| 6.17 | DELETE /tasks/:id/labels/:labelId | Gỡ label | ⬜ |
| **Filtering & Sorting** | | | |
| 6.18 | Filter by status | ?status=TODO | ⬜ |
| 6.19 | Filter by assignee | ?assigneeId=xxx | ⬜ |
| 6.20 | Filter by priority | ?priority=HIGH | ⬜ |
| 6.21 | Sort by dueDate | ?sort=dueDate:asc | ⬜ |
| 6.22 | Pagination | ?page=1&limit=20 | ⬜ |

---

### 7. COMMENTS MODULE

**Mục đích:** Quản lý bình luận trên tasks

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| 7.1 | POST /tasks/:taskId/comments | Thêm comment | ⬜ |
| 7.2 | GET /tasks/:taskId/comments | Danh sách comments | ⬜ |
| 7.3 | PATCH /comments/:id | Sửa comment (author only) | ⬜ |
| 7.4 | DELETE /comments/:id | Xóa comment | ⬜ |
| 7.5 | Reply comment (parentId) | Comment con | ⬜ |
| 7.6 | Set isEdited = true khi sửa | Đánh dấu đã edit | ⬜ |

---

### 8. LABELS MODULE

**Mục đích:** Quản lý nhãn phân loại (workspace-level)

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| 8.1 | POST /workspaces/:id/labels | Tạo label | ⬜ |
| 8.2 | GET /workspaces/:id/labels | Danh sách labels | ⬜ |
| 8.3 | PATCH /labels/:id | Cập nhật name, color | ⬜ |
| 8.4 | DELETE /labels/:id | Xóa label | ⬜ |
| 8.5 | Unique name trong workspace | Validation | ⬜ |

---

### 9. NOTIFICATIONS MODULE

**Mục đích:** Quản lý thông báo

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| 9.1 | GET /notifications | Danh sách thông báo của user | ⬜ |
| 9.2 | PATCH /notifications/:id/read | Đánh dấu đã đọc | ⬜ |
| 9.3 | PATCH /notifications/read-all | Đánh dấu tất cả đã đọc | ⬜ |
| 9.4 | GET /notifications/unread-count | Số thông báo chưa đọc | ⬜ |
| **Auto-create notifications:** | | | |
| 9.5 | Khi được gán task | TASK_ASSIGNED | ⬜ |
| 9.6 | Khi có comment mới | COMMENT_ADDED | ⬜ |
| 9.7 | Khi được @mention | MENTIONED | ⬜ |
| 9.8 | Khi task sắp đến hạn | TASK_DUE_SOON | ⬜ |

---

### 10. COMMON MODULE (Shared Utilities)

**Mục đích:** Các utilities dùng chung

| # | Checkpoint | Mô tả | Trạng thái |
|---|------------|-------|------------|
| 10.1 | @CurrentUser() decorator | Lấy user từ request | ⬜ |
| 10.2 | HttpExceptionFilter | Format error response | ⬜ |
| 10.3 | TransformInterceptor | Format success response | ⬜ |
| 10.4 | Logging interceptor | Log requests | ⬜ |

---

## 📊 TỔNG KẾT

| Module | Số Checkpoints | Priority |
|--------|----------------|----------|
| Prisma | 5 | ⭐⭐⭐⭐⭐ |
| Auth | 18 | ⭐⭐⭐⭐⭐ |
| Users | 11 | ⭐⭐⭐⭐ |
| Workspaces | 14 | ⭐⭐⭐⭐ |
| Projects | 10 | ⭐⭐⭐ |
| **Tasks** | **22** | ⭐⭐⭐⭐⭐ |
| Comments | 6 | ⭐⭐⭐ |
| Labels | 5 | ⭐⭐ |
| Notifications | 8 | ⭐⭐⭐ |
| Common | 4 | ⭐⭐⭐ |
| **TỔNG** | **103** | |

---

## 🚀 THỨ TỰ TRIỂN KHAI ĐỀ XUẤT

```
Phase 1: Foundation
├── 1. Prisma Module        (Database connection)
├── 2. Common Module        (Shared utilities)
└── 3. Auth Module          (Authentication)

Phase 2: Core Features
├── 4. Users Module         (User management)
├── 5. Workspaces Module    (Workspace CRUD + Members)
├── 6. Projects Module      (Project CRUD)
└── 7. Labels Module        (Label management)

Phase 3: Main Feature
├── 8. Tasks Module         (Core feature)
│   ├── 8.1 Basic CRUD
│   ├── 8.2 Status Management
│   ├── 8.3 Assignment
│   ├── 8.4 Subtasks
│   └── 8.5 Labels integration
└── 9. Comments Module      (Comments on tasks)

Phase 4: Enhancement
└── 10. Notifications Module (Real-time notifications)
```

---

## ✅ TRẠNG THÁI

- ⬜ Chưa làm
- 🔄 Đang làm
- ✅ Hoàn thành
- ❌ Bỏ qua/Không cần

---

*Cập nhật trạng thái mỗi khi hoàn thành checkpoint!*
