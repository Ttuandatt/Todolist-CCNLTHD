# Q&A — CÂU HỎI & GHI CHÚ KỸ THUẬT
## DỰ ÁN: TODOLIST COLLABORATION

> File này tổng hợp các câu hỏi kỹ thuật, vấn đề phát hiện trong quá trình phát triển và đề xuất giải quyết.
> Cập nhật liên tục khi có phát hiện mới.

---

## MỤC LỤC

1. [API Optimization](#1-api-optimization)
2. [Database & Prisma](#2-database--prisma)
3. [Authentication & Security](#3-authentication--security)
4. [NestJS & Kiến trúc](#4-nestjs--kiến-trúc)

---

## 1. API OPTIMIZATION

> **Nguồn:** Phân tích kiến trúc ngày 21/03/2026

---

### Q1.1 — N+1 Query khi load Kanban board

**Vấn đề:**
`GET /projects/:id/tasks?groupBySection=true` cần trả về sections kèm tasks, mỗi task có `assignees`, `labels`, `subtaskProgress`, `commentsCount`. Nếu không cẩn thận sẽ phát sinh N+1 queries (1 query lấy sections → N queries lấy tasks → N×M queries lấy assignees/labels...).

**Giải pháp:** Dùng 1 Prisma query duy nhất với nested `include`:

```ts
// section.service.ts — getKanbanBoard()
const sections = await this.prisma.section.findMany({
  where: { projectId },
  orderBy: { position: 'asc' },
  include: {
    tasks: {
      where: { isDeleted: false },  // nếu có soft delete sau này
      orderBy: { position: 'asc' },
      include: {
        assignments: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        labels: {
          include: { label: true },
        },
        _count: {
          select: { comments: true },
        },
        subtasks: {
          select: { isCompleted: true },
        },
      },
    },
  },
});
```

Toàn bộ Kanban board trong **1 round-trip** đến DB.

**Áp dụng:** Khi implement Section service + Task list endpoint.

**Assignee:** Phú (Task Module)

---

### Q1.2 — Position reordering: O(n) writes

**Vấn đề:**
Hiện tại `position` là `Int`. Khi kéo thả section hoặc task, nếu update `position = index` cho tất cả items → N write queries mỗi lần reorder, không scale.

**Giải pháp — Fractional Indexing:**
- Đổi `position` từ `Int` sang `Float` trong schema
- Logic: item A ở `1.0`, item B ở `2.0` → kéo item mới vào giữa → `position = 1.5`
- Chỉ cần **1 write** thay vì N writes
- Khi gap quá nhỏ (< 0.001) → normalize lại toàn bộ (hiếm xảy ra)

```ts
// Tính position mới khi drop vào giữa prev và next
function getNewPosition(prevPos: number | null, nextPos: number | null): number {
  if (prevPos === null && nextPos === null) return 1.0;
  if (prevPos === null) return nextPos! / 2;
  if (nextPos === null) return prevPos + 1.0;
  return (prevPos + nextPos) / 2;
}
```

**Trade-off:** Float có thể mất precision sau nhiều lần reorder → cần normalize job.

**Áp dụng khi:** Implement drag & drop endpoint (F5.5 — Reorder sections, F6.16 — Kéo thả task).

**Assignee:** Người implement Reorder API

---

### Q1.3 — Task list: tách Card view vs Detail view

**Vấn đề:**
`GET /projects/:id/tasks` hiện tại trả về quá nhiều data cho List/Kanban view (comments, attachments, subtasks đầy đủ...). Gây tốn bandwidth và slow response không cần thiết.

**Giải pháp:** Tách rõ 2 response shape:

| Endpoint | Mục đích | Data trả về |
|---|---|---|
| `GET /projects/:id/tasks` | List / Kanban card | `id, title, status, priority, dueDate, position, section{id,name}, assignees{id,name,avatar}, labels, subtaskCount, commentCount` |
| `GET /tasks/:id` | Task detail modal | Toàn bộ: subtasks[], comments[], attachments[], activity... |

Kanban card **không cần** nội dung comments hay file attachments — chỉ cần count.

**Áp dụng:** Ngay khi implement Task controller.

**Assignee:** Phú (Task Module)

---

### Q1.4 — Notification: tránh write DB đồng bộ trong request

**Vấn đề:**
Khi assign task cho 5 người → tạo 5 Notification records + 5 WebSocket events trong cùng 1 HTTP request → làm chậm response của người dùng.

**Giải pháp:** Dùng Bull queue (đã có sẵn trong stack):

```
POST /tasks/:id/assignees
  ├── 1. Lưu TaskAssignment vào DB         (sync — bắt buộc)
  ├── 2. Push job vào Bull queue            (async — non-blocking)
  │        └── Worker xử lý:
  │              ├── Tạo Notification records
  │              └── Emit WebSocket event tới users
  └── 3. Return HTTP 201 ngay lập tức
```

Người dùng nhận response nhanh, notification đến sau vài milliseconds.

**Áp dụng:** Khi implement Notification module (Huyền — Phase 6).

**Assignee:** Huyền (Notification + WebSocket)

---

### Q1.5 — Redis caching cho data đọc nhiều, write ít

**Vấn đề:**
Một số data được đọc trong hầu hết mọi request (kiểm tra permission, load Kanban header...) nhưng hiếm khi thay đổi. Đang query DB mỗi lần.

**Redis đã có trong stack** — nên tận dụng:

| Data cần cache | TTL đề xuất | Invalidate khi |
|---|---|---|
| Workspace members list | 5 phút | Thêm/xóa/đổi role member |
| Labels của workspace | 10 phút | Create/update/delete label |
| Section list của project | 2 phút | Tạo/xóa/reorder section |

**Ví dụ pattern:**

```ts
// workspace.service.ts
async getMembers(workspaceId: string) {
  const cacheKey = `workspace:${workspaceId}:members`;
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const members = await this.prisma.workspaceMember.findMany({ ... });
  await this.redis.setex(cacheKey, 300, JSON.stringify(members)); // TTL 5 phút
  return members;
}

async addMember(workspaceId: string, ...) {
  // ... save to DB
  await this.redis.del(`workspace:${workspaceId}:members`); // invalidate
}
```

**Áp dụng:** Bắt đầu từ workspace members (vì check permission mọi request).

**Assignee:** Đạt (Workspace Module đã có sẵn)

---

### Q1.6 — userPublicSelect: tránh lộ sensitive fields

**Vấn đề:**
Khi dùng `include: { user: true }` trong Prisma, response có thể vô tình bao gồm `password`, `emailVerified`, `lastLoginAt`... — đây là lỗ hổng thông tin.

**Giải pháp:** Tạo constant dùng chung toàn project:

```ts
// src/common/selects/user.select.ts
export const userPublicSelect = {
  id: true,
  name: true,
  displayName: true,
  avatar: true,
} as const;

// Dùng ở mọi nơi cần include user info:
assignments: {
  include: {
    user: { select: userPublicSelect },
  },
},
```

**Áp dụng:** Ngay bây giờ — tạo file này trước khi các module dùng đến User relation.

**Assignee:** Tất cả (convention chung)

---

## 2. DATABASE & PRISMA

> **Nguồn:** Worklog tuần 4 + Phase 2 code guide

---

### Q2.1 — Prisma 7 bỏ `url = env()` trong datasource block

**Vấn đề:**
Prisma 7 thay đổi cách cấu hình datasource. Nếu giữ nguyên format cũ:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ← Lỗi khi dùng Prisma 7
}
```
Sẽ bị lỗi khi chạy `prisma generate` hoặc `prisma migrate`.

**Giải pháp:** Xóa dòng `url = env(...)` khỏi datasource block — Prisma 7 tự động đọc `DATABASE_URL` từ `.env` mà không cần khai báo tường minh:

```prisma
datasource db {
  provider = "postgresql"
  // Không cần dòng url nữa — Prisma 7 tự đọc DATABASE_URL từ .env
}
```

**Áp dụng:** Khi setup project trên máy mới hoặc upgrade Prisma lên v7+.

**Assignee:** Tất cả (đã fix, cần nhớ khi clone repo hoặc upgrade)

---

### Q2.2 — Prisma `select` vs destructuring để che password

**Vấn đề:**
Hai cách phổ biến để ẩn `password` trước khi trả về client:

```ts
// Cách 1: Destructuring (sai về performance)
const user = await this.prisma.user.findUnique({ where: { id } });
const { password, ...safeUser } = user; // Lấy lên rồi mới bỏ đi

// Cách 2: Prisma select (đúng)
const user = await this.prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true, ... }, // Không có password
});
```

**Vấn đề với cách 1:** DB vẫn phải truy vấn và truyền cột `password` lên memory Node.js, rồi mới bỏ. Lãng phí băng thông internal + memory.

**Giải pháp:** Luôn dùng Prisma `select` — lệnh `SELECT` xuống DB không chứa cột `password` ngay từ đầu. Tạo một constant `profileSelect` dùng chung:

```ts
// user.service.ts
private readonly profileSelect = {
  id: true, email: true, name: true, displayName: true,
  avatar: true, status: true, bio: true,
  lastLoginAt: true, createdAt: true, updatedAt: true,
  // password: KHÔNG CÓ
} as const;
```

**Áp dụng:** Mọi method trong UserService trả về user data. Tương tự với `userPublicSelect` (Q1.6) khi include user trong các relation.

**Assignee:** Vy + bất kỳ ai viết method trả user data

---

## 3. AUTHENTICATION & SECURITY

> **Nguồn:** Worklog tuần 5–7 + Phase 1/2 code guide

---

### Q3.1 — BUG-U-001: Multer fileFilter trả HTTP 500 thay vì 400

**Vấn đề:**
Khi user upload file `.txt` (sai định dạng), Multer `fileFilter` throw một `Error` thông thường:

```ts
fileFilter: (_req, file, callback) => {
  if (!allowed.includes(file.mimetype)) {
    return callback(new Error('Chỉ chấp nhận file ảnh'), false); // ← Error thường
  }
  callback(null, true);
},
```

NestJS không biết đây là lỗi HTTP 400 — nó bị bắt bởi Express thay vì NestJS Exception Filter → trả về HTTP 500 hoặc response không chuẩn.

**Giải pháp:** Throw `BadRequestException` của NestJS thay vì `Error` thông thường:

```ts
import { BadRequestException } from '@nestjs/common';

fileFilter: (_req, file, callback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Chỉ chấp nhận file ảnh (jpg, png, gif)'),
      false,
    );
  }
  callback(null, true);
},
```

**Trạng thái:** Chưa fix (đang pending). Cần fix trước khi merge Phase 2.

**Assignee:** Đạt (fix BUG-U-001 trong tuần 8)

---

### Q3.2 — `@nestjs/jwt` v11+ `expiresIn` type mismatch

**Vấn đề:**
`@nestjs/jwt` phiên bản 11+ thay đổi type signature của option `expiresIn`. Khi dùng:

```ts
this.jwtService.signAsync(payload, {
  expiresIn: process.env.JWT_EXPIRES_IN || '15m', // ← TypeScript error
})
```

TypeScript báo lỗi type mismatch vì `expiresIn` lúc này yêu cầu kiểu `number` (seconds) thay vì `string` ('15m').

**Workaround tạm thời:** Cast `as any` để bypass TypeScript check:

```ts
this.jwtService.signAsync(payload, {
  secret: process.env.JWT_SECRET,
  expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any, // workaround
})
```

**Giải pháp dài hạn:** Chuyển `expiresIn` sang số giây:

```ts
expiresIn: 15 * 60, // 900 giây = 15 phút (type-safe, không cần cast)
```

**Áp dụng:** `AuthService.generateTokens()` — cả access token lẫn refresh token.

**Assignee:** Đạt (cân nhắc refactor khi có thời gian)

---

### Q3.3 — Invite email mismatch: lỗ hổng nếu không check

**Vấn đề:**
Khi invite gửi đến `alice@mail.com`, token invite được share công khai (qua link email). Nếu `bob@mail.com` lấy được link và gọi accept endpoint → bob gia nhập workspace với role của alice.

**Giải pháp:** Luôn verify email user đang login phải khớp email trong invite record:

```ts
async acceptInvite(token: string, user: { id: string; email: string }) {
  const invite = await this.prisma.workspaceInvite.findUnique({ where: { token } });

  if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
    throw new BadRequestException('INVITE_EMAIL_MISMATCH');
    // Invite gửi alice@mail.com nhưng bob@mail.com đang accept → chặn
  }
  // ...
}
```

**Áp dụng:** `WorkspaceInviteService.acceptInvite()` và `rejectInvite()` — cả 2 đều cần check.

**Assignee:** Vy (WorkspaceInvite module — Phase 3)

---

## 4. NESTJS & KIẾN TRÚC

> **Nguồn:** Phase 0/2/3 code guide + Workspace Suite Design Spec

---

### Q4.1 — Tại sao tách 3 module Workspace thay vì 1?

**Vấn đề:**
Có thể gộp tất cả logic workspace (CRUD + members + invites) vào 1 `WorkspaceService` cho đơn giản.

**Lý do không làm vậy:**
Gộp hết vào 1 service sẽ ra file 500+ dòng với quá nhiều trách nhiệm. Khó test, khó maintain, vi phạm Single Responsibility Principle.

**Thiết kế đúng — 3 module riêng biệt:**

| Module | Trách nhiệm |
|---|---|
| `WorkspaceModule` | CRUD workspace (tạo, xem, đổi tên, archive, delete) |
| `WorkspaceMemberModule` | Quản lý thành viên + phân quyền (add, remove, promote, transfer) |
| `WorkspaceInviteModule` | Vòng đời lời mời (create, accept, reject, revoke) |

Mỗi module nhỏ = dễ test độc lập, dễ đọc, dễ phân công cho từng người.

**Áp dụng:** Pattern này nên dùng cho Project module (CRUD project vs project members).

**Assignee:** Vy + Đạt (Phase 3)

---

### Q4.2 — Global interceptor/filter: `main.ts` vs `APP_INTERCEPTOR` trong Module

**Vấn đề:**
Có 2 cách đăng ký interceptor/filter global trong NestJS — dùng cái nào?

**Cách 1: `main.ts` (Phase 0 — đang dùng)**
```ts
app.useGlobalInterceptors(new LoggingInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());
```
- Ưu: Đơn giản, không cần inject dependencies
- Nhược: **Không thể inject service** (PrismaService, ConfigService...) vào interceptor/filter

**Cách 2: `APP_INTERCEPTOR` trong AppModule**
```ts
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // JwtAuthGuard đang dùng cách này
  ],
})
```
- Ưu: **Có thể inject dependencies** → JwtAuthGuard cần `Reflector` nên phải dùng cách này
- Nhược: Phức tạp hơn một chút

**Nguyên tắc chọn:** Nếu interceptor/filter/guard cần inject dependencies → dùng `APP_*` trong Module. Nếu không cần → `main.ts` cho gọn.

**Áp dụng:** Khi tạo guard mới cần Prisma hoặc Config → phải dùng `APP_GUARD`.

**Assignee:** Tất cả

---

### Q4.3 — FileInterceptor vs ParseFilePipe: tại sao cần cả 2?

**Vấn đề:**
Trong UserController upload avatar, ta dùng cả 2 lớp validation:

```ts
@UseInterceptors(FileInterceptor('avatar', avatarMulterConfig)) // Lớp 1
uploadAvatar(
  @UploadedFile(new ParseFilePipe({                              // Lớp 2
    validators: [new MaxFileSizeValidator(...), new FileTypeValidator(...)],
  })) file: Express.Multer.File,
) { ... }
```

Có vẻ dư thừa? Thực ra không:

| | FileInterceptor (Multer) | ParseFilePipe |
|---|---|---|
| **Thời điểm chạy** | Khi nhận file từ network stream | Sau khi file đã ghi xuống disk |
| **Mục đích** | Chặn file lớn/sai định dạng **trước khi ghi disk** | Validation lần cuối trước khi Controller nhận |
| **Hiệu năng** | Cao — reject ngay, không tốn I/O disk | Thấp hơn — file đã ghi rồi |

**Lý do cần 2 lớp:** FileInterceptor (Multer) bảo vệ disk I/O. ParseFilePipe bảo vệ Controller logic. Cùng nhau tạo "defense in depth".

**Lưu ý BUG-U-001:** Nếu Multer callback `new Error()` thay vì `new BadRequestException()` → lớp 1 trả 500, không đến được ParseFilePipe. Xem Q3.1.

**Assignee:** Đạt (fix BUG-U-001), Vy (tham khảo khi cần upload trong workspace)

---

## CÁCH ĐÓNG GÓP

Khi phát hiện vấn đề kỹ thuật mới, thêm entry theo format:

```markdown
### Q[section].[number] — [Tên vấn đề ngắn gọn]

**Vấn đề:** Mô tả rõ vấn đề gặp phải.

**Giải pháp:** Cách giải quyết + code snippet nếu có.

**Áp dụng:** Khi nào / ở đâu cần áp dụng.

**Assignee:** Ai chịu trách nhiệm implement.
```
