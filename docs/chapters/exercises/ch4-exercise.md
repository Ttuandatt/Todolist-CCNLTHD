# Chương 4 — Bài tập ứng dụng: Xây dựng Module Student với dữ liệu giả

## 1. Mục tiêu

Bài tập này giúp người đọc vận dụng các khái niệm cốt lõi đã học trong Chương 4 — bao gồm Modules, Controllers, Providers/Services, và Dependency Injection — để xây dựng một module chức năng hoàn chỉnh. Sau khi hoàn thành, người đọc sẽ:

- Biết cách sử dụng NestJS CLI để generate các thành phần (Module, Controller, Service).
- Hiểu cách Controller nhận request và uỷ thác xử lý cho Service.
- Nắm rõ cơ chế Dependency Injection khi Service được inject vào Controller qua constructor.
- Xây dựng được API RESTful cơ bản với dữ liệu in-memory (chưa cần database).

## 2. Mô tả bài tập

Tiếp tục từ dự án `student-manager` đã tạo ở Chương 3, xây dựng module **Student** với ba endpoint cơ bản. Ở giai đoạn này, dữ liệu được lưu tạm trong một mảng JavaScript (in-memory) — việc kết nối database sẽ được thực hiện ở Chương 5.

**Yêu cầu cụ thể:**

1. Sử dụng NestJS CLI để generate `StudentModule`, `StudentController`, `StudentService`.
2. Định nghĩa interface `Student` với các trường: `id`, `name`, `studentCode`, `major`, `gpa`.
3. Trong `StudentService`, sử dụng mảng in-memory để lưu trữ dữ liệu và triển khai ba phương thức: `findAll()`, `findOne(id)`, `create(data)`.
4. Trong `StudentController`, tạo ba endpoint:
   - `GET /students` — Lấy danh sách tất cả sinh viên
   - `GET /students/:id` — Lấy thông tin chi tiết một sinh viên theo ID
   - `POST /students` — Thêm sinh viên mới
5. Kiểm tra toàn bộ API bằng Hoppscotch.

## 3. Code minh họa

**Bước 1: Generate các thành phần bằng CLI**

```bash
nest g module student
nest g controller student --no-spec
nest g service student --no-spec
```

Ba lệnh trên sẽ tạo ra các file tương ứng trong thư mục `src/student/` và tự động cập nhật `StudentModule`. Flag `--no-spec` bỏ qua file test để giữ thư mục gọn gàng.

> (Ảnh chụp: Terminal hiển thị kết quả ba lệnh generate thành công)

**Bước 2: Định nghĩa Interface Student**

Tạo file `src/student/interfaces/student.interface.ts`:

```typescript
// src/student/interfaces/student.interface.ts
export interface Student {
  id: number;
  name: string;
  studentCode: string;
  major: string;
  gpa: number;
}
```

Interface này giúp TypeScript kiểm tra kiểu dữ liệu tại compile-time, đảm bảo mọi object Student đều có đầy đủ các trường cần thiết.

**Bước 3: Triển khai StudentService**

```typescript
// src/student/student.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from './interfaces/student.interface';

@Injectable()
export class StudentService {
  // Mảng in-memory đóng vai trò "database tạm"
  private students: Student[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      studentCode: 'SV001',
      major: 'Công nghệ thông tin',
      gpa: 3.5,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      studentCode: 'SV002',
      major: 'Khoa học máy tính',
      gpa: 3.8,
    },
  ];

  private nextId = 3;

  findAll(): Student[] {
    return this.students;
  }

  findOne(id: number): Student {
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên với ID ${id}`);
    }
    return student;
  }

  create(data: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      id: this.nextId++,
      ...data,
    };
    this.students.push(newStudent);
    return newStudent;
  }
}
```

Điểm cần lưu ý:
- Decorator `@Injectable()` đánh dấu class này là Provider, cho phép NestJS quản lý và inject vào các class khác.
- `NotFoundException` là built-in exception của NestJS, tự động trả về HTTP status 404 khi không tìm thấy sinh viên.
- Kiểu `Omit<Student, 'id'>` loại bỏ trường `id` khỏi dữ liệu đầu vào vì `id` được tự động sinh.

**Bước 4: Triển khai StudentController**

```typescript
// src/student/student.controller.ts
import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './interfaces/student.interface';

@Controller('students')
export class StudentController {
  // Dependency Injection: NestJS tự động inject StudentService
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll(): Student[] {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Student {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body() data: Omit<Student, 'id'>): Student {
    return this.studentService.create(data);
  }
}
```

Điểm cần lưu ý:
- `@Controller('students')` đặt route prefix `/students` cho toàn bộ controller.
- `constructor(private readonly studentService: StudentService)` — đây chính là Dependency Injection. NestJS tự động tạo instance `StudentService` và truyền vào constructor mà Controller không cần tự khởi tạo bằng `new`.
- `ParseIntPipe` tự động chuyển tham số `:id` từ string (URL parameter luôn là string) sang number.

**Bước 5: Kiểm tra StudentModule**

```typescript
// src/student/student.module.ts
import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
```

NestJS CLI đã tự động đăng ký `StudentController` và `StudentService` vào module, và import `StudentModule` vào `AppModule`.

**Bước 6: Kiểm tra bằng Hoppscotch**

Test 1 — Lấy danh sách sinh viên:
- **Method:** GET
- **URL:** `http://localhost:3000/students`
- **Expected:** Mảng JSON chứa 2 sinh viên mặc định.

> (Ảnh chụp: Hoppscotch hiển thị response GET /students — status 200, mảng 2 sinh viên)

Test 2 — Thêm sinh viên mới:
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body (JSON):**
```json
{
  "name": "Lê Văn C",
  "studentCode": "SV003",
  "major": "Kỹ thuật phần mềm",
  "gpa": 3.2
}
```
- **Expected:** Object sinh viên mới với `id: 3`.

> (Ảnh chụp: Hoppscotch hiển thị response POST /students — status 201, object sinh viên mới)

Test 3 — Lấy chi tiết sinh viên:
- **Method:** GET
- **URL:** `http://localhost:3000/students/1`
- **Expected:** Object sinh viên có `id: 1`.

> (Ảnh chụp: Hoppscotch hiển thị response GET /students/1 — status 200, chi tiết sinh viên)

Test 4 — Trường hợp không tìm thấy:
- **Method:** GET
- **URL:** `http://localhost:3000/students/999`
- **Expected:** Status 404 với message `"Không tìm thấy sinh viên với ID 999"`.

> (Ảnh chụp: Hoppscotch hiển thị response 404 Not Found)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập, chúng ta đã xây dựng thành công:

- **StudentModule** đóng gói toàn bộ chức năng quản lý sinh viên.
- **StudentController** tiếp nhận HTTP request và uỷ thác xử lý cho Service.
- **StudentService** chứa business logic với dữ liệu in-memory.
- Cơ chế **Dependency Injection** giữa Controller và Service hoạt động đúng.
- API RESTful cơ bản với ba endpoint đã hoạt động và được kiểm tra thành công.

Tuy nhiên, dữ liệu in-memory sẽ bị mất mỗi khi ứng dụng restart. Chương tiếp theo sẽ giải quyết vấn đề này bằng cách kết nối với cơ sở dữ liệu PostgreSQL thông qua Prisma ORM.
