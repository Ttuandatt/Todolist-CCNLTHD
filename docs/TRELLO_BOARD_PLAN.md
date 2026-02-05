# 📋 TRELLO BOARD PLAN - TodoList Collaboration

> **Board Name:** TodoList Collaboration Development  
> **Team:** 4 thành viên  
> **Thời gian:** 15 tuần

---

## 🏷️ LABELS (Nhãn màu)

| Màu | Label | Mô tả |
|-----|-------|-------|
| 🟢 | Học tập | Tìm hiểu công nghệ, đọc docs |
| 🔵 | Thiết kế | Phân tích, thiết kế hệ thống |
| 🟣 | Backend | Code NestJS |
| 🟠 | Frontend | Code React |
| 🔴 | Urgent | Việc gấp, deadline |
| 🟡 | Review | Cần review code/tài liệu |
| ⚪ | Báo cáo | Viết tài liệu báo cáo |

---

## 📅 LIST: TUẦN 1 - Giới thiệu & Setup cơ bản

### 🟢 Card 1: Tìm hiểu tổng quan dự án
**Assign:** Cả team  
**Checklist:**
- [ ] Hiểu yêu cầu đề tài "TodoList Collaboration"
- [ ] Đọc hiểu các chức năng chính
- [ ] Xác định công nghệ sử dụng
- [ ] Phân chia vai trò trong team

---

### 🔵 Card 2: Setup môi trường cá nhân
**Assign:** Cả team  
**Checklist:**
- [ ] Cài đặt Node.js
- [ ] Cài đặt Docker Desktop
- [ ] Cài đặt VS Code + Extensions
- [ ] Cài đặt Git
- [ ] Clone repository

---

### 🟢 Card 3: Tìm hiểu Git cơ bản
**Assign:** Cả team  
**Checklist:**
- [ ] Git clone, pull, push
- [ ] Git branch, checkout
- [ ] Git merge, rebase
- [ ] Pull Request workflow
- [ ] Resolve conflicts

---

## 📅 LIST: TUẦN 2 - TypeScript Fundamentals

### 🟢 Card 1: TypeScript cơ bản (Part 1)
**Assign:** Cả team  
**Checklist:**
- [ ] Hiểu Types cơ bản (string, number, boolean)
- [ ] Arrays và Objects
- [ ] Type inference
- [ ] Union types
- [ ] Type aliases

**Tài liệu:** `docs/knowledge/01-typescript-fundamentals.md`

---

### 🟢 Card 2: TypeScript nâng cao (Part 2)
**Assign:** Cả team  
**Checklist:**
- [ ] Interface vs Type
- [ ] Generics
- [ ] Utility types
- [ ] Decorators
- [ ] Modules và Namespaces

---

### 🟢 Card 3: Bài tập thực hành TypeScript
**Assign:** Cả team  
**Checklist:**
- [ ] Viết 5 bài tập nhỏ
- [ ] Review code chéo
- [ ] Sửa lỗi và cải thiện

---

## 📅 LIST: TUẦN 3 - NestJS Core Architecture

### 🟢 Card 1: Tìm hiểu NestJS - Modules & Controllers
**Assign:** Cả team  
**Checklist:**
- [ ] NestJS là gì, tại sao dùng
- [ ] Cấu trúc project NestJS
- [ ] Modules (@Module decorator)
- [ ] Controllers (@Controller, @Get, @Post...)
- [ ] Route parameters và Query

**Tài liệu:** `docs/knowledge/02-nestjs-core.md`

---

### 🟢 Card 2: Tìm hiểu NestJS - Services & DI
**Assign:** Cả team  
**Checklist:**
- [ ] Providers và Services
- [ ] Dependency Injection
- [ ] @Injectable decorator
- [ ] Module imports/exports
- [ ] Scope (DEFAULT, REQUEST, TRANSIENT)

---

### 🔵 Card 3: Setup Backend Project
**Assign:** Team Lead + 1 member  
**Checklist:**
- [ ] Tạo NestJS project
- [ ] Cấu hình ESLint, Prettier
- [ ] Setup Docker PostgreSQL
- [ ] Cấu hình Prisma
- [ ] Tạo .env.example

---

## 📅 LIST: TUẦN 4 - DTOs, Validation & Prisma

### 🟢 Card 1: DTOs và Validation
**Assign:** Cả team  
**Checklist:**
- [ ] Tạo DTOs với class-validator
- [ ] @IsString, @IsEmail, @IsNotEmpty...
- [ ] ValidationPipe
- [ ] Transform với class-transformer
- [ ] Custom validators

---

### 🟢 Card 2: Tìm hiểu Prisma ORM
**Assign:** Cả team  
**Checklist:**
- [ ] Prisma schema syntax
- [ ] Scalar types và Enums
- [ ] Relations (1-1, 1-N, N-N)
- [ ] Prisma migrations
- [ ] Prisma Client CRUD

**Tài liệu:** `docs/knowledge/03-database-prisma.md`

---

### 🟣 Card 3: Thực hành Prisma
**Assign:** 2 members  
**Checklist:**
- [ ] Tạo PrismaService
- [ ] Tạo PrismaModule (global)
- [ ] Viết schema User đơn giản
- [ ] Chạy migration
- [ ] Test CRUD operations

---

## 📅 LIST: TUẦN 5 - Phân tích & Thiết kế hệ thống

### 🔵 Card 1: Phân tích yêu cầu
**Assign:** Team Lead + 1 member  
**Checklist:**
- [ ] Xác định Actors (User, Admin)
- [ ] Liệt kê Functional Requirements
- [ ] Liệt kê Non-functional Requirements
- [ ] Viết User Stories
- [ ] Ưu tiên features (MoSCoW)

---

### 🔵 Card 2: Thiết kế Use Case
**Assign:** 1 member  
**Checklist:**
- [ ] Vẽ Use Case Diagram tổng quan
- [ ] UC: Authentication
- [ ] UC: Workspace Management
- [ ] UC: Project Management
- [ ] UC: Task Management
- [ ] UC: Collaboration

---

### 🔵 Card 3: Thiết kế Database Schema
**Assign:** 2 members  
**Checklist:**
- [ ] Vẽ ERD (Entity Relationship Diagram)
- [ ] Định nghĩa entities chi tiết
- [ ] Xác định relationships
- [ ] Indexes và constraints
- [ ] Review với team

---

## 📅 LIST: TUẦN 6 - Thiết kế chi tiết

### 🔵 Card 1: Thiết kế System Architecture
**Assign:** Team Lead  
**Checklist:**
- [ ] Vẽ Overall Architecture Diagram
- [ ] Vẽ Component Diagram
- [ ] Vẽ Deployment Diagram
- [ ] Document tech stack justification

---

### 🔵 Card 2: Thiết kế API Endpoints
**Assign:** 2 members  
**Checklist:**
- [ ] List tất cả API endpoints
- [ ] Định nghĩa request/response format
- [ ] HTTP methods và status codes
- [ ] Authentication requirements
- [ ] Viết OpenAPI/Swagger spec

---

### 🔵 Card 3: Thiết kế Sequence Diagrams
**Assign:** 1 member  
**Checklist:**
- [ ] Sequence: User Registration
- [ ] Sequence: User Login
- [ ] Sequence: Create Task
- [ ] Sequence: Real-time Update

---

## 📅 LIST: TUẦN 7 - Authentication (Part 1)

### 🟢 Card 1: Tìm hiểu JWT Authentication
**Assign:** Cả team  
**Checklist:**
- [ ] JWT là gì, cấu trúc
- [ ] Access Token vs Refresh Token
- [ ] JWT verify và decode
- [ ] Token expiration
- [ ] Security best practices

**Tài liệu:** `docs/knowledge/04-authentication-security.md`

---

### 🟢 Card 2: Tìm hiểu Passport.js
**Assign:** 2 members  
**Checklist:**
- [ ] Passport strategies
- [ ] Local strategy
- [ ] JWT strategy
- [ ] Guards trong NestJS
- [ ] Custom decorators

---

### 🟣 Card 3: Implement User Module
**Assign:** 1 member  
**Checklist:**
- [ ] Tạo User model trong Prisma
- [ ] Chạy migration
- [ ] Tạo UserModule
- [ ] UserService với CRUD
- [ ] UserController (admin only)

---

## 📅 LIST: TUẦN 8 - Authentication (Part 2)

### 🟣 Card 1: Implement Register
**Assign:** 1 member  
**Checklist:**
- [ ] Tạo AuthModule
- [ ] RegisterDto với validation
- [ ] Hash password với bcrypt
- [ ] Check duplicate email
- [ ] Return user (không password)
- [ ] Test với Postman

---

### 🟣 Card 2: Implement Login
**Assign:** 1 member  
**Checklist:**
- [ ] LoginDto
- [ ] Validate credentials
- [ ] Generate JWT token
- [ ] Return token + user info
- [ ] Test với Postman

---

### 🟣 Card 3: Implement Guards & Decorators
**Assign:** 1 member  
**Checklist:**
- [ ] JwtStrategy
- [ ] JwtAuthGuard
- [ ] @CurrentUser decorator
- [ ] Protect routes
- [ ] Test protected endpoints

---

## 📅 LIST: TUẦN 9 - Workspace & Project Modules

### 🟣 Card 1: Workspace Module
**Assign:** 2 members  
**Checklist:**
- [ ] Workspace model
- [ ] WorkspaceModule
- [ ] CRUD endpoints
- [ ] Owner authorization
- [ ] Unit tests

---

### 🟣 Card 2: Project Module
**Assign:** 2 members  
**Checklist:**
- [ ] Project model (belongs to Workspace)
- [ ] ProjectModule
- [ ] CRUD endpoints
- [ ] Validate workspace ownership
- [ ] Unit tests

---

### 🟡 Card 3: Code Review Sprint 1
**Assign:** Team Lead  
**Checklist:**
- [ ] Review code conventions
- [ ] Check error handling
- [ ] Review security
- [ ] Refactor nếu cần
- [ ] Update documentation

---

## 📅 LIST: TUẦN 10 - Task Management

### 🟣 Card 1: Task Module - CRUD
**Assign:** 2 members  
**Checklist:**
- [ ] Task model (status, priority, dueDate)
- [ ] TaskModule
- [ ] Create, Read, Update, Delete
- [ ] Validate project ownership
- [ ] Unit tests

---

### 🟣 Card 2: Task Features - Filters
**Assign:** 1 member  
**Checklist:**
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Filter by assignee
- [ ] Filter by date range
- [ ] Search by title/description

---

### 🟣 Card 3: Task Features - Advanced
**Assign:** 1 member  
**Checklist:**
- [ ] Subtasks (self-referencing)
- [ ] Labels/Tags
- [ ] Sorting options
- [ ] Pagination
- [ ] Bulk operations

---

## 📅 LIST: TUẦN 11 - Collaboration Features

### 🟣 Card 1: Member Management
**Assign:** 2 members  
**Checklist:**
- [ ] WorkspaceMember model
- [ ] Invite member endpoint
- [ ] Accept/Reject invitation
- [ ] Remove member
- [ ] List members

---

### 🟣 Card 2: Role-based Permissions
**Assign:** 1 member  
**Checklist:**
- [ ] Define roles (OWNER, ADMIN, MEMBER, VIEWER)
- [ ] RolesGuard
- [ ] @Roles decorator
- [ ] Permission checks
- [ ] Test permissions

---

### 🟣 Card 3: Comments Module
**Assign:** 1 member  
**Checklist:**
- [ ] Comment model
- [ ] Add comment to task
- [ ] List comments
- [ ] Edit comment
- [ ] Delete comment

---

## 📅 LIST: TUẦN 12 - Real-time Features

### 🟢 Card 1: Tìm hiểu WebSocket
**Assign:** 2 members  
**Checklist:**
- [ ] WebSocket vs HTTP
- [ ] Socket.io library
- [ ] NestJS Gateway
- [ ] Rooms và Broadcasting
- [ ] Connection lifecycle

**Tài liệu:** `docs/knowledge/05-realtime-websocket.md`

---

### 🟣 Card 2: Implement WebSocket Gateway
**Assign:** 2 members  
**Checklist:**
- [ ] EventsGateway
- [ ] WebSocket authentication (JWT)
- [ ] Join workspace room
- [ ] Real-time task updates
- [ ] Handle disconnection

---

### 🟣 Card 3: Notifications
**Assign:** 1 member  
**Checklist:**
- [ ] Notification model
- [ ] Create notification on events
- [ ] Push via WebSocket
- [ ] Mark as read
- [ ] List notifications

---

## 📅 LIST: TUẦN 13 - Advanced Features & Polish

### 🟣 Card 1: File Attachments
**Assign:** 1 member  
**Checklist:**
- [ ] Multer setup
- [ ] Upload endpoint
- [ ] Store metadata in DB
- [ ] Attach to task
- [ ] Download file

---

### 🟣 Card 2: Activity Log
**Assign:** 1 member  
**Checklist:**
- [ ] ActivityLog model
- [ ] Log task changes
- [ ] Log member actions
- [ ] View activity feed
- [ ] Filter by type

---

### 🟡 Card 3: Code Review & Optimization
**Assign:** Team Lead  
**Checklist:**
- [ ] Performance review
- [ ] Security audit
- [ ] Code cleanup
- [ ] Optimize queries
- [ ] Error handling

---

## 📅 LIST: TUẦN 14 - Testing & Documentation

### 🟡 Card 1: Unit Testing
**Assign:** Cả team  
**Checklist:**
- [ ] Test AuthService
- [ ] Test WorkspaceService
- [ ] Test ProjectService
- [ ] Test TaskService
- [ ] Coverage > 70%

---

### 🟡 Card 2: E2E Testing
**Assign:** 2 members  
**Checklist:**
- [ ] Setup test database
- [ ] Test Auth endpoints
- [ ] Test CRUD endpoints
- [ ] Test WebSocket
- [ ] CI/CD integration

---

### 🔵 Card 3: API Documentation
**Assign:** 1 member  
**Checklist:**
- [ ] Setup Swagger
- [ ] Document all endpoints
- [ ] Request/Response examples
- [ ] Authentication docs
- [ ] Generate OpenAPI spec

---

## 📅 LIST: TUẦN 15 - Báo cáo & Demo

### ⚪ Card 1: Viết báo cáo - Phần 1, 2
**Assign:** 2 members  
**Checklist:**
- [ ] Lời mở đầu
- [ ] Phần 1: Giới thiệu
- [ ] Phần 2: Tổng quan công nghệ
- [ ] Review và chỉnh sửa

---

### ⚪ Card 2: Viết báo cáo - Phần 3, 4
**Assign:** 2 members  
**Checklist:**
- [ ] Phần 3: Nội dung cốt lõi và thực hành
- [ ] Phần 4: Xây dựng đồ án
- [ ] Mapping code với kiến thức
- [ ] Screenshots, diagrams
- [ ] Review và chỉnh sửa

---

### ⚪ Card 3: Phần kết luận & Demo
**Assign:** Team Lead  
**Checklist:**
- [ ] Phần 5: Tổng kết
- [ ] Tài liệu tham khảo
- [ ] Chuẩn bị slides
- [ ] Record demo video
- [ ] Rehearse presentation

---

## 📊 TỔNG QUAN 15 TUẦN

| Tuần | Focus | Chủ đề chính |
|------|-------|--------------|
| 1 | 🟢 Setup | Giới thiệu, Git, Môi trường |
| 2 | 🟢 Learning | TypeScript Fundamentals |
| 3 | 🟢 Learning | NestJS Core Architecture |
| 4 | 🟢 Learning | DTOs, Validation, Prisma |
| 5 | 🔵 Design | Phân tích yêu cầu, Use Case, ERD |
| 6 | 🔵 Design | Architecture, API, Sequence |
| 7 | 🟢🟣 Auth | JWT, Passport, User Module |
| 8 | 🟣 Auth | Register, Login, Guards |
| 9 | 🟣 CRUD | Workspace, Project Modules |
| 10 | 🟣 CRUD | Task Management |
| 11 | 🟣 Collab | Members, Roles, Comments |
| 12 | 🟣 Real-time | WebSocket, Notifications |
| 13 | 🟣 Advanced | Attachments, Activity, Polish |
| 14 | 🟡 QA | Testing, Documentation |
| 15 | ⚪ Report | Báo cáo, Demo, Presentation |

---

## 👥 PHÂN CÔNG TEAM

| Member | Chuyên môn | Tuần chính |
|--------|------------|------------|
| **Lead** | Architecture, Review | 5-6, 9, 13-15 |
| **Member 2** | Database, CRUD | 4-6, 9-10 |
| **Member 3** | Auth, Security | 7-8, 11 |
| **Member 4** | Features, Real-time | 10-12 |

---

## 🔗 LIÊN KẾT

- **Repository:** https://github.com/Ttuandatt/Todolist-CCNLTHD
- **Knowledge Base:** `docs/knowledge/`
- **Checkpoints:** `docs/CHECKPOINTS.md`
- **Progress Log:** `docs/PROGRESS_LOG.md`
