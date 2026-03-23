# Chương 5 — Bài tập ứng dụng: Kết nối Database và CRUD User với Prisma

## 1. Mục tiêu

Vận dụng kiến thức về Prisma ORM đã học trong Chương 5 để thay thế dữ liệu in-memory bằng cơ sở dữ liệu PostgreSQL thực tế. Sau khi hoàn thành, người đọc sẽ:

- Biết cách cài đặt, cấu hình Prisma và định nghĩa model trong schema.
- Thành thạo quy trình migration: từ schema → SQL → database.
- Tích hợp Prisma vào kiến trúc NestJS thông qua PrismaService (injectable, lifecycle hooks) và PrismaModule (global).
- Thực hiện các thao tác CRUD với database thực, sử dụng Prisma Client type-safe.

## 2. Mô tả bài tập

Tiếp tục từ dự án `todolist-collaboration` ở Chương 4, thay thế mảng in-memory trong UserService bằng PostgreSQL thông qua Prisma ORM.

**Yêu cầu cụ thể:**

1. Cài đặt Prisma và khởi tạo cấu hình.
2. Định nghĩa model `User` trong file `schema.prisma`.
3. Tạo `PrismaService` với lifecycle hooks (`onModuleInit`, `onModuleDestroy`).
4. Tạo `PrismaModule` với decorator `@Global()`.
5. Refactor `UserService`: thay toàn bộ logic mảng in-memory bằng Prisma Client queries.
6. Kiểm tra bằng Hoppscotch và Prisma Studio.

## 3. Code minh họa

### Bước 1: Cài đặt và khởi tạo Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Cấu hình kết nối database trong file `.env`:

```env
DATABASE_URL="postgresql://admin:secretpassword@localhost:5432/todolist_collaboration?schema=public"
```

> (Ảnh chụp: Terminal hiển thị kết quả `npx prisma init` thành công)

### Bước 2: Định nghĩa Model User

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String     @id @default(uuid())
  email         String     @unique
  password      String
  name          String
  displayName   String?
  avatar        String?
  bio           String?
  status        UserStatus @default(ACTIVE)
  emailVerified Boolean    @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@map("users")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}
```

Giải thích các attribute:
- `@id @default(uuid())` — Primary key, tự động sinh UUID.
- `@unique` — Email không được trùng lặp trong hệ thống.
- `String?` — Dấu `?` đánh dấu trường là optional (có thể null).
- `@default(ACTIVE)` — Trạng thái mặc định khi tạo user mới.
- `@updatedAt` — Tự động cập nhật timestamp khi record bị sửa đổi.
- `@@map("users")` — Tên bảng trong database là `users` (snake_case convention).
- `enum UserStatus` — Giới hạn trạng thái chỉ nhận 3 giá trị hợp lệ.

Chạy migration:

```bash
npx prisma migrate dev --name init_user
```

> (Ảnh chụp: Terminal hiển thị migration thành công — "Your database is now in sync with your schema")

### Bước 3: Tạo PrismaService với Lifecycle Hooks

Đây là file thực tế từ dự án TodoList Collaboration:

```typescript
// src/prisma/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
```

Điểm cần lưu ý:
- `extends PrismaClient` — Kế thừa tất cả methods query database (`this.user.findMany()`, `this.user.create()`, ...). Không cần tạo instance riêng.
- `implements OnModuleInit, OnModuleDestroy` — Móc vào vòng đời NestJS: mở kết nối khi module khởi tạo, đóng kết nối khi app shutdown.
- Tại sao không gọi `$connect()` trong constructor? Vì constructor không hỗ trợ `async`. Lifecycle hooks là nơi đúng để thực hiện các thao tác bất đồng bộ.

### Bước 4: Tạo PrismaModule (Global)

```typescript
// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- `@Global()` — PrismaService sẽ available ở mọi module trong ứng dụng mà không cần import `PrismaModule` lặp lại. Chỉ cần import một lần ở `AppModule`.
- `exports: [PrismaService]` — Bắt buộc. Nếu thiếu dòng này, dù có `@Global()` thì module khác vẫn không thể inject `PrismaService`.

Import vào `AppModule`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
})
export class AppModule {}
```

### Bước 5: Refactor UserService — Thay in-memory bằng Prisma

Dưới đây là `UserService` thực tế từ dự án, sử dụng Prisma Client thay cho mảng in-memory:

```typescript
// src/user/user.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Cấu hình select — chỉ trả về các trường an toàn (KHÔNG trả password)
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

  // Lấy thông tin hồ sơ người dùng
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.profileSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Cập nhật thông tin hồ sơ
  async updateProfile(userId: string, dto: { displayName?: string; bio?: string }) {
    if (!dto.displayName && !dto.bio) {
      throw new BadRequestException(
        'At least one field (displayName or bio) must be provided for update',
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.displayName ? { displayName: dto.displayName } : {}),
        ...(dto.bio ? { bio: dto.bio } : {}),
      },
      select: this.profileSelect,
    });
    return updated;
  }
}
```

So sánh với phiên bản Chương 4:
- `this.users.find()` → `this.prisma.user.findUnique()` (query database thực).
- Trực tiếp mutate object → `this.prisma.user.update()` (cập nhật database).
- Các methods giờ là `async` vì thao tác database là bất đồng bộ.
- Option `select` chỉ trả về các trường được liệt kê — đặc biệt quan trọng để **không bao giờ trả password** về cho client.
- Kiểu `as const` giúp TypeScript hiểu rằng đây là object bất biến, hỗ trợ type inference chính xác hơn.

### Bước 6: Kiểm tra bằng Hoppscotch

Trước tiên, cần tạo dữ liệu test. Mở Prisma Studio:

```bash
npx prisma studio
```

Truy cập `http://localhost:5555`, vào bảng `users`, tạo một bản ghi mới với các trường: email, password (giá trị bất kỳ), name, displayName.

> (Ảnh chụp: Prisma Studio hiển thị bảng users với bản ghi vừa tạo)

**Test 1 — Lấy hồ sơ người dùng (READ):**
- **Method:** GET
- **URL:** `http://localhost:3000/users/{id-từ-prisma-studio}`
- **Expected:** Object user với các trường đã select (không có password).

> (Ảnh chụp: Hoppscotch GET — response 200, object user không chứa trường password)

**Test 2 — Cập nhật hồ sơ (UPDATE):**
- **Method:** PATCH
- **URL:** `http://localhost:3000/users/{id}`
- **Body:**
```json
{
  "displayName": "Dat Updated",
  "bio": "NestJS Developer"
}
```

> (Ảnh chụp: Hoppscotch PATCH — response 200, displayName và bio đã cập nhật, updatedAt thay đổi)

**Test 3 — Xem dữ liệu đã cập nhật trên Prisma Studio:**

> (Ảnh chụp: Prisma Studio hiển thị bản ghi user với displayName và bio mới)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Cài đặt và cấu hình Prisma ORM, định nghĩa model `User` với đầy đủ field types, attributes, và enum.
- Tạo `PrismaService` tích hợp lifecycle hooks — tự động mở/đóng kết nối database đúng thời điểm.
- Tạo `PrismaModule` với `@Global()` — PrismaService available ở mọi nơi trong ứng dụng.
- Refactor thành công `UserService` từ in-memory sang Prisma Client — dữ liệu giờ đây được lưu trữ bền vững trong PostgreSQL.
- Option `select` đảm bảo không bao giờ trả trường nhạy cảm (password) về cho client.

Tuy nhiên, API hiện tại chưa có cơ chế kiểm tra tính hợp lệ của dữ liệu đầu vào (ví dụ: displayName không quá 50 ký tự) và response chưa được chuẩn hóa format. Chương tiếp theo sẽ giải quyết hai vấn đề này bằng Pipes và Interceptors.
