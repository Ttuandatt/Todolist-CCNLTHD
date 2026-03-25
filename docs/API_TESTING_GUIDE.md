# 📘 API TESTING GUIDE — Task Module (Phase 4)

> **Base URL:** `http://localhost:3333/api/v1`  
> **Auth:** Tất cả API (trừ Register/Login) đều cần header:  
> `Authorization: Bearer <accessToken>`

---

## 🔐 BƯỚC 0: Chuẩn bị — Đăng ký + Đăng nhập

### 0.1 Đăng ký tài khoản

```
POST /api/v1/auth/register
```

Body:
```json
{
  "name": "Phú Nguyễn",
  "email": "phu@test.com",
  "password": "123456"
}
```

### 0.2 Đăng nhập (Lấy Token)

```
POST /api/v1/auth/login
```

Body:
```json
{
  "email": "phu@test.com",
  "password": "123456"
}
```

Response:
```json
{
  "accessToken": "eyJhb...",     ← COPY giá trị này
  "refreshToken": "eyJhb..."
}
```

> ⚠️ **Từ đây trở xuống**, mọi request đều phải gắn header:
> ```
> Authorization: Bearer eyJhb...
> ```

---

## 🏢 BƯỚC 1: Tạo Workspace

```
POST /api/v1/workspaces
```

Body:
```json
{
  "name": "Team Dev Backend",
  "description": "Không gian làm việc của team"
}
```

Response → Lưu lại giá trị `id` → Đây là **workspaceId**

---

## 📁 BƯỚC 2: Tạo Project trong Workspace

```
POST /api/v1/workspaces/{workspaceId}/projects
```

Body:
```json
{
  "name": "Dự án TodoList App",
  "description": "Module Task và Comment",
  "color": "#3B82F6"
}
```

Response → Lưu lại giá trị `id` → Đây là **projectId**

> **Xem lại danh sách Projects:**
> ```
> GET /api/v1/workspaces/{workspaceId}/projects
> ```

---

## ✅ BƯỚC 3: TASK CRUD (Core)

### 3.1 Tạo Task mới

```
POST /api/v1/projects/{projectId}/tasks
```

Body:
```json
{
  "title": "Thiết kế UI Login",
  "description": "Lên figma màn hình Login và Register",
  "priority": "HIGH",
  "estimatedHours": 5.5,
  "dueDate": "2026-03-30T10:00:00Z"
}
```

> **Giá trị priority:** `LOW` | `NORMAL` | `HIGH` | `URGENT`

Response → Lưu lại `id` → Đây là **taskId**

---

### 3.2 Danh sách Task (Filter + Sort + Pagination)

```
GET /api/v1/projects/{projectId}/tasks
```

Các query params có thể dùng:

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `status` | `TODO,IN_PROGRESS` | Lọc theo trạng thái (phân cách bằng dấu phẩy) |
| `priority` | `HIGH,URGENT` | Lọc theo mức ưu tiên |
| `assigneeId` | `uuid` | Lọc theo người được giao |
| `labelIds` | `uuid1,uuid2` | Lọc theo nhãn |
| `dueDate` | `overdue` / `today` / `week` / `none` | Lọc theo hạn chót |
| `search` | `Login` | Tìm theo tiêu đề |
| `sortBy` | `position` / `createdAt` / `dueDate` / `priority` | Sắp xếp theo |
| `sortOrder` | `asc` / `desc` | Thứ tự sắp xếp |
| `page` | `1` | Trang hiện tại |
| `limit` | `20` | Số item mỗi trang |

Ví dụ đầy đủ:
```
GET /api/v1/projects/{projectId}/tasks?status=TODO&priority=HIGH&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

---

### 3.3 Chi tiết 1 Tas

```
GET /api/v1/tasks/{taskId}
```

Response bao gồm: `subtasks[]`, `assignments[]`, `labels[]`, `_count.comments`, `_count.attachments`

---

### 3.4 Cập nhật Task

```
PATCH /api/v1/tasks/{taskId}
```

Body (chỉ gửi field muốn đổi):
```json
{
  "title": "Thiết kế UI Login (v2)",
  "description": "Đã cập nhật yêu cầu mới",
  "priority": "URGENT",
  "actualHours": 6
}
```

---

### 3.5 Chuyển trạng thái Task

```
PATCH /api/v1/tasks/{taskId}/status
```

Body:
```json
{
  "status": "IN_PROGRESS"
}
```

> **Giá trị status:** `TODO` → `IN_PROGRESS` → `REVIEW` → `DONE`
>
> Khi chuyển sang `DONE`, hệ thống tự động set `completedAt = now()`

---

### 3.6 Xóa Task

```
DELETE /api/v1/tasks/{taskId}
```

> ⚠️ Cascade delete: Subtasks, assignments, labels, comments, attachments đều bị xóa theo

---

## 👥 BƯỚC 4: Assign / Unassign Member

### 4.1 Giao Task cho thành viên

```
POST /api/v1/tasks/{taskId}/assign
```

Body:
```json
{
  "userId": "uuid-cua-thanh-vien"
}
```

> Người được assign **phải là member** của workspace chứa project

### 4.2 Hủy giao Task

```
DELETE /api/v1/tasks/{taskId}/assign/{userId}
```

---

## 🏷️ BƯỚC 5: Gắn / Gỡ Label

> **Trước tiên cần tạo Label trong Workspace** (nếu team Vy đã làm LabelModule).
> Nếu chưa có LabelModule, bạn có thể tạo Label trực tiếp trong DB bằng Prisma Studio:
> ```bash
> npx prisma studio
> ```
> Mở bảng `Label`, thêm 1 record với `workspaceId`, `name`, `color`.

### 5.1 Gắn Label vào Task

```
POST /api/v1/tasks/{taskId}/labels
```

Body:
```json
{
  "labelId": "uuid-cua-label"
}
```

### 5.2 Gỡ Label khỏi Task

```
DELETE /api/v1/tasks/{taskId}/labels/{labelId}
```

---

## 📋 BƯỚC 6: Subtask (Công việc con)

### 6.1 Tạo Subtask

```
POST /api/v1/tasks/{taskId}/subtasks
```

Body:
```json
{
  "title": "Vẽ wireframe"
}
```

### 6.2 Xem danh sách Subtasks

```
GET /api/v1/tasks/{taskId}/subtasks
```

### 6.3 Check / Uncheck hoàn thành Subtask

```
PATCH /api/v1/subtasks/{subtaskId}/complete
```

> Không cần body. Gọi 1 lần → `isCompleted: true`. Gọi lần nữa → `isCompleted: false`.

### 6.4 Xóa Subtask

```
DELETE /api/v1/subtasks/{subtaskId}
```

---

## 🧪 TEST FLOW ĐỀ NGHỊ

Chạy theo thứ tự sau để test hết tất cả chức năng:

```
1. POST /auth/register       → Tạo tài khoản
2. POST /auth/login           → Lấy token
3. POST /workspaces            → Tạo workspace → lưu workspaceId
4. POST /workspaces/:wsId/projects → Tạo project → lưu projectId
5. POST /projects/:pId/tasks  → Tạo task 1 → lưu taskId
6. POST /projects/:pId/tasks  → Tạo task 2
7. GET  /projects/:pId/tasks  → Xem danh sách (kiểm tra position tự tăng)
8. GET  /tasks/:taskId         → Xem chi tiết task
9. PATCH /tasks/:taskId        → Sửa title
10. PATCH /tasks/:taskId/status → Chuyển sang IN_PROGRESS
11. PATCH /tasks/:taskId/status → Chuyển sang DONE → kiểm tra completedAt
12. POST /tasks/:taskId/subtasks → Tạo subtask
13. PATCH /subtasks/:id/complete → Toggle hoàn thành
14. GET  /tasks/:taskId/subtasks → Xem list subtask
15. DELETE /subtasks/:id         → Xóa subtask
16. GET /projects/:pId/tasks?status=DONE&sortBy=dueDate → Test filter
17. DELETE /tasks/:taskId        → Xóa task
```

---

## ❌ CÁC LỖI THƯỜNG GẶP

| HTTP Code | Ý nghĩa | Nguyên nhân |
|-----------|---------|-------------|
| `400` | Bad Request | Body thiếu field bắt buộc hoặc sai format (VD: priority = "MEDIUM") |
| `401` | Unauthorized | Thiếu token hoặc token hết hạn |
| `403` | Forbidden | User không phải member của workspace chứa project |
| `404` | Not Found | Task/Project/Subtask ID không tồn tại |
| `409` | Conflict | Assign trùng (user đã được giao) hoặc label đã gắn rồi |
