# Chương 6: Các kỹ thuật nâng cao

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ hiểu được cách sử dụng Pipes để validate và transform dữ liệu, Interceptors để xử lý response và logging, Middleware để thực hiện logic trước khi request đến controller, và Exception Filters để xử lý lỗi tập trung. Tất cả các ví dụ đều minh họa qua module Task trong dự án TodoList Collaboration.

---

## 6.1. Request Lifecycle trong NestJS

Trước khi đi vào từng kỹ thuật cụ thể, cần hiểu rõ vòng đời của một HTTP request khi đi qua ứng dụng NestJS. Mỗi request sẽ phải "bước qua" một chuỗi các trạm kiểm soát theo thứ tự cố định, và mỗi kỹ thuật trong chương này sẽ can thiệp vào một giai đoạn cụ thể.

Đầu tiên, request sẽ gặp **Middleware**. Đây là trạm xử lý vòng ngoài cùng, thường làm các nhiệm vụ chung chung như ghi log (Logging) hoặc cấp phép tên miền (CORS) trước cả khi hệ thống điều hướng (routing) biết request này sẽ đi về đâu. Tiếp theo, request phải đi qua lớp **Guards** (Người gác cổng an ninh). Lớp này kiểm tra thẻ chứng minh (ví dụ như JwtAuthGuard) để xem người dùng đã được hệ thống cấp phép hợp lệ chưa, rồi mới quyết định cho đi tiếp hay đuổi về.

Sau khi qua cửa an ninh, request sẽ đi qua lớp **Interceptors đoạn trước** (Kẻ đánh chặn đầu vào). Đây là nơi lý tưởng để biến đổi cấu trúc request hoặc bấm đồng hồ bắt đầu tính thời gian chạy. Kế đến, request bị giữ lại bởi **Pipes** (Máy soi an ninh). Hệ thống ống dẫn này có nhiệm vụ kiểm tra dữ liệu đầu vào xem có đúng định dạng chuẩn (Validation) để tạo Task mới hay không, đồng thời tự động ép kiểu dữ liệu cho khớp với yêu cầu của hệ thống. 

Khi đã rũ bỏ những dữ liệu rác rưởi bên ngoài và qua trót lọt mọi bài kiểm tra, request mới chính thức diện kiến **Controller** - trung tâm đầu não phân phối nơi chứa toàn bộ Business Logic (ví dụ TaskController gọi tới Service xử lý việc cập nhật công việc). Sau khi Controller xử lý xong và gói ghém dữ liệu chuẩn bị trả về, kết quả lại một lần nữa rơi vào vòng tay của **Interceptors đoạn sau** (Kẻ đánh chặn đầu ra). Lớp này lãnh trách nhiệm bọc kết quả lại theo một định dạng response chuẩn chỉnh trước khi gửi thẳng về lại người dùng.

Trong suốt dọc hành trình tuyến tính đó, nếu có bất cứ biến cố, lỗi rác (Exception) nào ném ra một cách khó kiểm soát, **Exception Filters** (Lưới lọc lỗi) sẽ xuất hiện để hứng trọn vẹn. Nó gom các thông báo lỗi xấu xí khô khan lại và gói gém thành dạng JSON tiêu chuẩn dễ đọc.

Việc thấu hiểu trình tự trước-sau của các trạm kiểm soát này vô cùng quan trọng. Nhờ đó lập trình viên mới biết chính xác nên nhét logic xử lý vào đâu cho tối ưu (Ví dụ: logic từ chối độ dài chuỗi title ngắn phải đặt ở thư mục Pipes chứ không được dồn nén ra Middleware, vì Middleware vốn dĩ chưa vớt được thông tin về hàm (route handler) chuẩn bị xử lý chuỗi đó).

---

## 6.2. Pipes – Validation và Transformation

### 6.2.1. Pipe là gì?

Nếu coi Controller là "Lễ tân" tiếp nhận yêu cầu, thì **Pipe** đóng vai trò như "Máy soi an ninh" đặt ngay trước cửa ngõ Controller. Về mặt kỹ thuật, Pipe là một class được gắn `@Injectable()` và implement interface **`PipeTransform`** — interface này bắt buộc phải có method `transform(value, metadata)` để NestJS gọi vào mỗi khi có dữ liệu cần xử lý. Một request mang theo dữ liệu (payload) từ client gửi lên sẽ bị Pipe giữ lại để thực hiện hai nhiệm vụ cốt lõi: **Validation (Kiểm tra tính hợp lệ)** và **Transformation (Biến đổi dữ liệu)**.

Về Validation, Pipe sẽ soi xem dữ liệu có chứa mã độc, có bị thiếu trường bắt buộc, thiếu định dạng email (`@`) hay không. Nếu phát hiện vi phạm, Pipe lập tức "tuýt còi" (throw exception) và chặn đứng request ngay tại chỗ, trả luôn lỗi về cho người dùng mà không thèm báo cáo vào trong cho Controller biết gì cả. Về Transformation, đôi khi dữ liệu người dùng gửi lên đúng về mặt ý nghĩa nhưng sai về định dạng — ví dụ: gửi ID dạng chuỗi chữ `"123"` nhưng Controller lại cần ID dạng số nguyên `123`. Pipe sẽ tự động "ép kiểu" dữ liệu thành đúng định dạng trước khi nhồi vào hàm xử lý bên trong.

NestJS cung cấp sẵn các "máy soi" mạnh mẽ như: `ValidationPipe` (kiểm duyệt toàn diện form data mượt mà dựa trên DTO), `ParseIntPipe` (tự ép String thành Integer), `ParseBoolPipe` (chuyển chuỗi `"true"` / `"false"` thành kiểu boolean), hay `ParseUUIDPipe` (chỉ cho phép các ID có định dạng mã UUID siêu dài đi qua).

### 6.2.2. ValidationPipe – Validate dữ liệu tự động


ValidationPipe là pipe quan trọng nhất và được sử dụng rộng rãi nhất trong NestJS. Pipe này phối hợp với thư viện `class-validator` và `class-transformer` để tự động validate request body dựa trên decorators trong DTO class.

Đầu tiên, cần cài đặt hai thư viện hỗ trợ:

```bash
npm install class-validator class-transformer
```

Tiếp theo, kích hoạt ValidationPipe ở cấp global trong `main.ts` để áp dụng cho toàn bộ ứng dụng:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Tự động loại bỏ fields không có trong DTO
    forbidNonWhitelisted: true, // Throw error nếu có fields lạ
    transform: true,       // Tự động transform types (string → number)
  }));

  await app.listen(3000);
}
bootstrap();
```

Option `whitelist: true` là tính năng bảo mật quan trọng — nó tự động loại bỏ bất kỳ field nào client gửi lên mà không được khai báo trong DTO. Ví dụ, nếu client cố gắng gửi `{ title: "Task", role: "admin" }`, field `role` sẽ bị loại bỏ vì không tồn tại trong CreateTaskDto.

### 6.2.3. Áp dụng vào CreateTaskDto

Khi ValidationPipe đã được kích hoạt global, mọi DTO sử dụng class-validator decorators sẽ được validate tự động:

```typescript
// task/dto/create-task.dto.ts
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  MaxLength, IsDateString, IsUUID,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề task không được để trống' })
  @MaxLength(200, { message: 'Tiêu đề không được vượt quá 200 ký tự' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.NORMAL;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsUUID()
  projectId: string;
}
```

Cấu trúc `CreateTaskDto` được xây dựng theo nguyên tắc từng trường có bộ decorator riêng để kiểm soát chặt chẽ. Trường `title` bắt buộc phải là chuỗi không được rỗng và không vượt 200 ký tự — thay vì hàng chuc dong code if-else thủ công, chỉ cần ba dòng decorator là đủ. Trường `status` và `priority` dùng `@IsEnum()` để bảo đảm client chỉ có thể gửi đúng một trong các giá trị được định nghĩa sẵn trong enum, nếu gửi chữ `"xong"` thay vì `"DONE"` sẽ bị từ chối ngay lập tức. Trường `dueDate` yêu cầu đúng chuẩn ISO 8601 nên client không thể gửi các định dạng ngày tùy tiện như `"23/2/2026"`. Cuối cùng, `projectId` bắt buộc phải là UUID chuẩn để tránh các ID rác từ phía client chị được truyền xuống hàm query Database.

### 6.2.4. ParseUUIDPipe – Validate tham số URL

Ngoài validate body, chúng ta cần validate cả URL parameters. Ví dụ, endpoint GET /tasks/:id cần đảm bảo :id là UUID hợp lệ:

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.taskService.findOne(id);
}
```

Nếu client gửi GET /tasks/abc (không phải UUID), ParseUUIDPipe sẽ tự động trả về lỗi 400 thay vì để request đi đến service và query database với giá trị không hợp lệ.

---

## 6.3. Interceptors – Xử lý Response và Cross-cutting Concerns

### 6.3.1. Interceptor là gì?

Khác với Pipe chỉ đứng chặn cửa lúc đi vào, **Interceptor (Kẻ đánh chặn)** có quyền năng to lớn hơn: nó có thể chặn request **trước khi** vào Controller, VÀ chặn luôn mớ dữ liệu **sau khi** Controller làm xong chuẩn bị trả về client. Theo tài liệu chính thức NestJS, Interceptors được xây dựng dựa trên tư tưởng **AOP (Aspect-Oriented Programming — Lập trình Hướng Khía cạnh)**, một phương pháp thiết kế phần mềm cho phép tách khỏi các logic lặp đi lặp lại (như logging, caching) ra khỏi mã nghiệp vụ chính. Về mặt kỹ thuật, Interceptor là class được gắn `@Injectable()` và implement interface **`NestInterceptor`**. Method `intercept(context, next)` của nó nhận vào `next: CallHandler` — một stream RxJS Observable đại diện cho luồng dữ liệu xử lý. Khi gọi `next.handle()`, bạn quán sát ("subscribe") vào bước kế tiếp của pipeline, sau đó có thể dùng toán tử RxJS như `map()` để biến đổi kết quả hoặc `tap()` để quan sát mà không đụng vào dữ liệu.

Ba "nỗi lo chung" ("Cross-cutting Concerns") điển hình nhất mà Interceptor giải quyết rất chuẩn: **Logging** (bấm giờ từ lúc request vào đến lúc response ra, đo thời gian xử lý từng API), **Transform Response** (bọc kết quả JSON trả về theo một định dạng chung `{ success: true, data: [...] }` cho toàn hệ thống), và **Caching** (trả người dùng kết quả có sẵn trong bộ nhớ tạm nếu câu hỏi giống hệt trong khoảng thời gian hiệu lực, tiết kiệm hẳn một chuyến truy vấn DB).


### 6.3.2. Transform Response Interceptor

Trong dự án TodoList Collaboration, chúng ta muốn tất cả API responses có cùng một format chuẩn để frontend dễ xử lý. Thay vì wrap response thủ công trong từng controller method, tạo một interceptor áp dụng toàn cục:

```typescript
// common/interceptors/transform-response.interceptor.ts
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
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
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

Có một số điểm kỹ thuật quan trọng cần hiểu trong đoạn code trên. `TransformResponseInterceptor` implement interface `NestInterceptor<T, ApiResponse<T>>` — trong đó tham số đầu tiên `T` là kiểu dữ liệu đầu vào từ Controller, tham số thứ hai `ApiResponse<T>` là kiểu dữ liệu đầu ra sau khi đã bọc. Trong method `intercept()`, việc gọi `next.handle()` có nghĩa là "cho phép request tiếp tục chạy xuống Controller" và đợi kết quả trả về dưới dạng một RxJS Observable. Toán tử `map()` sau đó lần lượt xử lý từng giá trị chạy ra khỏi stream đó, bọc chúng vào format `{ success, data, timestamp }` rồi mới gửi về client. Nhờ kiến trúc này, khi áp dụng interceptor toàn củc, mọi API trong hệ thống đều tự động có cùng format response mà không cần chạm vào bất kỳ Controller nào.

```json
{
  "success": true,
  "data": { "id": "1", "title": "Viết báo cáo" },
  "timestamp": "2026-02-20T10:30:00.000Z"
}
```

### 6.3.3. Logging Interceptor

Interceptor cũng rất hữu ích cho việc đo lường performance. Ví dụ sau đây log thời gian xử lý mỗi request, giúp phát hiện các endpoints chậm:

```typescript
// common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} - ${responseTime}ms`);
      }),
    );
  }
}
```

Cách hoạt động của `LoggingInterceptor` rất tinh tế: Trước tiên, hàm `intercept()` lấy thông tin request (method và URL) từ `ExecutionContext` rồi bấm giờ bằng `Date.now()`. Tiếp đó nó gọi `next.handle()` để chạy Controller bình thường. Toán tử `tap()` khác với `map()` ở chỗ nó không làm thay đổi dữ liệu trả về — nó chỉ "đứng xem" sau khi Controller xử lý xong, tính khoảng cách thời gian và ghi log như `[HTTP] POST /tasks - 45ms` vào terminal mà không ảnh hưởng gì đến kết quả trả về cho client.

### 6.3.4. Đăng ký Interceptor toàn cục

Để áp dụng interceptor cho toàn bộ ứng dụng, đăng ký trong `main.ts` hoặc trong AppModule:

```typescript
// main.ts
app.useGlobalInterceptors(
  new LoggingInterceptor(),
  new TransformResponseInterceptor(),
);
```

---

## 6.4. Middleware – Xử lý trước Routing

### 6.4.1. Middleware là gì?

**Middleware (Phần mềm trung gian)** là những hàm (function) chạy đầu tiên nhất, sớm nhất, ngay khi request vừa chạm vào ranh giới ứng dụng, trước khi cả Pipe, Guard hay Interceptor kịp lên tiếng. Theo tài liệu chính thức NestJS, có một khác biệt cực kỳ cốt lõi giữa Middleware và Guards/Interceptors: Middleware là thành phần **"mù" (dumb)** vì nó hoàn toàn **không có quyền truy cập vào `ExecutionContext`**. Điều này có nghĩa là Middleware chẳng biết và cũng chẳng có cách nào biết request đang vào sẽ được xử lý bởi controller nào, method nào, hay handler nào cả. Đây là lý do tại sao logic bảo mật context-aware (cần biết route handler là gì) nên đặt trong Guards thay vì Middleware.

Hãy tưởng tượng Middleware là "Trạm thu phí" ngoài đường cao tốc. Nó chỉ làm nhiệm vụ ghi sổ (Logging request ID, thời gian đến), quét thẻ tự động (phân tích CORS - kiểm tra xem domain nào được phép gọi API), hoặc giới hạn tốc độ (Rate Limiting - chặn spam click). Middleware không hề biết và cũng chẳng thèm quan tâm chiếc xe qua trạm sẽ đi tới quận nào hay nhà nào (Route handler/Controller nào).



### 6.4.2. Ví dụ Logger Middleware

```typescript
// common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    this.logger.log(`[${method}] ${originalUrl} - IP: ${ip}`);
    next();
  }
}
```

Trong đoạn code trên, `LoggerMiddleware` implement interface `NestMiddleware`, yêu cầu phải có method `use(req, res, next)`. Ba tham số này là chuẩn của Express.js: `req` chứa toàn bộ thông tin request (URL, method, headers, body...), `res` là đối tượng response dùng để gửi kết quả về (ít dùng trong logging middleware), và `next` là hàm **bắt buộc phải gọi** để chuyển tiếp sang bước xử lý kế tiếp trong pipeline. Nếu quên không gọi `next()`, request sẽ bị treo vĩnh viễn, không bao giờ được phép vào Controller — đây là một lỗi phổ biến của người mới viết Middleware lần đầu.

### 6.4.3. Đăng ký Middleware trong Module

Middleware được đăng ký trong method `configure()` của Module, cho phép chỉ định cụ thể routes nào sẽ áp dụng:

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TaskModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('tasks'); // Chỉ áp dụng cho /tasks routes
  }
}
```

Method `forRoutes('tasks')` giới hạn middleware chỉ chạy cho các request đến routes bắt đầu bằng `/tasks`. Nếu muốn áp dụng cho tất cả routes, sử dụng `forRoutes('*')`.

---

## 6.5. Exception Filters – Xử lý lỗi tập trung

### 6.5.1. Exception Handling trong NestJS

NestJS có một lớp exception filter mặc định xử lý tất cả exception chưa được bắt. Khi một exception được throw trong bất kỳ đâu trong ứng dụng (controller, service, pipe), filter sẽ bắt và chuyển đổi thành HTTP response phù hợp.

NestJS là một framework cực kỳ tinh tế khi cung cấp sẵn hàng loạt các Exception (Ngoại lệ) được dựng sẵn từ đầu, tương ứng trọn vẹn với các mã trạng thái HTTP tiêu chuẩn.

Thay vì phải tự nhớ các con số vô hồn, lập trình viên chỉ cần gọi đúng tên loại lỗi là xong. Chẳng hạn, khi người dùng gửi form nhưng điền thiếu trường dữ liệu hoặc cấu trúc không hợp lệ, ta chỉ cần ném ra một `BadRequestException` (tương đương lỗi dội ngược mã 400). Khi ai đó cố tình truy cập API bảo mật mà quên chưa đính kèm chuỗi đăng nhập Token, `UnauthorizedException` (mã 401) là lựa chọn hoàn hảo.

Đối với những trường hợp oái ăm hơn, ví dụ người dùng đã đăng nhập thành công vào hệ thống nhưng lại đòi tò mò táy máy xóa công việc của người thuộc tổ chức khác, ta lập tức lấy còi chặn bằng `ForbiddenException` (Lỗi 403 - Cấm cửa triệt để quyền hạn hạn hẹp). Khi tìm kiếm đỏ mắt mà không thấy lấy một Object task nào dựa trên truy vấn ID, ta tung ra `NotFoundException` (Lỗi 404 quen thuộc không tìm thấy lối mòn). 

Thêm vào đó, trường hợp người dùng thao tác lưu tạo mới nhưng lại cố tình cắm cờ trùng lặp dữ liệu độc nhất (như một Email đã được người khác sử dụng), `ConflictException` (Lỗi 409 - Xung đột) sẽ được ném ra để vạch rõ giới hạn ranh giới logic. Và chốt chặn cuối cùng là quả bom mạng mang tên `InternalServerErrorException` (Lỗi 500) gióng tiếng chuông khẩn cấp dành cho các trường hợp sập nguồn hoặc đứt đoạn database từ hệ thống lõi server, sự vụ bất thình lình nằm ngoài tầm kiểm soát của User.

Chính nhờ các gói lỗi khai trước định danh này, code từ chối logic nghiệp vụ tại `TaskService` trở nên dễ đọc như ngôn ngữ thực tế:

```typescript
async findOne(id: string) {
  const task = await this.prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new NotFoundException(`Task với ID "${id}" không tồn tại`);
  }
  return task;
}
```

### 6.5.2. Custom Exception Filter

Khi muốn tùy chỉnh format lỗi trả về, tạo một custom exception filter:

```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }
}
```

Có một vài cơ chế trong `HttpExceptionFilter` cần hiểu rõ. Decorator `@Catch(HttpException)` thông báo với NestJS rằng filter này chỉ được kích hoạt khi exception thuộc loại `HttpException` hoặc các lớp con của nó như `NotFoundException`, `ForbiddenException`... Tham số `host: ArgumentsHost` là đối tượng đa dụng được NestJS truyền vào — ta phải gọi `.switchToHttp()` để chuyển nó sang ngữ cảnh HTTP và mới truyền xuất được `request` và `response`. Dòng xử lý `message` dùng `typeof` để kiểm tra: khi throw lỗi thủ công bằng chuỗi thì message là string, nhưng khi `ValidationPipe` từ chối dữ liệu thì nó trả về object chứa mảng lỗi — logic này đảm bảo cả hai trường hợp đều được xử lý đúng cách.

Sau khi áp dụng filter này, khi user cố gắng truy cập task không tồn tại (GET /tasks/invalid-id), response trả về sẽ có format chuẩn:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Task với ID \"invalid-id\" không tồn tại",
  "path": "/tasks/invalid-id",
  "timestamp": "2026-02-20T10:30:00.000Z"
}
```

Format này nhất quán với TransformResponseInterceptor (cùng có `success`, `timestamp`), giúp frontend xử lý cả success và error response theo cùng một pattern.

---

## 6.6. Swagger – Tài liệu API tự động

### 6.6.1. Swagger là gì?

Swagger (OpenAPI) là công cụ tự động tạo tài liệu cho API dựa trên các decorators trong code. Thay vì viết tài liệu API thủ công (dễ bị outdated), Swagger sinh ra documentation trực tiếp từ source code, đảm bảo tài liệu luôn cập nhật với code thực tế. Ngoài ra, Swagger còn cung cấp giao diện web interactive cho phép test API trực tiếp trên trình duyệt.

### 6.6.2. Cài đặt và cấu hình

```bash
npm install @nestjs/swagger
```

Cấu hình Swagger trong `main.ts`:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('TodoList Collaboration API')
    .setDescription('API documentation cho dự án TodoList Collaboration')
    .setVersion('1.0')
    .addBearerAuth()  // Thêm nút Authorize cho JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

Sau khi cấu hình, truy cập `http://localhost:3000/api-docs` để xem giao diện Swagger UI. Tất cả endpoints, parameters, và response types sẽ được hiển thị tự động dựa trên decorators trong controllers và DTOs.

### 6.6.3. Decorators cho Swagger

Để tài liệu API chi tiết hơn, sử dụng các Swagger decorators trong controller và DTO:

```typescript
// task/task.controller.ts
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')           // Nhóm endpoints theo tag
@ApiBearerAuth()            // Đánh dấu cần JWT token
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  @ApiOperation({ summary: 'Lấy danh sách tasks theo project' })
  @ApiResponse({ status: 200, description: 'Danh sách tasks' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.taskService.findByProject(projectId);
  }

  @ApiOperation({ summary: 'Tạo task mới' })
  @ApiResponse({ status: 201, description: 'Task được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @Post()
  create(@CurrentUser() user, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user.userId, createTaskDto);
  }
}
```

Trong DTO, sử dụng `@ApiProperty()` để mô tả từng field:

```typescript
// task/dto/create-task.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Viết báo cáo chương 7',
    description: 'Tiêu đề của task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Viết nội dung về Pipes, Interceptors, và Swagger',
    description: 'Mô tả chi tiết task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'uuid-of-project',
    description: 'ID của project chứa task',
  })
  @IsUUID()
  projectId: string;
}
```

---

## 6.7. Custom Decorators – Dấu ấn của sự chuyên nghiệp (Advanced)

### 6.7.1. Tại sao cần Custom Decorator?

Nếu bạn đã quen thuộc với NestJS, bạn sẽ thấy framework này cung cấp sẵn vô số Decorators tiện ích (`@Get()`, `@Body()`, `@Param()`). Tuy nhiên, trong quá trình phát triển các ứng dụng thực tế, sẽ có những đoạn logic trích xuất dữ liệu bị lặp đi lặp lại rất nhiều lần ở tầng Controller.

Ví dụ kinh điển nhất là chức năng lấy thông tin **User đang đăng nhập** (đã được xác thực qua JWT Guard). Theo cách thông thường, dữ liệu User sẽ được gắn vào trong object `request`. Khi Controller cần lấy ra để lưu AI tạo Task, ta phải viết:

```typescript
@Post()
createTask(@Req() request: Request, @Body() data: CreateTaskDto) {
  // Lấy ID user khá thủ công và làm mờ nhạt ý nghĩa của parameter
  const userId = request.user['id']; 
  return this.taskService.create(userId, data);
}
```

Cách làm trên hoạt động được, nhưng nó "phá vỡ" triết lý của NestJS vì khiến Controller phụ thuộc trực tiếp vào object Request của framework bên dưới (như Express.js), khó viết Unit Test hơn. Thay vào đó, NestJS cung cấp cơ chế tạo **Custom Parameter Decorator** giúp mã nguồn sạch (Clean Code), rõ ràng và mang tính khai báo (Declarative) cao hơn.

### 6.7.2. Tự chế tác Decorator `@CurrentUser()`

Chúng ta có thể tự tạo ra một decorator mang tên `@CurrentUser()` như sau:

```typescript
// auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // 1. Lấy Request object từ ngữ cảnh hiện tại
    const request = ctx.switchToHttp().getRequest();
    // 2. Trích xuất thông tin user (đã được JWT Guard nhồi vào từ trước)
    const user = request.user;

    if (!user) {
      return null;
    }

    // 3. Nếu truyền tham số (như 'id'), trả về đúng thuộc tính đó, ngược lại trả nguyên object
    return data ? user[data] : user;
  },
);
```

### 6.7.3. Áp dụng vào TaskController

Sau khi sở hữu "vũ khí" tự chế này, phần code bên trong `TaskController` sẽ thay đổi ngoạn mục, trở nên cực kỳ tinh gọn và chuyên nghiệp:

```typescript
// task/task.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Đảm bảo chỉ user đã đăng nhập mới chui vào được
export class TaskController {
  
  @Post()
  create(
    @CurrentUser('id') userId: string, // <-- Vẻ đẹp của Custom Decorator
    @Body() createTaskDto: CreateTaskDto
  ) {
    // Mã nguồn sạch bóng, chỉ truyền thẳng dữ liệu vào Service
    return this.taskService.create(userId, createTaskDto);
  }
}
```

Việc sử dụng Custom Decorator không chỉ rút ngắn số dòng code, mà còn giúp bất kỳ lập trình viên nào nhìn lướt qua hàm `create()` cũng hiểu ngay lập tức rằng: *"Hàm này cần cần ID của user hiện tại và cục DTO body để tạo Task"*. Đây là một kỹ thuật nhỏ nhưng thể hiện rõ mức độ thành thạo TypeScript và sự làm chủ framework NestJS của hội đồng bảo vệ đồ án.

---

## 6.8. Tổng kết

Chương này đã dệt nên một bức tranh hoàn chỉnh về cách NestJS kiểm soát và nhào nặn luồng dữ liệu thông qua các kỹ thuật nâng cao. 

Chúng ta có **Pipes** (Máy soi an ninh) đóng vai trò chốt chặn cuối cùng trước Controller, đảm bảo mọi dữ liệu đều hợp lệ thông qua sức mạnh của DTO. Có **Interceptors** (Bưu điện tổng) bao bọc hai đầu request/response, cực kỳ đắc lực cho việc định chuẩn dữ liệu trả về và đo lường hiệu suất. Có **Middleware** (Trạm thu phí) đứng ở vòng ngoài để gánh vác các tác vụ mạng cơ bản. Có **Exception Filters** giăng lưới bắt lỗi tập trung, giúp ứng dụng không bao giờ bị Crash màn hình xanh với người dùng. Và cuối cùng là **Custom Decorators**, một "chữ ký" thể hiện đẳng cấp Clean Code trong việc trích xuất dữ liệu ngầm tĩnh. 

Sự kết hợp thêm với công cụ tài liệu hóa tự động **Swagger** biến toàn bộ các endpoint thuộc module Task của chúng ta trở thành một hệ thống API mang chuẩn "Enterprise-ready" — Vừa bảo mật (Guard), vừa chính xác (Pipe), có giám sát (Interceptor), chuẩn hóa thông báo lỗi (Filter), và có tài liệu sống (Swagger). Đây chính là lý do vì sao NestJS vượt trội hơn hẳn so với những framework Node.js truyền thống.
