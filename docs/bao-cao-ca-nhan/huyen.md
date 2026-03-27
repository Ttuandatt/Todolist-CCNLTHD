<p align="center"><b>[TÊN TRƯỜNG]</b></p>
<p align="center"><b>[TÊN KHOA]</b></p>
<p align="center">───────────────────</p>

<br/>

<p align="center"><b>BÁO CÁO CÁ NHÂN</b></p>
<p align="center"><b>ĐỒ ÁN CUỐI KỲ — CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI</b></p>

<br/>

| Thông tin | Nội dung |
|-----------|----------|
| **Họ và tên** | Trần Khánh Huyền |
| **MSSV** | 3122410156 |
| **Email** | trankhanhhuyen601901@gmail.com |
| **SĐT** | 0945064690 |
| **Vai trò** | Thành viên — Phụ trách Project + Comment + Notification modules |
| **Tên đề tài** | Tìm hiểu công nghệ NestJS |
| **GVHD** | Phạm Thi Vương |

---

## 1. GIỚI THIỆU ĐỀ TÀI VÀ NHÓM

### 1.1. Tổng quan đề tài

Đồ án nghiên cứu và trình bày công nghệ **NestJS** — framework Node.js xây dựng trên TypeScript, sử dụng kiến trúc module hóa với Dependency Injection. Nhóm xây dựng ứng dụng **TodoList Collaboration** (quản lý công việc nhóm) để minh họa các kỹ thuật đặc trưng của NestJS trong thực tế.

### 1.2. Thành viên nhóm

| STT | Họ tên | MSSV | Vai trò |
|:---:|--------|------|---------|
| 1 | Phan Cảnh Tuấn Đạt | 3122410076 | Nhóm trưởng / Technical Lead |
| 2 | Nguyễn Hoàng Mai Vy | 3122410490 | Thành viên — Phase 3 |
| 3 | Huỳnh Văn Phú | 3122560057 | Thành viên — Phase 4+5 |
| 4 | Trần Khánh Huyền | 3122410156 | Thành viên — Project, Comment, Notification modules |

### 1.3. Vai trò cá nhân

Trong đồ án, tôi phụ trách **Project Module** (CRUD, workspace relations, RBAC), **Comment Module** (discussions trên tasks), và **Notification Module** (real-time alerts). Ngoài ra, tôi **hỗ trợ Vy** hoàn thiện **Workspace Module** (activity log, transfer ownership, viewer role). Trong báo cáo, tôi viết Chương 3 (Cài đặt môi trường) và Chương 6 (Kỹ thuật nâng cao — Request Lifecycle, Pipes).

---

## 2. CÔNG VIỆC ĐÃ THỰC HIỆN

### 2.1. Giai đoạn chuẩn bị (12/01 – 01/02): Nghiên cứu công nghệ

- Tham gia họp nhóm, thống nhất đề tài và phạm vi dự án
- Nghiên cứu **Docker**: Docker Engine, Dockerfile, Docker Compose, image vs container, volume mapping
- Nghiên cứu **PostgreSQL**: cài đặt qua Docker, tạo database, kết nối từ NestJS
- Tìm hiểu cách thiết lập môi trường phát triển cho NestJS project:
  - Node.js installation và version management (nvm)
  - NestJS CLI: nest new, nest generate, nest start
  - Docker Compose cho PostgreSQL + Redis
- Thực hành cài đặt và chạy thử NestJS project trên máy local

### 2.2. Tuần 1 (02/02 – 08/02): Vẽ Activity Diagram

- Vẽ **Activity Diagram** cho các workflow chính:
  - **Task lifecycle**: Created → In Progress → Review → Done (với các điều kiện chuyển trạng thái)
  - **Authentication flow**: Register → Verify → Login → Access Protected Resource → Refresh Token → Logout
  - Thể hiện các decision points, parallel activities, và exception handling
- Tham gia họp nhóm: review ERD, API Specification
- Nhận phần viết **Chương 3 (Cài đặt môi trường)** và **Chương 6 (Kỹ thuật nâng cao)**

### 2.3. Tuần 2 (09/02 – 15/02): Bắt đầu viết báo cáo

- Bắt đầu viết **Chương 3 — Cài đặt môi trường và cấu trúc dự án**:
  - Cài đặt Node.js và quản lý phiên bản
  - Cài đặt NestJS CLI và tạo project mới
  - Cấu hình Docker cho PostgreSQL
  - Cấu trúc thư mục project NestJS: giải thích từng file/folder
- Nghiên cứu **NestJS Request Lifecycle** để chuẩn bị viết Chương 6:
  - Thứ tự: Middleware → Guard → Interceptor (before) → Pipe → Handler → Interceptor (after) → Filter
  - Tại sao thứ tự này quan trọng trong thiết kế ứng dụng

### 2.4. Tuần 3 (16/02 – 22/02): Hoàn thiện chương báo cáo

- Hoàn thiện **Chương 3 — Cài đặt môi trường**:
  - Bổ sung hướng dẫn chi tiết từng bước cài đặt kèm screenshots
  - Giải thích cấu trúc thư mục NestJS project (src/, main.ts, app.module.ts, app.controller.ts...)
  - Docker Compose configuration cho PostgreSQL
- Bắt đầu viết **Chương 6 — Kỹ thuật nâng cao**:
  - **Request Lifecycle**: sơ đồ luồng request qua các layers
  - **Pipes**: ValidationPipe (class-validator, class-transformer), ParseUUIDPipe, ParseIntPipe
  - Custom Pipe: cách tạo pipe riêng, implement PipeTransform interface

### 2.5. Tuần 4 (23/02 – 01/03): Review và cập nhật

- **Review Chương 3 và Chương 6** trên Google Docs
- Cập nhật **section numbers** sau khi đổi thứ tự chương
- Kiểm tra tính nhất quán với các chương khác
- Tham gia họp nhóm: thống nhất kế hoạch implementation, demo Phase 0

### 2.6. Tuần 5 (02/03 – 08/03): Bổ sung nội dung TypeScript

- Bổ sung section **"Kiến thức nền tảng TypeScript"** vào Chương 6:
  - `const` vs `let`: block scoping, immutability
  - `async/await`: Promise-based asynchronous programming
  - Prisma query syntax: findMany, findUnique, create, update, delete
- **Review Chương 3** lần cuối: kiểm tra commands còn đúng với phiên bản hiện tại
- Đảm bảo Docker Compose instructions hoạt động đúng

### 2.7. Tuần 6 (09/03 – 15/03): Chuẩn bị Phase 6+7

- Đọc **`TASK_ASSIGNMENT.md`**: nắm rõ scope Phase 6 (WebSocket Gateway) và Phase 7 (Notifications, File Upload, Docker deployment)
- **Setup Redis + Bull** trên máy local:
  - Thêm Redis service vào Docker Compose
  - Chạy `docker-compose up redis` thành công
  - Test kết nối Redis từ Node.js
- Nghiên cứu **@nestjs/websockets + Socket.IO**:
  - WebSocketGateway decorator, @SubscribeMessage
  - Room concept: join/leave rooms, broadcast to room
  - WebSocket authentication: verify JWT on connection
- Nghiên cứu **@nestjs/bull**:
  - Queue concept, Producer/Consumer pattern
  - Scheduled jobs (cron), delayed jobs
  - Use case: Due Date Reminder job

### 2.8. Tuần 7 (16/03 – 22/03): Chuẩn bị implementation

- Chuẩn bị **Project + Comment + Notification modules**:
  - Thiết kế **Project Module**: CRUD endpoints, workspace relations, RBAC (only OWNER/ADMIN create), Prisma schema review
  - Thiết kế **Comment Module**: nested comments (parent-child relations), mention support, task linking
  - Thiết kế **Notification Module**: 5 loại notification (task:assigned, task:updated, comment:mentioned, member:invited, workspace:changed)
  - Lên kế hoạch WebSocket integration cho real-time events
- Chờ Phú hoàn thành Task Module + Đạt review Project skeleton trước khi bắt đầu code

### 2.9. Tuần 8 (23/03 – 29/03): Triển khai Project + Comment Module

- **Project Module** (hỗ trợ từ Đạt):
  - Scaffold ProjectController, ProjectService, ProjectModule
  - Implement CRUD: 5 endpoints (GET list, POST create, GET detail, PATCH update, DELETE)
  - Validate workspace relationship, enforce RBAC guards (OWNER/ADMIN only create/update/delete)
  - Tạo ProjectDTO + validation pipes
  - Update Hoppscotch collection, tự test toàn bộ endpoints
  - Test permission checks: member can read, but cannot create/update

- **Comment Module** (preparation):
  - Design CommentDTO (CreateCommentDto, UpdateCommentDto, FilterCommentDto)
  - Thiết kế schema: task link, author, created/updated timestamps, nested replies
  - Vẽ sơ đồ luồng: create comment → trigger notification → emit WebSocket event
  - Chuẩn bị test cases cho comment threads

- **Hỗ trợ Vy — Workspace Module**:
  - Review Activity Log implementation (tự động ghi log Create/Update/Delete/Role events)
  - Test Transfer Ownership flow end-to-end
  - Test Viewer role + permissions validation
  - Verify code before submitting PR (không merge code — do Đạt thực hiện)

### 2.10. Tuần 9 (30/03 – 05/04): Notification + Comment hoàn thiện

- **Notification Module**:
  - Implement NotificationController (list, mark read, read all, unread count)
  - NotificationService: create, update seen status
  - Tích hợp WebSocket: emit notification:new khi có event từ Task/Comment/Member
  - Setup Bull queue cho scheduled notifications (due date reminder)
  - Test notification flow đầy đủ

- **Comment Module** (hoàn thiện):
  - Implement CommentController + CommentService
  - CRUD endpoints: create, list (with pagination), update, delete
  - Validation: only author/admin can edit/delete
  - Tích hợp Notification: mention → send notification
  - Test thread pagination, nested replies

- **WebSocket Gateway** (preparation):
  - Thiết kế room strategy: workspace:{id}, task:{id}
  - Events: task:created, task:updated, comment:created, notification:new, member:joined
  - Authentication on connection: verify JWT, join user to personal room

---

## 3. TỔNG HỢP SẢN PHẨM ĐÃ TẠO

### 3.1. Nội dung báo cáo

| Chương | Nội dung | Vai trò |
|--------|----------|---------|
| Chương 3 | Cài đặt môi trường — Node.js, NestJS CLI, Docker, PostgreSQL, cấu trúc project | Viết toàn bộ |
| Chương 6 | Kỹ thuật nâng cao — Request Lifecycle, Pipes, TypeScript nền tảng | Viết phần Request Lifecycle + Pipes + TypeScript basics |

### 3.2. Sơ đồ thiết kế

- **Activity Diagram**: Task lifecycle workflow, Authentication flow

### 3.3. Hạ tầng

- Setup **Docker Compose** cho PostgreSQL + Redis trên máy local
- Kiểm tra kết nối Redis cho Bull queue

### 3.4. Code backend (chuẩn bị + tuần 8-9)

| Module | Endpoints/Features | Status |
|--------|:----------------:|:--------:|
| Project CRUD | 5 endpoints (list, create, detail, update, delete) | 🔄 Tuần 8 |
| Project RBAC | Permission guards (OWNER/ADMIN create/update/delete) | 🔄 Tuần 8 |
| Comment CRUD | 4 endpoints (list, create, update, delete) + thread pagination | ⏳ Tuần 9 |
| Comment Notifications | Mention → send notification | ⏳ Tuần 9 |
| Notification Module | 4 endpoints (list, mark read, unread count, preferences) | ⏳ Tuần 9 |
| WebSocket Events | Gateway + Room strategy | 📋 Chuẩn bị |

### 3.5. Hoạt động hỗ trợ

- Hỗ trợ **Vy — Workspace Module**: review code, test Activity Log, Transfer Ownership, Viewer Role
- Hỗ trợ **Phú — Task Module**: test integration với Task (comment-on-task)

---

## 4. KỸ NĂNG VÀ KIẾN THỨC ĐÃ HỌC ĐƯỢC

### 4.1. Kỹ thuật

- **NestJS Request Lifecycle**: hiểu sâu thứ tự Middleware → Guard → Interceptor → Pipe → Handler → Interceptor → Filter
- **Pipes**: ValidationPipe (class-validator), ParseUUIDPipe, ParseIntPipe, cách tạo Custom Pipe
- **Docker**: Dockerfile (multi-stage build), Docker Compose, volume mapping, network, environment variables
- **PostgreSQL**: cài đặt, cấu hình, kết nối từ NestJS qua Prisma
- **Redis + Bull**: message queue, scheduled jobs, Producer/Consumer pattern
- **WebSocket (Socket.IO)**: room concept, event-driven communication, authentication on connection
- **Activity Diagram**: mô hình hóa workflow, decision points, parallel activities

### 4.2. Quy trình làm việc

- **Viết tài liệu hướng dẫn**: cài đặt từng bước, kèm giải thích rõ ràng
- **Docker-first development**: sử dụng Docker để tạo môi trường phát triển nhất quán
- **Nghiên cứu công nghệ mới**: đọc docs chính thức, thực hành trên máy local trước khi áp dụng

---

## 5. KHÓ KHĂN VÀ CÁCH GIẢI QUYẾT

| Khó khăn | Cách giải quyết |
|----------|-----------------|
| Request Lifecycle phức tạp (nhiều layers, thứ tự quan trọng) | Vẽ sơ đồ, đọc NestJS docs nhiều lần, tạo ví dụ thực tế |
| Docker Compose cấu hình nhiều services (postgres, redis, backend, frontend) | Bắt đầu từ đơn giản (1 service), thêm dần, test từng bước |
| Redis chưa quen sử dụng | Setup Docker Redis, đọc docs Bull, test Producer/Consumer pattern |
| WebSocket authentication phức tạp | Nghiên cứu Socket.IO middleware, kết hợp với JwtService verify |
| Phase 6+7 phụ thuộc Phase 4+5 (Phú) chưa xong | Chuẩn bị thiết kế, nghiên cứu patterns, setup infrastructure trước |
| Chương 6 khá rộng (nhiều concepts) | Chia nhỏ thành sections, viết từng phần, review với nhóm |

---

## 6. TỰ ĐÁNH GIÁ

### 6.1. Điểm mạnh
- Viết Chương 3 (Cài đặt) và Chương 6 (Kỹ thuật nâng cao) chi tiết, dễ follow
- Setup Docker infrastructure thành công (PostgreSQL + Redis)
- Nghiên cứu kỹ WebSocket, Bull queue patterns trước khi bắt đầu code
- Activity Diagram thể hiện rõ workflow hệ thống

### 6.2. Hạn chế
- Chưa bắt đầu code Phase 6+7 (phụ thuộc Phase 4+5)
- Cần thời gian thêm để master WebSocket Gateway trong NestJS
- Chưa viết test cases cho phần mình phụ trách
- Phần Docker deployment chưa hoàn thiện Dockerfile cho backend/frontend

### 6.3. Mức hoàn thành
- Phần báo cáo: **90%** (Chương 3 và Chương 6 hoàn thành, đã review)
- Phần thiết kế: **100%** (Activity Diagrams hoàn thành)
- Phần hạ tầng: **40%** (Docker Compose cơ bản xong, Redis setup xong, chưa có Dockerfiles)
- Phần code backend: **10%** (chuẩn bị design, nghiên cứu patterns, chờ dependency)

---

<p align="right"><i>TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026</i></p>

<br/>

<p align="center"><b>Người viết báo cáo</b></p>
<p align="center">(Ký và ghi rõ họ tên)</p>

<br/><br/><br/>

<p align="center"><b>Trần Khánh Huyền</b></p>
