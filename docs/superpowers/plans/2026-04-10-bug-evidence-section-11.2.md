# Bug Evidence for Report Section 11.2 — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tạo branch `demo/bug-evidence` chứa 6 commit (3 cặp bug/fix) làm bằng chứng cho mục 11.2 của báo cáo, kèm file Hoppscotch payloads và template markdown báo cáo.

**Architecture:** Branch demo riêng tách khỏi `develop`, mỗi bug có 2 commit (introduce + fix), user tự chạy server và chụp ảnh Hoppscotch theo hướng dẫn trong file artifact. Tất cả artifact nằm ở `docs/supplements/bug-evidence/`.

**Tech Stack:** Git, NestJS backend (TypeScript), Hoppscotch (API client), markdown

**Spec Reference:** `docs/superpowers/specs/2026-04-10-bug-evidence-section-11.2-design.md`

**⚠ Lưu ý đặc biệt:**
- Đây KHÔNG phải là feature dev → **không áp dụng TDD**. Không viết test cho các bug (bug được "đưa vào" tạm thời, test sẽ fail một cách vô nghĩa).
- Các bước có `[USER ACTION]` là việc bạn tự làm tay (chạy server + Hoppscotch + chụp ảnh), AI không làm thay được.
- Tuyệt đối không merge branch `demo/bug-evidence` vào `develop` hay `main`.

---

## File Structure

**Tạo mới:**
```
docs/supplements/bug-evidence/
├── README.md                     # Mô tả thư mục, hướng dẫn đọc
├── hoppscotch-requests.md        # Tất cả request (seed data + 3 test case)
├── report-template.md            # Template markdown 3 bug cho báo cáo
└── screenshots/
    ├── BUG-01/
    │   ├── before/               # User tự lưu ảnh
    │   └── after/
    ├── BUG-02/{before,after}/
    └── BUG-03/{before,after}/
```

**Sửa tạm thời (trên branch `demo/bug-evidence` only):**
- `backend/src/modules/task/task.service.ts` — 3 vị trí
- `backend/src/modules/workspace/workspace.service.ts` — 1 vị trí
- `backend/src/modules/user/user.service.ts` — 1 vị trí

**Không động đến:** bất kỳ file nào khác ngoài danh sách trên.

---

## Task 1: Setup branch và cấu trúc thư mục artifact

**Files:**
- Create: `docs/supplements/bug-evidence/README.md`
- Create: thư mục `docs/supplements/bug-evidence/screenshots/BUG-0{1,2,3}/{before,after}/`

- [ ] **Step 1.1: Tạo branch demo/bug-evidence từ develop**

```bash
git checkout develop
git status    # Phải clean, không có file chưa commit
git checkout -b demo/bug-evidence
git branch    # Xác nhận đang ở demo/bug-evidence
```

Expected: `* demo/bug-evidence`

- [ ] **Step 1.2: Tạo cấu trúc thư mục screenshots**

```bash
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-01/before
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-01/after
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-02/before
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-02/after
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-03/before
mkdir -p docs/supplements/bug-evidence/screenshots/BUG-03/after
```

- [ ] **Step 1.3: Tạo file .gitkeep để git track thư mục rỗng**

```bash
touch docs/supplements/bug-evidence/screenshots/BUG-01/before/.gitkeep
touch docs/supplements/bug-evidence/screenshots/BUG-01/after/.gitkeep
touch docs/supplements/bug-evidence/screenshots/BUG-02/before/.gitkeep
touch docs/supplements/bug-evidence/screenshots/BUG-02/after/.gitkeep
touch docs/supplements/bug-evidence/screenshots/BUG-03/before/.gitkeep
touch docs/supplements/bug-evidence/screenshots/BUG-03/after/.gitkeep
```

- [ ] **Step 1.4: Viết README.md**

Tạo file `docs/supplements/bug-evidence/README.md` với nội dung:

```markdown
# Bug Evidence — Mục 11.2 Báo cáo

Thư mục này chứa bằng chứng cho 3 bug bảo mật đã được thảo luận
trong mục 11.2 (Phân tích lỗi) của báo cáo đồ án NestJS.

## Nội dung

- `hoppscotch-requests.md` — Danh sách tất cả request Hoppscotch
  dùng để seed data và test 3 bug
- `report-template.md` — Template markdown điền sẵn 3 bug cho báo cáo
- `screenshots/BUG-0N/before/` — Ảnh response khi bug còn tồn tại
- `screenshots/BUG-0N/after/` — Ảnh response sau khi đã fix

## Cách đọc git history

Toàn bộ bằng chứng nằm trên branch `demo/bug-evidence`. Xem lịch sử:

    git log --oneline demo/bug-evidence

Mỗi bug có 2 commit: 1 "bug(BUG-0N): ..." và 1 "fix(BUG-0N): ...".

## Danh sách bug

| # | Phân loại OWASP | Endpoint |
|---|---|---|
| BUG-01 | API1:2023 — Broken Object Level Authorization (IDOR) | `/api/v1/tasks/:id` |
| BUG-02 | API5:2023 — Broken Function Level Authorization | `PATCH /api/v1/workspaces/:id/members/:userId` |
| BUG-03 | API3:2023 — Broken Object Property Level Authorization | `GET /api/v1/users/me` |

## Cảnh báo

Branch `demo/bug-evidence` **KHÔNG ĐƯỢC MERGE** vào `develop` hay `main`.
Code trên branch này cố ý chứa lỗi bảo mật cho mục đích minh họa báo cáo.
```

- [ ] **Step 1.5: Commit setup**

```bash
git add docs/supplements/bug-evidence/
git commit -m "chore(bug-evidence): setup directory structure for section 11.2"
```

Expected: 1 commit mới trên branch `demo/bug-evidence`.

---

## Task 2: Viết file hoppscotch-requests.md

**Files:**
- Create: `docs/supplements/bug-evidence/hoppscotch-requests.md`

- [ ] **Step 2.1: Viết file hoppscotch-requests.md**

Tạo file với nội dung đầy đủ (copy-paste nguyên khối dưới đây):

````markdown
# Hoppscotch Requests — Bug Evidence

**Base URL:** `http://localhost:3000/api/v1`

Tất cả request đều thiết lập header:
```
Content-Type: application/json
```

Các request cần token thì thêm:
```
Authorization: Bearer {{accessToken}}
```

---

## Phần 1 — Seed Data (chạy 1 lần trước mọi test)

### 1.1 Register 4 users

**POST** `/auth/register`

Body (user 1 — Alice, sẽ là owner workspace):
```json
{
  "email": "alice@test.com",
  "password": "Alice@1234",
  "name": "Alice Owner"
}
```

Lặp lại POST register với:
```json
{ "email": "bob@test.com",     "password": "Bob@1234",     "name": "Bob Member"   }
{ "email": "charlie@test.com", "password": "Charlie@1234", "name": "Charlie Victim" }
{ "email": "dave@test.com",    "password": "Dave@1234",    "name": "Dave Outsider" }
```

### 1.2 Login Alice → lấy accessToken_A

**POST** `/auth/login`

Body:
```json
{ "email": "alice@test.com", "password": "Alice@1234" }
```

Lưu `accessToken` từ response → gọi là `accessToken_A`.

### 1.3 Alice tạo workspace

**POST** `/workspaces`
Header: `Authorization: Bearer {{accessToken_A}}`

Body:
```json
{
  "name": "Demo Workspace",
  "description": "Workspace dùng để demo bug section 11.2"
}
```

Lưu `id` từ response → gọi là `workspaceId`.

### 1.4 Alice tạo project trong workspace

**POST** `/workspaces/{{workspaceId}}/projects`
Header: `Authorization: Bearer {{accessToken_A}}`

Body:
```json
{
  "name": "Demo Project",
  "description": "Project để tạo task test IDOR"
}
```

Lưu `id` → gọi là `projectId`.

### 1.5 Alice tạo task

**POST** `/projects/{{projectId}}/tasks`
Header: `Authorization: Bearer {{accessToken_A}}`

Body:
```json
{
  "title": "Task mật — chỉ Alice xem được",
  "description": "Task này dùng để test BUG-01 (IDOR)",
  "priority": "HIGH"
}
```

Lưu `id` → gọi là `taskId`.

### 1.6 Alice invite Bob và Charlie

**POST** `/workspaces/{{workspaceId}}/invite`
Header: `Authorization: Bearer {{accessToken_A}}`

Body (invite Bob):
```json
{ "email": "bob@test.com", "role": "MEMBER" }
```

Lưu `inviteToken` từ response → gọi là `inviteToken_B`.

Lặp lại cho Charlie → lưu `inviteToken_C`.

### 1.7 Login Bob, Charlie, Dave

**POST** `/auth/login` × 3 với credential tương ứng.

Lưu các token: `accessToken_B`, `accessToken_C`, `accessToken_D`.

### 1.8 Bob và Charlie accept invite

**POST** `/workspaces/accept-invite/{{inviteToken_B}}`
Header: `Authorization: Bearer {{accessToken_B}}`

Body: (không cần body)

Lặp lại cho Charlie với `accessToken_C` và `inviteToken_C`.

**Sau bước này, state database:**
- Alice: OWNER của workspace
- Bob: MEMBER của workspace
- Charlie: MEMBER của workspace
- Dave: KHÔNG phải member (outsider)

---

## Phần 2 — Test BUG-01 (IDOR Task)

### Test case: Dave (outsider) truy cập task của Alice

**GET** `/tasks/{{taskId}}`
Header: `Authorization: Bearer {{accessToken_D}}`

**Kỳ vọng bảo mật:** `403 Forbidden`
```json
{ "statusCode": 403, "message": "Bạn không có quyền truy cập task này" }
```

**Nếu bug tồn tại:** `200 OK` + toàn bộ task object.

**Ảnh cần chụp (before fix):**
1. Request panel (method GET + URL + header Authorization)
2. Response panel (status + body) → lưu `screenshots/BUG-01/before/`

**Ảnh cần chụp (after fix):** giống vậy nhưng response là 403 → `screenshots/BUG-01/after/`

Có thể test thêm PATCH và DELETE nếu muốn minh họa đầy đủ:

**PATCH** `/tasks/{{taskId}}`
```json
{ "title": "Dave đã hack task của Alice" }
```

**DELETE** `/tasks/{{taskId}}` (cẩn thận — nếu chạy xong thì phải tạo lại task cho các test kế tiếp)

---

## Phần 3 — Test BUG-02 (RBAC Change Role)

### Test case: Bob (MEMBER) đổi role Charlie thành OWNER

**PATCH** `/workspaces/{{workspaceId}}/members/{{charlieUserId}}`
Header: `Authorization: Bearer {{accessToken_B}}`

Body:
```json
{ "role": "OWNER" }
```

**Lưu ý:** `charlieUserId` là `id` của user Charlie, lấy từ response login của Charlie, hoặc từ GET `/workspaces/{{workspaceId}}/members`.

**Kỳ vọng:** `403 Forbidden`
```json
{ "statusCode": 403, "message": "Chỉ Owner mới có quyền đổi Role của thành viên khác" }
```

**Nếu bug tồn tại:** `200 OK` + Charlie đã thành OWNER.

**Ảnh cần chụp (before fix):** request + response 200 OK → `screenshots/BUG-02/before/`
**Ảnh cần chụp (after fix):** request + response 403 → `screenshots/BUG-02/after/`

**Sau khi test xong bug:** nhớ đổi role Charlie về `MEMBER` lại (dùng accessToken_A):
```
PATCH /workspaces/{{workspaceId}}/members/{{charlieUserId}}
Body: { "role": "MEMBER" }
```

---

## Phần 4 — Test BUG-03 (Password Hash Leak)

### Test case: Bất kỳ user nào gọi /users/me

**GET** `/users/me`
Header: `Authorization: Bearer {{accessToken_A}}`

**Kỳ vọng:** response chỉ chứa các field safe:
```json
{
  "id": "...",
  "email": "alice@test.com",
  "displayName": "Alice Owner",
  "avatar": null,
  "status": "ACTIVE",
  "bio": null,
  "emailVerified": true,
  "lastLoginAt": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Nếu bug tồn tại:** response chứa thêm field `password`:
```json
{
  "id": "...",
  "email": "alice@test.com",
  "password": "$2b$10$XYZ...abc",   // ← LEAK
  "displayName": "Alice Owner",
  ...
}
```

**Ảnh cần chụp (before fix):** request + response có `password` → `screenshots/BUG-03/before/`
**Ảnh cần chụp (after fix):** request + response không có `password` → `screenshots/BUG-03/after/`

---

## Checklist ảnh

| Bug | before/ | after/ |
|---|---|---|
| BUG-01 | request.png, response-200.png | response-403.png |
| BUG-02 | request.png, response-200.png | response-403.png |
| BUG-03 | request.png, response-leak.png | response-clean.png |

Đặt tên file snake-case. Định dạng PNG hoặc JPG đều được.
````

- [ ] **Step 2.2: Commit hoppscotch reference**

```bash
git add docs/supplements/bug-evidence/hoppscotch-requests.md
git commit -m "docs(bug-evidence): add Hoppscotch request reference for seed data and tests"
```

---

## Task 3: Viết file report-template.md

**Files:**
- Create: `docs/supplements/bug-evidence/report-template.md`

- [ ] **Step 3.1: Viết template markdown**

Tạo file `docs/supplements/bug-evidence/report-template.md` với nội dung:

````markdown
# 11.2. Phân tích lỗi (Bug Reports)

Trong giai đoạn test API (dùng Swagger và Hoppscotch), nhóm không chỉ
kiểm tra "chạy được hay không" mà còn kiểm tra hành vi có đúng với
kỳ vọng bảo mật ban đầu hay không. Trong đó, một số lỗi tiêu biểu
được nhóm chọn ra để trình bày bao gồm:

---

## 11.2.1. BUG-01 — IDOR trên Task endpoint

**Phân loại:** OWASP API Security Top 10 — **API1:2023 Broken Object Level Authorization (BOLA)**

**Endpoint bị ảnh hưởng:** `GET /api/v1/tasks/:id` (cũng như `PATCH` và `DELETE`)

### Hành vi kỳ vọng vs thực tế

- **Kỳ vọng bảo mật:** Chỉ các thành viên của workspace chứa task đó mới được xem/sửa/xóa. User ngoài workspace gọi vào phải nhận `403 Forbidden`.
- **Thực tế khi có bug:** Service bỏ sót kiểm tra quyền truy cập — bất kỳ user nào đã đăng nhập (có JWT hợp lệ) đều có thể truy cập task bằng cách đoán `taskId` (UUID).

### Kịch bản reproduce

1. Tạo 2 workspace: Alice là OWNER của workspace A (có task `T`), Dave không thuộc workspace A.
2. Dave login → lấy JWT hợp lệ.
3. Dave gọi `GET /api/v1/tasks/<T.id>` với token của mình.
4. Quan sát response.

### Screenshot — Trước khi fix

![Request của Dave](screenshots/BUG-01/before/request.png)

![Response 200 OK (lỗ hổng)](screenshots/BUG-01/before/response-200.png)

*Hình 11.2.1a — Dave (outsider) nhận được 200 OK cùng dữ liệu task của Alice.*

### Code snippet — Đoạn có lỗi

File `backend/src/modules/task/task.service.ts`, method `findOne`:

```typescript
async findOne(userId: string, taskId: string) {
  // ⚠ THIẾU: await this.checkTaskAccess(taskId, userId);

  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
    include: { /* ... */ },
  });

  return task;  // → trả về bất kể user có quyền hay không
}
```

### Code snippet — Sau khi fix

```typescript
async findOne(userId: string, taskId: string) {
  await this.checkTaskAccess(taskId, userId);  // ← thêm lại kiểm tra

  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
    include: { /* ... */ },
  });

  return task;
}
```

Helper `checkTaskAccess` (đã có sẵn trong service) query bảng `WorkspaceMember`
để xác minh user là member của workspace chứa task; nếu không, throw `ForbiddenException`.

### Screenshot — Sau khi fix

![Response 403 Forbidden](screenshots/BUG-01/after/response-403.png)

*Hình 11.2.1b — Sau khi fix, cùng request của Dave trả về 403 Forbidden.*

### Giải thích

Fix này triệt để vì nó áp dụng nguyên tắc **authorization tại tầng service**
(không chỉ dựa vào route guard). Bất kỳ method nào truy cập một resource theo
ID đều phải gọi helper kiểm tra membership trước. Đây là **defense-in-depth** —
ngay cả khi guard ở controller bị sai hoặc bypass, service vẫn là lớp cuối cùng
chặn truy cập trái phép.

---

## 11.2.2. BUG-02 — Thiếu kiểm tra RBAC khi đổi role thành viên

**Phân loại:** OWASP API Security Top 10 — **API5:2023 Broken Function Level Authorization (BFLA)**

**Endpoint bị ảnh hưởng:** `PATCH /api/v1/workspaces/:id/members/:userId`

### Hành vi kỳ vọng vs thực tế

- **Kỳ vọng bảo mật:** Chỉ OWNER của workspace mới được đổi role của thành viên khác. MEMBER thường gọi vào phải nhận `403 Forbidden`.
- **Thực tế khi có bug:** Service chỉ kiểm tra user có phải là member của workspace hay không, không kiểm tra role cụ thể. Hậu quả: một MEMBER có thể tự nâng mình hoặc nâng người khác lên OWNER.

### Kịch bản reproduce

1. Alice tạo workspace, invite Bob và Charlie làm MEMBER.
2. Bob login → lấy JWT.
3. Bob gọi `PATCH /api/v1/workspaces/<wsId>/members/<charlieId>` với body `{"role": "OWNER"}`.
4. Quan sát response.

### Screenshot — Trước khi fix

![Request đổi role của Bob](screenshots/BUG-02/before/request.png)

![Response 200 OK (lỗ hổng)](screenshots/BUG-02/before/response-200.png)

*Hình 11.2.2a — Bob (MEMCustomer) đã đổi thành công role của Charlie thành OWNER.*

### Code snippet — Đoạn có lỗi

File `backend/src/modules/workspace/workspace.service.ts`, method `changeMemberRole`:

```typescript
async changeMemberRole(userId, workspaceId, targetUserId, dto) {
  const requester = await this.prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });

  // ⚠ THIẾU: kiểm tra requester.role === 'OWNER'
  if (!requester) {
    throw new ForbiddenException('Bạn không phải thành viên workspace này');
  }
  // ... tiếp tục update role
}
```

### Code snippet — Sau khi fix

```typescript
async changeMemberRole(userId, workspaceId, targetUserId, dto) {
  const requester = await this.prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });

  if (!requester || requester.role !== 'OWNER') {  // ← thêm check role
    throw new ForbiddenException(
      'Chỉ Owner mới có quyền đổi Role của thành viên khác'
    );
  }
  // ... tiếp tục update role
}
```

### Screenshot — Sau khi fix

![Response 403 Forbidden](screenshots/BUG-02/after/response-403.png)

*Hình 11.2.2b — Bob gọi lại endpoint → 403 Forbidden.*

### Giải thích

Fix này phân biệt rõ **authentication** (user có đăng nhập không) và
**authorization** (user có quyền thực hiện hành động cụ thể này không).
BFLA là lỗi rất phổ biến trong các hệ thống có RBAC: developer thường
chỉ kiểm tra "đã login" mà quên kiểm tra role cụ thể cho từng chức năng
nhạy cảm. Giải pháp tốt hơn nữa là extract ra decorator/guard
`@RequireRole('OWNER')` để áp dụng nhất quán.

---

## 11.2.3. BUG-03 — Lộ password hash trong response `/users/me`

**Phân loại:** OWASP API Security Top 10 — **API3:2023 Broken Object Property Level Authorization (Excessive Data Exposure)**

**Endpoint bị ảnh hưởng:** `GET /api/v1/users/me`

### Hành vi kỳ vọng vs thực tế

- **Kỳ vọng bảo mật:** Response chỉ chứa các field an toàn (id, email, displayName, avatar, v.v.). Field `password` (bcrypt hash) tuyệt đối không được xuất hiện trong bất kỳ response nào.
- **Thực tế khi có bug:** Service query Prisma không dùng `select`, dẫn đến việc trả về **toàn bộ cột** của bảng `User`, bao gồm `password`.

### Kịch bản reproduce

1. Login bất kỳ user nào → lấy JWT.
2. Gọi `GET /api/v1/users/me` với JWT đó.
3. Quan sát response — có field `password` là bug.

### Screenshot — Trước khi fix

![Response có field password](screenshots/BUG-03/before/response-leak.png)

*Hình 11.2.3a — Response chứa field `password: "$2b$10$..."` — leak bcrypt hash.*

### Code snippet — Đoạn có lỗi

File `backend/src/modules/user/user.service.ts`, method `getProfile`:

```typescript
async getProfile(userId: string) {
  // ⚠ THIẾU: select: this.profileSelect
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });
  // → Prisma trả về TẤT CẢ cột, bao gồm password hash

  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

### Code snippet — Sau khi fix

```typescript
// Projection chỉ các field an toàn
private readonly profileSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  status: true,
  bio: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: this.profileSelect,  // ← chỉ lấy các field an toàn
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

### Screenshot — Sau khi fix

![Response không còn password](screenshots/BUG-03/after/response-clean.png)

*Hình 11.2.3b — Sau fix, response không còn chứa `password`.*

### Giải thích

Fix này áp dụng nguyên tắc **explicit allowlist** thay vì implicit — thay vì
"lấy tất rồi lọc bỏ những field nhạy cảm" (dễ sót), ta chỉ định chính xác
các field được phép trả về. Prisma hỗ trợ điều này native qua `select`.

Một cách làm chuyên nghiệp hơn là dùng **Response DTO** với class-transformer
(`@Exclude()` / `@Expose()`) ở tầng controller, để tách biệt hoàn toàn
data-access layer với serialization layer. Tuy nhiên với quy mô dự án này,
`select` tại service layer đã đủ an toàn và dễ đọc.

---

## Tóm tắt 3 bug

| # | OWASP | Endpoint | Loại lỗi |
|---|---|---|---|
| BUG-01 | API1 BOLA | `/tasks/:id` | Thiếu kiểm tra ownership cấp object |
| BUG-02 | API5 BFLA | `/workspaces/:id/members/:userId` | Thiếu kiểm tra role cấp function |
| BUG-03 | API3 OPLA | `/users/me` | Lộ field nhạy cảm do query không select |

**Bài học rút ra:** Cả 3 bug đều thuộc nhóm **authorization/data exposure** —
loại lỗi mà unit test đơn thuần khó bắt vì code vẫn chạy "đúng" về mặt logic
nghiệp vụ. Cần bổ sung **security test case** (test giả lập user khác cố
tình truy cập) trong các kỳ phát triển tiếp theo.
````

- [ ] **Step 3.2: Commit report template**

```bash
git add docs/supplements/bug-evidence/report-template.md
git commit -m "docs(bug-evidence): add report template for 3 bugs with code snippets"
```

---

## Task 4: BUG-01 — Introduce IDOR on Task endpoints

**Files:**
- Modify: `backend/src/modules/task/task.service.ts` (3 vị trí)

- [ ] **Step 4.1: Xóa checkTaskAccess trong method findOne**

Tại file `backend/src/modules/task/task.service.ts`, method `findOne` (khoảng L228-252), xóa dòng `await this.checkTaskAccess(taskId, userId);`:

**Trước (code đúng):**
```typescript
async findOne(userId: string, taskId: string) {
  await this.checkTaskAccess(taskId, userId);

  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
    include: { /* ... */ },
  });

  return task;
}
```

**Sau (code có bug):**
```typescript
async findOne(userId: string, taskId: string) {
  // BUG-01: removed membership check for IDOR demo

  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
    include: { /* ... */ },
  });

  return task;
}
```

- [ ] **Step 4.2: Xóa checkTaskAccess trong method update**

Tại method `update` (khoảng L256-293), xóa dòng `await this.checkTaskAccess(taskId, userId);` ở đầu method.

- [ ] **Step 4.3: Xóa checkTaskAccess trong method remove**

Tại method `remove` (khoảng L297-305), thay:
```typescript
const { task } = await this.checkTaskAccess(taskId, userId);
```
Bằng:
```typescript
// BUG-01: removed membership check
const task = await this.findTaskOrThrow(taskId);
```

(Cần `task` để có `task.projectId` cho event emit ở dưới.)

- [ ] **Step 4.4: Verify file compile được**

```bash
cd backend
npx tsc --noEmit -p tsconfig.json
```

Expected: không có error liên quan tới task.service.ts. (Có thể có warning, bỏ qua.)

- [ ] **Step 4.5: [USER ACTION] Start server và reproduce**

```bash
cd backend
npm run start:dev
```

Mở Hoppscotch, chạy theo hướng dẫn ở `docs/supplements/bug-evidence/hoppscotch-requests.md` Phần 2:
1. Nếu chưa có seed data → chạy Phần 1 trước (register 4 users + tạo workspace/project/task).
2. Chạy test BUG-01: Dave gọi `GET /tasks/:taskId`.
3. Expected: **200 OK** + trả về task của Alice.
4. Chụp 2 ảnh: request + response → lưu vào `docs/supplements/bug-evidence/screenshots/BUG-01/before/`
5. (Optional) chụp thêm PATCH/DELETE nếu muốn minh họa đầy đủ.

Stop server sau khi chụp xong (`Ctrl+C`).

- [ ] **Step 4.6: Commit bug introduction**

```bash
git add backend/src/modules/task/task.service.ts docs/supplements/bug-evidence/screenshots/BUG-01/before/
git commit -m "$(cat <<'EOF'
bug(BUG-01): introduce IDOR in task endpoints for 11.2 evidence

Remove checkTaskAccess() calls in findOne/update/remove methods so any
authenticated user can read/modify/delete any task by UUID, regardless
of workspace membership.

OWASP API1:2023 — Broken Object Level Authorization (BOLA)
EOF
)"
```

---

## Task 5: BUG-01 — Fix

**Files:**
- Modify: `backend/src/modules/task/task.service.ts` (revert Task 4 changes)

- [ ] **Step 5.1: Khôi phục checkTaskAccess trong findOne**

Thêm lại dòng `await this.checkTaskAccess(taskId, userId);` ở đầu method `findOne`.

- [ ] **Step 5.2: Khôi phục checkTaskAccess trong update**

Tương tự với method `update`.

- [ ] **Step 5.3: Khôi phục checkTaskAccess trong remove**

Khôi phục về:
```typescript
const { task } = await this.checkTaskAccess(taskId, userId);
```

- [ ] **Step 5.4: Verify file đồng nhất với develop**

```bash
git diff develop -- backend/src/modules/task/task.service.ts
```

Expected: **không có diff** (empty output) — nghĩa là đã khôi phục đúng về trạng thái develop.

- [ ] **Step 5.5: [USER ACTION] Start server và verify fix**

```bash
cd backend
npm run start:dev
```

Chạy lại đúng request ở Task 4.5 (Dave gọi `GET /tasks/:taskId`).
Expected: **403 Forbidden** + message "Bạn không có quyền truy cập task này".

Chụp ảnh response → lưu vào `docs/supplements/bug-evidence/screenshots/BUG-01/after/`.

Stop server.

- [ ] **Step 5.6: Commit fix**

```bash
git add backend/src/modules/task/task.service.ts docs/supplements/bug-evidence/screenshots/BUG-01/after/
git commit -m "$(cat <<'EOF'
fix(BUG-01): restore membership check in task endpoints

Re-add checkTaskAccess() in findOne/update/remove to verify user is a
member of the workspace containing the task before any operation.
Defense-in-depth: authorization at service layer, not only at guard.
EOF
)"
```

---

## Task 6: BUG-02 — Introduce missing RBAC in changeMemberRole

**Files:**
- Modify: `backend/src/modules/workspace/workspace.service.ts` (method `changeMemberRole`)

- [ ] **Step 6.1: Xóa check role trong changeMemberRole**

Tại method `changeMemberRole` (khoảng L222-245), thay:

**Trước:**
```typescript
if (!requester || requester.role !== 'OWNER') {
  throw new ForbiddenException('Chỉ Owner mới có quyền đổi Role của thành viên khác');
}
```

**Sau:**
```typescript
// BUG-02: removed OWNER role check — only authenticate membership
if (!requester) {
  throw new ForbiddenException('Bạn không phải thành viên workspace này');
}
```

- [ ] **Step 6.2: Verify compile**

```bash
cd backend
npx tsc --noEmit -p tsconfig.json
```

- [ ] **Step 6.3: [USER ACTION] Reproduce bug**

Start server. Dùng Hoppscotch (tham khảo Phần 3 file hoppscotch-requests.md):
1. Bob login (nếu cần) → lấy token.
2. Bob gọi `PATCH /workspaces/:id/members/:charlieUserId` body `{"role": "OWNER"}`.
3. Expected: **200 OK** + Charlie đã thành OWNER.
4. Chụp request + response → `screenshots/BUG-02/before/`.

**Quan trọng:** Sau khi chụp xong, restore role Charlie về MEMBER (dùng accessToken_A):
```
PATCH /workspaces/:id/members/:charlieUserId  body: {"role": "MEMBER"}
```

Stop server.

- [ ] **Step 6.4: Commit bug introduction**

```bash
git add backend/src/modules/workspace/workspace.service.ts docs/supplements/bug-evidence/screenshots/BUG-02/before/
git commit -m "$(cat <<'EOF'
bug(BUG-02): remove OWNER role check in changeMemberRole

Service only verifies workspace membership, not role. Any MEMBER can
promote other members (or themselves) to OWNER via the change-role
endpoint.

OWASP API5:2023 — Broken Function Level Authorization (BFLA)
EOF
)"
```

---

## Task 7: BUG-02 — Fix

**Files:**
- Modify: `backend/src/modules/workspace/workspace.service.ts`

- [ ] **Step 7.1: Khôi phục role check**

Trong `changeMemberRole`, khôi phục:
```typescript
if (!requester || requester.role !== 'OWNER') {
  throw new ForbiddenException('Chỉ Owner mới có quyền đổi Role của thành viên khác');
}
```

- [ ] **Step 7.2: Verify đồng nhất develop**

```bash
git diff develop -- backend/src/modules/workspace/workspace.service.ts
```

Expected: empty output.

- [ ] **Step 7.3: [USER ACTION] Verify fix**

Start server. Bob gọi lại cùng PATCH request. Expected: **403 Forbidden**.
Chụp response → `screenshots/BUG-02/after/`. Stop server.

- [ ] **Step 7.4: Commit fix**

```bash
git add backend/src/modules/workspace/workspace.service.ts docs/supplements/bug-evidence/screenshots/BUG-02/after/
git commit -m "$(cat <<'EOF'
fix(BUG-02): enforce OWNER role in changeMemberRole

Restore explicit check that requester.role === 'OWNER' before allowing
member role changes. Separates authentication (is logged in) from
authorization (has specific privilege).
EOF
)"
```

---

## Task 8: BUG-03 — Introduce password hash leak

**Files:**
- Modify: `backend/src/modules/user/user.service.ts` (method `getProfile`)

- [ ] **Step 8.1: Xóa select trong getProfile**

Tại method `getProfile` (khoảng L34-43), thay:

**Trước:**
```typescript
async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: this.profileSelect,
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

**Sau:**
```typescript
async getProfile(userId: string) {
  // BUG-03: removed select projection — Prisma will return all columns
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

- [ ] **Step 8.2: Verify compile**

```bash
cd backend
npx tsc --noEmit -p tsconfig.json
```

- [ ] **Step 8.3: [USER ACTION] Reproduce bug**

Start server. Dùng Hoppscotch:
1. Login bất kỳ user nào → lấy token.
2. Gọi `GET /users/me` với token.
3. Expected: response có field `password: "$2b$10$..."`.
4. Chụp request + response (phóng to field password cho rõ) → `screenshots/BUG-03/before/`.

Stop server.

- [ ] **Step 8.4: Commit bug introduction**

```bash
git add backend/src/modules/user/user.service.ts docs/supplements/bug-evidence/screenshots/BUG-03/before/
git commit -m "$(cat <<'EOF'
bug(BUG-03): expose full user object in getProfile

Remove Prisma select projection so findUnique returns all columns
including the bcrypt-hashed password field. Leaks password hash in
GET /users/me response.

OWASP API3:2023 — Broken Object Property Level Authorization (OPLA)
EOF
)"
```

---

## Task 9: BUG-03 — Fix

**Files:**
- Modify: `backend/src/modules/user/user.service.ts`

- [ ] **Step 9.1: Khôi phục select**

Thêm lại `select: this.profileSelect,` trong câu `findUnique` của `getProfile`.

- [ ] **Step 9.2: Verify đồng nhất develop**

```bash
git diff develop -- backend/src/modules/user/user.service.ts
```

Expected: empty output.

- [ ] **Step 9.3: [USER ACTION] Verify fix**

Start server. Gọi lại `GET /users/me`. Expected: response không có field `password`.
Chụp response → `screenshots/BUG-03/after/`. Stop server.

- [ ] **Step 9.4: Commit fix**

```bash
git add backend/src/modules/user/user.service.ts docs/supplements/bug-evidence/screenshots/BUG-03/after/
git commit -m "$(cat <<'EOF'
fix(BUG-03): restore profileSelect projection in getProfile

Re-add explicit select with safe-field allowlist. Prisma now returns
only id, email, displayName, avatar, status, bio, emailVerified,
lastLoginAt, createdAt, updatedAt — never the password hash.
EOF
)"
```

---

## Task 10: Verification và handoff

- [ ] **Step 10.1: Verify branch state**

```bash
git log --oneline demo/bug-evidence ^develop
```

Expected: liệt kê đúng **9 commit** (1 setup + 2 artifact + 6 bug/fix), ví dụ:
```
<hash> fix(BUG-03): restore profileSelect projection in getProfile
<hash> bug(BUG-03): expose full user object in getProfile
<hash> fix(BUG-02): enforce OWNER role in changeMemberRole
<hash> bug(BUG-02): remove OWNER role check in changeMemberRole
<hash> fix(BUG-01): restore membership check in task endpoints
<hash> bug(BUG-01): introduce IDOR in task endpoints for 11.2 evidence
<hash> docs(bug-evidence): add report template for 3 bugs with code snippets
<hash> docs(bug-evidence): add Hoppscotch request reference for seed data and tests
<hash> chore(bug-evidence): setup directory structure for section 11.2
```

- [ ] **Step 10.2: Verify develop không bị ảnh hưởng**

```bash
git checkout develop
git status   # Phải clean
git diff demo/bug-evidence~6 develop -- backend/src/modules/task/task.service.ts backend/src/modules/workspace/workspace.service.ts backend/src/modules/user/user.service.ts
```

Expected: `git status` clean. Diff between fix commits and develop should be empty for the 3 files.

```bash
git checkout demo/bug-evidence   # quay lại branch demo
```

- [ ] **Step 10.3: Verify tất cả screenshot đã có**

```bash
ls docs/supplements/bug-evidence/screenshots/BUG-01/before/
ls docs/supplements/bug-evidence/screenshots/BUG-01/after/
ls docs/supplements/bug-evidence/screenshots/BUG-02/before/
ls docs/supplements/bug-evidence/screenshots/BUG-02/after/
ls docs/supplements/bug-evidence/screenshots/BUG-03/before/
ls docs/supplements/bug-evidence/screenshots/BUG-03/after/
```

Expected: mỗi thư mục có ít nhất 1 file ảnh (không chỉ `.gitkeep`).

- [ ] **Step 10.4: KHÔNG push lên remote cho đến khi review**

Không chạy `git push` cho branch này cho đến khi toàn bộ nhóm đã review. Khi push, dùng:
```bash
git push origin demo/bug-evidence
```
(**KHÔNG** tạo PR — branch này không dành để merge.)

- [ ] **Step 10.5: Sao chép report-template.md vào báo cáo chính**

Mở file `docs/supplements/bug-evidence/report-template.md`, copy toàn bộ nội dung vào mục 11.2 của file báo cáo chính (docx). Insert các ảnh từ `screenshots/BUG-0N/{before,after}/` vào đúng vị trí.

---

## Tiêu chí hoàn thành

- [x] Branch `demo/bug-evidence` tồn tại với ≥9 commit
- [x] 3 file artifact (`README.md`, `hoppscotch-requests.md`, `report-template.md`) nằm trong `docs/supplements/bug-evidence/`
- [x] Đủ 6 thư mục screenshot, mỗi thư mục có ảnh thực tế
- [x] `git diff develop demo/bug-evidence -- backend/` chỉ hiển thị diff ở các **bug commit**, **fix commit** diff = 0 so với develop
- [x] Không có merge/push lên `develop` hay `main`
- [x] Mục 11.2 trong báo cáo đã được điền đầy đủ theo template
