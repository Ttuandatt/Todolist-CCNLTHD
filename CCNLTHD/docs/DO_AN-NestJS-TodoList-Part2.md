# PHẦN 3: XÂY DỰNG ĐỒ ÁN TỔNG HỢP

## Chương 9: Mô tả và phân tích thiết kế đồ án

### 9.1 Ý tưởng và mục tiêu đồ án

**TodoList Collaboration** là ứng dụng quản lý công việc cho cá nhân và team nhỏ, cho phép:

- Tạo và quản lý tasks với subtasks
- Tổ chức tasks theo workspaces và projects
- Collaboration: mời thành viên, phân công tasks
- Real-time updates khi có thay đổi
- File attachments cho tasks

### 9.2 Các chức năng chính

#### Authentication
| Chức năng | Mô tả |
|-----------|-------|
| Đăng ký | Email/Password |
| Đăng nhập | Email/Password, Google OAuth, GitHub OAuth |
| Quên mật khẩu | Reset qua email |
| Đổi mật khẩu | Trong profile settings |

#### Workspace Management
| Chức năng | Mô tả |
|-----------|-------|
| Tạo workspace | Không gian làm việc chung |
| Mời thành viên | Qua email invitation |
| Phân quyền | Owner, Admin, Member, Viewer |
| Settings | Đổi tên, avatar, xóa workspace |

#### Task Management
| Chức năng | Mô tả |
|-----------|-------|
| CRUD Tasks | Tạo, xem, sửa, xóa tasks |
| Subtasks | Tasks con lồng nhau |
| Labels | Gắn nhãn phân loại |
| Due date | Hạn hoàn thành |
| Priority | Urgent, High, Normal, Low |
| Assignment | Giao task cho members |
| Comments | Bình luận trên task |
| Attachments | Đính kèm files (max 50MB) |

#### Views
| View | Mô tả |
|------|-------|
| List View | Danh sách tasks truyền thống |
| Kanban Board | Drag & drop giữa các columns |

### 9.3 Công nghệ sử dụng

```
┌─────────────────────────────────────────────────────────────┐
│                      TECH STACK                              │
├─────────────────────────────────────────────────────────────┤
│  BACKEND                                                     │
│  ├── NestJS 10.x         Framework                          │
│  ├── TypeScript 5.x      Language                           │
│  ├── Prisma 5.x          ORM                                │
│  ├── PostgreSQL 15       Database                           │
│  ├── Redis               Cache & Queue                      │
│  ├── Bull                Job Queue                          │
│  ├── Socket.io           Real-time                          │
│  ├── Passport + JWT      Authentication                     │
│  └── Swagger             API Documentation                  │
├─────────────────────────────────────────────────────────────┤
│  FRONTEND                                                    │
│  ├── React 18            UI Framework                       │
│  ├── TypeScript          Language                           │
│  ├── Vite                Build Tool                         │
│  ├── Zustand             State Management                   │
│  ├── React Query         Server State                       │
│  ├── Socket.io-client    Real-time                          │
│  └── dnd-kit             Drag & Drop                        │
└─────────────────────────────────────────────────────────────┘
```

### 9.4 Thiết kế hệ thống

#### Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (React + Vite)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                               │
│                     (NestJS)                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Middlewares                        │    │
│  │  Logger → CORS → Auth → Rate Limit → Validation     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Auth   │ │   User   │ │Workspace │ │  Task    │       │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  File    │ │  Notif   │ │  Label   │ │ Comment  │       │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              WebSocket Gateway                       │    │
│  │         (Real-time notifications)                    │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Redis    │  │ File Store  │
│  (Primary)  │  │(Cache/Queue)│  │ (Local/S3)  │
└─────────────┘  └─────────────┘  └─────────────┘
```

#### Thiết kế Database (ERD)

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Workspace    │
├─────────────────┤       ├─────────────────┤
│ id         PK   │──┐    │ id         PK   │
│ email           │  │    │ name            │
│ name            │  │    │ ownerId    FK   │
│ passwordHash    │  │    │ createdAt       │
│ avatarUrl       │  │    └─────────────────┘
│ provider        │  │            │
│ createdAt       │  │            │ 1:N
└─────────────────┘  │            ▼
         │           │    ┌─────────────────┐
         │           │    │WorkspaceMember  │
         │           │    ├─────────────────┤
         │           └───▶│ workspaceId FK  │
         │                │ userId     FK   │
         └───────────────▶│ role            │
                          │ joinedAt        │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     Project     │       │      Task       │
├─────────────────┤       ├─────────────────┤
│ id         PK   │──────▶│ id         PK   │
│ workspaceId FK  │       │ projectId  FK   │
│ name            │       │ title           │
│ description     │       │ description     │
│ color           │       │ status          │
│ createdAt       │       │ priority        │
└─────────────────┘       │ dueDate         │
                          │ parentId   FK   │──┐ (self-ref)
                          │ position        │  │
                          │ createdById FK  │  │
                          │ createdAt       │◀─┘
                          └─────────────────┘
                                  │
                                  │ 1:N
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  TaskAssignee   │     │     Comment     │     │   Attachment    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ taskId     FK   │     │ id         PK   │     │ id         PK   │
│ userId     FK   │     │ taskId     FK   │     │ taskId     FK   │
│ assignedAt      │     │ userId     FK   │     │ userId     FK   │
└─────────────────┘     │ content         │     │ filename        │
                        │ createdAt       │     │ fileUrl         │
                        └─────────────────┘     │ fileSize        │
                                                │ mimeType        │
                                                └─────────────────┘
```

---

## Chương 10: API Endpoints

### 10.1 Authentication APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/github` | GitHub OAuth |

### 10.2 User APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users/me` | Thông tin user hiện tại |
| PATCH | `/api/users/me` | Cập nhật profile |
| PATCH | `/api/users/me/password` | Đổi mật khẩu |
| PATCH | `/api/users/me/avatar` | Upload avatar |

### 10.3 Workspace APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/workspaces` | List workspaces của user |
| POST | `/api/workspaces` | Tạo workspace |
| GET | `/api/workspaces/:id` | Chi tiết workspace |
| PATCH | `/api/workspaces/:id` | Cập nhật workspace |
| DELETE | `/api/workspaces/:id` | Xóa workspace |
| POST | `/api/workspaces/:id/invite` | Mời thành viên |
| GET | `/api/workspaces/:id/members` | List members |
| PATCH | `/api/workspaces/:id/members/:userId` | Đổi role |
| DELETE | `/api/workspaces/:id/members/:userId` | Xóa member |

### 10.4 Project APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/workspaces/:wid/projects` | List projects |
| POST | `/api/workspaces/:wid/projects` | Tạo project |
| GET | `/api/projects/:id` | Chi tiết project |
| PATCH | `/api/projects/:id` | Cập nhật project |
| DELETE | `/api/projects/:id` | Xóa project |

### 10.5 Task APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/projects/:pid/tasks` | List tasks |
| POST | `/api/projects/:pid/tasks` | Tạo task |
| GET | `/api/tasks/:id` | Chi tiết task |
| PATCH | `/api/tasks/:id` | Cập nhật task |
| DELETE | `/api/tasks/:id` | Xóa task |
| PATCH | `/api/tasks/:id/status` | Đổi status |
| POST | `/api/tasks/:id/assign` | Assign member |
| DELETE | `/api/tasks/:id/assign/:userId` | Unassign |
| GET | `/api/tasks/:id/comments` | List comments |
| POST | `/api/tasks/:id/comments` | Thêm comment |
| POST | `/api/tasks/:id/attachments` | Upload file |

---

## Chương 11: Triển khai và kết quả

### 11.1 Cấu trúc thư mục Backend

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── google.strategy.ts
│   │   │   │   └── github.strategy.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── user/
│   │   ├── workspace/
│   │   ├── project/
│   │   ├── task/
│   │   ├── comment/
│   │   ├── label/
│   │   ├── attachment/
│   │   └── notification/
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   │
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
└── package.json
```

### 11.2 Cấu trúc thư mục Frontend

```
frontend/
├── src/
│   ├── main.tsx                   # Entry point
│   ├── App.tsx                    # Root component
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   └── Loading/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── MainLayout/
│   │   └── task/
│   │       ├── TaskCard/
│   │       ├── TaskList/
│   │       ├── TaskDetail/
│   │       └── KanbanBoard/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── workspace/
│   │   ├── project/
│   │   └── settings/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── workspace/
│   │   ├── task/
│   │   └── notification/
│   │
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── public/
└── package.json
```

### 11.3 Hướng dẫn cài đặt và chạy

#### Prerequisites
```bash
# Cài đặt Node.js 18+
# Cài đặt PostgreSQL 15+
# Cài đặt Redis
```

#### Backend Setup
```bash
# Clone repository
git clone <repo-url>
cd todolist-collab/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Chỉnh sửa .env với database credentials

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

#### Frontend Setup
```bash
cd todolist-collab/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

### 11.4 Demo sản phẩm

#### Màn hình đăng nhập
- Form login với email/password
- OAuth buttons (Google, GitHub)
- Link đến trang đăng ký

#### Dashboard
- Danh sách workspaces
- Tạo workspace mới
- Quick stats

#### Workspace View
- Sidebar với projects
- Members panel
- Settings

#### Task List View
- Danh sách tasks
- Filters (status, priority, assignee)
- Search
- Bulk actions

#### Kanban Board
- Drag & drop tasks
- Status columns
- Quick add task

#### Task Detail
- Editable title/description
- Subtasks checklist
- Comments section
- Attachments
- Activity log

---

# PHẦN 4: TỔNG KẾT

## Chương 12: Đánh giá và tổng kết

### 12.1 Kết quả đạt được

| Mục tiêu | Kết quả |
|----------|---------|
| Hiểu kiến trúc NestJS | ✅ Nắm vững modules, DI, decorators |
| Xây dựng REST API | ✅ 30+ endpoints hoạt động |
| Tích hợp Prisma | ✅ 10+ models, migrations |
| Authentication JWT | ✅ Login, OAuth, guards |
| Real-time WebSocket | ✅ Live updates |
| Ứng dụng hoàn chỉnh | ✅ Full-stack TodoList |

### 12.2 Ưu điểm của NestJS

| Ưu điểm | Giải thích |
|---------|-----------|
| **Kiến trúc rõ ràng** | Modules giúp tổ chức code tốt |
| **TypeScript native** | Type safety, IDE support tốt |
| **DI mạnh mẽ** | Dễ test, loose coupling |
| **Ecosystem phong phú** | Nhiều packages official |
| **Documentation tốt** | Docs chi tiết, examples đầy đủ |

### 12.3 Nhược điểm và hạn chế

| Nhược điểm | Giải pháp |
|------------|----------|
| Learning curve | Quen dần sau 1-2 projects |
| Boilerplate code | Sử dụng CLI generate |
| Bundle size lớn | Tree-shaking, lazy loading |

### 12.4 Khó khăn gặp phải

| Khó khăn | Giải pháp đã áp dụng |
|----------|---------------------|
| Circular dependency | ForwardRef, module refactoring |
| WebSocket auth | Custom guard cho gateway |
| File upload 50MB | Chunked upload, streaming |
| Real-time sync | Optimistic updates, conflict resolution |

---

## Chương 13: Hướng phát triển

### 13.1 Cải tiến đồ án

| Feature | Mô tả |
|---------|-------|
| Offline mode | Service workers, IndexedDB |
| Mobile app | React Native |
| Calendar view | Timeline visualization |
| Recurring tasks | RRULE support |
| Time tracking | Pomodoro, time logs |
| Integrations | Slack, Discord webhooks |

### 13.2 Định hướng cá nhân

- Học sâu hơn về NestJS Microservices
- Tìm hiểu GraphQL với NestJS
- Nghiên cứu Event Sourcing, CQRS
- Deployment với Kubernetes
- Performance optimization

---

# TÀI LIỆU THAM KHẢO

1. **NestJS Official Documentation** - https://docs.nestjs.com
2. **Prisma Documentation** - https://www.prisma.io/docs
3. **TypeScript Handbook** - https://www.typescriptlang.org/docs
4. **Socket.io Documentation** - https://socket.io/docs
5. **JWT.io** - https://jwt.io
6. **PostgreSQL Documentation** - https://www.postgresql.org/docs

---

# PHỤ LỤC

## A. Link Repository

- **Backend:** `github.com/username/todolist-collab-backend`
- **Frontend:** `github.com/username/todolist-collab-frontend`

## B. Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/todolist"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
REDIS_HOST="localhost"
REDIS_PORT=6379
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"
```

## C. Database Migration Commands

```bash
# Generate migration
npx prisma migrate dev --name <migration-name>

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

*Hoàn thành báo cáo đồ án*
