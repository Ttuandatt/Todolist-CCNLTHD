---
description: Hướng dẫn viết nội dung báo cáo theo văn phong diễn giải
---

# /report-writing - Hướng dẫn viết báo cáo

## Mục đích

Workflow này định nghĩa cách viết nội dung báo cáo kỹ thuật cho dự án TodoList Collaboration. Áp dụng khi cần viết hoặc chỉnh sửa các chương trong báo cáo.

---

## Nguyên tắc văn phong

### 1. Văn phong diễn giải (Narrative Style)

**KHÔNG viết theo dạng bullet point:**
```
❌ Sai:
- Type Safety: ORM tự động sinh ra các types từ schema
- Productivity: Giảm đáng kể lượng code boilerplate
- Maintainability: Code dễ đọc và dễ bảo trì
```

**Viết theo dạng đoạn văn mạch lạc:**
```
✅ Đúng:
Việc sử dụng ORM mang lại nhiều lợi ích đáng kể cho quá trình phát triển. 
Đầu tiên là về Type Safety - ORM tự động sinh ra các types từ schema, 
giúp IDE có thể auto-complete và phát hiện lỗi ngay khi code. Điều này 
đặc biệt quan trọng trong TypeScript vì giúp developer bắt lỗi sớm trong 
quá trình compile thay vì runtime.

Bên cạnh đó, ORM còn tăng đáng kể năng suất làm việc (Productivity). 
Thay vì phải viết hàng trăm dòng SQL boilerplate, developer chỉ cần 
vài dòng code ngắn gọn để thực hiện các thao tác với database...
```

### 2. Cấu trúc đoạn văn

- **Mở đầu mỗi phần** bằng một câu giới thiệu context
- **Giải thích "là gì"** trước, rồi mới đến "tại sao" và "như thế nào"
- **Sử dụng từ nối** để tạo mạch văn: "Đầu tiên...", "Bên cạnh đó...", "Thứ hai...", "Cuối cùng..."
- **Khi liệt kê nhiều items**, viết thành các đoạn văn riêng thay vì gạch đầu dòng

### 3. Sử dụng Bảng biểu (Tables) và Liệt kê (Bullet points)

- **Tuyệt đối hạn chế dùng bảng** để trình bày các định nghĩa, khái niệm mới hoặc trình tự danh sách kiến thức thông thường.
- **Chỉ sử dụng bảng (table)** cho những trường hợp thật sự cần **so sánh nhanh** các tiêu chí (ví dụ: So sánh ưu nhược điểm, bảng tóm tắt cài đặt option rạch ròi).
- Nếu đưa ra các khái niệm, kiến thức, lộ trình mới, bắt buộc phải dùng **văn xuôi diễn giải chi tiết** từng phần một cách mạch lạc thay vì nhồi nhét tóm tắt rỗng tuếch vào bảng.
- Vẫn có thể dùng bullet point đối với danh sách lệnh commands ngắn hoặc Checklist các bước cụ thể đi sát kèm giải thích.

### 4. Độ sâu nội dung

- Giải thích **khái niệm** trước khi đưa ví dụ
- Đưa ra **context và bối cảnh** trước khi đi vào chi tiết
- Giải thích **lý do đằng sau** mỗi quyết định kỹ thuật
- Khi có code example, **giải thích ý nghĩa** của code

---

## Cấu trúc nội dung đề xuất

### Khi viết về một công nghệ/framework:

1. **Định nghĩa và bối cảnh** - Công nghệ này là gì? Ra đời trong hoàn cảnh nào?
2. **Vấn đề giải quyết** - Tại sao cần công nghệ này? Giải quyết pain point gì?
3. **Đặc điểm và kiến trúc** - Hoạt động như thế nào? Có gì đặc biệt?
4. **So sánh (nếu cần)** - So với các alternatives khác thì sao?
5. **Lý do lựa chọn** - Tại sao chọn cho dự án này?

### Khi viết về một concept kỹ thuật:

1. **Giới thiệu khái niệm** - Khái niệm này là gì?
2. **Ví dụ minh họa** - Một ví dụ đơn giản để hiểu
3. **Chi tiết kỹ thuật** - Đi sâu vào cách hoạt động
4. **Áp dụng trong dự án** - Sử dụng như thế nào trong context dự án

---

## Ví dụ chuyển đổi

### Input (bullet point):
```
Lợi ích của Prisma:
- Auto-generated Types
- Declarative Schema
- Prisma Migrate
- Prisma Studio
```

### Output (diễn giải):
```
Prisma mang lại nhiều lợi ích đáng kể cho việc phát triển ứng dụng. 
Điểm nổi bật đầu tiên là khả năng Auto-generated Types - Prisma Client 
được generate tự động từ schema, đảm bảo types luôn đồng bộ với database 
structure. Điều này đặc biệt quan trọng với NestJS vì giúp tận dụng 
tối đa TypeScript.

Tiếp theo là cách tiếp cận Declarative Schema thông qua file schema.prisma. 
File này mô tả database structure một cách rõ ràng, dễ đọc, và có thể 
version control dễ dàng. Hệ thống Prisma Migrate tự động detect changes 
và generate migration files, giảm thiểu sai sót trong quá trình phát triển.

Cuối cùng, Prisma Studio cung cấp một GUI tool cho phép browse và edit 
data trong quá trình development, giúp việc debug và kiểm tra data trở 
nên trực quan hơn.
```

---

## Quy tắc module xuyên suốt (Running Example)

### Module chính: **Task**

Tất cả code examples trong báo cáo PHẢI sử dụng **module Task** làm ví dụ xuyên suốt. Điều này đảm bảo người đọc theo dõi được một câu chuyện liền mạch từ đầu đến cuối, thay vì phải nhớ context mới mỗi lần gặp ví dụ.

**KHÔNG làm thế này:**
```
❌ Giải thích Controller → dùng ProductController
❌ Giải thích Service   → dùng OrderService
❌ Giải thích Guard     → dùng AdminGuard
→ Rời rạc, mất liên kết
```

**Luôn làm thế này:**
```
✅ Giải thích Controller → TaskController
✅ Giải thích Service   → TaskService
✅ Giải thích Guard     → JwtAuthGuard bảo vệ Task endpoints
✅ Giải thích Pipe      → ValidationPipe trên CreateTaskDto
✅ Giải thích Module    → TaskModule
→ Mạch lạc, thống nhất
```

### Mapping module Task cho từng chương:

| Chương | Concept | Ví dụ từ module Task |
|--------|---------|---------------------|
| **Chương 2** (Kiến trúc) | Module | `TaskModule` |
| | Controller | `TaskController` (@Get, @Post, @Patch, @Delete) |
| | Service/Provider | `TaskService`, `PrismaService` inject |
| | Guard | `JwtAuthGuard` bảo vệ Task endpoints |
| | Pipe | `ValidationPipe` validate `CreateTaskDto` |
| | Interceptor | `LoggingInterceptor` log requests đến TaskController |
| | DTO | `CreateTaskDto`, `UpdateTaskDto` |
| **Chương 5** (Database) | Schema | `model Task { ... }` |
| | CRUD | `prisma.task.create/findMany/update/delete` |
| | Relations | Task → User, Task → Project, Task ↔ Label |
| | Migration | `add_priority_to_task` |
| **Chương 6** (Auth) | Guard protect | `@UseGuards(JwtAuthGuard)` trên TaskController |
| | Custom Decorator | `@GetUser()` lấy userId từ JWT |
| | Authorization | Chỉ project member xem được tasks |

### Khi nào được dùng module khác:

- Khi concept **không áp dụng được** cho Task (ví dụ: OAuth flow chỉ có ở Auth module)
- Khi cần **so sánh** giữa nhiều modules để minh họa tính modular
- Khi giới thiệu **Prisma schema** với nhiều models liên quan (User, Project, Task cùng lúc)
- Luôn **quay về Task** ngay sau khi giải thích xong concept đặc biệt

---

## Thông tin dự án (Project Context)

Sử dụng các thông tin sau để giữ tính nhất quán:

- **Tên dự án**: TodoList Collaboration (Quản lý công việc cộng tác)
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + Passport
- **Modules chính**: Auth, User, Workspace, Project, Task, Comment, Notification, Label, Activity
- **Entities chính**: User, Workspace, Project, Task, Subtask, Label, TaskLabel, TaskAssignment, Comment, Notification, ActivityLog, WorkspaceMember, RefreshToken

### Naming conventions trong code examples:
```
Controller: TaskController, UserController, AuthController
Service:    TaskService, UserService, AuthService
Module:     TaskModule, UserModule, AuthModule
DTO:        CreateTaskDto, UpdateTaskDto, TaskResponseDto
Guard:      JwtAuthGuard, RolesGuard
Decorator:  @GetUser(), @Roles()
```

---

## Lưu ý đặc biệt

1. **Ngôn ngữ**: Viết bằng tiếng Việt, thuật ngữ kỹ thuật giữ nguyên tiếng Anh
2. **Giọng văn**: Học thuật nhưng dễ hiểu, như đang giảng bài
3. **Độ dài**: Mỗi đoạn văn khoảng 3-5 câu, không quá dài
4. **Code examples**: Luôn kèm giải thích, không chỉ paste code
5. **Bảng biểu**: CHỈ dùng cho so sánh nhanh. Tuyệt đối không dùng bảng để giới thiệu định nghĩa/kiến thức dài dòng mới, phải chuyển nó thành văn xuôi tường tận.
6. **Module xuyên suốt**: Luôn dùng Task module làm ví dụ chính, chỉ dùng module khác khi bắt buộc.
7. **Tính nhất quán**: Dùng đúng tên class, file, variable như trong project thực tế.
