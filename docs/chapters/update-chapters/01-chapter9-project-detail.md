# CHƯƠNG 9: TRIỂN KHAI CHI TIẾT

> **Hướng dẫn dán vào báo cáo:** Thay toàn bộ nội dung Chương 9 (hiện đang trống) bằng nội dung dưới đây.

---

## 9.1. Cấu trúc thư mục dự án

Dự án được tổ chức theo **Option B — Infrastructure-separated Architecture**, phân tách rõ ràng giữa feature modules và shared infrastructure.

```
Todolist-CCNLTHD/
├── backend/                          ← NestJS Backend (Node.js)
│   ├── src/
│   │   ├── modules/                  ← Feature modules (nghiệp vụ)
│   │   │   ├── auth/                 ← Xác thực & phân quyền
│   │   │   │   ├── decorators/       ← @Public(), @CurrentUser()
│   │   │   │   ├── dto/              ← RegisterDto, LoginDto, ...
│   │   │   │   ├── guards/           ← JwtAuthGuard
│   │   │   │   ├── strategies/       ← JwtStrategy (Passport)
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── user/                 ← Quản lý hồ sơ người dùng
│   │   │   ├── workspace/            ← Không gian làm việc nhóm
│   │   │   ├── project/              ← Dự án trong workspace
│   │   │   └── task/                 ← Công việc trong project
│   │   ├── shared/                   ← Infrastructure dùng chung
│   │   │   ├── prisma/               ← PrismaService, PrismaModule
│   │   │   ├── mail/                 ← MailService (SendGrid/Mock)
│   │   │   └── common/
│   │   │       ├── config/           ← Multer config (file upload)
│   │   │       ├── filters/          ← HttpExceptionFilter
│   │   │       └── interceptors/     ← LoggingInterceptor, TransformResponseInterceptor
│   │   ├── types/                    ← TypeScript type augmentations
│   │   ├── app.module.ts             ← Root module
│   │   └── main.ts                   ← Entry point, bootstrap
│   ├── prisma/
│   │   ├── schema.prisma             ← 17 models, schema database
│   │   └── migrations/               ← Lịch sử thay đổi schema
│   ├── uploads/
│   │   └── avatars/                  ← Avatar người dùng (static files)
│   ├── docker-compose.yml            ← PostgreSQL container
│   ├── .env                          ← Biến môi trường (không commit)
│   └── package.json
├── frontend/                         ← React + TypeScript + Vite
│   └── src/
│       ├── pages/                    ← LoginPage, RegisterPage, Dashboard...
│       ├── stores/                   ← Zustand state management
│       ├── components/               ← ProtectedRoute, Layout...
│       └── lib/                      ← axios instance, validators
└── docs/                             ← Tài liệu dự án
```

**Giải thích các quyết định kiến trúc:**

| Quyết định | Lý do |
|-----------|-------|
| `modules/` tách khỏi `shared/` | Phân biệt rõ feature code và infrastructure code |
| `shared/prisma/` là `@Global()` | PrismaService dùng ở mọi module — không cần import lại |
| `shared/common/filters` & `interceptors` | Đăng ký global trong `main.ts` — áp dụng cho toàn bộ API |
| `uploads/` nằm trong `backend/` | Static file serving qua `app.useStaticAssets()` |

---

## 9.2. Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---------|-------------------|---------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Docker Desktop | v4+ | `docker --version` |
| Git | bất kỳ | `git --version` |

### Bước 1: Clone repository

```bash
git clone https://github.com/Ttuandatt/Todolist-CCNLTHD.git
cd Todolist-CCNLTHD
```

### Bước 2: Cài đặt dependencies cho Backend

```bash
cd backend
npm install
```

### Bước 3: Tạo file biến môi trường

```bash
# Tạo file .env từ mẫu
cp .env.example .env
```

Nội dung file `.env` cần điền:

```env
# Database (PostgreSQL qua Docker)
DATABASE_URL="postgresql://postgres:123@localhost:5433/CCNLTHD_postgres"

# JWT Secrets (đặt chuỗi bí mật ngẫu nhiên)
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="15d"

# App
PORT=3333
FRONTEND_URL="http://localhost:5173"

# Mail (mock mode — không cần SendGrid khi test local)
MAIL_DRIVER="mock"
MAIL_FROM="noreply@todolist.local"
SENDGRID_API_KEY=""
```

### Bước 4: Khởi động PostgreSQL bằng Docker

```bash
# Trong thư mục backend/
docker compose up -d
```

Kết quả thành công:
```
✔ Container ccnlthd_postgres  Started
```

Kiểm tra container đang chạy:
```bash
docker ps
# PORTS: 0.0.0.0:5433->5432/tcp
```

### Bước 5: Chạy Database Migration

```bash
npx prisma migrate deploy
```

Kết quả:
```
✔ Applied 4 migrations
  - 20260203_init_database
  - 20260305_init
  - 20260316_add_display_name_bio_to_user
  - 20260319_workspace_suite_sync
```

### Bước 6: Generate Prisma Client

```bash
npx prisma generate
```

### Bước 7: Khởi động Backend

```bash
npm run start:dev
```

Kết quả thành công:
```
[PrismaService] ✅ Database connected successfully
[NestApplication] Nest application successfully started
```

Backend đang chạy tại:
- **API Base URL:** `http://localhost:3333/api/v1`
- **Swagger UI:** `http://localhost:3333/api-docs`

### Bước 8 (Tùy chọn): Xem dữ liệu qua Prisma Studio

```bash
npx prisma studio
# Mở trình duyệt tại http://localhost:5555
```

---

## 9.3. Danh sách API Endpoints

Toàn bộ hệ thống có **44 endpoints**, chia thành 5 modules. Mọi endpoint đều trả về response theo chuẩn nhờ `TransformResponseInterceptor`:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

Lỗi được bắt bởi `HttpExceptionFilter`:

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "path": "/api/v1/users/me",
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

### Auth Module — 6 endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/auth/register` | Public | Đăng ký tài khoản mới |
| POST | `/api/v1/auth/login` | Public | Đăng nhập, nhận JWT tokens |
| POST | `/api/v1/auth/refresh` | Public | Làm mới access token |
| POST | `/api/v1/auth/logout` | JWT | Đăng xuất, vô hiệu hóa token |
| POST | `/api/v1/auth/forgot-password` | Public | Gửi email reset mật khẩu |
| POST | `/api/v1/auth/reset-password` | Public | Đặt lại mật khẩu bằng token |

**Ví dụ: POST /api/v1/auth/register**

Request:
```json
{
  "fullname": "Nguyễn Văn A",
  "displayName": "Van A",
  "email": "vana@example.com",
  "password": "Password123!"
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "vana@example.com",
      "name": "Nguyễn Văn A",
      "avatar": null,
      "status": "ACTIVE"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
      "expiresIn": 900
    }
  },
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

**Ví dụ: POST /api/v1/auth/logout** (cần JWT token)

Request Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Response (200 OK):
```json
{
  "success": true,
  "data": { "message": "Logout successfully" },
  "timestamp": "2026-03-28T09:00:00.000Z"
}
```

Sau khi logout, token được thêm vào bảng `InvalidatedToken` — mọi request tiếp theo với token đó sẽ nhận 401.

---

### User Module — 4 endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/v1/users/me` | JWT | Xem hồ sơ cá nhân |
| PATCH | `/api/v1/users/me` | JWT | Cập nhật displayName, bio |
| PATCH | `/api/v1/users/me/change-password` | JWT | Đổi mật khẩu |
| POST | `/api/v1/users/me/avatar` | JWT | Upload ảnh đại diện (multipart/form-data) |

**Ví dụ: POST /api/v1/users/me/avatar**

Request: `Content-Type: multipart/form-data`, field `avatar` chứa file ảnh (JPEG/PNG/GIF, tối đa 5MB).

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400...",
    "email": "vana@example.com",
    "displayName": "Van A",
    "avatar": "1711620000000-avatar.jpg",
    "status": "ACTIVE"
  }
}
```

File ảnh được lưu tại `backend/uploads/avatars/` và truy cập qua URL:
`http://localhost:3333/uploads/avatars/1711620000000-avatar.jpg`

---

### Workspace Module — 11 endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/workspaces` | JWT | Tạo workspace mới |
| GET | `/api/v1/workspaces` | JWT | Danh sách workspaces của user |
| GET | `/api/v1/workspaces/:id` | JWT | Xem chi tiết workspace |
| PATCH | `/api/v1/workspaces/:id` | JWT | Cập nhật workspace |
| DELETE | `/api/v1/workspaces/:id` | JWT | Xóa workspace |
| POST | `/api/v1/workspaces/:id/invite` | JWT | Mời thành viên (tạo invite link) |
| POST | `/api/v1/workspaces/accept-invite/:token` | JWT | Chấp nhận lời mời |
| GET | `/api/v1/workspaces/:id/members` | JWT | Danh sách thành viên |
| PATCH | `/api/v1/workspaces/:id/members/:userId` | JWT | Thay đổi role thành viên |
| DELETE | `/api/v1/workspaces/:id/members/:userId` | JWT | Xóa thành viên khỏi workspace |
| DELETE | `/api/v1/workspaces/:id/leave` | JWT | Rời workspace |

**Ví dụ: POST /api/v1/workspaces**

Request:
```json
{
  "name": "Nhóm 24 - CCNLTHD",
  "description": "Workspace nhóm học môn Các Công Nghệ Lập Trình Hiện Đại"
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "660e8400-...",
    "name": "Nhóm 24 - CCNLTHD",
    "description": "Workspace nhóm...",
    "ownerId": "550e8400-...",
    "createdAt": "2026-03-28T09:00:00.000Z"
  }
}
```

---

### Project Module — 9 endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/workspaces/:wsId/projects` | JWT | Tạo project trong workspace |
| GET | `/api/v1/workspaces/:wsId/projects` | JWT | Danh sách projects |
| GET | `/api/v1/projects/:id` | JWT | Xem chi tiết project |
| PATCH | `/api/v1/projects/:id` | JWT | Cập nhật project |
| DELETE | `/api/v1/projects/:id` | JWT | Xóa project |
| POST | `/api/v1/projects/:id/archive` | JWT | Lưu trữ project |
| POST | `/api/v1/projects/:id/unarchive` | JWT | Khôi phục project |
| POST | `/api/v1/projects/:id/pin` | JWT | Ghim project |
| POST | `/api/v1/projects/:id/unpin` | JWT | Bỏ ghim project |

---

### Task Module — 14 endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/projects/:projectId/tasks` | JWT | Tạo task trong project |
| GET | `/api/v1/projects/:projectId/tasks` | JWT | Danh sách tasks (có filter) |
| GET | `/api/v1/tasks/:id` | JWT | Xem chi tiết task |
| PATCH | `/api/v1/tasks/:id` | JWT | Cập nhật task |
| DELETE | `/api/v1/tasks/:id` | JWT | Xóa task |
| PATCH | `/api/v1/tasks/:id/status` | JWT | Đổi trạng thái task |
| POST | `/api/v1/tasks/:id/assign` | JWT | Giao task cho thành viên |
| DELETE | `/api/v1/tasks/:id/assign/:userId` | JWT | Hủy giao task |
| POST | `/api/v1/tasks/:id/labels` | JWT | Thêm nhãn vào task |
| DELETE | `/api/v1/tasks/:id/labels/:labelId` | JWT | Xóa nhãn khỏi task |
| POST | `/api/v1/tasks/:id/subtasks` | JWT | Tạo subtask |
| GET | `/api/v1/tasks/:id/subtasks` | JWT | Danh sách subtasks |
| PATCH | `/api/v1/subtasks/:id/complete` | JWT | Đánh dấu subtask hoàn thành |
| DELETE | `/api/v1/subtasks/:id` | JWT | Xóa subtask |

**Ví dụ: POST /api/v1/projects/:projectId/tasks**

Request:
```json
{
  "title": "Viết báo cáo chương 9",
  "description": "Triển khai chi tiết đồ án",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2026-03-30T23:59:59.000Z"
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "770e8400-...",
    "title": "Viết báo cáo chương 9",
    "status": "TODO",
    "priority": "HIGH",
    "projectId": "660e8400-...",
    "createdById": "550e8400-...",
    "dueDate": "2026-03-30T23:59:59.000Z",
    "createdAt": "2026-03-28T09:00:00.000Z"
  }
}
```

**Ví dụ: GET /api/v1/projects/:projectId/tasks** (với filter)

Query parameters hỗ trợ:
- `status=TODO` — lọc theo trạng thái
- `priority=HIGH` — lọc theo độ ưu tiên
- `assigneeId=<uuid>` — lọc theo người được giao

---

## 9.4. Demo vận hành hệ thống

### Luồng demo chính (Happy Path)

Dưới đây là luồng sử dụng hoàn chỉnh từ đầu đến cuối, có thể thực hiện qua **Swagger UI** tại `http://localhost:3333/api-docs`:

**Bước 1:** `POST /auth/register` → Tạo tài khoản → nhận `accessToken`

**Bước 2:** Click **Authorize** trên Swagger, nhập `Bearer <accessToken>`

**Bước 3:** `POST /workspaces` → Tạo workspace "Nhóm 24"

**Bước 4:** `POST /workspaces/:id/invite` → Tạo invite link cho thành viên

**Bước 5:** `POST /workspaces/:wsId/projects` → Tạo project "TodoList App"

**Bước 6:** `POST /projects/:id/tasks` → Tạo task "Viết chapter 9"

**Bước 7:** `PATCH /tasks/:id/status` → Đổi status sang `IN_PROGRESS`

**Bước 8:** `POST /tasks/:id/subtasks` → Tạo subtask "Viết cấu trúc thư mục"

**Bước 9:** `PATCH /subtasks/:id/complete` → Đánh dấu subtask hoàn thành

**Bước 10:** `POST /auth/logout` → Đăng xuất, token bị vô hiệu hóa ngay lập tức

### Kiểm tra Token Blacklist

Sau khi logout, thử dùng lại token cũ:

```
GET /api/v1/users/me
Authorization: Bearer <token-đã-logout>
```

Response (401 Unauthorized):
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Token is invalidated",
  "path": "/api/v1/users/me"
}
```

Đây là minh chứng cho cơ chế **Token Blacklist** — token bị vô hiệu hóa ngay lập tức sau logout mà không cần chờ hết hạn.

### Kiểm tra Validation

Thử gửi request với dữ liệu sai định dạng:

```
POST /api/v1/auth/register
{
  "email": "khong-phai-email",
  "password": "123"
}
```

Response (400 Bad Request):
```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "fullname should not be empty"
  ],
  "path": "/api/v1/auth/register"
}
```

`ValidationPipe` tự động kiểm tra và trả về danh sách lỗi chi tiết.
