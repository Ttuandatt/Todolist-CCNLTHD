# Kế Hoạch Cải Thiện Báo Cáo CCNLTHD — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cải thiện báo cáo đồ án NestJS theo đúng format giảng viên yêu cầu: Lý thuyết → Code mẫu → Bài tập nhỏ → Đồ án tổng hợp, với code snippet + screenshot cho mọi khái niệm.

**Architecture:** Chia thành 2 track song song: (1) Implement Task module để có code chạy thực tế cho bài tập, (2) Viết nội dung bổ sung cho từng chương báo cáo dưới dạng Markdown. Nội dung Markdown sẽ được team copy vào file Word và format + chèn screenshot.

**Tech Stack:** NestJS, Prisma ORM, PostgreSQL, TypeScript, class-validator, Passport JWT

**Người thực hiện:**
- **Phú & Huyền:** Implement Task module (Track 1)
- **Đạt (+ Claude):** Viết nội dung báo cáo bổ sung (Track 2)
- **Cả nhóm:** Chụp screenshot, ghép vào Word, review

---

## Bối Cảnh

### Nhận xét của giảng viên
1. Tập trung vào công nghệ, đồ án là minh họa
2. Format: **Lý thuyết → Code mẫu → Bài tập nhỏ → Đồ án tổng hợp**
3. Mọi khái niệm lý thuyết **BẮT BUỘC** có Code Snippet + Ảnh chụp kết quả chạy thực tế
4. Phần 3 (Đồ án tổng hợp) = lắp ghép module từ Phần 2, show minh chứng chức năng thực tế
5. Kỹ thuật chưa trình bày ở Phần 2 **không được** xuất hiện ở Phần 3

### Code đã có sẵn
- **Auth module:** 6 endpoints (register, login, refresh, logout, forgot/reset password)
- **User module:** 4 endpoints (profile, update, change password, avatar upload)
- **Workspace module:** 11 endpoints (CRUD, invite, accept, members, roles, leave)
- **Prisma schema:** 17 models đã define (bao gồm Task, Label, Comment)
- **Frontend React:** Login, Register, Dashboard, Profile pages
- **Task module:** Chưa implement (chỉ có schema)

### Cấu trúc báo cáo hiện tại
```
Phần 1: Tổng quan
  Ch1: Giới thiệu NestJS
  Ch2: (Thiếu - Thị trường/Nghề nghiệp)

Phần 2/3: Nội dung cốt lõi
  Ch3: Cài đặt môi trường & Hello World
  Ch4: Các khái niệm cơ bản (TypeScript, Module, Controller, Service, DI)
  Ch5: Database & Prisma ORM
  Ch6: Kỹ thuật nâng cao (Pipes, Interceptors)
  Ch7: Authentication & Authorization

Phần 4: Đồ án tổng hợp
  Ch8: Phân tích & Thiết kế hệ thống
  Ch9: Triển khai chi tiết (placeholder)

Phần 5: Tổng kết
  Ch10-11: Đánh giá & Hướng phát triển
```

### Thiếu sót chính
1. **KHÔNG CÓ "Bài tập ứng dụng"** ở cuối mỗi chương (Ch3-Ch7)
2. **THIẾU ảnh chụp màn hình** kết quả chạy thực tế
3. **Phần Đồ án tổng hợp trống** — chưa có demo, chưa có hướng dẫn cài đặt
4. Frontend React xuất hiện ở Phần 3 nhưng Phần 2 không trình bày React

---

## TRACK 1: Implement Task Module (Phú & Huyền)

> Task module cần hoàn thành để có material cho bài tập Ch5 (Prisma CRUD, relations N-N) và Ch6 (Pipes validate CreateTaskDto với nhiều field types).

### Task 1.1: Tạo Task Module — CRUD cơ bản

**Files cần tạo:**
- `backend/src/modules/task/task.module.ts`
- `backend/src/modules/task/task.controller.ts`
- `backend/src/modules/task/task.service.ts`
- `backend/src/modules/task/dto/create-task.dto.ts`
- `backend/src/modules/task/dto/update-task.dto.ts`
- `backend/src/modules/task/dto/query-task.dto.ts`

**Files cần sửa:**
- `backend/src/app.module.ts` — import TaskModule

**Yêu cầu kỹ thuật:**

- [ ] **Step 1: Tạo DTOs với class-validator**

```typescript
// dto/create-task.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString, MaxLength } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề task không được để trống' })
  @MaxLength(200, { message: 'Tiêu đề không được vượt quá 200 ký tự' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4', { message: 'projectId phải là UUID hợp lệ' })
  @IsNotEmpty({ message: 'projectId không được để trống' })
  projectId: string;

  @IsEnum(TaskStatus, { message: 'Status không hợp lệ. Chấp nhận: TODO, IN_PROGRESS, REVIEW, DONE' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority không hợp lệ. Chấp nhận: LOW, NORMAL, HIGH, URGENT' })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString({}, { message: 'dueDate phải đúng định dạng ISO 8601' })
  @IsOptional()
  dueDate?: string;
}
```

```typescript
// dto/update-task.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```

```typescript
// dto/query-task.dto.ts
import { IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class QueryTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
```

- [ ] **Step 2: Tạo TaskService với CRUD operations**

```typescript
// task.service.ts
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // Tạo task mới (kiểm tra user thuộc workspace chứa project)
  async create(userId: string, dto: CreateTaskDto) { ... }

  // Lấy danh sách task theo project (filter status/priority)
  async findAllByProject(userId: string, projectId: string, query: QueryTaskDto) { ... }

  // Lấy chi tiết 1 task (include subtasks, assignments, labels, comments)
  async findOne(userId: string, taskId: string) { ... }

  // Cập nhật task
  async update(userId: string, taskId: string, dto: UpdateTaskDto) { ... }

  // Xóa task (chỉ người tạo hoặc OWNER/ADMIN workspace)
  async remove(userId: string, taskId: string) { ... }

  // Assign task cho user
  async assignUser(userId: string, taskId: string, assigneeId: string) { ... }

  // Unassign user khỏi task
  async unassignUser(userId: string, taskId: string, assigneeId: string) { ... }
}
```

- [ ] **Step 3: Tạo TaskController với endpoints**

```
POST   /tasks                    — Tạo task mới
GET    /tasks?projectId=xxx      — Danh sách task theo project
GET    /tasks/:id                — Chi tiết task
PATCH  /tasks/:id                — Cập nhật task
DELETE /tasks/:id                — Xóa task
POST   /tasks/:id/assign/:userId — Assign user
DELETE /tasks/:id/assign/:userId — Unassign user
```

- [ ] **Step 4: Tạo TaskModule và register vào AppModule**
- [ ] **Step 5: Test tất cả endpoints qua Hoppscotch**
- [ ] **Step 6: Commit**

### Task 1.2: Label & TaskLabel — Quan hệ N-N

**Files cần tạo:**
- `backend/src/modules/label/label.module.ts`
- `backend/src/modules/label/label.controller.ts`
- `backend/src/modules/label/label.service.ts`
- `backend/src/modules/label/dto/create-label.dto.ts`

**Yêu cầu:**

- [ ] **Step 1: Tạo Label CRUD** (trong scope workspace)

```
POST   /workspaces/:id/labels    — Tạo label cho workspace
GET    /workspaces/:id/labels    — Danh sách labels
DELETE /labels/:id               — Xóa label
```

- [ ] **Step 2: Tạo endpoints gắn/gỡ label cho task** (minh họa N-N relation)

```
POST   /tasks/:id/labels/:labelId  — Gắn label vào task
DELETE /tasks/:id/labels/:labelId  — Gỡ label khỏi task
```

- [ ] **Step 3: Test qua Hoppscotch**
- [ ] **Step 4: Commit**

### Task 1.3: Comment — Self-relation (Reply)

**Files cần tạo:**
- `backend/src/modules/comment/comment.module.ts`
- `backend/src/modules/comment/comment.controller.ts`
- `backend/src/modules/comment/comment.service.ts`
- `backend/src/modules/comment/dto/create-comment.dto.ts`

**Yêu cầu:**

- [ ] **Step 1: Tạo Comment CRUD với reply support** (minh họa self-relation)

```
POST   /tasks/:taskId/comments           — Tạo comment
GET    /tasks/:taskId/comments           — Danh sách comments (nested replies)
PATCH  /comments/:id                     — Sửa comment
DELETE /comments/:id                     — Xóa comment
POST   /tasks/:taskId/comments/:parentId/reply — Reply comment
```

- [ ] **Step 2: Test luồng comment + reply qua Hoppscotch**
- [ ] **Step 3: Commit**

### Task 1.4: Project Module (tối thiểu)

> Task phụ thuộc vào Project (projectId), nên cần ít nhất CRUD Project cơ bản.

**Files cần tạo:**
- `backend/src/modules/project/project.module.ts`
- `backend/src/modules/project/project.controller.ts`
- `backend/src/modules/project/project.service.ts`
- `backend/src/modules/project/dto/create-project.dto.ts`

**Yêu cầu:**

- [ ] **Step 1: CRUD Project trong workspace**

```
POST   /workspaces/:id/projects   — Tạo project
GET    /workspaces/:id/projects   — Danh sách projects
GET    /projects/:id              — Chi tiết project
PATCH  /projects/:id              — Cập nhật project
DELETE /projects/:id              — Xóa project
```

- [ ] **Step 2: Test qua Hoppscotch**
- [ ] **Step 3: Commit**

**Lưu ý thứ tự implement:** Task 1.4 (Project) → Task 1.1 (Task) → Task 1.2 (Label) → Task 1.3 (Comment)

---

## TRACK 2: Viết Nội Dung Báo Cáo Bổ Sung (Đạt + Claude)

> Output: File Markdown cho mỗi chương, chứa phần "Bài tập ứng dụng" + hướng dẫn screenshot cần chụp. Team copy vào Word.

### Task 2.0: Bổ sung các phần còn thiếu trong cấu trúc

**File output:** `docs/report-supplements/00-structure-additions.md`

- [ ] **Step 1: Viết phần "Lời cảm ơn"**
- [ ] **Step 2: Viết phần "Phạm vi nghiên cứu" trong Lời mở đầu**
- [ ] **Step 3: Viết bảng "Kế hoạch & Tiến độ thực hiện" chi tiết**
- [ ] **Step 4: Viết phần "Cấu trúc báo cáo" mô tả 4 phần**

### Task 2.1: Bổ sung Chương 3 — Cài đặt & Hello World

**File output:** `docs/report-supplements/ch03-exercise.md`

**Nội dung bài tập:**
- Mục tiêu: Cài đặt thành công môi trường, tạo project NestJS đầu tiên
- Các bước: Cài Node.js → NestJS CLI → Docker → tạo project → chạy Hello World
- Code snippet cho từng bước + chỉ dẫn screenshot cần chụp

**Screenshots cần chụp (team tự chụp):**

- [ ] Terminal: `node -v` và `npm -v`
- [ ] Terminal: `nest --version`
- [ ] Docker Desktop: container PostgreSQL đang chạy (xanh lá)
- [ ] Terminal: `docker-compose up -d` output
- [ ] Terminal: `nest new todolist-collaboration` output
- [ ] Terminal: `npm run start:dev` — thông báo "Nest application successfully started"
- [ ] Browser: `http://localhost:3333` hiển thị response
- [ ] Hoppscotch: GET request thành công

### Task 2.2: Bổ sung Chương 4 — Kiến trúc NestJS

**File output:** `docs/report-supplements/ch04-exercise.md`

**Nội dung bài tập:** Xây dựng Auth Module từ đầu — minh họa Module, Controller, Service, DTO, DI, Decorators

**Các bước trong bài tập:**
1. Tạo AuthModule bằng NestJS CLI (`nest g module auth`, `nest g controller auth`, `nest g service auth`)
2. Tạo RegisterDto với TypeScript Interface + class-validator
3. Implement AuthService (inject PrismaService qua DI)
4. Implement AuthController (nhận request, gọi service)
5. Test register endpoint qua Hoppscotch

**Screenshots cần chụp:**

- [ ] Terminal: output lệnh `nest g module auth`
- [ ] VS Code: file auth.module.ts với decorator `@Module()`
- [ ] VS Code: file auth.controller.ts với decorator `@Controller()`, `@Post()`
- [ ] VS Code: file auth.service.ts với `@Injectable()` và constructor injection
- [ ] VS Code: file register.dto.ts với class-validator decorators
- [ ] Hoppscotch: POST /auth/register thành công (200)
- [ ] Hoppscotch: POST /auth/register thất bại — validation error (400)

### Task 2.3: Bổ sung Chương 5 — Prisma ORM

**File output:** `docs/report-supplements/ch05-exercise.md`

**Nội dung bài tập:** Định nghĩa schema, chạy migration, thực hiện CRUD, demo các loại relation

**Phần A — Schema & Migration (dùng User + Workspace đã có):**
1. Giải thích file schema.prisma (generator, datasource, models)
2. Định nghĩa model User, Workspace, WorkspaceMember
3. Chạy `npx prisma migrate dev --name init`
4. Mở Prisma Studio xem kết quả

**Phần B — CRUD Operations (dùng Auth + Workspace):**
1. Create: Đăng ký user mới → Prisma `user.create()`
2. Read: Lấy danh sách workspace → Prisma `workspace.findMany()` với `include`
3. Update: Cập nhật workspace → Prisma `workspace.update()`
4. Delete: Xóa workspace → Prisma `workspace.delete()` (cascade)

**Phần C — Relations (dùng code thực tế):**
1. **1-N:** User → RefreshToken, User → Workspace (owner), Workspace → WorkspaceMember
2. **N-N:** Task ↔ Label (qua TaskLabel) — dùng schema snippet + Prisma Studio
3. **1-1:** Giới thiệu pattern (UserSettings example) — code snippet
4. **Self-relation:** Comment → Comment (reply) — dùng schema snippet + Prisma Studio

**Phần D — Advanced (dùng Workspace service):**
1. Transaction: `$transaction()` khi tạo workspace + member cùng lúc
2. Filtering: `findMany()` với `where`, `include`, `select`

**Screenshots cần chụp:**

- [ ] VS Code: file schema.prisma (models User, Workspace, WorkspaceMember)
- [ ] Terminal: output `npx prisma migrate dev`
- [ ] Prisma Studio: bảng User với data
- [ ] Prisma Studio: bảng WorkspaceMember thể hiện relation
- [ ] Hoppscotch: POST /auth/register (create)
- [ ] Hoppscotch: GET /workspaces (read với include owner)
- [ ] Hoppscotch: PATCH /workspaces/:id (update)
- [ ] Hoppscotch: DELETE /workspaces/:id (delete cascade)
- [ ] Hoppscotch: GET /workspaces/:id (chi tiết với members — relation)
- [ ] VS Code: đoạn code `$transaction()` trong workspace.service.ts

**Sau khi Task module hoàn thành, bổ sung thêm:**
- [ ] Hoppscotch: POST /tasks/:id/labels/:labelId (gắn label — N-N)
- [ ] Hoppscotch: GET /tasks/:taskId/comments (nested replies — self-relation)
- [ ] Prisma Studio: bảng TaskLabel thể hiện N-N
- [ ] Prisma Studio: bảng Comment thể hiện self-relation (parentId)

### Task 2.4: Bổ sung Chương 6 — Pipes & Interceptors

**File output:** `docs/report-supplements/ch06-exercise.md`

**Nội dung bài tập:** Validate dữ liệu đầu vào và chuẩn hóa response đầu ra

**Phần A — ValidationPipe (dùng Auth DTO):**
1. Show cấu hình global ValidationPipe trong main.ts
2. Show RegisterDto với các decorator: `@IsEmail`, `@MinLength`, `@IsNotEmpty`
3. Test: Gửi data đúng → thành công
4. Test: Gửi data thiếu field → lỗi 400 chi tiết
5. Test: Gửi data thừa field (whitelist) → field bị strip

**Phần B — ParseUUIDPipe (dùng Workspace endpoint):**
1. Gọi GET /workspaces/abc → lỗi UUID
2. Gọi GET /workspaces/{valid-uuid} → thành công

**Phần C — TransformResponseInterceptor (dùng bất kỳ endpoint nào):**
1. Show code interceptor
2. Show response format chuẩn: `{ success, data, timestamp }`
3. So sánh response có vs không có interceptor

**Sau khi Task module hoàn thành, bổ sung thêm:**
- CreateTaskDto minh họa validate phức tạp hơn: `@IsEnum`, `@IsUUID`, `@IsDateString`, `@MaxLength`

**Screenshots cần chụp:**

- [ ] VS Code: main.ts — đoạn cấu hình ValidationPipe
- [ ] VS Code: register.dto.ts — class-validator decorators
- [ ] Hoppscotch: POST /auth/register với data đúng → 201
- [ ] Hoppscotch: POST /auth/register thiếu email → 400 validation error
- [ ] Hoppscotch: POST /auth/register thừa field "role" → field bị strip (whitelist)
- [ ] Hoppscotch: GET /workspaces/abc → 400 UUID error
- [ ] Hoppscotch: response bất kỳ → thấy format `{ success, data, timestamp }`
- [ ] VS Code: transform-response.interceptor.ts

### Task 2.5: Bổ sung Chương 7 — Authentication & Authorization

**File output:** `docs/report-supplements/ch07-exercise.md`

**Nội dung bài tập:** Xây dựng hệ thống xác thực JWT và bảo vệ API

**Các bước:**
1. Đăng ký tài khoản (POST /auth/register)
2. Đăng nhập (POST /auth/login) → nhận JWT token
3. Decode token trên jwt.io → thấy payload
4. Gọi protected endpoint KHÔNG có token → 401
5. Gọi protected endpoint CÓ token → thành công
6. Tạo workspace (minh họa Authorization: chỉ OWNER/ADMIN mới sửa được)
7. User khác thử sửa workspace → 403 Forbidden

**Screenshots cần chụp:**

- [ ] Hoppscotch: POST /auth/register → response với tokens
- [ ] Hoppscotch: POST /auth/login → response với accessToken
- [ ] jwt.io: decode token → thấy sub, email, exp
- [ ] Hoppscotch: GET /workspaces KHÔNG có token → 401 Unauthorized
- [ ] Hoppscotch: GET /workspaces CÓ Bearer token → 200 OK
- [ ] Hoppscotch: PATCH /workspaces/:id bằng user không phải OWNER → 403 Forbidden
- [ ] VS Code: jwt.strategy.ts
- [ ] VS Code: jwt-auth.guard.ts
- [ ] VS Code: current-user.decorator.ts
- [ ] VS Code: workspace.controller.ts — `@UseGuards()` + `@CurrentUser()`

### Task 2.6: Cải thiện Phần 3 — Đồ án tổng hợp (Ch8-Ch9)

**File output:** `docs/report-supplements/ch08-09-project.md`

**Nội dung Chương 8 (Phân tích & Thiết kế) — cập nhật:**

- [ ] **Step 1:** Cập nhật bảng module chức năng (bỏ "Sắp triển khai", ghi rõ trạng thái thực tế)
- [ ] **Step 2:** Giữ ERD, sequence diagrams đã có
- [ ] **Step 3:** Bổ sung mô tả rõ hơn về kiến trúc module

**Nội dung Chương 9 (Triển khai & Demo) — viết mới:**

- [ ] **Step 1:** Hướng dẫn cài đặt và chạy project (clone, install, docker, migrate, start)
- [ ] **Step 2:** Demo Auth module — screenshot register, login, token
- [ ] **Step 3:** Demo User module — screenshot profile, change password, avatar
- [ ] **Step 4:** Demo Workspace module — screenshot tạo, invite, members, role
- [ ] **Step 5:** Demo Task module (khi xong) — screenshot CRUD, assign, labels, comments
- [ ] **Step 6:** Giải thích cách các module lắp ghép: Auth guard bảo vệ → Workspace chứa Project → Project chứa Task → Task có Label + Comment

**Screenshots cần chụp:**

- [ ] Frontend: trang Login
- [ ] Frontend: trang Register
- [ ] Frontend: trang Dashboard
- [ ] Frontend: trang Profile Settings
- [ ] Hoppscotch: Luồng đầy đủ — register → login → tạo workspace → tạo project → tạo task → gắn label → comment
- [ ] Prisma Studio: data thực tế sau khi demo

### Task 2.7: Bổ sung Phần 5 — Tổng kết (Ch10-Ch11)

**File output:** `docs/report-supplements/ch10-11-conclusion.md`

- [ ] **Step 1:** Viết đánh giá so với mục tiêu ban đầu (% hoàn thành)
- [ ] **Step 2:** Viết Bug Reports (1-2 lỗi thú vị nhất + cách fix)
- [ ] **Step 3:** Viết hướng phát triển tương lai
- [ ] **Step 4:** Viết định hướng cá nhân

### Task 2.8: Bổ sung phần phụ

- [ ] **Lời cảm ơn** — viết theo mẫu báo cáo tham khảo
- [ ] **Tài liệu tham khảo** — liệt kê NestJS docs, Prisma docs, JWT.io, etc.
- [ ] **Phụ lục** — link GitHub repo

---

## Thứ Tự Thực Hiện (Timeline)

```
Tuần hiện tại:
├── [Đạt + Claude] Task 2.0: Bổ sung cấu trúc (Lời cảm ơn, Kế hoạch, Phạm vi)
├── [Đạt + Claude] Task 2.1: Viết bài tập Ch3
├── [Đạt + Claude] Task 2.2: Viết bài tập Ch4
├── [Đạt + Claude] Task 2.5: Viết bài tập Ch7
├── [Phú + Huyền] Task 1.4: Implement Project module
└── [Phú + Huyền] Task 1.1: Implement Task module CRUD

Tuần tiếp theo:
├── [Phú + Huyền] Task 1.2: Implement Label module (N-N)
├── [Phú + Huyền] Task 1.3: Implement Comment module (Self-relation)
├── [Đạt + Claude] Task 2.3: Viết bài tập Ch5 (phần cơ bản trước, bổ sung khi Task xong)
├── [Đạt + Claude] Task 2.4: Viết bài tập Ch6 (phần cơ bản trước, bổ sung khi Task xong)
├── [Đạt + Claude] Task 2.6: Viết Ch8-Ch9 (Đồ án tổng hợp)
├── [Đạt + Claude] Task 2.7: Viết Ch10-Ch11 (Tổng kết)
└── [Cả nhóm] Chụp screenshot, ghép vào Word, review

Hoàn thiện:
├── [Cả nhóm] Review toàn bộ báo cáo
├── [Cả nhóm] Bổ sung screenshot cho phần Task/Label/Comment
└── [Cả nhóm] Format Word, mục lục, đánh số trang
```

---

## Quy Ước Output

### File Markdown bổ sung
- Lưu tại: `docs/report-supplements/chXX-*.md`
- Mỗi file chứa nội dung sẵn sàng copy vào Word
- Chỗ cần screenshot đánh dấu: `[SCREENSHOT: mô tả]`
- Code snippet dùng fenced code block có syntax highlight

### Module code mới
- Đặt tại: `backend/src/modules/{module-name}/`
- Theo pattern workspace module: module + controller + service + dto/
- Comment tiếng Việt cho dễ hiểu
- Validation messages tiếng Việt

---

## Checklist Cuối Cùng

Trước khi nộp báo cáo, kiểm tra:

- [ ] Mỗi chương Ch3-Ch7 đều có phần "Bài tập ứng dụng" với: Mục tiêu, Đề bài, Code minh họa, Kết quả đạt được (screenshot)
- [ ] Mọi code snippet đều có ảnh chụp kết quả chạy thực tế kèm theo
- [ ] Phần 3 (Đồ án tổng hợp) có demo chức năng thực tế với screenshot
- [ ] KHÔNG có kỹ thuật nào ở Phần 3 mà chưa trình bày ở Phần 2
- [ ] Có Lời cảm ơn, Bảng kế hoạch, Tài liệu tham khảo, Phụ lục
- [ ] Mục lục cập nhật đúng
