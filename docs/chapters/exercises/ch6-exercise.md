# Chương 6 — Bài tập ứng dụng: Validation, Response chuẩn hóa và Exception Filter

## 1. Mục tiêu

Vận dụng các kỹ thuật nâng cao đã học trong Chương 6 — Pipes, Interceptors, và Exception Filters — vào dự án TodoList Collaboration. Sau khi hoàn thành, người đọc sẽ:

- Biết cách tạo DTO với các validation rules sử dụng `class-validator`.
- Hiểu cách `ValidationPipe` tự động kiểm tra dữ liệu đầu vào.
- Xây dựng `TransformResponseInterceptor` để chuẩn hóa format response thành công.
- Xây dựng `HttpExceptionFilter` để chuẩn hóa format response lỗi.
- Phân biệt rõ vai trò: Pipe (kiểm tra đầu vào) → Controller → Interceptor (bọc đầu ra) → Filter (bắt lỗi).

## 2. Mô tả bài tập

Tiếp tục từ dự án ở Chương 5, bổ sung ba cơ chế quan trọng: **kiểm tra dữ liệu đầu vào** (Validation Pipe + DTO), **chuẩn hóa response thành công** (Interceptor), và **chuẩn hóa response lỗi** (Exception Filter).

**Yêu cầu cụ thể:**

1. Cài đặt `class-validator` và `class-transformer`.
2. Tạo `UpdateProfileDto` với validation: displayName (optional, max 50 ký tự), bio (optional, max 160 ký tự).
3. Kích hoạt `ValidationPipe` toàn cục với `whitelist` và `forbidNonWhitelisted`.
4. Tạo `TransformResponseInterceptor` bọc response thành `{ success, data, timestamp }`.
5. Tạo `HttpExceptionFilter` bọc lỗi thành `{ success: false, statusCode, message, path, timestamp }`.
6. Đăng ký tất cả trong `main.ts`.

## 3. Code minh họa

### Bước 1: Cài đặt thư viện

```bash
npm install class-validator class-transformer
```

### Bước 2: Tạo UpdateProfileDto

Đây là DTO thực tế từ dự án TodoList Collaboration:

```typescript
// src/user/dto/update-profile.dto.ts
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Display name must be at most 50 characters long' })
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Bio must be at most 160 characters long' })
  bio?: string;
}
```

Mỗi trường được bảo vệ bởi decorator:
- `@IsOptional()` — Trường này không bắt buộc. Nếu không gửi, sẽ không bị validate.
- `@IsString()` — Nếu có gửi, giá trị phải là chuỗi ký tự.
- `@MaxLength(50)` — Giới hạn độ dài tối đa. Tham số `message` tuỳ chỉnh thông báo lỗi.
- Dấu `?` sau tên trường (`displayName?`) đánh dấu trường là optional trong TypeScript.

### Bước 3: Cập nhật Controller sử dụng DTO

```typescript
// src/user/user.controller.ts (trích đoạn)
import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch(':id')
  updateProfile(
    @Param('id') userId: string,
    @Body() dto: UpdateProfileDto,   // ← Thay plain object bằng DTO class
  ) {
    return this.userService.updateProfile(userId, dto);
  }
}
```

Khi `@Body()` nhận kiểu `UpdateProfileDto`, `ValidationPipe` sẽ tự động validate body theo các decorators trong DTO trước khi dữ liệu đến Controller.

### Bước 4: Tạo TransformResponseInterceptor

Đây là Interceptor thực tế từ dự án:

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
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

- `next.handle()` cho phép request đi tiếp vào Controller xử lý.
- Toán tử `map()` của RxJS nhận kết quả trả về từ Controller và bọc vào format `{ success, data, timestamp }`.
- Nhờ áp dụng toàn cục, **mọi API** đều tự động có cùng format response mà không cần sửa bất kỳ Controller nào.

### Bước 5: Tạo HttpExceptionFilter

Đây là Exception Filter thực tế từ dự án:

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }
}
```

- `@Catch(HttpException)` — Bắt tất cả HttpException (400, 401, 404, 409, ...).
- Response lỗi có format nhất quán: `{ success: false, statusCode, message, path, timestamp }`.
- `Logger` ghi log lỗi ra console để dễ debug trong quá trình phát triển.
- Filter này hoạt động "dọc hành trình" — bất kỳ lỗi nào throw ra trong Pipe, Guard, Controller, hay Service đều bị bắt.

### Bước 6: Đăng ký tất cả trong main.ts

Đây là file `main.ts` thực tế từ dự án:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. GLOBAL PREFIX — tất cả API bắt đầu bằng /api/v1
  app.setGlobalPrefix('api/v1');

  // 2. GLOBAL PIPES — validate dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Loại bỏ trường không khai báo trong DTO
      forbidNonWhitelisted: true, // Trả lỗi 400 nếu gửi trường lạ
      transform: true,            // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // 3. GLOBAL INTERCEPTORS — chuẩn hóa response thành công
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // 4. GLOBAL FILTERS — chuẩn hóa response lỗi
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
```

Thứ tự đăng ký phản ánh Request Lifecycle: Request → Pipe (validate) → Controller → Interceptor (bọc response) → Filter (bắt lỗi).

### Bước 7: Kiểm tra bằng Hoppscotch

**Test 1 — Gửi displayName quá dài (validation lỗi):**
- **Method:** PATCH
- **URL:** `http://localhost:3333/api/v1/users/{id}`
- **Body:**
```json
{
  "displayName": "Tên này rất dài và chắc chắn vượt quá năm mươi ký tự cho phép của hệ thống nên sẽ bị từ chối"
}
```
- **Expected:** Status 400 — format lỗi chuẩn hóa từ Filter:
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Display name must be at most 50 characters long"],
  "path": "/api/v1/users/...",
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch PATCH — response 400 với message validation lỗi, format chuẩn hóa)

**Test 2 — Gửi trường không tồn tại trong DTO (forbidNonWhitelisted):**
- **Method:** PATCH
- **URL:** `http://localhost:3333/api/v1/users/{id}`
- **Body:**
```json
{
  "displayName": "Đạt",
  "isAdmin": true
}
```
- **Expected:** Status 400 — `"property isAdmin should not exist"`.

> (Ảnh chụp: Hoppscotch PATCH — response 400, trường isAdmin bị từ chối)

**Test 3 — Gửi request hợp lệ (response chuẩn hóa từ Interceptor):**
- **Method:** PATCH
- **URL:** `http://localhost:3333/api/v1/users/{id}`
- **Body:**
```json
{
  "displayName": "Tuấn Đạt",
  "bio": "NestJS Developer"
}
```
- **Expected:** Status 200 — response được bọc bởi Interceptor:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "email": "dat@sgu.edu.vn",
    "displayName": "Tuấn Đạt",
    "bio": "NestJS Developer",
    ...
  },
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch PATCH — response 200 với format chuẩn hóa { success, data, timestamp })

**Test 4 — Truy cập user không tồn tại (Exception Filter):**
- **Method:** GET
- **URL:** `http://localhost:3333/api/v1/users/00000000-0000-0000-0000-000000000000`
- **Expected:** Status 404 — format lỗi chuẩn hóa:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "path": "/api/v1/users/00000000-...",
  "timestamp": "2026-03-23T..."
}
```

> (Ảnh chụp: Hoppscotch GET — response 404, format lỗi chuẩn hóa từ HttpExceptionFilter)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo `UpdateProfileDto` với validation decorators — dữ liệu đầu vào được kiểm tra tự động.
- `ValidationPipe` toàn cục với `whitelist` và `forbidNonWhitelisted` bảo vệ API khỏi dữ liệu rác và trường lạ.
- `TransformResponseInterceptor` chuẩn hóa mọi response thành công thành `{ success: true, data, timestamp }`.
- `HttpExceptionFilter` chuẩn hóa mọi response lỗi thành `{ success: false, statusCode, message, path, timestamp }`.
- Toàn bộ đều được đăng ký trong `main.ts` — áp dụng toàn cục cho mọi endpoint mà không cần sửa từng Controller.

API giờ đây có hệ thống kiểm tra dữ liệu đầu vào chặt chẽ và format đầu ra nhất quán cho cả trường hợp thành công lẫn thất bại. Tuy nhiên, bất kỳ ai cũng có thể truy cập API mà không cần xác thực. Chương tiếp theo sẽ bảo vệ các endpoint bằng JWT Authentication.
