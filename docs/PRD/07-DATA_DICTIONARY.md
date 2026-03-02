# DATA DICTIONARY - TỪ ĐIỂN DỮ LIỆU
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Dựa trên:** ERD.md và schema.prisma

---

## 1. ENTITY: USER

### 1.1. Mô tả
Bảng lưu trữ thông tin người dùng hệ thống.

### 1.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất (UUID v4) |
| `email` | VARCHAR(255) | ✅ | - | UNIQUE | Email đăng nhập |
| `password` | VARCHAR(255) | ❌ | - | - | Mật khẩu đã hash (bcrypt). Null nếu OAuth |
| `name` | VARCHAR(100) | ✅ | - | - | Tên hiển thị |
| `avatar` | VARCHAR(500) | ❌ | NULL | - | URL ảnh đại diện |
| `status` | ENUM | ✅ | 'ACTIVE' | - | Trạng thái: ACTIVE, INACTIVE, BANNED |
| `email_verified` | BOOLEAN | ✅ | false | - | Email đã xác thực chưa |
| `last_login_at` | TIMESTAMP | ❌ | NULL | - | Thời điểm đăng nhập gần nhất |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMP | ✅ | now() | ON UPDATE | Thời điểm cập nhật cuối |

### 1.3. Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `user_pkey` | id | PRIMARY | Khóa chính |
| `user_email_key` | email | UNIQUE | Tìm kiếm theo email |
| `user_status_idx` | status | INDEX | Filter theo trạng thái |

### 1.4. Sample Data

```
| id                                   | email              | name     | status |
|--------------------------------------|--------------------|----------|--------|
| 550e8400-e29b-41d4-a716-446655440000 | john@example.com   | John Doe | ACTIVE |
| 6ba7b810-9dad-11d1-80b4-00c04fd430c8 | jane@example.com   | Jane Doe | ACTIVE |
```

---

## 2. ENTITY: OAUTH_ACCOUNT

### 2.1. Mô tả
Lưu thông tin liên kết tài khoản OAuth (Google, GitHub).

### 2.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Reference đến User |
| `provider` | ENUM | ✅ | - | - | GOOGLE, GITHUB |
| `provider_id` | VARCHAR(255) | ✅ | - | - | ID từ OAuth provider |
| `access_token` | TEXT | ❌ | - | - | OAuth access token |
| `refresh_token` | TEXT | ❌ | - | - | OAuth refresh token |
| `expires_at` | TIMESTAMP | ❌ | - | - | Token expiration |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm liên kết |

### 2.3. Unique Constraint

| Name | Columns | Purpose |
|------|---------|---------|
| `oauth_provider_unique` | (provider, provider_id) | Một provider ID chỉ liên kết 1 user |

---

## 3. ENTITY: WORKSPACE

### 3.1. Mô tả
Không gian làm việc chung của một nhóm người dùng.

### 3.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `name` | VARCHAR(100) | ✅ | - | - | Tên workspace |
| `description` | TEXT | ❌ | NULL | - | Mô tả chi tiết |
| `owner_id` | VARCHAR(36) | ✅ | - | FK → User | Người tạo/sở hữu |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMP | ✅ | now() | ON UPDATE | Thời điểm cập nhật |

### 3.3. Relationships

| Relation | Target | Type | Description |
|----------|--------|------|-------------|
| owner | User | Many-to-One | Người sở hữu workspace |
| members | WorkspaceMember | One-to-Many | Danh sách thành viên |
| projects | Project | One-to-Many | Danh sách projects |
| labels | Label | One-to-Many | Labels dùng chung |

---

## 4. ENTITY: WORKSPACE_MEMBER

### 4.1. Mô tả
Bảng junction quản lý thành viên của workspace và vai trò.

### 4.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `workspace_id` | VARCHAR(36) | ✅ | - | FK → Workspace | Reference workspace |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Reference user |
| `role` | ENUM | ✅ | 'MEMBER' | - | OWNER, ADMIN, MEMBER |
| `joined_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tham gia |

### 4.3. Unique Constraint

| Name | Columns | Purpose |
|------|---------|---------|
| `workspace_member_unique` | (workspace_id, user_id) | Mỗi user chỉ 1 record/workspace |

### 4.4. Enum Values

```
WorkspaceRole:
  - OWNER  : Người tạo, full quyền
  - ADMIN  : Quản trị viên, có thể mời/xóa member
  - MEMBER : Thành viên thường
```

---

## 5. ENTITY: PROJECT

### 5.1. Mô tả
Dự án trong workspace, chứa các tasks.

### 5.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `workspace_id` | VARCHAR(36) | ✅ | - | FK → Workspace | Thuộc workspace nào |
| `name` | VARCHAR(100) | ✅ | - | - | Tên project |
| `description` | TEXT | ❌ | NULL | - | Mô tả project |
| `color` | VARCHAR(7) | ❌ | '#6366F1' | - | Mã màu HEX |
| `status` | ENUM | ✅ | 'ACTIVE' | - | ACTIVE, ARCHIVED |
| `is_pinned` | BOOLEAN | ✅ | false | - | Đánh dấu ghim |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMP | ✅ | now() | ON UPDATE | Thời điểm cập nhật |

### 5.3. Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `project_workspace_idx` | workspace_id | INDEX | Query projects theo workspace |
| `project_status_idx` | status | INDEX | Filter theo trạng thái |

---

## 6. ENTITY: TASK

### 6.1. Mô tả
Công việc/nhiệm vụ trong project. Entity chính của hệ thống.

### 6.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `project_id` | VARCHAR(36) | ✅ | - | FK → Project | Thuộc project nào |
| `created_by_id` | VARCHAR(36) | ✅ | - | FK → User | Người tạo task |
| `title` | VARCHAR(255) | ✅ | - | - | Tiêu đề task |
| `description` | TEXT | ❌ | NULL | - | Mô tả chi tiết |
| `status` | ENUM | ✅ | 'TODO' | - | TODO, IN_PROGRESS, REVIEW, DONE |
| `priority` | ENUM | ✅ | 'NORMAL' | - | LOW, NORMAL, HIGH, URGENT |
| `due_date` | DATE | ❌ | NULL | - | Hạn hoàn thành |
| `start_date` | DATE | ❌ | NULL | - | Ngày bắt đầu |
| `completed_at` | TIMESTAMP | ❌ | NULL | - | Thời điểm hoàn thành |
| `position` | INTEGER | ✅ | 0 | - | Thứ tự trong Kanban |
| `estimated_hours` | DECIMAL(5,2) | ❌ | NULL | - | Thời gian ước tính (giờ) |
| `actual_hours` | DECIMAL(5,2) | ❌ | NULL | - | Thời gian thực tế (giờ) |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMP | ✅ | now() | ON UPDATE | Thời điểm cập nhật |

### 6.3. Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `task_project_idx` | project_id | INDEX | Query tasks theo project |
| `task_status_idx` | status | INDEX | Filter theo trạng thái |
| `task_assignee_idx` | (via TaskAssignment) | INDEX | Query tasks theo assignee |
| `task_due_date_idx` | due_date | INDEX | Query tasks sắp đến hạn |

### 6.4. Enum Values

```
TaskStatus:
  - TODO        : Chưa bắt đầu
  - IN_PROGRESS : Đang thực hiện
  - REVIEW      : Chờ review
  - DONE        : Hoàn thành

TaskPriority:
  - LOW    : Thấp (màu xanh lá)
  - NORMAL : Bình thường (màu xanh dương)
  - HIGH   : Cao (màu cam)
  - URGENT : Khẩn cấp (màu đỏ)
```

---

## 7. ENTITY: TASK_ASSIGNMENT

### 7.1. Mô tả
Bảng junction quản lý việc gán người thực hiện task.

### 7.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `task_id` | VARCHAR(36) | ✅ | - | FK → Task | Reference task |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Reference user được gán |
| `assigned_at` | TIMESTAMP | ✅ | now() | - | Thời điểm gán |

### 7.3. Unique Constraint

| Name | Columns | Purpose |
|------|---------|---------|
| `task_assignment_unique` | (task_id, user_id) | Mỗi user chỉ gán 1 lần/task |

---

## 8. ENTITY: SUBTASK

### 8.1. Mô tả
Công việc con của task chính.

### 8.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `task_id` | VARCHAR(36) | ✅ | - | FK → Task | Thuộc task nào |
| `title` | VARCHAR(255) | ✅ | - | - | Tiêu đề subtask |
| `is_completed` | BOOLEAN | ✅ | false | - | Đã hoàn thành chưa |
| `position` | INTEGER | ✅ | 0 | - | Thứ tự hiển thị |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

---

## 9. ENTITY: COMMENT

### 9.1. Mô tả
Bình luận trên task.

### 9.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `task_id` | VARCHAR(36) | ✅ | - | FK → Task | Thuộc task nào |
| `author_id` | VARCHAR(36) | ✅ | - | FK → User | Người viết comment |
| `content` | TEXT | ✅ | - | - | Nội dung comment |
| `parent_id` | VARCHAR(36) | ❌ | NULL | FK → Comment | Reply cho comment nào |
| `is_edited` | BOOLEAN | ✅ | false | - | Đã chỉnh sửa chưa |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |
| `updated_at` | TIMESTAMP | ✅ | now() | ON UPDATE | Thời điểm sửa |

### 9.3. Self-Reference

Comment có thể reply cho comment khác thông qua `parent_id`, tạo thread.

---

## 10. ENTITY: LABEL

### 10.1. Mô tả
Nhãn phân loại task, định nghĩa ở cấp workspace.

### 10.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `workspace_id` | VARCHAR(36) | ✅ | - | FK → Workspace | Thuộc workspace nào |
| `name` | VARCHAR(50) | ✅ | - | - | Tên label |
| `color` | VARCHAR(7) | ✅ | - | - | Mã màu HEX |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

### 10.3. Sample Data

```
| id    | workspace_id | name       | color   |
|-------|--------------|------------|---------|
| L001  | WS001        | Bug        | #EF4444 |
| L002  | WS001        | Feature    | #22C55E |
| L003  | WS001        | Improvement| #3B82F6 |
```

---

## 11. ENTITY: TASK_LABEL

### 11.1. Mô tả
Bảng junction gán labels cho tasks.

### 11.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `task_id` | VARCHAR(36) | ✅ | - | FK → Task | Reference task |
| `label_id` | VARCHAR(36) | ✅ | - | FK → Label | Reference label |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm gán |

---

## 12. ENTITY: ATTACHMENT

### 12.1. Mô tả
File đính kèm của task.

### 12.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `task_id` | VARCHAR(36) | ✅ | - | FK → Task | Thuộc task nào |
| `uploaded_by_id` | VARCHAR(36) | ✅ | - | FK → User | Người upload |
| `file_name` | VARCHAR(255) | ✅ | - | - | Tên file gốc |
| `file_url` | VARCHAR(500) | ✅ | - | - | URL file (local/S3) |
| `file_size` | INTEGER | ✅ | - | - | Kích thước (bytes) |
| `mime_type` | VARCHAR(100) | ✅ | - | - | Loại file (image/png, ...) |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm upload |

### 12.3. File Constraints

- Max size: 10MB
- Allowed types: jpg, png, gif, pdf, doc, docx, xls, xlsx

---

## 13. ENTITY: NOTIFICATION

### 13.1. Mô tả
Thông báo trong ứng dụng.

### 13.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Người nhận |
| `type` | ENUM | ✅ | - | - | Loại notification |
| `title` | VARCHAR(255) | ✅ | - | - | Tiêu đề |
| `message` | TEXT | ❌ | NULL | - | Nội dung chi tiết |
| `reference_type` | VARCHAR(50) | ❌ | NULL | - | Loại entity liên quan |
| `reference_id` | VARCHAR(36) | ❌ | NULL | - | ID entity liên quan |
| `is_read` | BOOLEAN | ✅ | false | - | Đã đọc chưa |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

### 13.3. Notification Types

```
NotificationType:
  - TASK_ASSIGNED        : Được gán task mới
  - TASK_UNASSIGNED      : Bị hủy gán khỏi task
  - TASK_STATUS_CHANGED  : Trạng thái task thay đổi
  - TASK_DUE_SOON        : Task sắp đến hạn (1 ngày)
  - TASK_OVERDUE         : Task quá hạn
  - COMMENT_ADDED        : Có comment mới
  - COMMENT_REPLY        : Có reply comment
  - MENTIONED            : Được @mention
  - WORKSPACE_INVITE     : Được mời vào workspace
  - PROJECT_CREATED      : Project mới được tạo
```

---

## 14. ENTITY: ACTIVITY_LOG

### 14.1. Mô tả
Lịch sử hoạt động trong workspace.

### 14.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `workspace_id` | VARCHAR(36) | ✅ | - | FK → Workspace | Thuộc workspace nào |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Người thực hiện |
| `action` | ENUM | ✅ | - | - | CREATE, UPDATE, DELETE |
| `entity_type` | VARCHAR(50) | ✅ | - | - | Task, Project, Comment, ... |
| `entity_id` | VARCHAR(36) | ✅ | - | - | ID của entity |
| `old_value` | JSON | ❌ | NULL | - | Giá trị trước khi thay đổi |
| `new_value` | JSON | ❌ | NULL | - | Giá trị sau khi thay đổi |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm hoạt động |

---

## 15. ENTITY: INVITATION

### 15.1. Mô tả
Lời mời tham gia workspace, gửi qua email.

### 15.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `workspace_id` | VARCHAR(36) | ✅ | - | FK → Workspace | Workspace mời vào |
| `email` | VARCHAR(255) | ✅ | - | - | Email người được mời |
| `role` | ENUM | ✅ | 'MEMBER' | - | Vai trò: OWNER, ADMIN, MEMBER |
| `token` | VARCHAR(255) | ✅ | - | UNIQUE | Token xác nhận lời mời |
| `invited_by_id` | VARCHAR(36) | ✅ | - | FK → User | Người gửi lời mời |
| `expires_at` | TIMESTAMP | ✅ | - | - | Thời hạn lời mời |
| `accepted_at` | TIMESTAMP | ❌ | NULL | - | Thời điểm chấp nhận |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

---

## 16. ENTITY: REFRESH_TOKEN

### 16.1. Mô tả
Lưu trữ refresh token cho JWT authentication. Hỗ trợ Token Rotation — mỗi refresh token chỉ dùng 1 lần.

### 16.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `token` | TEXT | ✅ | - | UNIQUE | JWT refresh token |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | Chủ sở hữu token |
| `expires_at` | TIMESTAMP | ✅ | - | - | Thời hạn token (7 ngày) |
| `revoked_at` | TIMESTAMP | ❌ | NULL | - | Thời điểm thu hồi (logout/rotation) |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

### 16.3. Nghiệp vụ
- Khi **refresh**: revoke token cũ, tạo token mới (Token Rotation)
- Khi **logout**: revoke TẤT CẢ refresh tokens của user
- Token đã `revoked_at != NULL` hoặc `expires_at < now()` → không hợp lệ

---

## 17. ENTITY: PASSWORD_RESET

### 17.1. Mô tả
Token đặt lại mật khẩu, gửi qua email khi user quên mật khẩu.

### 17.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `user_id` | VARCHAR(36) | ✅ | - | FK → User | User yêu cầu reset |
| `token` | VARCHAR(255) | ✅ | - | UNIQUE | Token ngẫu nhiên (hex 64 ký tự) |
| `expires_at` | TIMESTAMP | ✅ | - | - | Thời hạn token (1 giờ) |
| `used_at` | TIMESTAMP | ❌ | NULL | - | Thời điểm đã sử dụng |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm tạo |

### 17.3. Nghiệp vụ
- Mỗi token chỉ dùng 1 lần (`used_at != NULL` → reject)
- Token hết hạn sau 1 giờ (`expires_at < now()` → reject)

---

## 18. ENTITY: INVALIDATED_TOKEN

### 18.1. Mô tả
Bảng lưu access tokens đã bị vô hiệu hóa (Token Blacklist). Khi user logout hoặc bị ban, access token hiện tại được thêm vào bảng này để tức thì thu hồi quyền truy cập.

### 18.2. Chi tiết

| Column | Type | Required | Default | Constraints | Description |
|--------|------|----------|---------|-------------|-------------|
| `id` | VARCHAR(36) | ✅ | UUID gen | PK | Định danh duy nhất |
| `token` | TEXT | ✅ | - | UNIQUE | JWT access token bị vô hiệu |
| `expires_at` | TIMESTAMP | ✅ | - | - | Thời điểm token hết hạn (dùng để dọn dẹp) |
| `reason` | VARCHAR(50) | ❌ | NULL | - | Lý do: LOGOUT, BANNED, PASSWORD_CHANGED |
| `created_at` | TIMESTAMP | ✅ | now() | - | Thời điểm vô hiệu hóa |

### 18.3. Nghiệp vụ
- **Logout**: Lưu access token hiện tại vào bảng → tức thì mất quyền truy cập
- **Ban user**: Admin ban → lưu access token → user bị kick ngay lập tức
- **Đổi password**: Lưu access token cũ → buộc đăng nhập lại
- **Dọn dẹp**: Cron job xóa records có `expires_at < now()` (token đã tự hết hạn, không cần giữ)
- **JwtStrategy**: Mỗi request kiểm tra token có trong bảng không → nếu có thì reject 401

### 18.4. Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `invalidated_token_pkey` | id | PRIMARY | Khóa chính |
| `invalidated_token_token_key` | token | UNIQUE | Tìm kiếm nhanh khi verify |
| `invalidated_token_expires_idx` | expires_at | INDEX | Dọn dẹp records hết hạn |

---

## 19. SUMMARY

| # | Entity | Columns | Type |
|---|--------|---------|------|
| 1 | User | 10 | Master |
| 2 | OAuthAccount | 8 | Master |
| 3 | Workspace | 6 | Master |
| 4 | WorkspaceMember | 5 | Junction |
| 5 | Project | 9 | Master |
| 6 | Task | 14 | Master (Core) |
| 7 | TaskAssignment | 4 | Junction |
| 8 | Subtask | 6 | Child |
| 9 | Comment | 8 | Master |
| 10 | Label | 5 | Master |
| 11 | TaskLabel | 4 | Junction |
| 12 | Attachment | 8 | Master |
| 13 | Notification | 10 | Master |
| 14 | ActivityLog | 10 | Master |
| 15 | Invitation | 9 | Master |
| 16 | RefreshToken | 6 | Auth Support |
| 17 | PasswordReset | 6 | Auth Support |
| 18 | InvalidatedToken | 5 | Auth Support (Token Blacklist) |

