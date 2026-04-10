<!-- Chèn vào: SAU section 6.4 (File Upload với Multer), TRƯỚC section 6.6 (bài tập) -->

## 6.5. Lỗi thường gặp và Trade-offs

### 6.5.1. Khi nào KHÔNG dùng ValidationPipe global

Trong `main.ts` của dự án TodoList Collaboration, `ValidationPipe` được đăng ký ở cấp global với option `whitelist: true` và `forbidNonWhitelisted: true`. Cấu hình này hoạt động hoàn hảo cho hầu hết các endpoint nhận JSON body — tự động loại bỏ fields không khai báo trong DTO và báo lỗi nếu client gửi fields lạ.

Tuy nhiên, `ValidationPipe` global có thể gây xung đột với hai loại endpoint đặc biệt. Thứ nhất là endpoint nhận **multipart/form-data** (file upload) — vì khi `whitelist` được bật, ValidationPipe có thể strip mất metadata của file hoặc báo lỗi vì form fields không match DTO. Thứ hai là **webhook endpoints** nhận payload từ dịch vụ bên ngoài — payload này có cấu trúc do bên thứ ba quyết định, không thể kiểm soát bằng DTO.

Trong những trường hợp này, giải pháp là override ValidationPipe ở cấp method hoặc controller:

```typescript
// Override cho endpoint cụ thể
@Post('webhook')
@UsePipes(new ValidationPipe({ whitelist: false, transform: false }))
handleWebhook(@Body() payload: any) {
  // Payload không bị strip hay validate
}
```

Trong dự án TodoList Collaboration, endpoint upload avatar không gặp vấn đề này vì `FileInterceptor` xử lý multipart/form-data trước khi `ValidationPipe` can thiệp. Tuy nhiên, nếu sau này cần thêm webhook (ví dụ: webhook từ Stripe cho thanh toán), cần nhớ override ValidationPipe cho endpoint đó.

### 6.5.2. Interceptor vs Middleware — chọn cái nào?

Ngoài vấn đề ValidationPipe, một câu hỏi thường gặp khi thiết kế ứng dụng NestJS là khi nào nên dùng Interceptor và khi nào nên dùng Middleware. Hai cơ chế này có vẻ tương tự — đều cho phép chèn logic trước khi request đến handler — nhưng thực tế chúng hoạt động ở các vị trí khác nhau trong pipeline và phục vụ những mục đích khác nhau. Để hiểu rõ sự khác biệt, cần phân tích từng khía cạnh cụ thể.

#### Vị trí trong request pipeline

Sự khác biệt quan trọng nhất nằm ở **thứ tự thực thi**. Middleware chạy đầu tiên trong pipeline — trước cả Guards, Pipes, và Interceptors. Điều này có nghĩa Middleware xử lý request ở dạng "thô" nhất, khi NestJS chưa biết request sẽ được route đến controller hay method nào. Ngược lại, Interceptor chạy **sau Guards** (đã xác thực xong) và **bao quanh Handler** — tức là nó có thể can thiệp cả trước lẫn sau khi handler trả về kết quả. Chính vì chạy ở cả hai phía của handler, Interceptor có khả năng transform response — điều mà Middleware không thể làm được vì nó đã chạy xong trước khi handler bắt đầu.

```
Client Request
    │
    ▼
Middleware (chạy đầu tiên — chỉ thấy req/res/next)
    │
    ▼
Guards (xác thực/phân quyền)
    │
    ▼
Interceptor — TRƯỚC handler (đã biết handler nào sẽ chạy)
    │
    ▼
Pipes (validate/transform params)
    │
    ▼
Handler (controller method)
    │
    ▼
Interceptor — SAU handler (có thể wrap/transform response)
    │
    ▼
Client Response
```

*Hình 6.2: Vị trí của Middleware và Interceptor trong NestJS request pipeline*

#### Khả năng truy cập Dependency Injection Container

Middleware trong NestJS có hai dạng: **function middleware** và **class middleware**. Function middleware là một hàm đơn giản nhận `(req, res, next)` — hoàn toàn giống Express middleware truyền thống — và không có khả năng inject service từ DI container. Class middleware có thể inject service qua constructor, nhưng bị hạn chế bởi cách NestJS đăng ký middleware (qua `consumer.apply()` trong module), khiến việc quản lý dependencies kém linh hoạt hơn.

Interceptor, ngược lại, là một class đầy đủ với decorator `@Injectable()`, được NestJS quản lý hoàn toàn trong DI container. Nó có thể inject bất kỳ service nào — từ `ConfigService` để đọc cấu hình, đến `Logger` để ghi log, hay bất kỳ custom service nào trong ứng dụng. Khả năng này đặc biệt quan trọng khi logic trước/sau request cần tương tác với database, cache, hoặc các service khác.

#### Xử lý response và tính năng RxJS

Đây là điểm khác biệt mang tính quyết định khi chọn giữa hai cơ chế. Middleware chỉ xử lý **request** — nó nhận `req`, có thể đọc/sửa headers, body, rồi gọi `next()` để chuyển tiếp. Sau khi gọi `next()`, Middleware không có cách nào can thiệp vào response trả về (trừ khi hack bằng cách override `res.json()`, nhưng đây là anti-pattern).

Interceptor hoạt động theo mô hình **Observable** của RxJS. Method `intercept()` trả về một Observable, và handler của controller cũng được wrap thành Observable. Nhờ đó, Interceptor có toàn bộ sức mạnh của RxJS operators: `map()` để transform response data, `tap()` để thực hiện side-effect (logging, metrics) mà không thay đổi data, `catchError()` để xử lý lỗi, hay `timeout()` để giới hạn thời gian xử lý. Ví dụ, `TransformResponseInterceptor` trong dự án sử dụng `map()` để wrap mọi response thành format `{ success, data, timestamp }` — một thao tác mà Middleware đơn giản không thể thực hiện.

#### Truy cập ExecutionContext

Interceptor nhận tham số `ExecutionContext` — một object chứa metadata phong phú về request hiện tại: controller nào đang xử lý, method nào sẽ chạy, metadata từ decorators (như `@Roles()` hay `@Public()`), và cả thông tin về transport layer (HTTP, WebSocket, hay gRPC). Khả năng này cho phép Interceptor đưa ra quyết định dựa trên ngữ cảnh — ví dụ, chỉ cache response cho những method được đánh dấu `@Cacheable()`, hoặc bỏ qua logging cho health-check endpoints.

Middleware không có `ExecutionContext`. Nó chỉ nhận `req`, `res`, `next` — ba đối tượng Express thuần. Middleware không biết request sẽ đến controller nào, không đọc được custom decorators, và không phân biệt được các transport layers. Điều này giới hạn Middleware vào những tác vụ không cần biết "ai sẽ xử lý request này" — như CORS, body parsing, hay request logging cơ bản.

#### Phạm vi áp dụng

Middleware được đăng ký theo **route** trong method `configure()` của module — áp dụng cho các đường dẫn cụ thể (ví dụ: `forRoutes('users')` hoặc `forRoutes({ path: 'auth/*', method: RequestMethod.POST })`). Cách tiếp cận route-based này phù hợp cho những tác vụ cần áp dụng theo URL pattern, nhưng không có cách đơn giản để áp dụng cho "tất cả method trong một controller" hay "chỉ method này trong controller kia".

Interceptor linh hoạt hơn với ba cấp độ: **global** (áp dụng toàn app), **controller** (áp dụng mọi method trong controller đó qua `@UseInterceptors()` trên class), hoặc **method** (chỉ áp dụng cho một endpoint cụ thể qua `@UseInterceptors()` trên method). Hệ thống phân cấp này cho phép kiểm soát chính xác interceptor nào chạy ở đâu mà không cần khai báo route patterns.

#### Bảng so sánh tổng hợp

Sau khi phân tích từng khía cạnh, bảng dưới đây tóm tắt sự khác biệt giữa Interceptor và Middleware để tiện tra cứu nhanh:

| Tiêu chí | **Interceptor** | **Middleware** |
|----------|-----------------|----------------|
| **Vị trí trong pipeline** | Sau Guards, trước/sau Handler | Đầu tiên, trước Guards |
| **Truy cập DI Container** | Có — inject bất kỳ service nào | Không (function middleware) hoặc hạn chế (class middleware) |
| **Xử lý response** | Có — wrap/transform response qua RxJS `map()` | Không — chỉ xử lý request |
| **Truy cập ExecutionContext** | Có — biết handler nào sẽ chạy | Không — chỉ có req, res, next |
| **Tính năng RxJS** | Đầy đủ — `tap()`, `map()`, `catchError()` | Không có |
| **Phạm vi áp dụng** | Global, controller, hoặc method | Route-based |

#### Lựa chọn trong dự án TodoList Collaboration

Dựa trên những phân tích trên, nhóm đã chọn Interceptor cho hai mục đích chính. `TransformResponseInterceptor` wrap tất cả response thành chuẩn `{ success, data, timestamp }` — điều này chỉ Interceptor mới làm được vì cần truy cập response data sau khi handler trả về. `LoggingInterceptor` ghi log thời gian xử lý request — cần đo thời gian từ trước đến sau handler, Interceptor với RxJS `tap()` thực hiện điều này rất tự nhiên.

Middleware được NestJS tự động sử dụng cho CORS (Cross-Origin Resource Sharing) — đây là trường hợp điển hình cần xử lý ở đầu pipeline, trước mọi logic khác. Ngoài ra, body parsing (`json()`, `urlencoded()`) cũng là middleware mặc định. Nói cách khác, Middleware phù hợp cho những tác vụ "infrastructure" chạy sớm trong pipeline và không cần biết về business logic, còn Interceptor phù hợp cho những tác vụ cần hiểu ngữ cảnh và can thiệp vào cả request lẫn response.

### 6.5.3. Interceptor chỉ wrap success — lỗi "quên" xử lý error

Một lỗi thường gặp khi viết Interceptor là chỉ wrap response thành công mà bỏ qua trường hợp lỗi. Xem xét `TransformResponseInterceptor` của dự án:

```typescript
// backend/src/shared/common/interceptors/transform-response.interceptor.ts
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

Interceptor này chỉ dùng `map()` — operator chỉ chạy khi handler trả về thành công. Khi handler throw exception, `map()` bị bỏ qua hoàn toàn, và response lỗi sẽ không có format chuẩn. Nếu developer cố gắng xử lý cả error trong Interceptor bằng `catchError()`, code sẽ trở nên phức tạp và vi phạm Single Responsibility Principle.

Giải pháp đúng — và cũng là cách dự án TodoList Collaboration đã làm — là **tách riêng** trách nhiệm xử lý success và error thành hai thành phần:

```typescript
// backend/src/shared/common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // ...
    const errorResponse = {
      success: false,          // ← Format chuẩn cho error
      statusCode: status,
      message: /* ... */,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(errorResponse);
  }
}
```

`TransformResponseInterceptor` xử lý response thành công (`success: true`), còn `HttpExceptionFilter` xử lý response lỗi (`success: false`). Cả hai đều trả về format nhất quán, giúp frontend chỉ cần kiểm tra field `success` để biết request thành công hay thất bại — không cần xử lý nhiều format khác nhau.
