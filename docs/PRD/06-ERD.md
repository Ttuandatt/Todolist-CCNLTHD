# ERD - ENTITY RELATIONSHIP DIAGRAM
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 02/02/2026  
> **Database:** PostgreSQL với Prisma ORM

---

## 1. TỔNG QUAN CÁC ENTITY

| STT | Entity | Mô tả | Số thuộc tính |
|-----|--------|-------|---------------|
| 1 | User | Người dùng hệ thống | 10 |
| 2 | Workspace | Không gian làm việc nhóm | 6 |
| 3 | WorkspaceMember | Thành viên trong workspace | 5 |
| 4 | Project | Dự án trong workspace | 9 |
| 5 | Task | Công việc cần thực hiện | 15 |
| 6 | Subtask | Công việc con của task | 6 |
| 7 | TaskAssignment | Phân công task cho user | 4 |
| 8 | Label | Nhãn phân loại task | 5 |
| 9 | TaskLabel | Liên kết task với label | 3 |
| 10 | Comment | Bình luận trên task | 8 |
| 11 | Attachment | File đính kèm | 7 |
| 12 | Notification | Thông báo | 9 |
| 13 | ActivityLog | Lịch sử hoạt động | 8 |

---

## 2. CHI TIẾT CÁC ENTITY

### 2.1. User (Người dùng)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| password | VARCHAR(255) | NOT NULL | Mật khẩu đã hash |
| name | VARCHAR(100) | NOT NULL | Tên hiển thị |
| avatar | VARCHAR(500) | NULL | URL ảnh đại diện |
| status | ENUM | DEFAULT 'ACTIVE' | ACTIVE, INACTIVE, BANNED |
| emailVerified | BOOLEAN | DEFAULT false | Đã xác thực email |
| lastLoginAt | TIMESTAMP | NULL | Lần đăng nhập cuối |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updatedAt | TIMESTAMP | ON UPDATE | Ngày cập nhật |

---

### 2.2. Workspace (Không gian làm việc)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| name | VARCHAR(100) | NOT NULL | Tên workspace |
| description | TEXT | NULL | Mô tả |
| ownerId | UUID | FK → User.id | Chủ sở hữu |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updatedAt | TIMESTAMP | ON UPDATE | Ngày cập nhật |

---

### 2.3. WorkspaceMember (Thành viên workspace)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| workspaceId | UUID | FK → Workspace.id | Workspace |
| userId | UUID | FK → User.id | Người dùng |
| role | ENUM | DEFAULT 'MEMBER' | OWNER, ADMIN, MEMBER |
| joinedAt | TIMESTAMP | DEFAULT NOW() | Ngày tham gia |

**Ràng buộc:** UNIQUE(workspaceId, userId)

---

### 2.4. Project (Dự án)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| name | VARCHAR(100) | NOT NULL | Tên project |
| description | TEXT | NULL | Mô tả |
| workspaceId | UUID | FK → Workspace.id | Workspace chứa project |
| createdById | UUID | FK → User.id | Người tạo |
| status | ENUM | DEFAULT 'ACTIVE' | ACTIVE, ARCHIVED |
| isPinned | BOOLEAN | DEFAULT false | Đã ghim |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Mã màu hex |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updatedAt | TIMESTAMP | ON UPDATE | Ngày cập nhật |

---

### 2.5. Task (Công việc) ⭐

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| title | VARCHAR(255) | NOT NULL | Tiêu đề task |
| description | TEXT | NULL | Mô tả chi tiết |
| projectId | UUID | FK → Project.id | Project chứa task |
| createdById | UUID | FK → User.id | Người tạo |
| status | ENUM | DEFAULT 'TODO' | TODO, IN_PROGRESS, REVIEW, DONE |
| priority | ENUM | DEFAULT 'NORMAL' | LOW, NORMAL, HIGH, URGENT |
| dueDate | TIMESTAMP | NULL | Hạn hoàn thành |
| startDate | TIMESTAMP | NULL | Ngày bắt đầu |
| completedAt | TIMESTAMP | NULL | Ngày hoàn thành |
| position | INTEGER | DEFAULT 0 | Thứ tự hiển thị |
| estimatedHours | DECIMAL(5,2) | NULL | Thời gian ước tính (giờ) |
| actualHours | DECIMAL(5,2) | NULL | Thời gian thực tế (giờ) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updatedAt | TIMESTAMP | ON UPDATE | Ngày cập nhật |

---

### 2.6. Subtask (Công việc con)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| taskId | UUID | FK → Task.id | Task cha |
| title | VARCHAR(255) | NOT NULL | Tiêu đề subtask |
| isCompleted | BOOLEAN | DEFAULT false | Đã hoàn thành |
| position | INTEGER | DEFAULT 0 | Thứ tự |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

---

### 2.7. TaskAssignment (Phân công task)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| taskId | UUID | FK → Task.id | Task được gán |
| userId | UUID | FK → User.id | Người được gán |
| assignedAt | TIMESTAMP | DEFAULT NOW() | Ngày gán |

**Ràng buộc:** UNIQUE(taskId, userId)

---

### 2.8. Label (Nhãn) - Workspace Level ⭐

> **Lưu ý:** Labels thuộc về Workspace, dùng chung cho tất cả Projects trong workspace đó.

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| name | VARCHAR(50) | NOT NULL | Tên nhãn |
| color | VARCHAR(7) | NOT NULL | Mã màu hex |
| **workspaceId** | UUID | FK → Workspace.id | **Workspace chứa label (dùng chung)** |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

**Ràng buộc:** UNIQUE(workspaceId, name) - Tên label không trùng trong cùng workspace

---

### 2.9. TaskLabel (Gán nhãn cho task)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| taskId | UUID | FK → Task.id | Task |
| labelId | UUID | FK → Label.id | Label |

**Ràng buộc:** UNIQUE(taskId, labelId)

---

### 2.10. Comment (Bình luận)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| content | TEXT | NOT NULL | Nội dung comment |
| taskId | UUID | FK → Task.id | Task được comment |
| authorId | UUID | FK → User.id | Người viết |
| parentId | UUID | FK → Comment.id, NULL | Comment cha (reply) |
| isEdited | BOOLEAN | DEFAULT false | Đã chỉnh sửa |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |
| updatedAt | TIMESTAMP | ON UPDATE | Ngày cập nhật |

---

### 2.11. Attachment (File đính kèm)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| fileName | VARCHAR(255) | NOT NULL | Tên file |
| fileUrl | VARCHAR(500) | NOT NULL | URL file |
| fileSize | INTEGER | NOT NULL | Kích thước (bytes) |
| mimeType | VARCHAR(100) | NOT NULL | Loại file |
| taskId | UUID | FK → Task.id | Task chứa file |
| uploadedById | UUID | FK → User.id | Người upload |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

---

### 2.12. Notification (Thông báo)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| type | ENUM | NOT NULL | TASK_ASSIGNED, COMMENT_ADDED, MENTIONED, DUE_SOON, etc. |
| title | VARCHAR(255) | NOT NULL | Tiêu đề thông báo |
| message | TEXT | NULL | Nội dung |
| userId | UUID | FK → User.id | Người nhận |
| actorId | UUID | FK → User.id | Người thực hiện hành động |
| referenceId | UUID | NULL | ID đối tượng liên quan |
| referenceType | VARCHAR(50) | NULL | Loại đối tượng (Task, Comment, etc.) |
| isRead | BOOLEAN | DEFAULT false | Đã đọc |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

---

### 2.13. ActivityLog (Lịch sử hoạt động)

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
|------------|--------------|-----------|-------|
| **id** | UUID | PK | Khóa chính |
| action | VARCHAR(50) | NOT NULL | CREATE, UPDATE, DELETE, ASSIGN, etc. |
| entityType | VARCHAR(50) | NOT NULL | Task, Project, Comment, etc. |
| entityId | UUID | NOT NULL | ID đối tượng |
| userId | UUID | FK → User.id | Người thực hiện |
| workspaceId | UUID | FK → Workspace.id | Workspace |
| oldValue | JSON | NULL | Giá trị cũ |
| newValue | JSON | NULL | Giá trị mới |
| createdAt | TIMESTAMP | DEFAULT NOW() | Ngày tạo |

---

## 3. SƠ ĐỒ ERD (Text-based)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TODOLIST COLLABORATION ERD                          │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │     USER     │
                                    ├──────────────┤
                                    │ PK id        │
                                    │    email     │
                                    │    password  │
                                    │    name      │
                                    │    avatar    │
                                    │    status    │
                                    └──────┬───────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              │ 1                          │ 1                          │ 1
              ▼                            ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
    │ WORKSPACE_MEMBER │         │   NOTIFICATION   │         │   ACTIVITY_LOG   │
    ├──────────────────┤         ├──────────────────┤         ├──────────────────┤
    │ PK id            │         │ PK id            │         │ PK id            │
    │ FK workspaceId   │         │ FK userId        │         │ FK userId        │
    │ FK userId        │         │ FK actorId       │         │ FK workspaceId   │
    │    role          │         │    type          │         │    action        │
    │    joinedAt      │         │    message       │         │    entityType    │
    └────────┬─────────┘         │    isRead        │         │    oldValue      │
             │                   └──────────────────┘         │    newValue      │
             │ N                                              └──────────────────┘
             │
             ▼ 1
    ┌──────────────────┐
    │    WORKSPACE     │
    ├──────────────────┤
    │ PK id            │
    │    name          │
    │    description   │
    │ FK ownerId       │◄───────────────────┐
    └────────┬─────────┘                    │ 1
             │                              │
             │ 1                            │
             ▼                              │
    ┌──────────────────┐                    │
    │     PROJECT      │                    │
    ├──────────────────┤                    │
    │ PK id            │                    │
    │    name          │                    │
    │    description   │                    │
    │ FK workspaceId   │                    │
    │ FK createdById   │────────────────────┘
    │    status        │
    │    isPinned      │
    └────────┬─────────┘
             │
     │
     │ 1
     ▼
┌──────────────────┐
│       TASK       │
├──────────────────┤
│ PK id            │
│    title         │
│    description   │
│ FK projectId     │
│ FK createdById   │
│    status        │
│    priority      │
│    dueDate       │
│    position      │
└───────┬──────────┘
        │
        │ N
        ▼
   ┌──────────┐         ┌─────────┐         ┌───────────┐
   │TASK_LABEL│ ──N:1──▶│  LABEL  │◀──1:N── │ WORKSPACE │
   ├──────────┤         ├─────────┤         │ (shared)  │
   │ PK id    │         │ PK id   │         └───────────┘
   │FK taskId │         │   name  │
   │FK labelId│         │   color │
   └──────────┘         │FK wkspcId│
                        └─────────┘
                       │
     ┌─────────────────┼─────────────────┬─────────────────┐
     │ 1               │ 1               │ 1               │ 1
     ▼                 ▼                 ▼                 ▼
┌───────────┐   ┌────────────┐   ┌────────────┐   ┌────────────────┐
│  SUBTASK  │   │  COMMENT   │   │ ATTACHMENT │   │ TASK_ASSIGNMENT│
├───────────┤   ├────────────┤   ├────────────┤   ├────────────────┤
│ PK id     │   │ PK id      │   │ PK id      │   │ PK id          │
│ FK taskId │   │ FK taskId  │   │ FK taskId  │   │ FK taskId      │
│   title   │   │ FK authorId│   │ FK uploadBy│   │ FK userId      │
│isCompleted│   │ FK parentId│   │   fileName │   │   assignedAt   │
│  position │   │   content  │   │   fileUrl  │   └────────────────┘
└───────────┘   │   isEdited │   │   fileSize │
                └────────────┘   │   mimeType │
                                 └────────────┘
```

---

## 4. MỐI QUAN HỆ (RELATIONSHIPS)

| STT | Quan hệ | Kiểu | Mô tả chi tiết |
|-----|---------|------|----------------|
| 1 | User ↔ Workspace | 1:N | 1 User có thể sở hữu nhiều Workspace; 1 Workspace chỉ thuộc về 1 và chỉ 1 User (owner) |
| 2 | Workspace ↔ WorkspaceMember | 1:N | 1 Workspace có thể có nhiều WorkspaceMember; 1 WorkspaceMember chỉ thuộc về 1 và chỉ 1 Workspace |
| 3 | User ↔ WorkspaceMember | 1:N | 1 User có thể tham gia nhiều Workspace (qua WorkspaceMember); 1 WorkspaceMember chỉ thuộc về 1 và chỉ 1 User |
| 4 | Workspace ↔ Project | 1:N | 1 Workspace có thể chứa nhiều Project; 1 Project chỉ thuộc về 1 và chỉ 1 Workspace |
| 5 | Project ↔ Task | 1:N | 1 Project có thể chứa nhiều Task; 1 Task chỉ thuộc về 1 và chỉ 1 Project |
| 6 | Task ↔ Subtask | 1:N | 1 Task có thể có nhiều Subtask; 1 Subtask chỉ thuộc về 1 và chỉ 1 Task |
| 7 | Task ↔ TaskAssignment | 1:N | 1 Task có thể được gán cho nhiều User (qua TaskAssignment); 1 TaskAssignment chỉ thuộc về 1 và chỉ 1 Task |
| 8 | User ↔ TaskAssignment | 1:N | 1 User có thể được gán nhiều Task (qua TaskAssignment); 1 TaskAssignment chỉ thuộc về 1 và chỉ 1 User |
| 9 | **Workspace ↔ Label** | **1:N** | **1 Workspace có thể có nhiều Label (dùng chung); 1 Label chỉ thuộc về 1 và chỉ 1 Workspace** |
| 10 | Task ↔ TaskLabel | 1:N | 1 Task có thể có nhiều Label (qua TaskLabel); 1 TaskLabel chỉ thuộc về 1 và chỉ 1 Task |
| 11 | Label ↔ TaskLabel | 1:N | 1 Label có thể gán cho nhiều Task (qua TaskLabel); 1 TaskLabel chỉ thuộc về 1 và chỉ 1 Label |
| 12 | Task ↔ Comment | 1:N | 1 Task có thể có nhiều Comment; 1 Comment chỉ thuộc về 1 và chỉ 1 Task |
| 13 | Comment ↔ Comment | 1:N (Self) | 1 Comment có thể có nhiều Reply (Comment con); 1 Reply chỉ thuộc về 1 Comment cha (hoặc null) |
| 14 | Task ↔ Attachment | 1:N | 1 Task có thể có nhiều Attachment; 1 Attachment chỉ thuộc về 1 và chỉ 1 Task |
| 15 | User ↔ Notification | 1:N | 1 User có thể nhận nhiều Notification; 1 Notification chỉ gửi đến 1 User (khi @All → tạo N bản ghi cho N users) |
| 16 | User ↔ Comment | 1:N | 1 User có thể viết nhiều Comment; 1 Comment chỉ được viết bởi 1 và chỉ 1 User |
| 17 | User ↔ Attachment | 1:N | 1 User có thể upload nhiều Attachment; 1 Attachment chỉ được upload bởi 1 và chỉ 1 User |
| 18 | User ↔ Task (creator) | 1:N | 1 User có thể tạo nhiều Task; 1 Task chỉ được tạo bởi 1 và chỉ 1 User |
| 19 | User ↔ Project (creator) | 1:N | 1 User có thể tạo nhiều Project; 1 Project chỉ được tạo bởi 1 và chỉ 1 User |
| 20 | Workspace ↔ ActivityLog | 1:N | 1 Workspace có thể có nhiều ActivityLog; 1 ActivityLog chỉ thuộc về 1 và chỉ 1 Workspace |
| 21 | User ↔ ActivityLog | 1:N | 1 User có thể tạo nhiều ActivityLog; 1 ActivityLog chỉ được tạo bởi 1 và chỉ 1 User |

---

## 5. INDEXES ĐỀ XUẤT

| Bảng | Index | Columns | Mô tả |
|------|-------|---------|-------|
| User | idx_user_email | email | Tìm kiếm nhanh theo email |
| Task | idx_task_project | projectId | Lấy task theo project |
| Task | idx_task_status | status | Filter theo trạng thái |
| Task | idx_task_due | dueDate | Sắp xếp theo deadline |
| Comment | idx_comment_task | taskId | Lấy comment theo task |
| Notification | idx_notif_user_read | userId, isRead | Lấy thông báo chưa đọc |
| ActivityLog | idx_activity_workspace | workspaceId, createdAt | Lấy activity gần đây |

---

## 6. PRISMA SCHEMA (Preview)

```prisma
// Xem chi tiết tại file: prisma/schema.prisma

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  avatar        String?
  status        UserStatus @default(ACTIVE)
  
  // Relations
  ownedWorkspaces    Workspace[]
  memberships        WorkspaceMember[]
  createdTasks       Task[]
  assignedTasks      TaskAssignment[]
  comments           Comment[]
  notifications      Notification[]
  activities         ActivityLog[]
}

model Workspace {
  id          String   @id @default(uuid())
  name        String
  description String?
  ownerId     String
  
  // Relations
  owner       User     @relation(fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  projects    Project[]
  labels      Label[]    // Workspace-level labels (shared)
  activities  ActivityLog[]
}

// ... (tiếp tục cho các model khác)
```

---

## 7. CÔNG CỤ VẼ ERD

Bạn có thể dùng các công cụ sau để vẽ ERD đẹp hơn:

| Công cụ | Link | Miễn phí |
|---------|------|----------|
| dbdiagram.io | https://dbdiagram.io | ✓ |
| Draw.io | https://draw.io | ✓ |
| Lucidchart | https://lucidchart.com | Có giới hạn |
| ERDPlus | https://erdplus.com | ✓ |
| MySQL Workbench | https://mysql.com/products/workbench | ✓ |
