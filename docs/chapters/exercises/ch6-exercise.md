# Chương 6 — Bài tập ứng dụng: Validation và Response chuẩn hóa

## 1. Mục tiêu

Bài tập này giúp người đọc vận dụng các kỹ thuật nâng cao đã học trong Chương 6 — cụ thể là Pipes (Validation) và Interceptors (Transform Response) — vào dự án thực tế. Sau khi hoàn thành, người đọc sẽ:

- Biết cách tạo DTO (Data Transfer Object) với các validation rules sử dụng `class-validator`.
- Hiểu cách `ValidationPipe` tự động kiểm tra dữ liệu đầu vào và trả về lỗi có cấu trúc.
- Xây dựng được `TransformResponseInterceptor` để chuẩn hóa format response cho toàn bộ API.
- Phân biệt được vai trò của Pipe (kiểm tra đầu vào) và Interceptor (xử lý đầu ra).

## 2. Mô tả bài tập

Tiếp tục từ dự án `student-manager` ở Chương 5, bổ sung hai cơ chế quan trọng: **kiểm tra dữ liệu đầu vào** bằng Validation Pipe và **chuẩn hóa dữ liệu đầu ra** bằng Interceptor.

**Yêu cầu cụ thể:**

1. Cài đặt `class-validator` và `class-transformer`.
2. Tạo `CreateStudentDto` với các ràng buộc: `name` (bắt buộc, tối đa 100 ký tự), `studentCode` (bắt buộc, đúng format `SVxxx`), `major` (bắt buộc), `gpa` (số, từ 0 đến 4).
3. Tạo `UpdateStudentDto` cho phép cập nhật từng trường (partial).
4. Kích hoạt `ValidationPipe` toàn cục trong `main.ts`.
5. Tạo `TransformResponseInterceptor` bọc response thành format `{ success, data, timestamp }`.
6. Kiểm tra: gửi request sai format → lỗi validation chi tiết; gửi request đúng → response chuẩn hóa.

## 3. Code minh họa

### Bước 1: Cài đặt thư viện validation

```bash
npm install class-validator class-transformer
```

- `class-validator` cung cấp các decorators để khai báo ràng buộc trên DTO.
- `class-transformer` cho phép chuyển đổi plain objects thành class instances để decorators hoạt động.

### Bước 2: Tạo CreateStudentDto

```typescript
// src/student/dto/create-student.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateStudentDto {
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống' })
  @Matches(/^SV\d{3,}$/, {
    message: 'Mã sinh viên phải có định dạng SVxxx (ví dụ: SV001)',
  })
  studentCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Ngành học không được để trống' })
  major: string;

  @IsNumber({}, { message: 'GPA phải là số' })
  @Min(0, { message: 'GPA không được nhỏ hơn 0' })
  @Max(4, { message: 'GPA không được lớn hơn 4' })
  gpa: number;
}
```

Mỗi trường được bảo vệ bởi nhiều lớp decorator:
- `@IsNotEmpty()` đảm bảo trường không được rỗng.
- `@Matches(/^SV\d{3,}$/)` sử dụng Regular Expression để bắt buộc mã sinh viên phải bắt đầu bằng "SV" theo sau bởi ít nhất 3 chữ số.
- `@Min(0)` và `@Max(4)` giới hạn GPA trong khoảng hợp lệ.
- Tham số `message` cho phép tuỳ chỉnh thông báo lỗi bằng tiếng Việt.

### Bước 3: Tạo UpdateStudentDto

```typescript
// src/student/dto/update-student.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
```

`PartialType()` tự động tạo ra một class mới với tất cả các trường từ `CreateStudentDto` nhưng đều là optional. Nhờ vậy, khi cập nhật sinh viên, client có thể gửi chỉ những trường cần thay đổi (ví dụ: chỉ gửi `gpa` mà không cần gửi lại `name`, `studentCode`).

Cần cài thêm package hỗ trợ:

```bash
npm install @nestjs/mapped-types
```

### Bước 4: Kích hoạt ValidationPipe toàn cục

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

Ba option quan trọng:
- `whitelist: true` — Tự động loại bỏ các trường không khai báo trong DTO. Nếu client gửi `{ name: "A", isAdmin: true }`, trường `isAdmin` sẽ bị loại bỏ hoàn toàn.
- `forbidNonWhitelisted: true` — Thay vì âm thầm loại bỏ, trả về lỗi 400 nếu phát hiện trường lạ. Đây là lớp bảo vệ bổ sung giúp client biết họ đang gửi dữ liệu sai.
- `transform: true` — Tự động chuyển đổi kiểu dữ liệu (ví dụ: string `"3.5"` → number `3.5`).

### Bước 5: Cập nhật Controller sử dụng DTO

```typescript
// src/student/student.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.remove(id);
  }
}
```

So với Chương 5: tham số `@Body()` giờ có kiểu là DTO class thay vì plain object. `ValidationPipe` sẽ tự động validate body theo các decorators trong DTO trước khi dữ liệu đến Controller.

### Bước 6: Tạo TransformResponseInterceptor

```typescript
// src/common/interceptors/transform-response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

Interceptor này sử dụng toán tử `map()` của RxJS để bọc mọi response vào format chuẩn `{ success, data, timestamp }`. Nhờ vậy, frontend nhận được response nhất quán từ mọi endpoint.

Áp dụng toàn cục trong `main.ts`:

```typescript
// src/main.ts (bổ sung)
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
```

### Bước 7: Kiểm tra bằng Hoppscotch

**Test 1 — Gửi request thiếu trường bắt buộc:**
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body:**
```json
{
  "name": "Nguyễn Văn A"
}
```
- **Expected:** Status 400 với danh sách lỗi validation cho các trường bị thiếu.

> (Ảnh chụp: Hoppscotch hiển thị response 400 — mảng message liệt kê: "Mã sinh viên không được để trống", "Ngành học không được để trống", "GPA phải là số")

**Test 2 — Gửi GPA vượt giới hạn:**
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body:**
```json
{
  "name": "Nguyễn Văn A",
  "studentCode": "SV001",
  "major": "CNTT",
  "gpa": 5.0
}
```
- **Expected:** Status 400 — `"GPA không được lớn hơn 4"`.

> (Ảnh chụp: Hoppscotch hiển thị response 400 — lỗi validation GPA)

**Test 3 — Gửi mã sinh viên sai format:**
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body:**
```json
{
  "name": "Nguyễn Văn A",
  "studentCode": "ABC123",
  "major": "CNTT",
  "gpa": 3.5
}
```
- **Expected:** Status 400 — `"Mã sinh viên phải có định dạng SVxxx"`.

> (Ảnh chụp: Hoppscotch hiển thị response 400 — lỗi format mã sinh viên)

**Test 4 — Gửi request hợp lệ (thấy response chuẩn hóa):**
- **Method:** POST
- **URL:** `http://localhost:3000/students`
- **Body:**
```json
{
  "name": "Trần Thị B",
  "studentCode": "SV002",
  "major": "Khoa học máy tính",
  "gpa": 3.8
}
```
- **Expected:** Status 201 với response đã được bọc bởi Interceptor:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "name": "Trần Thị B",
    "studentCode": "SV002",
    "major": "Khoa học máy tính",
    "gpa": 3.8,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch hiển thị response 201 — format chuẩn hóa với success, data, timestamp)

**Test 5 — GET danh sách cũng được chuẩn hóa:**
- **Method:** GET
- **URL:** `http://localhost:3000/students`
- **Expected:** Response được bọc trong format `{ success: true, data: [...], timestamp: "..." }`.

> (Ảnh chụp: Hoppscotch hiển thị GET /students — response chuẩn hóa với mảng sinh viên trong trường data)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập, chúng ta đã:

- Tạo `CreateStudentDto` và `UpdateStudentDto` với đầy đủ validation rules bằng `class-validator`.
- Kích hoạt `ValidationPipe` toàn cục để tự động kiểm tra mọi request body.
- Xây dựng `TransformResponseInterceptor` chuẩn hóa format response cho toàn bộ API.
- Kiểm chứng được: dữ liệu không hợp lệ bị từ chối với thông báo lỗi rõ ràng (400), dữ liệu hợp lệ được xử lý và trả về trong format chuẩn (200/201).

API giờ đây đã có hệ thống kiểm tra dữ liệu đầu vào chặt chẽ và format đầu ra nhất quán. Tuy nhiên, bất kỳ ai cũng có thể truy cập API mà không cần xác thực. Chương tiếp theo sẽ bảo vệ các endpoint này bằng JWT Authentication.
