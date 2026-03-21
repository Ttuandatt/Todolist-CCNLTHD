# Code Guide — Phase 0: Shared Infrastructure 🚀

> Ngày tạo: 2026-02-27
>
> Trước khi viết bất kỳ API endpoint nào, ta cần xây **nền móng**. Giống xây nhà — không ai xây tường trước khi đổ móng. Phase 0 tạo ra các thành phần mà **mọi module sẽ dùng chung**, từ Phase 1 cho đến Phase 7.

---

## Tổng quan — Sau Phase 0 ta được gì?

Nghĩ thử xem: nếu ta có 53 endpoints, mỗi endpoint phải tự validate input, tự bọc response, tự try-catch lỗi, tự log... thì copy-paste bao nhiêu code? Answer: **không cần copy-paste dòng nào** — vì Phase 0 xử lý hết.

Sau khi xong, ứng dụng sẽ **tự động**:

1. ✅ **Validate** mọi request body — gửi sai field là reject ngay, Controller không cần check
2. ✅ **Wrap** mọi response theo format chuẩn `{ success, data, timestamp }`
3. ✅ **Catch** mọi exception → trả error chuẩn `{ success: false, statusCode, message }`
4. ✅ **Log** mọi request kèm thời gian xử lý: `[HTTP] POST /auth/login → 45ms`
5. ✅ **Swagger UI** tại `/api-docs` để test API trực tiếp trên browser
6. ✅ API prefix `/api/v1` cho tất cả routes

### Kỹ thuật sử dụng
- **ValidationPipe** + `class-validator` + `class-transformer` — auto-validate DTOs
- **Interceptor** pattern — can thiệp trước/sau Controller xử lý (AOP)
- **Exception Filter** — bắt lỗi tập trung, format chuẩn

> 💡 Tất cả kỹ thuật này ta đã viết chi tiết trong **Chương 6** của báo cáo. Bây giờ là lúc áp dụng thực tế!

---

## Bước 1: Cài đặt dependencies

### Tại sao cần cài?
- `class-validator` + `class-transformer`: Để `ValidationPipe` đọc decorators `@IsEmail()`, `@IsNotEmpty()` trên DTO và tự validate
- `@nestjs/swagger`: Tự sinh API docs từ decorators
- `@nestjs/jwt` + `passport` + `bcrypt`: Cho auth flow (Phase 1, nhưng cài sẵn luôn cho khỏi quay lại)

### Lệnh chạy
```bash
npm install class-validator class-transformer @nestjs/swagger
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

---

## Bước 2: Tạo TransformResponseInterceptor

📁 **File:** `src/common/interceptors/transform-response.interceptor.ts`

### Tại sao?

Theo API Spec, **mọi** response phải có format:
```json
{ "success": true, "data": { ... }, "timestamp": "2026-..." }
```

Giờ hỏi: ta có 53 endpoints — mỗi endpoint phải viết `return { success: true, data: result, timestamp: ... }` hay sao? Lặp lại 53 lần cùng 1 đoạn code? Không! Ta tạo **1 interceptor** áp dụng global → nó tự bọc hết.

### Kỹ thuật

Interceptor dùng RxJS `map()` để biến đổi kết quả **sau khi** Controller trả về. Nôm na:

```
Request → Controller trả data → Interceptor bọc lại → Client nhận { success, data, timestamp }
```

Giống như đóng gói hàng ở bưu điện — hàng (data) là của Controller, còn hộp + phiếu gửi (success, timestamp) là việc của Interceptor. 📦

### Code

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Hình dạng response chuẩn — mọi API đều trả về dạng này
export interface ApiResponse<T> {
  success: boolean;
  data: T;           // T = kiểu data tùy controller trả gì (User, Task[], string...)
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  // NestJS gọi method này MỖI KHI có request đi qua
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle()  // "Nhả cần gạt" — cho request chạy vào Controller
      .pipe(
        map((data) => ({
          // Controller trả về data gì, ta bọc thêm lớp áo ngoài
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
        })),
      );
    // Client nhận: { success: true, data: <data gốc>, timestamp: "2026-..." }
    // thay vì chỉ nhận <data gốc> trần trụi
  }
}
```

> **Hỏi nhanh:** `map()` ở đây khác `Array.map()` chỗ nào? Về bản chất giống — nhận giá trị, trả giá trị mới. Nhưng `map()` của RxJS dành cho **stream** (Observable), còn `Array.map()` dành cho mảng. Cùng tư duy, khác ngữ cảnh.

---

## Bước 3: Tạo HttpExceptionFilter

📁 **File:** `src/common/filters/http-exception.filter.ts`

### Tại sao?

Khi có lỗi (ví dụ `throw new NotFoundException('Task not found')`), NestJS trả error format mặc định — xấu xí, không consistent. Ta muốn error cũng theo cùng format chuẩn:

```json
{ "success": false, "statusCode": 404, "message": "Task not found", "path": "/api/v1/tasks/abc", "timestamp": "..." }
```

Nếu Interceptor là đóng gói hàng gửi đi, thì Exception Filter là **bộ phận xử lý hàng lỗi** — gom tất cả trả chỗ một cửa, format đồng nhất.

### Kỹ thuật
- `@Catch(HttpException)` — "bắt" mọi HttpException (NotFoundException, BadRequest, Unauthorized...)
- `ArgumentsHost` — đối tượng đa dụng, gọi `.switchToHttp()` để lấy req/res
- `exception.getResponse()` trả string HOẶC object → cần check `typeof`

### Code

```typescript
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
// Bảo NestJS: "Khi có HttpException bị throw mà không ai bắt, chuyển nó đến đây"
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    // switchToHttp() — vì ArgumentsHost hỗ trợ nhiều giao thức (HTTP, WS, gRPC)
    // ta đang làm REST API nên chuyển sang ngữ cảnh HTTP để lấy req/res
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Tại sao check typeof? Vì getResponse() trả 2 dạng:
    //   - string: khi dev throw "Task not found"
    //   - object: khi ValidationPipe reject { message: ['email phải hợp lệ'], ... }
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Log ra terminal cho dev debug — KHÔNG gửi stack trace cho client
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }
}
```

---

## Bước 4: Tạo LoggingInterceptor

📁 **File:** `src/common/interceptors/logging.interceptor.ts`

### Tại sao?

"API nào chậm?" — câu hỏi ta sẽ hỏi 1000 lần trong quá trình phát triển. LoggingInterceptor bấm giờ mỗi request và in ra terminal:

```
[HTTP] POST /api/v1/auth/login → 45ms
[HTTP] GET  /api/v1/workspaces → 12ms
```

Không có logging = mò kim đáy bể khi debug performance.

### Kỹ thuật

Ở đây ta dùng `tap()` thay vì `map()`. Khác nhau chỗ nào?
- `map()` — **biến đổi** data rồi truyền tiếp (data ra khác data vào)
- `tap()` — chỉ **nhìn** data, không đụng gì cả (dùng cho side-effect như logging)

Hoàn hảo cho logging: ta chỉ muốn ghi log, không muốn đụng vào data client nhận.

### Code

```typescript
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ═══ TRƯỚC Controller ═══
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();   // Bấm đồng hồ bắt đầu

    // ═══ SAU Controller ═══
    return next.handle().pipe(
      tap(() => {
        // Controller xong rồi → tính thời gian chênh lệch
        this.logger.log(`${method} ${url} → ${Date.now() - now}ms`);
      }),
    );
    // Data đi qua tap() mà KHÔNG bị thay đổi — client nhận nguyên vẹn
  }
}
```

---

## Bước 5: Cập nhật main.ts — "Cổng chính" của ứng dụng

📁 **File:** `src/main.ts` (sửa file có sẵn)

### Tại sao?

`main.ts` là nơi mọi thứ được khởi tạo. Ta đăng ký tất cả thành phần global ở đây — một lần duy nhất, áp dụng cho **toàn bộ** ứng dụng. Không cần import từng module.

### Code

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// 3 thành phần ta vừa tạo ở Bước 2, 3, 4
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── 1. GLOBAL PREFIX ──────────────────────────
  // Mọi route tự động thêm /api/v1 phía trước
  // @Get('tasks') → GET /api/v1/tasks
  app.setGlobalPrefix('api/v1');

  // ── 2. GLOBAL VALIDATION PIPE ──────────────────
  // ValidationPipe = "bộ lọc" đầu vào tự động
  // Client gửi body → Pipe đọc DTO decorators → reject nếu sai → Controller chỉ nhận data hợp lệ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // whitelist: tự LỘT BỎ field không khai báo trong DTO
      // Client gửi { email, password, role: "admin" } mà DTO chỉ có { email, password }
      // → field "role" bị xóa sạch (bảo mật!)

      forbidNonWhitelisted: true,
      // Thay vì lặng lẽ xóa field thừa → ném lỗi 400 luôn
      // Client biết ngay "field role không được phép" thay vì bị xóa âm thầm

      transform: true,
      // Tự ép kiểu theo DTO: URL param "123" (string) → 123 (number)
    }),
  );

  // ── 3. GLOBAL INTERCEPTORS ─────────────────────
  // Thứ tự QUAN TRỌNG: Logging trước → Transform sau
  // Flow: Request → Logging(bấm giờ) → Controller → Transform(bọc data) → Logging(log time) → Client
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  // ── 4. GLOBAL EXCEPTION FILTER ─────────────────
  // Bắt MỌI HttpException → format error chuẩn
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── 5. SWAGGER ─────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('TodoList Collaboration API')
    .setDescription('API documentation cho dự án TodoList Collaboration')
    .setVersion('1.0')
    .addBearerAuth()   // Thêm nút "Authorize" trên Swagger UI để nhập JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // → Truy cập http://localhost:3333/api-docs để xem API docs

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
```

---

## Bước 6: Test thử 🧪

Lúc này ta chưa có endpoint nào cả — nhưng vẫn kiểm tra được nền móng hoạt động:

1. **Chạy server:**
   ```bash
   npm run start:dev
   ```

2. **Mở Swagger UI:** `http://localhost:3333/api-docs` → phải hiện giao diện Swagger

3. **Gọi thử route không tồn tại** (ví dụ `GET /api/v1/xyz`):
   ```json
   { "success": false, "statusCode": 404, "message": "Cannot GET /api/v1/xyz", "path": "/api/v1/xyz", "timestamp": "..." }
   ```
   → Nếu thấy format này = Exception Filter hoạt động ✅

4. **Xem terminal** → phải thấy log:
   ```
   [HTTP] GET /api/v1/xyz → 2ms
   ```
   → Logging Interceptor hoạt động ✅

---

## Checklist Phase 0

- [ ] Cài dependencies (`class-validator`, `@nestjs/swagger`, `bcrypt`...)
- [ ] Tạo `TransformResponseInterceptor` — bọc response chuẩn
- [ ] Tạo `HttpExceptionFilter` — format error chuẩn
- [ ] Tạo `LoggingInterceptor` — đo thời gian request
- [ ] Cập nhật `main.ts` — đăng ký global prefix, pipes, interceptors, filters, Swagger
- [ ] Test: Swagger UI hoạt động + response format đúng

---

## Q&A

**Q1: Tại sao đăng ký interceptor/filter trong main.ts mà không dùng `@Module()`?**
Vì `main.ts` là cách đơn giản nhất cho **global** scope — áp dụng cho toàn bộ app. Nếu dùng `APP_GUARD` trong Module thì Guard có thể inject dependencies (ta sẽ làm ở Phase 1). Còn Interceptor/Filter ở Phase 0 không cần inject gì cả → dùng `main.ts` cho gọn.

**Q2: `whitelist` và `forbidNonWhitelisted` khác nhau sao?**
- `whitelist: true` + `forbidNonWhitelisted: false` → field thừa bị **xóa âm thầm** (client không biết)
- `whitelist: true` + `forbidNonWhitelisted: true` → field thừa bị **ném lỗi 400** (client biết ngay)

Ta bật cả 2 vì muốn strict: client phải gửi đúng, không hơn không kém.

**Q3: LoggingInterceptor có ảnh hưởng performance không?**
Gần như không. `Date.now()` + `console.log` mất < 0.01ms. Nhưng khi lên production, ta có thể thay bằng logging service chuyên dụng (Winston, Pino) hoặc tắt log khi cần.

> 🎯 **Hoàn thành Phase 0!** Tiếp tục sang **Phase 1: Auth Module** — implement JWT authentication, bcrypt password hashing, refresh token flow — đúng như những gì ta đã viết trong Chương 7 của báo cáo.
