# Chương 4 — Bài tập ứng dụng: Xây dựng User Module cho dự án TodoList Collaboration

## 1. Mục tiêu

Vận dụng các khái niệm cốt lõi đã học trong Chương 4 — Modules, Controllers, Providers/Services, và Dependency Injection — để xây dựng module quản lý người dùng (User Module) cho dự án TodoList Collaboration. Sau khi hoàn thành, người đọc sẽ:

- Biết cách sử dụng NestJS CLI để generate các thành phần (Module, Controller, Service).
- Hiểu cách Controller nhận request và uỷ thác xử lý cho Service thông qua Dependency Injection.
- Xây dựng được các endpoint RESTful với các HTTP Method Decorators và Request Data Decorators.
- Quan sát nguyên tắc Single Responsibility: Controller chỉ nhận/trả request, Service chứa business logic.

## 2. Mô tả bài tập

Tiếp tục từ dự án `todolist-collaboration` đã tạo ở Chương 3, xây dựng module **User** với các endpoint quản lý hồ sơ người dùng. Ở giai đoạn này, dữ liệu được lưu tạm trong một mảng in-memory — việc kết nối database sẽ được thực hiện ở Chương 5.

**Yêu cầu cụ thể:**

1. Sử dụng NestJS CLI để generate `UserModule`, `UserController`, `UserService`.
2. Triển khai hai endpoint ban đầu:
   - `GET /users/:id` — Lấy thông tin hồ sơ người dùng
   - `PATCH /users/:id` — Cập nhật hồ sơ người dùng (displayName, bio)
3. Minh họa Dependency Injection giữa Controller và Service.
4. Kiểm tra API bằng Hoppscotch.

## 3. Code minh họa

### Bước 1: Generate các thành phần bằng CLI

```bash
nest g module user
nest g controller user --no-spec
nest g service user --no-spec
```

Ba lệnh trên sẽ tạo các file tương ứng trong thư mục `src/user/` và tự động cập nhật `UserModule`. Flag `--no-spec` bỏ qua file test để giữ thư mục gọn gàng.

> (Ảnh chụp: Terminal hiển thị kết quả ba lệnh generate thành công)

### Bước 2: Triển khai UserService (In-memory)

```typescript
// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

// Dữ liệu giả lập — sẽ được thay bằng Prisma ở Chương 5
interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: '1',
      email: 'dat@sgu.edu.vn',
      displayName: 'Tuấn Đạt',
      bio: 'Backend Developer',
      status: 'ACTIVE',
      createdAt: new Date(),
    },
    {
      id: '2',
      email: 'vy@sgu.edu.vn',
      displayName: 'Thanh Vy',
      bio: 'Frontend Developer',
      status: 'ACTIVE',
      createdAt: new Date(),
    },
  ];

  // Lấy thông tin hồ sơ người dùng
  getProfile(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Cập nhật hồ sơ người dùng
  updateProfile(userId: string, data: { displayName?: string; bio?: string }) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (data.displayName) user.displayName = data.displayName;
    if (data.bio) user.bio = data.bio;
    return user;
  }
}
```

Điểm cần lưu ý:
- Decorator `@Injectable()` đánh dấu class này là Provider, cho phép NestJS quản lý và inject vào các class khác.
- `NotFoundException` là built-in exception của NestJS, tự động trả về HTTP 404.
- Mảng `users` đóng vai trò "database tạm" — Chương 5 sẽ thay bằng Prisma ORM.

### Bước 3: Triển khai UserController

```typescript
// src/user/user.controller.ts
import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  // Dependency Injection: NestJS tự động inject UserService qua constructor
  constructor(private readonly userService: UserService) {}

  // GET /users/:id — Lấy hồ sơ
  @Get(':id')
  getProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  // PATCH /users/:id — Cập nhật hồ sơ
  @Patch(':id')
  updateProfile(
    @Param('id') userId: string,
    @Body() data: { displayName?: string; bio?: string },
  ) {
    return this.userService.updateProfile(userId, data);
  }
}
```

Điểm cần lưu ý:
- `@Controller('users')` đặt route prefix `/users` cho toàn bộ controller.
- `constructor(private readonly userService: UserService)` — đây chính là **Dependency Injection**. NestJS tự động tạo instance `UserService` và truyền vào constructor. Controller không cần biết `UserService` được tạo như thế nào hay phụ thuộc vào gì.
- `@Param('id')` trích xuất giá trị từ URL parameter `:id`.
- `@Body()` lấy toàn bộ nội dung body dưới dạng object.
- Controller chỉ nhận request và gọi Service — **không chứa business logic** (nguyên tắc Single Responsibility).

### Bước 4: Kiểm tra UserModule

```typescript
// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

NestJS CLI đã tự động đăng ký `UserController` và `UserService` vào module, và import `UserModule` vào `AppModule`.

### Bước 5: Kiểm tra bằng Hoppscotch

**Test 1 — Lấy hồ sơ người dùng:**
- **Method:** GET
- **URL:** `http://localhost:3000/users/1`
- **Expected:** Object chứa thông tin user với `id: "1"`.

> (Ảnh chụp: Hoppscotch hiển thị response GET /users/1 — status 200, object user "Tuấn Đạt")

**Test 2 — Cập nhật hồ sơ:**
- **Method:** PATCH
- **URL:** `http://localhost:3000/users/1`
- **Body (JSON):**
```json
{
  "displayName": "Tuan Dat Updated",
  "bio": "Fullstack Developer"
}
```
- **Expected:** Object user với `displayName` và `bio` đã cập nhật.

> (Ảnh chụp: Hoppscotch hiển thị response PATCH /users/1 — status 200, thông tin đã cập nhật)

**Test 3 — Trường hợp không tìm thấy:**
- **Method:** GET
- **URL:** `http://localhost:3000/users/999`
- **Expected:** Status 404 — `"User not found"`.

> (Ảnh chụp: Hoppscotch hiển thị response 404 Not Found)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo **UserModule** đóng gói toàn bộ chức năng quản lý người dùng.
- **UserController** tiếp nhận HTTP request và uỷ thác xử lý cho Service — tuân thủ nguyên tắc Single Responsibility.
- **UserService** chứa business logic với dữ liệu in-memory.
- Cơ chế **Dependency Injection** giữa Controller và Service hoạt động đúng — Controller không tự tạo instance Service mà nhận từ NestJS IoC Container.

Tuy nhiên, dữ liệu in-memory sẽ bị mất mỗi khi ứng dụng restart. Chương tiếp theo sẽ giải quyết vấn đề này bằng cách kết nối với cơ sở dữ liệu PostgreSQL thông qua Prisma ORM.
