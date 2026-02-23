# WBS - WORK BREAKDOWN STRUCTURE
## DỰ ÁN: TODOLIST COLLABORATION API

> **Phiên bản:** 2.0  
> **Ngày cập nhật:** 01/02/2026  
> **Tập trung:** Backend API Development với NestJS + Prisma + PostgreSQL

---

# 📌 TỔNG QUAN DỰ ÁN

| Thuộc tính | Giá trị |
|------------|---------|
| **Tên dự án** | TodoList Collaboration API |
| **Mục tiêu** | Xây dựng REST API cho ứng dụng quản lý công việc nhóm |
| **Công nghệ chính** | NestJS, Prisma, PostgreSQL, JWT |
| **Số modules chính** | 7 (Auth, User, Workspace, Project, Task, Comment, Notification) |
| **Ước tính thời gian** | 8-10 tuần |

---

# PHẦN 1: WBS PHÂN CHIA CÔNG VIỆC (Task-Based WBS)

## 📊 Bảng WBS Chi Tiết với Thời gian & Phân công

| WBS ID | Tên công việc | Mô tả | Thời gian | Deliverables | Phụ thuộc |
|--------|---------------|-------|-----------|--------------|-----------|
| **1** | **PLANNING** | | **3 ngày** | | |
| 1.1 | Xác định scope & mục tiêu | Định nghĩa phạm vi, mục tiêu SMART | 1 ngày | Project Charter | - |
| 1.2 | Phân tích stakeholders | Xác định các bên liên quan | 0.5 ngày | Stakeholder List | 1.1 |
| 1.3 | Lập timeline & milestones | Gantt chart, các mốc quan trọng | 1 ngày | Project Schedule | 1.1 |
| 1.4 | Phân công nhóm | Phân vai trò và trách nhiệm | 0.5 ngày | RACI Matrix | 1.3 |
| **2** | **REQUIREMENTS** | | **4 ngày** | | |
| 2.1 | Thu thập yêu cầu | Phỏng vấn, brainstorm, nghiên cứu | 1 ngày | Requirements List | 1.1 |
| 2.2 | Phân tích & ưu tiên | MoSCoW prioritization | 0.5 ngày | Prioritized Backlog | 2.1 |
| 2.3 | Viết User Stories | Format: As a... I want... So that... | 1 ngày | USER_STORIES.md | 2.2 |
| 2.4 | Định nghĩa API Endpoints | Danh sách tất cả endpoints | 1 ngày | API Specification | 2.3 |
| 2.5 | Xác định NFRs | Performance, Security, Scalability | 0.5 ngày | NFR Document | 2.1 |
| **3** | **DESIGN** | | **5 ngày** | | |
| 3.1 | Thiết kế kiến trúc | Clean Architecture, Module structure | 1 ngày | Architecture Diagram | 2.4 |
| 3.2 | Thiết kế Database | ERD, Prisma Schema | 1.5 ngày | schema.prisma, ERD | 3.1 |
| 3.3 | Thiết kế API | RESTful conventions, DTOs | 1 ngày | API Design Doc | 3.1 |
| 3.4 | Thiết kế Security | Auth flow, RBAC matrix | 1 ngày | Security Design | 3.3 |
| 3.5 | Thiết kế UI/UX (basic) | Wireframes các màn hình chính | 0.5 ngày | Figma/Wireframes | 2.3 |
| **4** | **DEVELOPMENT** | | **30 ngày** | | |
| 4.1 | **Setup môi trường** | | **2 ngày** | | |
| 4.1.1 | Init NestJS project | Cấu trúc thư mục, base config | 0.5 ngày | NestJS Project | 3.1 |
| 4.1.2 | Setup Prisma + PostgreSQL | Database connection, schema | 0.5 ngày | DB Connection | 4.1.1 |
| 4.1.3 | Setup Docker | Docker Compose cho dev | 0.5 ngày | docker-compose.yml | 4.1.2 |
| 4.1.4 | Setup Git & CI | Git flow, GitHub Actions | 0.5 ngày | CI Pipeline | 4.1.1 |
| 4.2 | **Auth Module** | | **4 ngày** | | |
| 4.2.1 | Register API | Đăng ký với email/password | 1 ngày | POST /auth/register | 4.1.2 |
| 4.2.2 | Login API | Đăng nhập, trả JWT | 0.5 ngày | POST /auth/login | 4.2.1 |
| 4.2.3 | JWT Strategy | Access + Refresh token | 1 ngày | JWT Guards | 4.2.2 |
| 4.2.4 | Password Reset | Forgot + Reset password | 1 ngày | Reset Password Flow | 4.2.3 |
| 4.2.5 | OAuth (optional) | Google OAuth integration | 0.5 ngày | OAuth Login | 4.2.3 |
| 4.3 | **User Module** | | **2 ngày** | | |
| 4.3.1 | Get Profile | Lấy thông tin user | 0.5 ngày | GET /users/me | 4.2.3 |
| 4.3.2 | Update Profile | Cập nhật name, avatar | 0.5 ngày | PATCH /users/me | 4.3.1 |
| 4.3.3 | Change Password | Đổi mật khẩu | 0.5 ngày | PATCH /users/password | 4.3.1 |
| 4.3.4 | Upload Avatar | Upload ảnh đại diện | 0.5 ngày | POST /users/avatar | 4.3.2 |
| 4.4 | **Workspace Module** | | **4 ngày** | | |
| 4.4.1 | CRUD Workspace | Tạo, xem, sửa, xóa workspace | 1.5 ngày | Workspace APIs | 4.2.3 |
| 4.4.2 | Invite Member | Mời user vào workspace | 1 ngày | Invite Flow | 4.4.1 |
| 4.4.3 | Manage Roles | Owner, Admin, Member roles | 1 ngày | Role Management | 4.4.2 |
| 4.4.4 | Leave/Remove | Rời hoặc kick member | 0.5 ngày | Member Management | 4.4.3 |
| 4.5 | **Project Module** | | **3 ngày** | | |
| 4.5.1 | CRUD Project | Tạo, xem, sửa, xóa project | 1.5 ngày | Project APIs | 4.4.1 |
| 4.5.2 | Archive/Restore | Lưu trữ project | 0.5 ngày | Archive APIs | 4.5.1 |
| 4.5.3 | Pin/Unpin | Ghim project quan trọng | 0.5 ngày | Pin APIs | 4.5.1 |
| 4.5.4 | Project Settings | Cài đặt project | 0.5 ngày | Settings APIs | 4.5.1 |
| 4.6 | **Task Module** ⭐ | | **6 ngày** | | |
| 4.6.1 | CRUD Task | Tạo, xem, sửa, xóa task | 1.5 ngày | Task APIs | 4.5.1 |
| 4.6.2 | Status Management | TODO → IN_PROGRESS → DONE | 0.5 ngày | Status Update API | 4.6.1 |
| 4.6.3 | Assign/Unassign | Gán người thực hiện | 0.5 ngày | Assignment APIs | 4.6.1 |
| 4.6.4 | Priority & Due Date | Độ ưu tiên và deadline | 0.5 ngày | Task Properties | 4.6.1 |
| 4.6.5 | Subtasks | Chia nhỏ task | 1 ngày | Subtask APIs | 4.6.1 |
| 4.6.6 | Labels/Tags | Gắn nhãn phân loại | 0.5 ngày | Label APIs | 4.6.1 |
| 4.6.7 | Attachments | Upload file đính kèm | 1 ngày | Attachment APIs | 4.6.1 |
| 4.6.8 | Drag & Drop Order | Sắp xếp thứ tự | 0.5 ngày | Reorder API | 4.6.1 |
| 4.7 | **Comment Module** | | **2 ngày** | | |
| 4.7.1 | CRUD Comment | Thêm, sửa, xóa comment | 1 ngày | Comment APIs | 4.6.1 |
| 4.7.2 | Mention Users | @username notification | 0.5 ngày | Mention Feature | 4.7.1, 4.8 |
| 4.7.3 | Reply Comments | Thread comments | 0.5 ngày | Reply APIs | 4.7.1 |
| 4.8 | **Notification Module** | | **3 ngày** | | |
| 4.8.1 | In-app Notifications | Real-time notifications | 1.5 ngày | Notification APIs | 4.6.3 |
| 4.8.2 | Email Notifications | Send email thông báo | 1 ngày | Email Service | 4.8.1 |
| 4.8.3 | Notification Settings | Bật/tắt từng loại | 0.5 ngày | Settings APIs | 4.8.1 |
| 4.9 | **Search & Filter** | | **2 ngày** | | |
| 4.9.1 | Full-text Search | Tìm kiếm text | 1 ngày | Search APIs | 4.6.1 |
| 4.9.2 | Advanced Filters | Filter theo nhiều tiêu chí | 0.5 ngày | Filter Logic | 4.9.1 |
| 4.9.3 | Sorting & Pagination | Sắp xếp và phân trang | 0.5 ngày | Pagination | 4.9.2 |
| 4.10 | **Dashboard APIs** | | **2 ngày** | | |
| 4.10.1 | Statistics APIs | Thống kê tổng quan | 1 ngày | Stats APIs | 4.6.1 |
| 4.10.2 | Activity Log | Lịch sử hoạt động | 1 ngày | Activity APIs | 4.6.1 |
| **5** | **TESTING** | | **7 ngày** | | |
| 5.1 | Unit Tests | Test từng service/function | 2 ngày | Jest Test Files | 4.10 |
| 5.2 | Integration Tests | Test API endpoints | 2 ngày | Supertest Files | 5.1 |
| 5.3 | E2E Tests | Test full flow | 1.5 ngày | E2E Test Suite | 5.2 |
| 5.4 | Security Testing | Test vulnerabilities | 1 ngày | Security Report | 5.2 |
| 5.5 | Bug Fixing | Sửa lỗi phát hiện | Ongoing | Bug Fixes | 5.1-5.4 |
| **6** | **DEPLOYMENT** | | **3 ngày** | | |
| 6.1 | Setup Production Server | Cloud server configuration | 1 ngày | Server Ready | 5.3 |
| 6.2 | Database Migration | Migrate schema to prod | 0.5 ngày | Prod Database | 6.1 |
| 6.3 | CI/CD Pipeline | Automated deployment | 1 ngày | CI/CD Ready | 6.1 |
| 6.4 | Go-live & Smoke Test | Deploy và verify | 0.5 ngày | Live Application | 6.2, 6.3 |
| **7** | **MAINTENANCE** | | **Ongoing** | | |
| 7.1 | Monitoring & Logging | Giám sát hệ thống | Ongoing | Monitoring Setup | 6.4 |
| 7.2 | Bug Fixes | Sửa lỗi production | Ongoing | Patches | 6.4 |
| 7.3 | Feature Updates | Nâng cấp tính năng | Ongoing | New Features | 7.1 |

---

## 🎯 MILESTONES

| Milestone | Ngày dự kiến | Deliverables | Tiêu chí hoàn thành |
|-----------|-------------|--------------|---------------------|
| **M1: Project Kickoff** | Tuần 1 | Project Charter, WBS | Approved by team |
| **M2: Design Complete** | Tuần 2 | Architecture, ERD, API Spec | Design review passed |
| **M3: Core APIs Ready** | Tuần 4 | Auth, User, Workspace APIs | All endpoints working |
| **M4: Feature Complete** | Tuần 6 | All 7 modules done | 100% API implemented |
| **M5: Testing Complete** | Tuần 8 | Test coverage > 80% | All critical bugs fixed |
| **M6: Go Live** | Tuần 9 | Production deployed | Smoke test passed |

---

## 📈 SƠ ĐỒ GANTT (Simplified)

```
Tuần    1    2    3    4    5    6    7    8    9    10
        |----|----|----|----|----|----|----|----|----|----|
1.Plan  ████|    |    |    |    |    |    |    |    |    |
2.Req   ████████|    |    |    |    |    |    |    |    |
3.Design|    ████████|    |    |    |    |    |    |    |
4.Dev   |    |    ████████████████████████████|    |    |
  Auth  |    |    ████|    |    |    |    |    |    |    |
  User  |    |    |████|    |    |    |    |    |    |    |
  Worksp|    |    |    ████|    |    |    |    |    |    |
  Projct|    |    |    |████|    |    |    |    |    |    |
  Task  |    |    |    |    ████████|    |    |    |    |
  Commnt|    |    |    |    |    ████|    |    |    |    |
  Notif |    |    |    |    |    |████|    |    |    |    |
  Search|    |    |    |    |    |    ████|    |    |    |
5.Test  |    |    |    |    |    |    |████████████|    |
6.Deploy|    |    |    |    |    |    |    |    ████|    |
7.Maint |    |    |    |    |    |    |    |    |    ████→
        |    |    |    |    |    |    |    |    |    |    |
        M1   M2        M3        M4        M5   M6
```

---

# PHẦN 2: WBS PHÂN CHIA SẢN PHẨM (Product-Based WBS)

## 📦 Bảng WBS Sản phẩm với Acceptance Criteria

| WBS ID | Sản phẩm | Mô tả | Acceptance Criteria |
|--------|----------|-------|---------------------|
| **1** | **BACKEND API** | | |
| 1.1 | **Auth Module** | Xác thực & phân quyền | |
| 1.1.1 | AuthController | Xử lý requests | Có endpoints: register, login, refresh, logout, forgot-password, reset-password |
| 1.1.2 | AuthService | Business logic | Register tạo user, Login trả JWT, Refresh token hoạt động |
| 1.1.3 | JWT Strategy | Xác thực JWT | Valid token → pass, Invalid → 401, Expired → refresh |
| 1.1.4 | Auth Guards | Bảo vệ routes | Protected routes yêu cầu token, Public routes không yêu cầu |
| 1.1.5 | Auth DTOs | Data validation | RegisterDto, LoginDto, TokenDto với validation |
| 1.2 | **User Module** | Quản lý user | |
| 1.2.1 | UserController | | GET /me, PATCH /me, PATCH /password, POST /avatar |
| 1.2.2 | UserService | | Lấy, cập nhật profile, đổi password, upload avatar |
| 1.2.3 | User DTOs | | UpdateProfileDto, ChangePasswordDto validated |
| 1.3 | **Workspace Module** | Quản lý workspace | |
| 1.3.1 | WorkspaceController | | CRUD + invite + roles + members endpoints |
| 1.3.2 | WorkspaceService | | Tạo workspace, quản lý members, roles hoạt động |
| 1.3.3 | MemberService | | Invite, remove, update role hoạt động |
| 1.3.4 | Workspace Guards | | Chỉ members mới truy cập, Admin/Owner có quyền cao hơn |
| 1.3.5 | Workspace DTOs | | CreateWorkspace, InviteMember, UpdateRole validated |
| 1.4 | **Project Module** | Quản lý project | |
| 1.4.1 | ProjectController | | CRUD + archive + pin endpoints |
| 1.4.2 | ProjectService | | Tạo project thuộc workspace, archive/restore, pin/unpin |
| 1.4.3 | Project DTOs | | CreateProject, UpdateProject validated |
| 1.5 | **Task Module** ⭐ | Quản lý task | |
| 1.5.1 | TaskController | | CRUD + status + assign + subtasks + attachments |
| 1.5.2 | TaskService | | Tạo task, cập nhật status, assign members |
| 1.5.3 | SubtaskService | | CRUD subtasks, toggle complete |
| 1.5.4 | AttachmentService | | Upload/delete files, max 10MB |
| 1.5.5 | Task DTOs | | CreateTask, UpdateTask, FilterTask validated |
| 1.6 | **Comment Module** | Bình luận | |
| 1.6.1 | CommentController | | CRUD + mention + reply endpoints |
| 1.6.2 | CommentService | | Thêm comment, mention trigger notification |
| 1.6.3 | Comment DTOs | | CreateComment, UpdateComment validated |
| 1.7 | **Notification Module** | Thông báo | |
| 1.7.1 | NotificationController | | List, mark read, settings endpoints |
| 1.7.2 | NotificationService | | Tạo notification khi assign, mention, deadline |
| 1.7.3 | EmailService | | Gửi email thành công |
| 1.7.4 | Notification DTOs | | NotificationResponse, SettingsDto |
| 1.8 | **Common/Shared** | Modules dùng chung | |
| 1.8.1 | PrismaModule | Database ORM | Connection pool, query logging |
| 1.8.2 | ConfigModule | App configuration | Env variables loaded, validated |
| 1.8.3 | Exception Filters | Error handling | Consistent error response format |
| 1.8.4 | Interceptors | Response transform | Response wrapper, logging |
| 1.8.5 | Pipes | Validation | Automatic DTO validation |
| 1.8.6 | Custom Decorators | Utilities | @CurrentUser, @Roles decorators |
| 1.9 | **Database** | | |
| 1.9.1 | Prisma Schema | schema.prisma | Tất cả models defined, relations đúng |
| 1.9.2 | Migrations | DB migrations | Migrations chạy không lỗi |
| 1.9.3 | Seed Data | Test data | Có script seed data cho dev |
| 1.10 | **API Documentation** | | |
| 1.10.1 | Swagger Setup | OpenAPI 3.0 | Tất cả endpoints documented |
| 1.10.2 | API Examples | Request/Response | Mỗi endpoint có example |
| | | | |
| **2** | **FRONTEND (Basic)** | | |
| 2.1 | Auth Pages | Login, Register, Forgot | Functional forms, API integrated |
| 2.2 | Dashboard Page | Overview, My Tasks | Statistics displayed |
| 2.3 | Workspace Pages | List, Detail, Settings | CRUD hoạt động |
| 2.4 | Project Pages | List, Detail | CRUD hoạt động |
| 2.5 | Task Board | Kanban view | Drag & drop, status update |
| 2.6 | Task Detail | Modal/Page | All task info, comments, subtasks |
| | | | |
| **3** | **TÀI LIỆU** | | |
| 3.1 | **Tài liệu Yêu cầu** | | |
| 3.1.1 | Danh sách chức năng | FEATURES.md | 72 chức năng listed |
| 3.1.2 | User Stories | USER_STORIES.md | 60 user stories |
| 3.1.3 | NFRs | Performance, Security | Documented |
| 3.2 | **Tài liệu Thiết kế** | | |
| 3.2.1 | Kiến trúc hệ thống | ARCHITECTURE.md | Diagrams, explanations |
| 3.2.2 | Database Design | ERD.md | ERD diagram, schema |
| 3.2.3 | API Specification | API.md or Swagger | All endpoints |
| 3.3 | **Tài liệu Kỹ thuật** | | |
| 3.3.1 | README | README.md | Setup instructions |
| 3.3.2 | Deployment Guide | DEPLOYMENT.md | Step-by-step |
| 3.4 | **Hướng dẫn Sử dụng** | | |
| 3.4.1 | User Guide | USER_GUIDE.md | Feature usage |
| | | | |
| **4** | **TÀI LIỆU KIỂM THỬ** | | |
| 4.1 | Test Plan | TEST_PLAN.md | Scope, strategy, resources |
| 4.2 | Unit Tests | *.spec.ts files | Coverage > 80% |
| 4.3 | Integration Tests | *.e2e-spec.ts | API tests pass |
| 4.4 | Postman Collection | *.postman.json | All endpoints testable |
| 4.5 | Test Reports | Coverage reports | Pipeline reports |

---

## 🏗️ KIẾN TRÚC MODULE

```
┌─────────────────────────────────────────────────────────────────┐
│                        AppModule (Root)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    │                           │                           │
    ▼                           ▼                           ▼
┌─────────┐              ┌─────────────┐              ┌───────────┐
│ Common  │              │   Feature   │              │  Config   │
│ Module  │              │   Modules   │              │  Module   │
└────┬────┘              └──────┬──────┘              └───────────┘
     │                          │
     ▼                          ▼
┌─────────────┐    ┌─────────────────────────────────────────────┐
│• Prisma     │    │                                             │
│• Filters    │    │  ┌──────┐ ┌──────┐ ┌─────────┐ ┌─────────┐  │
│• Interceptor│    │  │ Auth │ │ User │ │Workspace│ │ Project │  │
│• Pipes      │    │  └──────┘ └──────┘ └─────────┘ └─────────┘  │
│• Guards     │    │                                             │
│• Decorators │    │  ┌──────┐ ┌───────┐ ┌────────────┐          │
└─────────────┘    │  │ Task │ │Comment│ │Notification│          │
                   │  └──────┘ └───────┘ └────────────┘          │
                   │                                             │
                   └─────────────────────────────────────────────┘
```

---

## 📁 CẤU TRÚC THƯ MỤC DỰ KIẾN

```
backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   │
│   ├── common/                 # Shared utilities
│   │   ├── decorators/        
│   │   ├── filters/           
│   │   ├── guards/            
│   │   ├── interceptors/      
│   │   └── pipes/             
│   │
│   ├── config/                 # Configuration
│   │   ├── config.module.ts
│   │   └── env.validation.ts
│   │
│   ├── prisma/                 # Database
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── modules/                # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   │
│   │   ├── user/
│   │   ├── workspace/
│   │   ├── project/
│   │   ├── task/
│   │   ├── comment/
│   │   └── notification/
│   │
│   └── shared/                 # Shared types, utils
│       ├── types/
│       └── utils/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                       # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# PHẦN 3: WBS DICTIONARY (Từ điển WBS)

## Định nghĩa các Work Packages quan trọng

### WP 4.2: Auth Module

| Thuộc tính | Chi tiết |
|------------|----------|
| **ID** | 4.2 |
| **Tên** | Auth Module Development |
| **Mô tả** | Xây dựng hệ thống xác thực và phân quyền cho ứng dụng |
| **Responsible** | Backend Developer |
| **Thời gian** | 4 ngày |
| **Inputs** | API Specification, Security Design |
| **Outputs** | AuthController, AuthService, JWT Strategy, Guards |
| **Dependencies** | 4.1 (Setup môi trường) |
| **Acceptance Criteria** | - Register tạo user mới với password hashed<br>- Login trả access + refresh token<br>- Protected routes yêu cầu valid token<br>- Refresh token hoạt động khi access expired<br>- Password reset qua email hoạt động |
| **Risks** | Token security, Email service failure |

### WP 4.6: Task Module

| Thuộc tính | Chi tiết |
|------------|----------|
| **ID** | 4.6 |
| **Tên** | Task Module Development |
| **Mô tả** | Xây dựng module quản lý công việc - core feature của ứng dụng |
| **Responsible** | Backend Developer |
| **Thời gian** | 6 ngày |
| **Inputs** | Database Schema, API Specification |
| **Outputs** | TaskController, TaskService, SubtaskService, AttachmentService |
| **Dependencies** | 4.5 (Project Module) |
| **Acceptance Criteria** | - CRUD task hoạt động<br>- Status workflow: TODO → IN_PROGRESS → REVIEW → DONE<br>- Assign/unassign members<br>- Priority levels: LOW, NORMAL, HIGH, URGENT<br>- Due date với reminder<br>- Subtasks CRUD + toggle complete<br>- File attachments upload/delete<br>- Drag & drop reorder |
| **Risks** | Performance với nhiều tasks, File storage |

---

# PHẦN 4: THỐNG KÊ TỔNG HỢP

## Phân bổ công việc theo Phase

| Phase | Công việc | % Effort | Thời gian |
|-------|-----------|----------|-----------|
| Planning | 4 | 5% | 3 ngày |
| Requirements | 5 | 8% | 4 ngày |
| Design | 5 | 10% | 5 ngày |
| Development | 40+ | 57% | 30 ngày |
| Testing | 5 | 13% | 7 ngày |
| Deployment | 4 | 5% | 3 ngày |
| Maintenance | Ongoing | 2% | Ongoing |
| **TOTAL** | **63+** | **100%** | **52+ ngày** |

## Phân bổ Development theo Module

| Module | Priority | Thời gian | % Dev Effort |
|--------|----------|-----------|--------------|
| Setup | - | 2 ngày | 7% |
| Auth | High | 4 ngày | 13% |
| User | Medium | 2 ngày | 7% |
| Workspace | High | 4 ngày | 13% |
| Project | Medium | 3 ngày | 10% |
| **Task** ⭐ | **Critical** | **6 ngày** | **20%** |
| Comment | Medium | 2 ngày | 7% |
| Notification | Medium | 3 ngày | 10% |
| Search & Filter | Medium | 2 ngày | 7% |
| Dashboard | Low | 2 ngày | 7% |
| **TOTAL** | | **30 ngày** | **100%** |

---

## ✅ CHECKLIST DELIVERABLES

### Backend API Deliverables
- [ ] Auth Module (Register, Login, JWT, Refresh, Reset)
- [ ] User Module (Profile, Avatar, Change Password)
- [ ] Workspace Module (CRUD, Invite, Roles, Members)
- [ ] Project Module (CRUD, Archive, Pin)
- [ ] Task Module (CRUD, Status, Assign, Subtasks, Attachments)
- [ ] Comment Module (CRUD, Mention, Reply)
- [ ] Notification Module (In-app, Email, Settings)
- [ ] Search & Filter APIs
- [ ] Dashboard/Statistics APIs
- [ ] Swagger Documentation

### Documentation Deliverables
- [ ] User Stories (USER_STORIES.md)
- [ ] WBS (WBS.md)
- [ ] ERD & Database Schema
- [ ] API Specification
- [ ] README with setup instructions
- [ ] Deployment Guide

### Testing Deliverables
- [ ] Unit Tests (Coverage > 80%)
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Postman Collection
- [ ] Test Reports
