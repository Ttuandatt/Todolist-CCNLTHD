# Chương 5 — Bài tập ứng dụng: Kết nối PostgreSQL và CRUD với Prisma

## 1. Mục tiêu

Bài tập này giúp người đọc vận dụng kiến thức về Prisma ORM đã học trong Chương 5 để kết nối ứng dụng NestJS với cơ sở dữ liệu PostgreSQL thực tế. Sau khi hoàn thành, người đọc sẽ:

- Biết cách cài đặt và cấu hình Prisma trong dự án NestJS.
- Thành thạo quy trình định nghĩa model, chạy migration, và generate Prisma Client.
- Tích hợp Prisma vào kiến trúc NestJS thông qua PrismaService và PrismaModule.
- Thực hiện đầy đủ 5 thao tác CRUD (Create, Read All, Read One, Update, Delete) với database thực.

## 2. Mô tả bài tập

Tiếp tục từ dự án `student-manager` ở Chương 4, thay thế mảng in-memory bằng cơ sở dữ liệu PostgreSQL thực tế. Đồng thời bổ sung thêm hai endpoint: cập nhật (PATCH) và xóa (DELETE) sinh viên.

**Yêu cầu cụ thể:**

1. Cài đặt Prisma và khởi tạo cấu hình.
2. Định nghĩa model `Student` trong file `schema.prisma` với các trường: `id` (UUID, tự sinh), `name`, `studentCode` (unique), `major`, `gpa` (Float), `createdAt`, `updatedAt`.
3. Chạy migration để tạo bảng trong database.
4. Tạo `PrismaService` và `PrismaModule` (global).
5. Refactor `StudentService`: thay toàn bộ logic mảng in-memory bằng Prisma Client queries.
6. Bổ sung hai endpoint mới trong `StudentController`: `PATCH /students/:id` và `DELETE /students/:id`.
7. Kiểm tra toàn bộ 5 thao tác CRUD bằng Hoppscotch và xem dữ liệu trên Prisma Studio.

## 3. Code minh họa

### Bước 1: Cài đặt và khởi tạo Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Lệnh `prisma init` tạo thư mục `prisma/` chứa file `schema.prisma` và thêm biến `DATABASE_URL` vào file `.env`.

Cấu hình kết nối database trong file `.env`:

```env
DATABASE_URL="postgresql://admin:secretpassword@localhost:5432/student_manager?schema=public"
```

> (Ảnh chụp: Terminal hiển thị kết quả `npx prisma init` thành công)

### Bước 2: Định nghĩa Model Student

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Student {
  id          String   @id @default(uuid())
  name        String
  studentCode String   @unique
  major       String
  gpa         Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("students")
}
```

Giải thích các attribute:
- `@id @default(uuid())` — Đánh dấu primary key, tự động sinh UUID khi tạo bản ghi mới.
- `@unique` — Đảm bảo mã sinh viên (`studentCode`) không bị trùng lặp.
- `@default(now())` — Tự động ghi thời gian tạo bản ghi.
- `@updatedAt` — Tự động cập nhật timestamp mỗi khi bản ghi được sửa đổi.
- `@@map("students")` — Đặt tên bảng trong database là `students` thay vì `Student`.

> (Ảnh chụp: File schema.prisma hoàn chỉnh trong IDE)

### Bước 3: Chạy Migration

```bash
npx prisma migrate dev --name init_student
```

Lệnh này thực hiện ba bước: so sánh schema với database, tạo file migration SQL, và apply migration vào database. Sau khi chạy xong, Prisma Client cũng được tự động regenerate.

> (Ảnh chụp: Terminal hiển thị migration thành công — "Your database is now in sync with your schema")

### Bước 4: Tạo PrismaService và PrismaModule

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

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

Import `PrismaModule` vào `AppModule`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [PrismaModule, StudentModule],
})
export class AppModule {}
```

Nhờ decorator `@Global()`, `PrismaService` sẽ tự động available ở mọi module trong ứng dụng mà không cần import `PrismaModule` lặp lại.

### Bước 5: Refactor StudentService — Thay in-memory bằng Prisma

```typescript
// src/student/student.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Student } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Student[]> {
    return this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên với ID ${id}`);
    }
    return student;
  }

  async create(data: { name: string; studentCode: string; major: string; gpa: number }): Promise<Student> {
    return this.prisma.student.create({ data });
  }

  async update(id: string, data: { name?: string; major?: string; gpa?: number }): Promise<Student> {
    await this.findOne(id); // Kiểm tra tồn tại trước
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Student> {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
```

So sánh với phiên bản Chương 4: toàn bộ logic mảng `this.students` đã được thay bằng các Prisma Client methods (`findMany`, `findUnique`, `create`, `update`, `delete`). Các methods giờ đây là `async` vì thao tác database là bất đồng bộ. Kiểu `Student` được import trực tiếp từ `@prisma/client` — đây là type được Prisma auto-generate từ schema, đảm bảo type-safe tuyệt đối.

### Bước 6: Cập nhật StudentController

```typescript
// src/student/student.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from '@prisma/client';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Post()
  create(
    @Body() data: { name: string; studentCode: string; major: string; gpa: number },
  ): Promise<Student> {
    return this.studentService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { name?: string; major?: string; gpa?: number },
  ): Promise<Student> {
    return this.studentService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.studentService.remove(id);
  }
}
```

Thay đổi so với Chương 4: `ParseIntPipe` được thay bằng `ParseUUIDPipe` vì `id` giờ là UUID string thay vì số nguyên. Thêm hai endpoint mới `PATCH` và `DELETE` cho chức năng cập nhật và xóa.

### Bước 7: Kiểm tra bằng Hoppscotch

**Test 1 — Tạo sinh viên mới (CREATE):**
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body:**
```json
{
  "name": "Nguyễn Văn A",
  "studentCode": "SV001",
  "major": "Công nghệ thông tin",
  "gpa": 3.5
}
```

> (Ảnh chụp: Hoppscotch POST — response 201 với object sinh viên bao gồm UUID id và timestamps)

**Test 2 — Lấy danh sách (READ ALL):**
- **Method:** GET
- **URL:** `http://localhost:3000/students`

> (Ảnh chụp: Hoppscotch GET — response 200 với mảng sinh viên)

**Test 3 — Lấy chi tiết (READ ONE):**
- **Method:** GET
- **URL:** `http://localhost:3000/students/{id-vừa-tạo}`

> (Ảnh chụp: Hoppscotch GET by ID — response 200 với chi tiết sinh viên)

**Test 4 — Cập nhật GPA (UPDATE):**
- **Method:** PATCH
- **URL:** `http://localhost:3000/students/{id}`
- **Body:**
```json
{
  "gpa": 3.8
}
```

> (Ảnh chụp: Hoppscotch PATCH — response 200 với GPA đã cập nhật, updatedAt thay đổi)

**Test 5 — Xóa sinh viên (DELETE):**
- **Method:** DELETE
- **URL:** `http://localhost:3000/students/{id}`

> (Ảnh chụp: Hoppscotch DELETE — response 200 trả về object sinh viên đã xóa)

### Bước 8: Xem dữ liệu trên Prisma Studio

```bash
npx prisma studio
```

Truy cập `http://localhost:5555` để mở Prisma Studio — công cụ GUI cho phép browse, filter, và edit dữ liệu trực tiếp trong trình duyệt.

> (Ảnh chụp: Prisma Studio hiển thị bảng students với các bản ghi đã tạo)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập, chúng ta đã:

- Cài đặt và cấu hình Prisma ORM thành công trong dự án NestJS.
- Định nghĩa model `Student` với đầy đủ các field types, attributes, và constraints.
- Tích hợp Prisma vào kiến trúc NestJS thông qua `PrismaService` (injectable) và `PrismaModule` (global).
- Thực hiện thành công đầy đủ 5 thao tác CRUD với cơ sở dữ liệu PostgreSQL thực tế.
- Kiểm tra dữ liệu trực quan qua Prisma Studio.
- Dữ liệu giờ đây được lưu trữ bền vững — không bị mất khi restart ứng dụng như phiên bản in-memory ở Chương 4.

Tuy nhiên, API hiện tại chưa có cơ chế kiểm tra tính hợp lệ của dữ liệu đầu vào (ví dụ: GPA phải nằm trong khoảng 0–4, mã sinh viên không được để trống). Chương tiếp theo sẽ giải quyết vấn đề này bằng Pipes và Interceptors.
