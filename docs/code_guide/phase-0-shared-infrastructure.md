# 🚀 Hướng dẫn Code — Phase 0: Shared Infrastructure

## Tổng quan Phase 0

### Chúng ta đang làm gì?
Trước khi viết bất kỳ API endpoint nào, ta cần xây **nền móng chung** cho toàn bộ ứng dụng. Giống như xây nhà phải đổ móng trước — Phase 0 tạo ra các thành phần mà **mọi module đều sẽ dùng chung**.

### Cần đạt được gì?
Sau Phase 0, ứng dụng sẽ tự động:
1. ✅ **Validate** mọi request body (reject dữ liệu sai trước khi vào Controller)
2. ✅ **Wrap** mọi response theo format chuẩn `{ success, data, timestamp }`
3. ✅ **Catch** mọi exception và trả error chuẩn `{ success: false, statusCode, message }`
4. ✅ **Log** mọi request với thời gian xử lý `[HTTP] POST /auth/login - 45ms`
5. ✅ Có **Swagger UI** tại `/api-docs` để test API trực tiếp
6. ✅ API prefix `/api/v1` cho tất cả routes

### Kỹ thuật sử dụng
- **ValidationPipe** + `class-validator` + `class-transformer` (auto-validate DTOs)
- **Interceptor** pattern (AOP — can thiệp trước/sau Controller xử lý)
- **Exception Filter** pattern (bắt lỗi tập trung)

> 💡 Tất cả các kỹ thuật này bạn đã viết chi tiết trong **Chương 6** của báo cáo. Bây giờ ta sẽ áp dụng thực tế!

---

## Bước 1: Cài đặt dependencies

### Tại sao cần cài?
- `class-validator` + `class-transformer`: Để `ValidationPipe` có thể đọc decorators `@IsEmail()`, `@IsNotEmpty()` trên DTO và tự động validate
- `@nestjs/swagger`: Tự động sinh API docs từ decorators
- `@nestjs/jwt` + `@nestjs/passport` + `passport` + `passport-jwt`: Cho auth flow (Phase 1, nhưng cài sẵn luôn)
- `bcrypt`: Hash password

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
{ "success": true, "data": { ... }, "timestamp": "..." }
```
Thay vì bọc thủ công trong 53 endpoints, ta tạo **1 interceptor** áp dụng global → tự động bọc hết.

### Kỹ thuật
Interceptor dùng RxJS `map()` operator để **biến đổi** kết quả sau khi Controller trả về. Flow:
```
Request → Controller → return data → Interceptor.map(data → { success, data, timestamp }) → Client
```

### Code + Giải thích từng dòng

```typescript
// ===== PHẦN 1: IMPORTS =====

// Import từ @nestjs/common — đây là thư viện core của NestJS
import {
  Injectable,        // Decorator đánh dấu class này có thể được DI container quản lý
                     // → Bắt buộc cho mọi class muốn inject vào hệ thống NestJS
  NestInterceptor,   // Interface mà class phải implement để trở thành Interceptor
                     // → Giống "hợp đồng": NestJS yêu cầu bạn phải có method intercept()
  ExecutionContext,   // Object chứa thông tin về request hiện tại (method, url, handler...)
                     // → Mạnh hơn Request vì nó biết cả controller nào, method nào đang xử lý
  CallHandler,       // Object đại diện cho "bước tiếp theo" trong pipeline
                     // → Gọi next.handle() = cho request tiếp tục vào Controller
} from '@nestjs/common';

import { Observable } from 'rxjs';
// Observable là kiểu dữ liệu của RxJS — đại diện cho "luồng dữ liệu bất đồng bộ"
// → Giống Promise nhưng mạnh hơn: có thể phát ra nhiều giá trị, hủy được, chain pipe được
// → NestJS dùng Observable thay vì Promise bình thường trong Interceptor

import { map } from 'rxjs/operators';
// map() là toán tử biến đổi — nhận giá trị đầu vào, trả ra giá trị mới
// → Giống Array.map() nhưng dành cho stream: mỗi giá trị chạy qua đều bị biến đổi
// → Ở đây: data gốc từ Controller → bọc vào { success, data, timestamp }


// ===== PHẦN 2: INTERFACE =====

// Định nghĩa "hình dạng" của response chuẩn mà MỌI API sẽ trả về
// export = cho phép file khác import interface này (ví dụ để type-check)
// <T> = Generic — nghĩa là "T là bất kỳ kiểu nào", tùy vào data thực tế
//   Ví dụ: ApiResponse<User> thì data là User, ApiResponse<Task[]> thì data là mảng Task
export interface ApiResponse<T> {
  success: boolean;    // Luôn true cho success response
  data: T;             // Dữ liệu thực tế — kiểu T tùy thuộc vào controller trả gì
  timestamp: string;   // Thời điểm response — dùng ISO 8601 format
}


// ===== PHẦN 3: CLASS INTERCEPTOR =====

@Injectable()  // Đánh dấu để NestJS DI container quản lý instance của class này

// TransformResponseInterceptor<T>:
//   - <T> = Generic, nhận kiểu data từ Controller
//   - implements NestInterceptor<T, ApiResponse<T>>:
//       + Tham số 1 (T) = kiểu DỮ LIỆU VÀO (data gốc từ Controller)
//       + Tham số 2 (ApiResponse<T>) = kiểu DỮ LIỆU RA (sau khi bọc)
//     → TypeScript kiểm tra: đầu vào T, đầu ra phải là ApiResponse<T>
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  // Method bắt buộc phải có (do implement NestInterceptor)
  // NestJS tự động gọi method này MỖI KHI có request đi qua
  intercept(
    context: ExecutionContext,  // Chứa info request hiện tại (ít dùng trong interceptor này)
    next: CallHandler,         // "Cần gạt" để cho request tiếp tục vào Controller
  ): Observable<ApiResponse<T>> {  // Kiểu trả về: stream chứa ApiResponse

    return next.handle()  // Bước 1: "Nhả cần gạt" — cho request chạy vào Controller
                          //   → Controller xử lý xong, trả data về dưới dạng Observable
      .pipe(              // Bước 2: "Đặt ống dẫn" — data từ Controller chạy qua đây
        map((data) => ({  // Bước 3: "Biến đổi" — mỗi data chạy qua đều bị bọc lại
          success: true,
          data: data,                          // Giữ nguyên data gốc từ Controller
          timestamp: new Date().toISOString(), // Gắn thêm thời gian hiện tại
        })),
      );
    // Kết quả: Client nhận { success: true, data: <data gốc>, timestamp: "2026-..." }
    // thay vì chỉ nhận <data gốc>
  }
}
```

---

## Bước 3: Tạo HttpExceptionFilter

📁 **File:** `src/common/filters/http-exception.filter.ts`

### Tại sao?
Khi có lỗi (ví dụ `throw new NotFoundException()`), NestJS trả error format mặc định. Ta muốn error cũng theo cùng format:
```json
{ "success": false, "statusCode": 404, "message": "...", "path": "/tasks/abc", "timestamp": "..." }
```

### Kỹ thuật
- `@Catch(HttpException)` — đăng ký filter bắt lỗi loại HttpException
- `ArgumentsHost` — đối tượng đa dụng, gọi `.switchToHttp()` để lấy request/response
- `exception.getResponse()` trả string hoặc object tùy cách throw → cần kiểm tra `typeof`

### Code + Giải thích từng dòng

```typescript
import {
  ExceptionFilter,  // Interface bắt buộc implement → cần có method catch()
  Catch,            // Decorator khai báo "filter này bắt loại exception nào"
  ArgumentsHost,    // Object đa dụng — chứa request/response, hỗ trợ HTTP, WebSocket, gRPC
                    // → Phải gọi .switchToHttp() để chuyển sang ngữ cảnh HTTP
  HttpException,    // Class cha của tất cả NestJS exceptions (NotFoundException, BadRequest...)
  Logger,           // NestJS built-in logger — tự format đẹp với timestamp và màu sắc
} from '@nestjs/common';

import { Request, Response } from 'express';
// Import kiểu Request, Response từ Express.js (framework HTTP bên dưới NestJS)
// → Cần để TypeScript biết req có .url, .method và res có .status(), .json()


// @Catch(HttpException) — Bảo NestJS:
//   "Khi có bất kỳ HttpException nào bị throw mà không ai bắt,
//    hãy chuyển nó đến filter này để xử lý"
// Bao gồm: NotFoundException, BadRequestException, UnauthorizedException, v.v.
// (vì chúng đều kế thừa từ HttpException)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Tạo logger riêng với nhãn 'Exception' — mỗi log sẽ hiển thị [Exception] ở đầu
  private readonly logger = new Logger('Exception');

  // Method bắt buộc (do implement ExceptionFilter)
  // NestJS gọi method này khi bắt được exception
  catch(exception: HttpException, host: ArgumentsHost) {

    // host.switchToHttp() — chuyển đổi ArgumentsHost sang ngữ cảnh HTTP
    // Tại sao phải chuyển? Vì ArgumentsHost hỗ trợ nhiều giao thức (HTTP, WS, RPC)
    // → Sau khi chuyển, mới lấy được request và response objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();  // Express Response — dùng để gửi JSON về client
    const request = ctx.getRequest<Request>();      // Express Request — lấy URL, method
    const status = exception.getStatus();           // Lấy mã HTTP (404, 400, 401...)

    // exception.getResponse() trả về nội dung lỗi, NHƯNG có 2 dạng:
    //   - Dạng string: khi dev throw thủ công, ví dụ throw new NotFoundException('Task not found')
    //   - Dạng object: khi ValidationPipe reject, trả { message: ['email must be an email'], ... }
    // → Phải kiểm tra typeof để xử lý đúng cả 2 trường hợp
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      // Nếu là string → dùng luôn string đó
      // Nếu là object → lấy field .message ra (có thể là string hoặc mảng string)
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
      path: request.url,         // URL gây lỗi, ví dụ "/api/v1/tasks/invalid-id"
      timestamp: new Date().toISOString(),
    };

    // Log lỗi ra terminal để dev biết — KHÔNG log ra cho client
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${errorResponse.message}`,
    );

    // Gửi response về client với đúng mã HTTP + body JSON chuẩn
    // response.status(404).json({...}) → Client nhận HTTP 404 + JSON body
    response.status(status).json(errorResponse);
  }
}
```

---

## Bước 4: Tạo LoggingInterceptor

📁 **File:** `src/common/interceptors/logging.interceptor.ts`

### Tại sao?
Để theo dõi performance — biết mỗi request mất bao lâu xử lý. Cực kỳ hữu ích khi debug "API nào chậm?".

### Kỹ thuật
- `tap()` khác `map()`: `map()` biến đổi data, `tap()` chỉ "nhìn" data mà KHÔNG thay đổi gì
- Bấm giờ `Date.now()` trước khi Controller chạy, tính chênh lệch sau khi Controller xong

### Code + Giải thích từng dòng

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,           // NestJS logger — log ra terminal với format đẹp, có timestamp, có màu
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
// tap() — toán tử "quan sát" (side-effect)
// Khác với map(): map() THAY ĐỔI data đi qua, tap() CHỈ NHÌN rồi để data đi tiếp nguyên vẹn
// → Hoàn hảo cho logging: ta chỉ muốn ghi log, không muốn đụng vào data trả về


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Logger('HTTP') — tạo logger với nhãn 'HTTP'
  // Mỗi dòng log sẽ hiển thị: [HTTP] POST /api/v1/tasks - 23ms
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // === GIAI ĐOẠN "TRƯỚC" — chạy TRƯỚC KHI Controller xử lý ===

    // Lấy request object từ context
    const request = context.switchToHttp().getRequest();

    // Destructuring: rút method ('GET','POST'...) và url ('/api/v1/tasks') ra
    const { method, url } = request;

    // Bấm đồng hồ bắt đầu — Date.now() trả số millisecond hiện tại
    const now = Date.now();

    // === GIAI ĐOẠN "SAU" — chạy SAU KHI Controller xử lý xong ===

    return next.handle()  // Cho request vào Controller
      .pipe(
        tap(() => {
          // Code trong tap() chạy SAU KHI Controller trả kết quả
          // Tính thời gian chênh lệch = thời điểm hiện tại - thời điểm bắt đầu
          const responseTime = Date.now() - now;

          // Log ra terminal, ví dụ: [HTTP] POST /api/v1/auth/login - 45ms
          this.logger.log(`${method} ${url} - ${responseTime}ms`);
        }),
      );
    // Data từ Controller đi qua tap() mà KHÔNG bị thay đổi gì → client nhận nguyên vẹn
  }
}
```

---

## Bước 5: Cập nhật main.ts

📁 **File:** `src/main.ts` (sửa file có sẵn)

### Tại sao?
Đây là "cổng chính" của ứng dụng — nơi mọi thứ được khởi tạo. Ta đăng ký tất cả thành phần global ở đây để chúng áp dụng cho **toàn bộ** ứng dụng mà không cần import từng module.

### Code + Giải thích từng dòng

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Import 3 thành phần ta vừa tạo ở các bước trước
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // Tạo instance ứng dụng NestJS từ AppModule (module gốc)
  const app = await NestFactory.create(AppModule);

  // ───────────────────────────────────────────────
  // 1. GLOBAL PREFIX
  // ───────────────────────────────────────────────
  // Gắn prefix "/api/v1" vào TẤT CẢ routes
  // Ví dụ: @Get('tasks') → thực tế thành GET /api/v1/tasks
  // Tại sao cần? → Versioning API — sau này có v2 thì không conflict
  app.setGlobalPrefix('api/v1');

  // ───────────────────────────────────────────────
  // 2. GLOBAL VALIDATION PIPE
  // ───────────────────────────────────────────────
  // Tự động validate MỌI request body dựa trên DTO decorators
  // Không cần gọi validate() thủ công trong controller nữa
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // whitelist = true: Tự động LỘT BỎ mọi field mà DTO không khai báo
      // Ví dụ: DTO chỉ có { email, password }
      //   Client gửi { email, password, role: "admin" }
      //   → field "role" bị xóa sạch trước khi vào Controller (bảo mật!)

      forbidNonWhitelisted: true,
      // forbidNonWhitelisted = true: Thay vì lặng lẽ xóa, NÉM LỖI 400 luôn
      // → Client biết ngay "field role không được phép" thay vì bị xóa âm thầm

      transform: true,
      // transform = true: Tự động ép kiểu theo DTO
      // Ví dụ: URL param luôn là string, nhưng DTO khai báo number
      //   @Param('id') id: number → tự chuyển "123" thành 123
    }),
  );

  // ───────────────────────────────────────────────
  // 3. GLOBAL INTERCEPTORS
  // ───────────────────────────────────────────────
  // Đăng ký theo THỨ TỰ: Logging chạy trước → Transform chạy sau
  // Flow: Request → Logging(bấm giờ) → Controller → Transform(bọc data) → Logging(log time) → Client
  app.useGlobalInterceptors(
    new LoggingInterceptor(),             // Đo thời gian xử lý
    new TransformResponseInterceptor(),   // Bọc response { success, data, timestamp }
  );

  // ───────────────────────────────────────────────
  // 4. GLOBAL EXCEPTION FILTER
  // ───────────────────────────────────────────────
  // Bắt MỌI HttpException trong ứng dụng → format error chuẩn
  app.useGlobalFilters(new HttpExceptionFilter());

  // ───────────────────────────────────────────────
  // 5. SWAGGER
  // ───────────────────────────────────────────────
  // DocumentBuilder: xây config cho Swagger (tiêu đề, mô tả, phiên bản)
  const config = new DocumentBuilder()
    .setTitle('TodoList Collaboration API')
    .setDescription('API documentation cho dự án TodoList Collaboration')
    .setVersion('1.0')
    .addBearerAuth()   // Thêm nút "Authorize" trên Swagger UI để nhập JWT token
    .build();

  // createDocument: NestJS quét TẤT CẢ controllers, DTOs và tự sinh OpenAPI spec
  const document = SwaggerModule.createDocument(app, config);

  // setup: mount Swagger UI lên route /api-docs
  // → Truy cập http://localhost:3333/api-docs để xem và test API
  SwaggerModule.setup('api-docs', app, document);

  // Khởi động server trên port 3333 (hoặc PORT từ .env)
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
```

---

## Bước 6: Test thử

### Hành động
1. Chạy `npm run start:dev`
2. Mở browser → `http://localhost:3333/api-docs` → Swagger UI phải hiện ra
3. Thử gọi `POST /api/v1/auth/login` → response phải có format:
```json
{ "success": true, "data": { "msg": "I am logged in" }, "timestamp": "2026-02-27T..." }
```
4. Xem terminal → phải thấy log: `[HTTP] POST /api/v1/auth/login - Xms`
5. Thử gọi route không tồn tại → error phải có format:
```json
{ "success": false, "statusCode": 404, "message": "Cannot GET /api/v1/xyz", "path": "/api/v1/xyz" }
```

---

## Checklist Phase 0

- [ ] Cài đặt dependencies (`class-validator`, `@nestjs/swagger`, `bcrypt`...)
- [ ] Tạo `src/common/interceptors/transform-response.interceptor.ts`
- [ ] Tạo `src/common/filters/http-exception.filter.ts`
- [ ] Tạo `src/common/interceptors/logging.interceptor.ts`
- [ ] Cập nhật `src/main.ts` (prefix, pipes, interceptors, filters, swagger)
- [ ] Test: Swagger UI hoạt động + response format đúng

---

> **Khi hoàn thành Phase 0, báo tôi để tiếp tục sang Phase 1 (Auth Module).** Phase 1 sẽ hướng dẫn bạn implement JWT authentication, bcrypt password hashing, refresh token flow — đúng như những gì đã viết trong Chương 7 của báo cáo.
