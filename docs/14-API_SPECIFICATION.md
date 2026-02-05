# API SPECIFICATION - ĐẶC TẢ API
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Format:** OpenAPI 3.0 Compatible  
> **Base URL:** `http://localhost:3000/api/v1`

---

## 1. TỔNG QUAN

### 1.1. Server Configuration

```yaml
servers:
  - url: http://localhost:3000/api/v1
    description: Development server
  - url: https://api.todolist-collab.com/api/v1
    description: Production server
```

### 1.2. Authentication

Tất cả các API (trừ Auth) yêu cầu JWT token trong header:

```http
Authorization: Bearer <access_token>
```

### 1.3. Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  }
}
```

### 1.4. Pagination Format

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

---

## 2. AUTHENTICATION APIs

### 2.1. Đăng ký (Register)

```http
POST /auth/register
```

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email format |
| password | string | ✅ | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| name | string | ✅ | 2-100 chars |

**Request Example:**
```json
{
  "email": "john@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": null,
      "status": "ACTIVE"
    }
  }
}
```

**Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| EMAIL_EXISTS | 409 | Email đã được đăng ký |
| VALIDATION_ERROR | 400 | Dữ liệu không hợp lệ |

---

### 2.2. Đăng nhập (Login)

```http
POST /auth/login
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| email | string | ✅ |
| password | string | ✅ |

**Response 200:** Same as Register response

**Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Email hoặc password sai |
| ACCOUNT_LOCKED | 403 | Tài khoản bị khóa |

---

### 2.3. Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response 200:**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 900
}
```

---

### 2.4. Đăng xuất (Logout)

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2.5. Quên mật khẩu

```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 2.6. Đặt lại mật khẩu

```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123"
}
```

---

### 2.7. OAuth Login

```http
GET /auth/google
GET /auth/github
```

Redirect đến OAuth provider. Callback:

```http
GET /auth/google/callback
GET /auth/github/callback
```

---

## 3. USER APIs

### 3.1. Get Profile

```http
GET /users/me
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "status": "ACTIVE",
  "emailVerified": true,
  "lastLoginAt": "2026-02-05T00:00:00Z",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 3.2. Update Profile

```http
PATCH /users/me
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated"
}
```

---

### 3.3. Change Password

```http
POST /users/me/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

---

### 3.4. Upload Avatar

```http
POST /users/me/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Max Size |
|-------|------|----------|
| avatar | file | 5MB |

---

## 4. WORKSPACE APIs

### 4.1. List Workspaces

```http
GET /workspaces
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My Workspace",
      "description": "...",
      "role": "OWNER",
      "memberCount": 5,
      "projectCount": 3,
      "createdAt": "..."
    }
  ],
  "meta": { ... }
}
```

---

### 4.2. Create Workspace

```http
POST /workspaces
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Workspace",
  "description": "Optional description"
}
```

---

### 4.3. Get Workspace Detail

```http
GET /workspaces/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Workspace Name",
  "description": "...",
  "owner": { "id": "...", "name": "...", "avatar": "..." },
  "members": [...],
  "projects": [...],
  "labels": [...],
  "role": "ADMIN",
  "createdAt": "..."
}
```

---

### 4.4. Update Workspace

```http
PATCH /workspaces/:id
Authorization: Bearer <token>
```

**Required Role:** Owner, Admin

---

### 4.5. Delete Workspace

```http
DELETE /workspaces/:id
Authorization: Bearer <token>
```

**Required Role:** Owner only

---

### 4.6. Invite Member

```http
POST /workspaces/:id/invite
Authorization: Bearer <token>
```

**Required Role:** Owner, Admin

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "MEMBER"
}
```

---

### 4.7. Accept Invitation

```http
POST /workspaces/accept-invite/:token
Authorization: Bearer <token>
```

---

### 4.8. Remove Member

```http
DELETE /workspaces/:id/members/:userId
Authorization: Bearer <token>
```

---

### 4.9. Update Member Role

```http
PATCH /workspaces/:id/members/:userId
Authorization: Bearer <token>
```

**Required Role:** Owner only

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

---

## 5. PROJECT APIs

### 5.1. List Projects

```http
GET /workspaces/:workspaceId/projects
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Values |
|-------|------|--------|
| status | string | ACTIVE, ARCHIVED |

---

### 5.2. Create Project

```http
POST /workspaces/:workspaceId/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Optional",
  "color": "#6366F1"
}
```

---

### 5.3. Get Project Detail

```http
GET /projects/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Project Name",
  "description": "...",
  "color": "#6366F1",
  "status": "ACTIVE",
  "isPinned": false,
  "workspace": { ... },
  "taskCountByStatus": {
    "TODO": 5,
    "IN_PROGRESS": 3,
    "REVIEW": 1,
    "DONE": 10
  }
}
```

---

### 5.4. Update Project

```http
PATCH /projects/:id
Authorization: Bearer <token>
```

---

### 5.5. Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <token>
```

**Required Role:** Owner, Admin

---

### 5.6. Archive/Unarchive Project

```http
POST /projects/:id/archive
POST /projects/:id/unarchive
Authorization: Bearer <token>
```

---

## 6. TASK APIs ⭐

### 6.1. List Tasks

```http
GET /projects/:projectId/tasks
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string[] | Filter by status |
| priority | string[] | Filter by priority |
| assigneeId | string | Filter by assignee |
| labelIds | string[] | Filter by labels |
| dueDate | string | overdue, today, week, none |
| search | string | Full-text search in title/description |
| page | number | Page number |
| limit | number | Items per page |
| sortBy | string | createdAt, dueDate, priority, position |
| sortOrder | string | asc, desc |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "...",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-02-10",
      "position": 0,
      "assignees": [{ "id": "...", "name": "...", "avatar": "..." }],
      "labels": [{ "id": "...", "name": "Bug", "color": "#EF4444" }],
      "subtaskProgress": { "completed": 2, "total": 5 },
      "commentsCount": 3,
      "createdBy": { ... },
      "createdAt": "..."
    }
  ],
  "meta": { ... }
}
```

---

### 6.2. Create Task

```http
POST /projects/:projectId/tasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Optional description",
  "priority": "NORMAL",
  "dueDate": "2026-02-15",
  "assigneeIds": ["user-uuid-1", "user-uuid-2"],
  "labelIds": ["label-uuid-1"]
}
```

---

### 6.3. Get Task Detail

```http
GET /tasks/:id
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "title": "Task Title",
  "description": "...",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-02-10",
  "startDate": null,
  "completedAt": null,
  "position": 0,
  "estimatedHours": 8,
  "actualHours": null,
  "project": { ... },
  "createdBy": { ... },
  "assignees": [...],
  "labels": [...],
  "subtasks": [
    { "id": "...", "title": "Subtask 1", "isCompleted": true }
  ],
  "comments": [...],
  "attachments": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 6.4. Update Task

```http
PATCH /tasks/:id
Authorization: Bearer <token>
```

**Request Body:** (partial update)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "URGENT",
  "dueDate": "2026-02-20"
}
```

---

### 6.5. Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

---

### 6.6. Update Task Status

```http
PATCH /tasks/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

---

### 6.7. Assign User

```http
POST /tasks/:id/assignees
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user-uuid"
}
```

---

### 6.8. Unassign User

```http
DELETE /tasks/:id/assignees/:userId
Authorization: Bearer <token>
```

---

### 6.9. Reorder Tasks

```http
PATCH /tasks/:id/position
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "position": 2,
  "status": "IN_PROGRESS"
}
```

---

### 6.10. My Tasks (Dashboard)

```http
GET /tasks/my-tasks
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| filter | string | all, due_today, overdue |

---

## 7. SUBTASK APIs

### 7.1. Create Subtask

```http
POST /tasks/:taskId/subtasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Subtask title"
}
```

---

### 7.2. Toggle Subtask

```http
PATCH /subtasks/:id/toggle
Authorization: Bearer <token>
```

---

### 7.3. Delete Subtask

```http
DELETE /subtasks/:id
Authorization: Bearer <token>
```

---

## 8. COMMENT APIs

### 8.1. List Comments

```http
GET /tasks/:taskId/comments
Authorization: Bearer <token>
```

---

### 8.2. Create Comment

```http
POST /tasks/:taskId/comments
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Comment content with @mention",
  "parentId": null
}
```

---

### 8.3. Update Comment

```http
PATCH /comments/:id
Authorization: Bearer <token>
```

**Note:** Chỉ author mới được sửa

---

### 8.4. Delete Comment

```http
DELETE /comments/:id
Authorization: Bearer <token>
```

**Note:** Author hoặc Workspace Admin/Owner

---

## 9. NOTIFICATION APIs

### 9.1. List Notifications

```http
GET /notifications
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| isRead | boolean | - |
| limit | number | 20 |

---

### 9.2. Mark as Read

```http
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

---

### 9.3. Mark All as Read

```http
POST /notifications/read-all
Authorization: Bearer <token>
```

---

### 9.4. Get Unread Count

```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 5
}
```

---

## 10. LABEL APIs

### 10.1. List Labels

```http
GET /workspaces/:workspaceId/labels
Authorization: Bearer <token>
```

---

### 10.2. Create Label

```http
POST /workspaces/:workspaceId/labels
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Bug",
  "color": "#EF4444"
}
```

---

### 10.3. Update Label

```http
PATCH /labels/:id
Authorization: Bearer <token>
```

---

### 10.4. Delete Label

```http
DELETE /labels/:id
Authorization: Bearer <token>
```

---

## 11. ATTACHMENT APIs

### 11.1. Upload Attachment

```http
POST /tasks/:taskId/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Max Size |
|-------|------|----------|
| file | file | 10MB |

---

### 11.2. Delete Attachment

```http
DELETE /attachments/:id
Authorization: Bearer <token>
```

---

## 12. HTTP STATUS CODES

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Delete success) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 13. API SUMMARY

| Module | Endpoints | Methods |
|--------|-----------|---------|
| Auth | 7 | POST, GET |
| User | 4 | GET, PATCH, POST |
| Workspace | 9 | GET, POST, PATCH, DELETE |
| Project | 6 | GET, POST, PATCH, DELETE |
| Task | 10 | GET, POST, PATCH, DELETE |
| Subtask | 3 | POST, PATCH, DELETE |
| Comment | 4 | GET, POST, PATCH, DELETE |
| Notification | 4 | GET, PATCH, POST |
| Label | 4 | GET, POST, PATCH, DELETE |
| Attachment | 2 | POST, DELETE |
| **Total** | **53** | |
