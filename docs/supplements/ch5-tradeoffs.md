<!-- Chèn vào: SAU section 5.8 (Tích hợp Prisma), TRƯỚC bài tập Chương 5 -->

## 5.9. Lỗi thường gặp và Trade-offs

Prisma ORM đơn giản hóa đáng kể việc thao tác cơ sở dữ liệu, nhưng sự tiện lợi đó đôi khi che giấu những vấn đề hiệu năng nghiêm trọng. Phần này phân tích ba cạm bẫy phổ biến nhất khi sử dụng Prisma trong dự án thực tế, cùng cách khắc phục đã được nhóm áp dụng trong dự án TodoList Collaboration.

### 5.9.1. Vấn đề N+1 Query — cạm bẫy phổ biến nhất

Vấn đề N+1 Query là lỗi hiệu năng kinh điển trong mọi ORM, và Prisma cũng không ngoại lệ. Vấn đề xảy ra khi developer viết code lấy danh sách records (1 query), rồi với mỗi record lại chạy thêm một query để lấy dữ liệu liên quan — tổng cộng N+1 queries thay vì 1.

Giả sử chúng ta cần lấy danh sách tasks trong một project kèm thông tin người được assign và labels. Cách viết sai — tuy trông có vẻ hợp lý — sẽ tạo ra hàng chục queries:

```typescript
// ❌ SAI — N+1 queries
const tasks = await this.prisma.task.findMany({
  where: { projectId },
});

// Với mỗi task, chạy thêm 2 queries → N tasks = 2N + 1 queries
for (const task of tasks) {
  task.assignments = await this.prisma.taskAssignment.findMany({
    where: { taskId: task.id },
  });
  task.labels = await this.prisma.taskLabel.findMany({
    where: { taskId: task.id },
  });
}
```

Nếu project có 50 tasks, đoạn code trên sẽ thực thi 101 queries (1 + 50 + 50). Với mỗi query tốn khoảng 2-5ms, tổng thời gian xử lý có thể lên đến 200-500ms — chậm gấp 10-25 lần so với cách viết đúng.

Cách viết đúng là sử dụng `include` để Prisma tự động join dữ liệu trong một hoặc vài queries. Đây chính là cách `TaskService` trong dự án TodoList Collaboration thực hiện:

```typescript
// backend/src/modules/task/task.service.ts
// ✅ ĐÚNG — Prisma join trong 1 query
const tasks = await this.prisma.task.findMany({
  where: { projectId },
  include: {
    createdBy: { select: { id: true, name: true, email: true } },
    assignments: {
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    },
    labels: {
      include: {
        label: { select: { id: true, name: true, color: true } },
      },
    },
    _count: { select: { subtasks: true, comments: true } },
  },
});
```

Với `include`, Prisma sẽ tự động tạo các JOIN query tối ưu, lấy toàn bộ dữ liệu liên quan chỉ trong 1-3 queries — bất kể số lượng tasks. Đặc biệt, nhóm còn kết hợp `include` với `_count` để đếm subtasks và comments mà không cần load toàn bộ dữ liệu của chúng, tiết kiệm đáng kể băng thông và bộ nhớ.

### 5.9.2. Trade-off: include vs select

Prisma cung cấp hai cách để kiểm soát dữ liệu trả về: `include` và `select`. Hai cách tiếp cận này phục vụ mục đích khác nhau và có ảnh hưởng trực tiếp đến hiệu năng.

| Tiêu chí | **include** | **select** |
|----------|-------------|------------|
| **Mục đích** | Thêm relation vào kết quả | Chọn chính xác fields cần lấy |
| **Dữ liệu trả về** | Tất cả scalar fields + relations được include | Chỉ các fields được chọn |
| **Hiệu năng** | Tốt cho queries cần nhiều relations | Tốt hơn khi chỉ cần vài fields |
| **Trường hợp sử dụng** | Danh sách tasks với đầy đủ thông tin | Profile user (loại bỏ password) |
| **Kết hợp** | Không dùng chung với `select` ở cùng cấp | Có thể chọn relations bên trong |

Một ví dụ điển hình cho việc sử dụng `select` là method `getProfile()` trong `UserService`. Khi trả thông tin profile, chúng ta **tuyệt đối không** được trả về field `password` — dù đã hash. `UserService` giải quyết vấn đề này bằng cách định nghĩa một object `profileSelect` chỉ chứa các fields an toàn:

```typescript
// backend/src/modules/user/user.service.ts
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
  // ← KHÔNG có password — field này bị loại khỏi kết quả
} as const;

async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: this.profileSelect, // ← Chỉ lấy fields trong profileSelect
  });
  // ...
}
```

Nhờ khai báo `profileSelect` tập trung tại một nơi với `as const`, mọi method cần trả về thông tin user đều tái sử dụng cùng một bộ fields, đảm bảo tính nhất quán và ngăn ngừa việc vô tình trả password về client.

### 5.9.3. Khi nào KHÔNG nên dùng Prisma Migrate

`prisma migrate dev` là công cụ mạnh mẽ để quản lý schema database trong quá trình phát triển. Tuy nhiên, có những tình huống mà việc chạy migrate tự động có thể gây mất dữ liệu nghiêm trọng.

Tình huống nguy hiểm nhất là khi đổi tên column. Prisma không có khái niệm "rename" — thay vào đó, nó sẽ DROP column cũ và ADD column mới. Điều này có nghĩa toàn bộ dữ liệu trong column cũ sẽ bị mất vĩnh viễn. Ví dụ, nếu chúng ta đổi `name` thành `fullName` trong model `User`, migration được tạo sẽ là:

```sql
-- Prisma tự động generate (NGUY HIỂM!)
ALTER TABLE "users" DROP COLUMN "name";
ALTER TABLE "users" ADD COLUMN "fullName" TEXT NOT NULL;
-- → Toàn bộ tên user bị XÓA!
```

Giải pháp an toàn là sử dụng flag `--create-only` để Prisma chỉ tạo file migration mà không thực thi, sau đó sửa SQL thủ công:

```bash
npx prisma migrate dev --create-only --name rename_name_to_fullname
```

Sau khi file migration được tạo, mở file SQL và thay thế bằng lệnh RENAME an toàn:

```sql
-- Sửa thủ công — giữ nguyên dữ liệu
ALTER TABLE "users" RENAME COLUMN "name" TO "fullName";
```

Ngoài ra, trong môi trường production có dữ liệu quan trọng, **luôn backup database trước khi chạy bất kỳ migration nào**. Lệnh `pg_dump` của PostgreSQL cho phép tạo bản sao toàn bộ database chỉ trong vài giây, và chi phí phòng ngừa này luôn nhỏ hơn rất nhiều so với chi phí khôi phục dữ liệu bị mất.

Với kiến thức về cả thao tác dữ liệu lẫn các cạm bẫy hiệu năng, chúng ta sẽ áp dụng vào bài tập thực hành ở phần tiếp theo.
