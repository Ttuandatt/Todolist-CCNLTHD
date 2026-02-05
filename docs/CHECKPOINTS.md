# 🎯 IMPLEMENTATION CHECKPOINTS - TodoList Collaboration

> **Trạng thái:** In Progress  
> **Cập nhật:** 22/01/2026

---

## ✅ PHASE 0: Environment Setup (HOÀN THÀNH)
- [x] Node.js v24.12.0
- [x] Docker + PostgreSQL container
- [x] NestJS CLI v11.0.16
- [x] Backend project created
- [x] Prisma initialized

---

## 🔲 PHASE 1: Database Schema & Prisma (Checkpoint 1)

### Mục tiêu: Hoàn thành database schema

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Cấu hình DATABASE_URL trong `.env` | ⬜ | |
| Tạo schema User | ⬜ | |
| Tạo schema Workspace | ⬜ | |
| Tạo schema Project | ⬜ | |
| Tạo schema Task | ⬜ | |
| Chạy `prisma migrate dev` | ⬜ | |
| Tạo PrismaService | ⬜ | |
| Tạo PrismaModule (Global) | ⬜ | |

**✅ Checkpoint 1 Done khi:** Database có đầy đủ tables, PrismaService hoạt động

---

## 🔲 PHASE 2: Authentication Module (Checkpoint 2)

### Mục tiêu: Register/Login hoạt động

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Tạo AuthModule | ⬜ | |
| Tạo UserModule | ⬜ | |
| Tạo DTOs (RegisterDto, LoginDto) | ⬜ | |
| Cài bcrypt, @nestjs/jwt, @nestjs/passport | ⬜ | |
| Implement Register (hash password) | ⬜ | |
| Implement Login (generate JWT) | ⬜ | |
| Tạo JwtStrategy | ⬜ | |
| Tạo JwtAuthGuard | ⬜ | |
| Tạo @CurrentUser decorator | ⬜ | |
| Test với Postman | ⬜ | |

**✅ Checkpoint 2 Done khi:** Có thể Register, Login, và access protected route

---

## 🔲 PHASE 3: Workspace & Project CRUD (Checkpoint 3)

### Mục tiêu: CRUD cơ bản hoạt động

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Tạo WorkspaceModule | ⬜ | |
| CRUD Workspace (Create, Read, Update, Delete) | ⬜ | |
| Tạo ProjectModule | ⬜ | |
| CRUD Project | ⬜ | |
| Validation với class-validator | ⬜ | |
| Test endpoints | ⬜ | |

**✅ Checkpoint 3 Done khi:** Có thể tạo Workspace → tạo Project trong Workspace

---

## 🔲 PHASE 4: Task Management (Checkpoint 4)

### Mục tiêu: Quản lý Task đầy đủ

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Tạo TaskModule | ⬜ | |
| CRUD Task | ⬜ | |
| Task status (TODO, IN_PROGRESS, DONE) | ⬜ | |
| Task priority (LOW, NORMAL, HIGH, URGENT) | ⬜ | |
| Subtasks (self-referencing) | ⬜ | |
| Task filtering & sorting | ⬜ | |

**✅ Checkpoint 4 Done khi:** Có thể tạo, sửa, xóa, lọc tasks

---

## 🔲 PHASE 5: Members & Comments (Checkpoint 5)

### Mục tiêu: Collaboration features

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| WorkspaceMember model | ⬜ | |
| Invite member to workspace | ⬜ | |
| Role-based permissions | ⬜ | |
| Task assignment | ⬜ | |
| Comments on tasks | ⬜ | |
| Labels/Tags | ⬜ | |

**✅ Checkpoint 5 Done khi:** Có thể mời member, assign task, comment

---

## 🔲 PHASE 6: Real-time & Notifications (Checkpoint 6)

### Mục tiêu: WebSocket hoạt động

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Cài @nestjs/websockets socket.io | ⬜ | |
| Tạo EventsGateway | ⬜ | |
| WebSocket authentication | ⬜ | |
| Real-time task updates | ⬜ | |
| Notification module | ⬜ | |

**✅ Checkpoint 6 Done khi:** Thay đổi task được broadcast real-time

---

## 🔲 PHASE 7: Advanced Features (Checkpoint 7)

### Mục tiêu: Features nâng cao

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| File attachments (upload) | ⬜ | |
| Activity log | ⬜ | |
| Search functionality | ⬜ | |
| Swagger documentation | ⬜ | |

**✅ Checkpoint 7 Done khi:** Upload file, search, API docs hoạt động

---

## 🔲 PHASE 8: Testing & Polish (Checkpoint 8)

### Mục tiêu: Production-ready

| Task | Trạng thái | Ghi chú |
|------|------------|---------|
| Unit tests | ⬜ | |
| E2E tests | ⬜ | |
| Error handling | ⬜ | |
| Logging | ⬜ | |
| Performance optimization | ⬜ | |

---

## 📊 TỔNG TIẾN ĐỘ

| Phase | Trạng thái | % |
|-------|------------|---|
| Phase 0: Setup | ✅ Done | 100% |
| Phase 1: Database | ⬜ | 0% |
| Phase 2: Auth | ⬜ | 0% |
| Phase 3: Workspace/Project | ⬜ | 0% |
| Phase 4: Task | ⬜ | 0% |
| Phase 5: Collaboration | ⬜ | 0% |
| Phase 6: Real-time | ⬜ | 0% |
| Phase 7: Advanced | ⬜ | 0% |
| Phase 8: Testing | ⬜ | 0% |

**Overall: ~12%** (Phase 0 complete)

---

## 🔜 NEXT ACTION

**Bắt đầu Phase 1:** Cấu hình DATABASE_URL và tạo Prisma schema
