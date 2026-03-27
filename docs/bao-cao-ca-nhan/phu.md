<p align="center"><b>[TÊN TRƯỜNG]</b></p>
<p align="center"><b>[TÊN KHOA]</b></p>
<p align="center">───────────────────</p>

<br/>

<p align="center"><b>BÁO CÁO CÁ NHÂN</b></p>
<p align="center"><b>ĐỒ ÁN CUỐI KỲ — CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI</b></p>

<br/>

| Thông tin | Nội dung |
|-----------|----------|
| **Họ và tên** | Huỳnh Văn Phú |
| **MSSV** | 3122560057 |
| **Email** | phuhuynh.010104@gmail.com |
| **SĐT** | 0369698361 |
| **Vai trò** | Thành viên — Phụ trách Phase 4+5 |
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
| 4 | Trần Khánh Huyền | 3122410156 | Thành viên — Phase 6+7 |

### 1.3. Vai trò cá nhân

Trong đồ án, tôi phụ trách **Phase 4 — Task Module** và **Phase 5 — RBAC Guard + Comments + Activity Log**. Đây là core của ứng dụng — Task là thực thể được thao tác nhiều nhất, RBAC Guard đảm bảo phân quyền, Comments cho phép cộng tác. Ngoài ra, tôi viết Chương 7 (Authentication & Authorization) trong báo cáo — phần áp dụng trực tiếp kiến thức JWT, Guards đã nghiên cứu.

---

## 2. CÔNG VIỆC ĐÃ THỰC HIỆN

### 2.1. Giai đoạn chuẩn bị (12/01 – 01/02): Nghiên cứu công nghệ

- Tham gia họp nhóm, thống nhất đề tài và phạm vi dự án
- Nghiên cứu **JWT (JSON Web Token)**: cấu trúc token (Header, Payload, Signature), access token vs refresh token, token rotation
- Nghiên cứu **bcrypt**: thuật toán hash password, salt rounds, timing-safe comparison
- Tìm hiểu **Passport.js**: Strategy pattern, cách tích hợp với NestJS qua `@nestjs/passport`
- Đọc tài liệu NestJS về Guards, Authentication, Authorization

### 2.2. Tuần 1 (02/02 – 08/02): Vẽ Sequence Diagram

- Vẽ **Sequence Diagram** cho các luồng chính:
  - **Register flow**: Client → AuthController → AuthService → PrismaService → Database (hash password, create user, generate tokens)
  - **Login flow**: Client → AuthController → AuthService → validate credentials → generate JWT pair
  - **Create Task flow**: Client → TaskController → check permissions → TaskService → create task → emit WebSocket event
  - **Assign Task flow**: Client → TaskController → verify membership → TaskService → update assignees → create notification
- Tham gia họp nhóm: review ERD, API Specification, phân chia viết báo cáo
- Nhận phần viết **Chương 7 (Authentication & Authorization)**

### 2.3. Tuần 2 (09/02 – 15/02): Bắt đầu viết báo cáo

- Nghiên cứu sâu **JWT flow** trong NestJS:
  - Passport Strategy pattern: LocalStrategy, JwtStrategy
  - NestJS Guards: ExecutionContext, canActivate(), Reflector
  - Decorator composition: @UseGuards(), @Public()
- Bắt đầu viết **Chương 7 — Authentication & Authorization**:
  - Giới thiệu bài toán xác thực trong ứng dụng web
  - Lý thuyết JWT: cấu trúc, ưu/nhược điểm so với Session-based auth
  - bcrypt: tại sao không dùng MD5/SHA, salt rounds, timing attack
  - Passport.js trong NestJS: strategy pattern, integration

### 2.4. Tuần 3 (16/02 – 22/02): Hoàn thiện chương báo cáo

- Hoàn thiện **Chương 7 — Authentication & Authorization**:
  - **AuthService**: triển khai register (hash + create), login (validate + generate tokens), refreshToken (rotation), logout (blacklist)
  - **JwtStrategy**: custom validate method, truy vấn user từ DB, check token blacklist
  - **JwtAuthGuard**: kế thừa AuthGuard('jwt'), check @Public() metadata qua Reflector
  - **Custom Decorators**: @CurrentUser() (extract user từ request), @Public() (bypass guard)
  - Code snippets kèm giải thích chi tiết từ dự án thực tế
- Đối chiếu nội dung với **tài liệu chính thức NestJS** để fact-check
- Thay thế inline comments trong code blocks bằng đoạn văn giải thích diễn giải

### 2.5. Tuần 4 (23/02 – 01/03): Review và cập nhật

- **Review Chương 7** sau khi đổi thứ tự chương (thành Ch7 thay vì Ch6):
  - Cập nhật nội dung cho phù hợp thứ tự mới: Guards/Decorators giờ đã được giải thích ở Ch6
  - Loại bỏ phần giải thích trùng lặp, thêm cross-reference đến Ch6
- Cập nhật **authentication flow** cho phù hợp thứ tự mới
- Tham gia họp nhóm: review PRD, demo Phase 0, thống nhất kế hoạch implementation

### 2.6. Tuần 5 (02/03 – 08/03): Review authentication code

- **Review authentication flow** trong code Phase 1 (Đạt viết):
  - Kiểm tra **Token Blacklist logic**: khi logout, access token được ghi vào bảng InvalidatedToken, JwtStrategy check blacklist mỗi request
  - Kiểm tra **JwtStrategy validate**: flow từ extract token → decode → query user → check blacklist → attach user to request
  - Kiểm tra **bcrypt usage**: salt rounds = 12, compare timing-safe
  - Đối chiếu code thực tế với nội dung đã viết trong Chương 7
- Ghi nhận điểm khác biệt giữa code guide ban đầu và code thực tế (9 điểm lệch)

### 2.7. Tuần 6 (09/03 – 15/03): Chuẩn bị Phase 4+5

- Đọc **`TASK_ASSIGNMENT.md`**: nắm rõ scope Phase 4 (Task CRUD, 12 endpoints) và Phase 5 (RBAC Guard, Comments, Activity Log)
- Nghiên cứu **RBAC Guard pattern** trong NestJS:
  - Thiết kế Permission matrix: Owner > Admin > Member > Viewer
  - Custom decorator @RequireRole()
  - WorkspaceRoleGuard: kiểm tra role của user trong workspace
- Nghiên cứu **filter + pagination** cho Task list:
  - Query params: status, priority, assigneeId, labelIds, dueDate, sortBy, sortOrder, page, limit
  - Prisma where conditions, orderBy, skip/take
- Đọc code Phase 0, 1, 2 để hiểu patterns cần follow

### 2.8. Tuần 7 (16/03 – 22/03): Chuẩn bị implementation

- Chuẩn bị **Phase 4+5**:
  - Thiết kế DTOs cho Task Module: CreateTaskDto, UpdateTaskDto, FilterTaskDto
  - Lên kế hoạch RBAC permission matrix chi tiết
  - Đọc code Vy (Phase 3) để hiểu WorkspaceMember structure — cần thiết cho permission check
  - Nghiên cứu Activity Log pattern: tự động ghi log khi task/comment/member thay đổi
- Chờ Vy hoàn thành WorkspaceModule + ProjectModule (dependency) trước khi bắt đầu code

### 2.9. Tuần 8-9 (23/03 – 05/04): Triển khai Task Module + nhận hỗ trợ

**Tuần 8 — Task Module core:**
- Checkout nhánh `feature/phu-task-module`, rebase với `develop`, cấu hình Prisma schema Task ↔ Label ↔ WorkspaceMember
- Implement **TaskController + TaskService**: CRUD (create, list, detail, update, delete)
- Implement **Status Transition**: PATCH `/tasks/:id/status` (TODO → IN_PROGRESS → DONE)
- Implement **Assignment**: POST/DELETE `/tasks/:id/assign` (assign/unassign task)
- Implement **Labels**: POST/DELETE `/tasks/:id/labels` (attach/detach labels)
- Viết DTOs: CreateTaskDto, UpdateTaskDto, FilterTaskDto, UpdateStatusDto, AssignTaskDto, TaskLabelDto
- Validation pipes, pagination support, response format chuẩn
- Tự test toàn bộ endpoints trên Hoppscotch
- Verify RBAC: member can update/delete own tasks, cannot update/delete others' tasks

**Tuần 9 — Task Module advanced + support:**
- Implement **Subtask CRUD**: POST/GET/PATCH/DELETE `/tasks/:id/subtasks`
- Implement **Advanced Filtering**: multi-status, multi-priority, assignee, dueDate, search, sort, pagination
- Implement **Drag-drop Reorder**: PATCH `/tasks/:id/reorder` (order field)
- Implement **Duplicate Task**: POST `/tasks/:id/duplicate`
- Implement **Move Task**: PATCH `/tasks/:id/move` (between projects in same workspace)
- Implement **Time Tracking**: PATCH `/tasks/:id/time-spent` (accumulate minutes)
- Viết test cases + Hoppscotch collection update
- Tạo PR, chờ review từ **Đạt**

**Hỗ trợ nhận:**
- Nhận review từ **Đạt** (Task Module RBAC Guards, filter complexity, pagination)
- Nhận support từ **Huyền** (test Comment-on-Task integration khi Comment Module xong)

---

## 3. TỔNG HỢP SẢN PHẨM ĐÃ TẠO

### 3.1. Nội dung báo cáo

| Chương | Nội dung | Vai trò |
|--------|----------|---------|
| Chương 7 | Authentication & Authorization — JWT, bcrypt, Passport, Guards, Decorators | Viết toàn bộ |
| Chương 7 | Review, cập nhật cross-references sau đổi thứ tự chương | Cập nhật |

### 3.2. Sơ đồ thiết kế

- **Sequence Diagram**: 4 luồng chính (Register, Login, Create Task, Assign Task)

### 3.3. Hoạt động review

- Review authentication flow trong code Phase 1
- Review Token Blacklist logic, JwtStrategy, bcrypt usage
- Đối chiếu code thực tế với nội dung báo cáo Chương 7

### 3.4. Code backend (chuẩn bị + tuần 8-9)

| Module | Endpoints | Trạng thái |
|--------|:---------:|:----------:|
| Task CRUD | 5 (list, create, detail, update, delete) | 🔄 Tuần 8 |
| Task Status | 1 (PATCH /tasks/:id/status) | 🔄 Tuần 8 |
| Task Assignment | 2 (assign, unassign) | 🔄 Tuần 8 |
| Task Labels | 2 (add, remove) | 🔄 Tuần 8 |
| Task Subtask | 3 (create, update, complete) | 🔄 Tuần 9 |
| Task Advanced (Reorder/Duplicate/Move/Time) | 4 | ⏳ Tuần 9 |
| Task Filtering | Advanced filters + pagination | 🔄 Tuần 8-9 |

### 3.5. Hoạt động hỗ trợ & support

**Hỗ trợ nhận:**
- Review từ **Đạt**: RBAC Guards validation, filter + pagination complexity
- Support từ **Huyền**: test Comment-on-Task integration

---

## 4. KỸ NĂNG VÀ KIẾN THỨC ĐÃ HỌC ĐƯỢC

### 4.1. Kỹ thuật

- **JWT Authentication**: hiểu sâu cấu trúc JWT, access/refresh token flow, token rotation, token blacklist
- **bcrypt**: thuật toán hash, salt rounds, timing-safe comparison, tại sao chọn bcrypt thay vì MD5/SHA
- **NestJS Guards**: ExecutionContext, canActivate(), Reflector metadata, guard execution order
- **Passport.js Strategy**: Strategy pattern, JwtStrategy, LocalStrategy, cách tích hợp với NestJS
- **RBAC (Role-Based Access Control)**: thiết kế permission matrix, custom guard, decorator-based role check
- **Sequence Diagram**: mô hình hóa luồng xử lý request trong hệ thống

### 4.2. Quy trình làm việc

- **Viết báo cáo kỹ thuật**: trình bày lý thuyết kèm code snippets, diễn giải thay vì inline comments
- **Code review**: đánh giá authentication flow, kiểm tra security best practices
- **Đọc và hiểu codebase**: phân tích code người khác viết, đối chiếu với tài liệu

---

## 5. KHÓ KHĂN VÀ CÁCH GIẢI QUYẾT

| Khó khăn | Cách giải quyết |
|----------|-----------------|
| JWT flow phức tạp (access + refresh + blacklist + rotation) | Vẽ sequence diagram để hiểu rõ từng bước, đọc RFC 7519 |
| Chương 7 cần cập nhật sau khi đổi thứ tự chương | Rà soát toàn bộ cross-references, loại phần trùng với Ch6 |
| Chưa quen Passport.js Strategy pattern | Đọc source code @nestjs/passport, tham khảo NestJS docs |
| Phase 4+5 phụ thuộc Phase 3 (Vy) chưa xong | Chuẩn bị DTOs, nghiên cứu RBAC pattern, đọc code Phase 1+2 trước |
| RBAC permission matrix phức tạp (4 roles × nhiều actions) | Thiết kế bảng permission rõ ràng, tham khảo code guide |

---

## 6. TỰ ĐÁNH GIÁ

### 6.1. Điểm mạnh
- Viết Chương 7 (Authentication) chi tiết và chính xác, đối chiếu với docs chính thức
- Sequence Diagram thể hiện rõ luồng xử lý
- Nghiên cứu kỹ RBAC pattern trước khi bắt đầu code
- Review authentication code cẩn thận, phát hiện điểm khác biệt giữa guide và code thực tế

### 6.2. Hạn chế
- Chưa bắt đầu code Phase 4+5 (phụ thuộc Phase 3)
- Cần thời gian thêm để làm quen với Prisma queries phức tạp (filter + pagination)
- Chưa viết test cases cho phần mình phụ trách

### 6.3. Mức hoàn thành
- Phần báo cáo: **90%** (Chương 7 hoàn thành, đã review và cập nhật)
- Phần thiết kế: **100%** (Sequence Diagrams hoàn thành)
- Phần code backend: **45%** (hoàn thiện Task Module CRUD + filter + assignment, đang tích hợp Subtask)

---

<p align="right"><i>TP. Hồ Chí Minh, ngày ...... tháng ...... năm 2026</i></p>

<br/>

<p align="center"><b>Người viết báo cáo</b></p>
<p align="center">(Ký và ghi rõ họ tên)</p>

<br/><br/><br/>

<p align="center"><b>Huỳnh Văn Phú</b></p>
