# 📋 TodoList Collaboration App - Project Plan

> **Project:** TodoList với Collaboration Features  
> **Timeline:** 8 tuần (56 ngày làm việc)  
> **Team Size:** 4 developers  
> **Start Date:** 2026-01-21

---

## 📊 Executive Summary

Xây dựng ứng dụng TodoList full-stack với tính năng collaboration, cho phép người dùng cá nhân và team nhỏ quản lý tasks, projects hiệu quả.

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL |
| **Cache/Queue** | Redis + Bull |
| **Real-time** | Socket.io |
| **File Storage** | Local/S3-compatible (MinIO for dev) |
| **Auth** | JWT + Passport (Google, GitHub OAuth) |

---

## 🔍 Tech Stack Justification

### 1. Backend: NestJS vs Alternatives

| Criteria | NestJS | Express.js | Fastify |
|----------|--------|------------|---------|
| **TypeScript** | Native ✅ | Manual setup | Manual setup |
| **Structure** | Opinionated ✅ | Flexible (chaos risk) | Flexible |
| **DI System** | Built-in ✅ | None | None |
| **WebSocket** | `@nestjs/websockets` ✅ | socket.io manual | ws manual |
| **Testing** | Jest integrated ✅ | Manual setup | Manual setup |
| **Learning curve** | Medium | Low | Low |
| **Enterprise ready** | ✅ | ⚠️ | ⚠️ |

**🎯 Chọn NestJS vì:**
- **Modular architecture** → 4 developers có thể làm việc song song trên các modules khác nhau mà không conflict
- **Built-in WebSocket Gateway** → Essential cho real-time collaboration, không cần setup riêng
- **Dependency Injection** → Code testable, dễ mock dependencies
- **Decorators & Guards** → Permission system clean và maintainable
- **TypeScript native** → Type safety, better refactoring, IDE support tốt
- **Swagger integration** → API docs tự động generate

---

### 2. Database: PostgreSQL vs MySQL vs MongoDB

| Criteria | PostgreSQL | MySQL | MongoDB |
|----------|------------|-------|---------|
| **JSON support** | JSONB (indexed) ✅ | JSON (limited) | Native ✅ |
| **Complex queries** | Excellent ✅ | Good | Aggregation pipeline |
| **Transactions** | ACID ✅ | ACID ✅ | Multi-doc transactions |
| **Full-text search** | Built-in ✅ | Full-text | Atlas Search |
| **Relationships** | Native FK ✅ | Native FK | Embedded/Ref |
| **Scalability** | Horizontal (read) | Horizontal (read) | Horizontal ✅ |
| **Prisma support** | Excellent ✅ | Good | Good |

**🎯 Chọn PostgreSQL vì:**
- **JSONB** → Lưu metadata linh hoạt (activity log, notification data) với query performance tốt
- **Strong relationships** → Task-Project-Workspace-User có quan hệ phức tạp, cần FK constraints
- **Full-text search** → Search tasks/comments không cần Elasticsearch cho MVP
- **Transactions** → Ensure data integrity khi update nhiều tables (e.g., move task + update positions)
- **Prisma + PostgreSQL** = Best combination, type-safe queries, migrations mạnh

> **Tại sao không MongoDB?** → Collaboration app cần strong consistency và complex relationships. MongoDB flexible nhưng dễ có data inconsistency, không phù hợp cho task management với nhiều foreign keys.

---

### 3. ORM: Prisma vs TypeORM vs Sequelize

| Criteria | Prisma | TypeORM | Sequelize |
|----------|--------|---------|-----------|
| **Type safety** | Excellent ✅ | Good | Weak |
| **Schema-first** | ✅ | Code-first | Code-first |
| **Migrations** | Auto-generate ✅ | Manual | Manual |
| **Query builder** | Intuitive ✅ | Complex | Verbose |
| **Performance** | Good | Good | Good |
| **Raw queries** | Supported | Supported | Supported |
| **Learning curve** | Low ✅ | Medium | Medium |

**🎯 Chọn Prisma vì:**
- **Schema-first** → Single source of truth, dễ review database changes
- **Auto-generated types** → TypeScript types tự động sync với database schema
- **Intuitive API** → `prisma.task.findMany({ where: {...}, include: {...} })` readable hơn TypeORM
- **Prisma Studio** → GUI để debug data trong development
- **Migrations** → Auto-generate migration files từ schema changes

---

### 4. Frontend: React vs Vue vs Angular

| Criteria | React | Vue 3 | Angular |
|----------|-------|-------|---------|
| **Ecosystem** | Massive ✅ | Large | Large |
| **Flexibility** | High ✅ | Medium | Low (opinionated) |
| **Learning curve** | Medium | Low | High |
| **TypeScript** | Good ✅ | Good | Native |
| **State management** | Zustand/Redux | Pinia | NgRx |
| **Real-time libs** | socket.io-client ✅ | socket.io-client | socket.io-client |
| **Drag & drop** | react-dnd, dnd-kit ✅ | vue-draggable | cdk |

**🎯 Chọn React vì:**
- **User's preference** → Bạn đã chọn React
- **Ecosystem lớn nhất** → Nhiều libraries cho Kanban, drag-drop, rich text (comments)
- **Hiring pool** → Dễ tìm developers nếu cần expand team
- **Hooks** → Logic reuse tốt, clean code
- **Vite** → Fast dev server, HMR instant

---

### 5. State Management: Zustand vs Redux vs Jotai

| Criteria | Zustand | Redux Toolkit | Jotai |
|----------|---------|---------------|-------|
| **Boilerplate** | Minimal ✅ | Medium | Minimal |
| **Bundle size** | ~1KB ✅ | ~10KB | ~2KB |
| **DevTools** | ✅ | ✅ | ✅ |
| **Learning curve** | Very low ✅ | Medium | Low |
| **Async handling** | Simple ✅ | RTK Query | Simple |
| **TypeScript** | Excellent ✅ | Good | Good |

**🎯 Chọn Zustand vì:**
- **Simple API** → `const useStore = create((set) => ({...}))` - không có boilerplate
- **No providers** → Không cần wrap component tree
- **Immer built-in** → Immutable updates dễ dàng
- **Size** → Bundle size nhỏ, important cho performance
- **Combine với React Query** → Zustand cho UI state, React Query cho server state = perfect combo

---

### 6. Real-time: Socket.io vs WebSocket API vs Ably/Pusher

| Criteria | Socket.io | Native WebSocket | Ably/Pusher |
|----------|-----------|-----------------|-------------|
| **Fallback** | Auto ✅ | None | Auto |
| **Rooms/Namespaces** | Built-in ✅ | Manual | Built-in |
| **Reconnection** | Auto ✅ | Manual | Auto |
| **NestJS support** | `@nestjs/websockets` ✅ | Manual | SDK |
| **Cost** | Free ✅ | Free | Paid |
| **Scaling** | Redis adapter | Manual | Managed |

**🎯 Chọn Socket.io vì:**
- **NestJS integration** → `@WebSocketGateway()` decorator, seamless
- **Auto fallback** → Long-polling nếu WebSocket blocked
- **Rooms** → Perfect cho workspace-based updates (join room `workspace:123`)
- **Reconnection** → Handle network issues gracefully
- **Cost** → Free, self-hosted

---

### 7. Cache/Queue: Redis + Bull vs Alternatives

| Criteria | Redis + Bull | RabbitMQ | AWS SQS |
|----------|--------------|----------|---------|
| **Cache + Queue** | Both ✅ | Queue only | Queue only |
| **Setup** | Simple ✅ | Medium | Cloud-required |
| **NestJS support** | `@nestjs/bull` ✅ | Manual | SDK |
| **Job scheduling** | Built-in ✅ | Plugin | EventBridge |
| **Local dev** | Docker ✅ | Docker | LocalStack |

**🎯 Chọn Redis + Bull vì:**
- **Dual purpose** → Cache API responses + Job queue trong 1 service
- **Bull** → Scheduled jobs cho due date reminders, email notifications
- **NestJS Bull module** → Decorators cho job handlers
- **Performance** → In-memory cache cho frequent queries (workspace members, user profile)

---

### 8. File Storage: Local/MinIO vs S3 vs Cloudinary

| Criteria | Local/MinIO | AWS S3 | Cloudinary |
|----------|-------------|--------|------------|
| **Cost (dev)** | Free ✅ | Pay-per-use | Free tier |
| **50MB files** | ✅ | ✅ | ✅ |
| **S3-compatible** | MinIO ✅ | Native | No |
| **Migration path** | Easy to S3 ✅ | - | Different API |
| **Self-hosted** | ✅ | No | No |

**🎯 Chọn Local/MinIO vì:**
- **Development** → Local storage đơn giản, không cần cloud account
- **MinIO** → S3-compatible API, switch sang S3 production chỉ cần đổi endpoint
- **50MB limit** → Dễ implement chunked upload
- **Cost** → Free cho development phase

---

### 9. Auth: JWT + Passport vs Session vs Auth0

| Criteria | JWT + Passport | Session-based | Auth0/Clerk |
|----------|---------------|---------------|-------------|
| **Stateless** | ✅ | No | ✅ |
| **OAuth support** | Passport strategies ✅ | Manual | Built-in |
| **Cost** | Free ✅ | Free | Paid at scale |
| **Customization** | Full control ✅ | Full | Limited |
| **NestJS** | `@nestjs/passport` ✅ | express-session | SDK |

**🎯 Chọn JWT + Passport vì:**
- **Stateless** → Scalable, không cần session store
- **Passport strategies** → Google, GitHub OAuth đã có sẵn
- **Full control** → Custom claims, refresh token flow
- **NestJS integration** → Guards, decorators cho protected routes
- **Cost** → Free, không phụ thuộc third-party

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Auth UI   │  │  Task View  │  │  Kanban UI  │  │  Settings   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                              │                                      │
│                    ┌─────────┴─────────┐                            │
│                    │  State (Zustand)  │                            │
│                    └─────────┬─────────┘                            │
└────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   REST API + WS     │
                    └──────────┬──────────┘
                               │
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND (NestJS)                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        API Gateway                            │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │  │
│  │  │  Auth   │  │ Guards  │  │  Pipes  │  │   Interceptors  │   │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │ User Module │  │ Task Module │  │Project Module│  │Collab Module││
│  └─────────────┘  └─────────────┘  └──────────────┘  └─────────────┘│
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ File Module │  │Notif Module │  │ WS Gateway  │  │ Queue Jobs │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
       │ PostgreSQL  │  │    Redis    │  │ File Store  │
       │  (Primary)  │  │(Cache/Queue)│  │ (Local/S3)  │
       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 📦 Database Schema (Core Entities)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Workspace    │       │     Project     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │──┐    │ id              │──┐    │ id              │
│ email           │  │    │ name            │  │    │ workspace_id    │──┐
│ password_hash   │  │    │ owner_id        │  │    │ name            │  │
│ name            │  │    │ created_at      │  │    │ description     │  │
│ avatar_url      │  │    │ updated_at      │  │    │ color           │  │
│ provider        │  │    └─────────────────┘  │    │ created_at      │  │
│ provider_id     │  │                         │    └─────────────────┘  │
│ created_at      │  │    ┌─────────────────┐  │                         │
│ updated_at      │  │    │WorkspaceMember  │  │    ┌─────────────────┐  │
└─────────────────┘  │    ├─────────────────┤  │    │      Task       │  │
                     ├───▶│ workspace_id   │◀─┘    ├─────────────────┤  │
                     │    │ user_id         │◀──────│ id              │  │
                     │    │ role            │       │ project_id      │◀─┘
                     │    │ joined_at       │       │ title           │
                     │    └─────────────────┘       │ description     │
                     │                              │ status          │
                     │    ┌─────────────────┐       │ priority        │
                     │    │   TaskAssignee  │       │ due_date        │
                     │    ├─────────────────┤       │ parent_id       │
                     └───▶│ task_id         │◀─────│ position        │
                          │ user_id         │       │ created_by      │
                          │ assigned_at     │       │ created_at      │
                          └─────────────────┘       │ updated_at      │
                                                    └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Comment     │       │      Label      │       │   Attachment    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ task_id         │       │ workspace_id    │       │ task_id         │
│ user_id         │       │ name            │       │ user_id         │
│ content         │       │ color           │       │ filename        │
│ created_at      │       │ created_at      │       │ file_url        │
│ updated_at      │       └─────────────────┘       │ file_size       │
└─────────────────┘                                 │ mime_type       │
                          ┌─────────────────┐       │ created_at      │
                          │    TaskLabel    │       └─────────────────┘
                          ├─────────────────┤
                          │ task_id         │       ┌─────────────────┐
                          │ label_id        │       │  Notification   │
                          └─────────────────┘       ├─────────────────┤
                                                    │ id              │
                          ┌─────────────────┐       │ user_id         │
                          │  ActivityLog    │       │ type            │
                          ├─────────────────┤       │ title           │
                          │ id              │       │ content         │
                          │ workspace_id    │       │ data (JSON)     │
                          │ user_id         │       │ read_at         │
                          │ action          │       │ created_at      │
                          │ entity_type     │       └─────────────────┘
                          │ entity_id       │
                          │ metadata        │
                          │ created_at      │
                          └─────────────────┘
```

---

## 🎯 Feature Breakdown (MVP Scope)

### Phase 1: Foundation (Week 1-2)
- [x] Project setup (Backend + Frontend)
- [ ] Database schema + migrations
- [ ] Authentication (Email/Password)
- [ ] OAuth (Google, GitHub)
- [ ] User profile management
- [ ] Basic API structure

### Phase 2: Core Task Management (Week 3-4)
- [ ] Workspace CRUD
- [ ] Project CRUD
- [ ] Task CRUD với subtasks
- [ ] Labels/Tags system
- [ ] Task filtering & sorting
- [ ] List view UI

### Phase 3: Collaboration (Week 5-6)
- [ ] Workspace members management
- [ ] Role-based permissions (Owner/Admin/Member/Viewer)
- [ ] Task assignment
- [ ] Comments system
- [ ] Activity log
- [ ] Real-time updates (WebSocket)

### Phase 4: Advanced Features (Week 7)
- [ ] File attachments (max 50MB)
- [ ] Kanban board view
- [ ] Due date reminders
- [ ] Notifications system
- [ ] Search across workspace

### Phase 5: Polish & Testing (Week 8)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Integration testing
- [ ] Bug fixes
- [ ] Documentation

---

## 👥 Team Allocation

| Developer | Primary Focus | Secondary Focus |
|-----------|---------------|-----------------|
| **Dev 1** | Backend APIs, Auth | Database, Testing |
| **Dev 2** | Real-time, WebSocket | Backend APIs |
| **Dev 3** | Frontend Core | State Management |
| **Dev 4** | Frontend UI/UX | File Upload, Notifications |

---

## 📅 Sprint Planning (8 Weeks)

### Sprint 1 (Week 1-2): Foundation
**Goal:** Project setup và Authentication hoàn chỉnh

| Task | Assignee | Story Points | Priority |
|------|----------|--------------|----------|
| Backend project setup (NestJS, Prisma, PostgreSQL) | Dev 1 | 3 | P0 |
| Frontend project setup (React, Vite, Zustand) | Dev 3 | 3 | P0 |
| Database schema design & migrations | Dev 1 | 5 | P0 |
| Email/Password authentication | Dev 1 | 5 | P0 |
| OAuth Google integration | Dev 2 | 5 | P0 |
| OAuth GitHub integration | Dev 2 | 3 | P0 |
| Auth UI (Login, Register, Forgot Password) | Dev 3 | 5 | P0 |
| User profile API | Dev 1 | 3 | P1 |
| User profile UI | Dev 4 | 3 | P1 |
| API documentation setup (Swagger) | Dev 2 | 2 | P1 |
| **Sprint Total** | | **37 SP** | |

**Deliverables:**
- ✅ Authenticated users có thể login/register
- ✅ OAuth với Google và GitHub working
- ✅ User profile management
- ✅ API docs available

---

### Sprint 2 (Week 3-4): Core Task Management
**Goal:** CRUD đầy đủ cho Workspace, Project, Task

| Task | Assignee | Story Points | Priority |
|------|----------|--------------|----------|
| Workspace CRUD API | Dev 1 | 5 | P0 |
| Project CRUD API | Dev 1 | 5 | P0 |
| Task CRUD API (with subtasks) | Dev 2 | 8 | P0 |
| Labels/Tags API | Dev 2 | 3 | P1 |
| Task filtering & sorting API | Dev 1 | 5 | P0 |
| Workspace UI (create, list, settings) | Dev 3 | 5 | P0 |
| Project UI (sidebar, settings) | Dev 3 | 5 | P0 |
| Task List View UI | Dev 4 | 8 | P0 |
| Task Detail Modal | Dev 4 | 5 | P0 |
| Labels management UI | Dev 4 | 3 | P1 |
| Subtasks UI | Dev 3 | 3 | P1 |
| **Sprint Total** | | **55 SP** | |

**Deliverables:**
- ✅ Users có thể tạo workspaces và projects
- ✅ Full task management với subtasks
- ✅ Filtering và sorting working
- ✅ Labels/Tags attached to tasks

---

### Sprint 3 (Week 5-6): Collaboration Features
**Goal:** Multi-user collaboration đầy đủ với real-time

| Task | Assignee | Story Points | Priority |
|------|----------|--------------|----------|
| Workspace members API (invite, remove, roles) | Dev 1 | 8 | P0 |
| Permission guards & decorators | Dev 1 | 5 | P0 |
| Task assignment API | Dev 2 | 3 | P0 |
| Comments API | Dev 2 | 5 | P0 |
| Activity log API | Dev 2 | 5 | P1 |
| WebSocket Gateway setup | Dev 2 | 5 | P0 |
| Real-time task updates | Dev 2 | 8 | P0 |
| Members management UI | Dev 3 | 5 | P0 |
| Invite flow UI (email invite) | Dev 3 | 5 | P0 |
| Task assignment UI | Dev 4 | 3 | P0 |
| Comments UI | Dev 4 | 5 | P0 |
| Activity feed UI | Dev 3 | 5 | P1 |
| Real-time state sync (frontend) | Dev 4 | 5 | P0 |
| **Sprint Total** | | **67 SP** | |

**Deliverables:**
- ✅ Invite members to workspace
- ✅ Role-based access control
- ✅ Task assignment working
- ✅ Comments on tasks
- ✅ Real-time updates khi member khác thay đổi

---

### Sprint 4 (Week 7): Advanced Features
**Goal:** File attachments, Kanban view, Notifications

| Task | Assignee | Story Points | Priority |
|------|----------|--------------|----------|
| File upload service (50MB limit) | Dev 1 | 8 | P0 |
| Attachments API | Dev 1 | 5 | P0 |
| Notifications service (in-app) | Dev 2 | 5 | P0 |
| Due date reminder jobs (Bull queue) | Dev 2 | 5 | P1 |
| Notification preferences API | Dev 1 | 3 | P1 |
| File upload UI (drag & drop) | Dev 4 | 5 | P0 |
| Attachments preview | Dev 4 | 3 | P1 |
| Kanban board view | Dev 3 | 8 | P0 |
| Drag & drop tasks (Kanban) | Dev 3 | 5 | P0 |
| Notification center UI | Dev 4 | 5 | P0 |
| Global search API | Dev 2 | 5 | P1 |
| Global search UI | Dev 3 | 3 | P1 |
| **Sprint Total** | | **60 SP** | |

**Deliverables:**
- ✅ File attachments working (50MB)
- ✅ Kanban board với drag-drop
- ✅ In-app notifications
- ✅ Due date reminders
- ✅ Global search

---

### Sprint 5 (Week 8): Polish & Launch Ready
**Goal:** Quality, performance, và documentation

| Task | Assignee | Story Points | Priority |
|------|----------|--------------|----------|
| Integration tests (Backend) | Dev 1 | 8 | P0 |
| E2E tests (Critical flows) | Dev 2 | 5 | P0 |
| Performance optimization (API) | Dev 1 | 5 | P1 |
| Frontend unit tests | Dev 3 | 5 | P1 |
| UI/UX polish & responsive | Dev 4 | 8 | P0 |
| Error handling improvements | Dev 2 | 3 | P0 |
| Loading states & skeleton UI | Dev 4 | 3 | P1 |
| API documentation completion | Dev 1 | 3 | P1 |
| User guide / Help docs | Dev 3 | 5 | P2 |
| Bug fixes buffer | All | 10 | P0 |
| **Sprint Total** | | **55 SP** | |

**Deliverables:**
- ✅ Test coverage > 70%
- ✅ All critical bugs fixed
- ✅ Production-ready build
- ✅ Documentation complete

---

## 📊 Velocity & Capacity

| Sprint | Duration | Total SP | Per Dev/Week |
|--------|----------|----------|--------------|
| Sprint 1 | 2 weeks | 37 SP | ~4.6 SP |
| Sprint 2 | 2 weeks | 55 SP | ~6.9 SP |
| Sprint 3 | 2 weeks | 67 SP | ~8.4 SP |
| Sprint 4 | 1 week | 60 SP | ~15 SP |
| Sprint 5 | 1 week | 55 SP | ~13.8 SP |
| **Total** | **8 weeks** | **274 SP** | |

> ⚠️ **Note:** Sprint 4-5 có velocity cao, cần buffer time hoặc có thể move một số P1/P2 sang post-MVP.

---

## 🚀 Milestones

| Milestone | Target Date | Criteria |
|-----------|-------------|----------|
| **M1: Auth Complete** | End Week 2 | Users can register, login, OAuth |
| **M2: Task Management** | End Week 4 | Full CRUD, filtering, labels |
| **M3: Collaboration** | End Week 6 | Real-time, comments, members |
| **M4: MVP Complete** | End Week 7 | All features working |
| **M5: Production Ready** | End Week 8 | Tested, polished, documented |

---

## ⚠️ Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Real-time sync complexity | High | Medium | Start simple, iterate |
| File upload 50MB challenges | Medium | Low | Chunked upload, progress |
| OAuth provider issues | Medium | Low | Fallback to email auth |
| Scope creep | High | High | Strict MVP scope adherence |
| Performance with large workspaces | Medium | Medium | Pagination, lazy loading |

---

## 📁 Project Structure

```
todolist-collab/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── user/          # User management
│   │   │   ├── workspace/     # Workspaces
│   │   │   ├── project/       # Projects
│   │   │   ├── task/          # Tasks & subtasks
│   │   │   ├── label/         # Labels/Tags
│   │   │   ├── comment/       # Comments
│   │   │   ├── attachment/    # File attachments
│   │   │   ├── notification/  # Notifications
│   │   │   └── activity/      # Activity logs
│   │   ├── common/            # Shared utilities
│   │   ├── config/            # Configuration
│   │   └── prisma/            # Database schema
│   ├── test/                  # Tests
│   └── docs/                  # API docs
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # UI Components
│   │   ├── pages/             # Route pages
│   │   ├── features/          # Feature modules
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── store/             # Zustand stores
│   │   └── utils/             # Utilities
│   └── public/                # Static assets
│
├── docs/                      # Project docs
└── docker/                    # Docker configs
```

---

## ✅ Definition of Done

- [ ] Code reviewed by at least 1 team member
- [ ] Unit tests written (coverage > 70%)
- [ ] API documentation updated
- [ ] No console errors/warnings
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility basics (keyboard nav, ARIA)
- [ ] Performance acceptable (< 3s load time)

---

## 📚 Documentation Checklist

- [ ] README.md với setup instructions
- [ ] API Documentation (Swagger)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Contributing guide
- [ ] User guide (basic)

---

## 🔧 Development Guidelines

### Backend (NestJS)
- Sử dụng DTOs cho validation
- Guards cho authentication/authorization
- Interceptors cho response transformation
- Exception filters cho error handling
- Prisma cho database operations

### Frontend (React)
- Functional components với hooks
- Zustand cho state management
- React Query cho server state
- Component-based architecture
- CSS Modules hoặc Styled Components

### Git Workflow
- `main` - Production ready
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention
```
feat: Add task creation API
fix: Resolve auth token refresh issue
docs: Update API documentation
refactor: Simplify permission logic
test: Add workspace integration tests
```

---

> **Next Steps:** Review this plan và approve để bắt đầu implementation với `/create` command.
