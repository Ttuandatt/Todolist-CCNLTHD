# Chương 4: Các khái niệm cơ bản của kiến trúc NestJS

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ nắm vững các khái niệm nền tảng của TypeScript được sử dụng trong NestJS, hiểu cách tổ chức ứng dụng theo kiến trúc module, cách Controller xử lý HTTP requests, cách Provider cung cấp business logic, và cơ chế Dependency Injection giúp các thành phần kết nối với nhau.

---

## 4.1. TypeScript – Nền tảng xây dựng

### 4.1.1. TypeScript là gì?

TypeScript là ngôn ngữ lập trình mã nguồn mở được phát triển bởi Microsoft. Về bản chất, TypeScript là một "superset" của JavaScript, nghĩa là mọi đoạn code JavaScript hợp lệ đều là code TypeScript hợp lệ. Điểm khác biệt quan trọng nhất của TypeScript so với JavaScript nằm ở hệ thống kiểu dữ liệu tĩnh (static typing).

Trong JavaScript thuần, biến có thể thay đổi kiểu dữ liệu tùy ý trong quá trình chạy chương trình, điều này tuy linh hoạt nhưng dễ gây ra lỗi khó phát hiện. TypeScript giải quyết vấn đề này bằng cách yêu cầu khai báo kiểu dữ liệu ngay từ lúc viết code. Trình biên dịch TypeScript sẽ kiểm tra và báo lỗi nếu phát hiện sự không tương thích về kiểu, giúp lập trình viên phát hiện lỗi sớm trước khi chương trình được chạy.

NestJS được viết hoàn toàn bằng TypeScript và tận dụng triệt để các tính năng nâng cao của ngôn ngữ này như Decorators, Generics và Interfaces. Do đó, việc nắm vững TypeScript là điều kiện tiên quyết để làm việc hiệu quả với NestJS.

Trong kiến trúc của NestJS, TypeScript đóng vai trò cốt lõi nhờ vào ba đặc điểm chính. Đầu tiên là Static Typing (Định kiểu tĩnh), giúp phát hiện lỗi ngay trong quá trình phát triển (compile-time) thay vì đợi đến khi chạy ứng dụng (run-time). Tiếp theo là khả năng chỉnh sửa mã nguồn an toàn (Refactoring) — nhờ hệ thống kiểu dữ liệu, việc thay đổi cấu trúc code trong dự án NestJS trở nên ít rủi ro hơn. Cuối cùng là tính tương thích hoàn hảo với OOP — NestJS dựa trên lập trình hướng đối tượng, và TypeScript cung cấp đầy đủ các tính năng như Class, Interface, Access Modifiers (private, public, protected).

### 4.1.2. Hệ thống kiểu dữ liệu cơ bản

TypeScript cung cấp một hệ thống kiểu phong phú bao gồm các kiểu dữ liệu nguyên thủy (primitive types) và các kiểu dữ liệu phức hợp. Kiểu string dùng để đại diện cho dữ liệu văn bản. Kiểu number bao gồm cả số nguyên và số thực, khác với nhiều ngôn ngữ khác, TypeScript không phân tách thành int hay float. Kiểu boolean lưu giá trị logic true hoặc false. Kiểu Array có hai cách khai báo là `type[]` hoặc sử dụng Generic `Array<type>`.

Ví dụ minh họa các kiểu dữ liệu cơ bản trong context dự án TodoList:

```typescript
const appName: string = 'TodoList Collaboration';
const port: number = 3000;
const isProduction: boolean = false;
const modules: string[] = ['auth', 'user', 'workspace', 'project', 'task'];
```

Đối với các cấu trúc dữ liệu phức tạp hơn như object, TypeScript sử dụng Interface hoặc Type để định nghĩa hình dạng (shape) của dữ liệu. Điều này đảm bảo rằng mọi object thuộc một kiểu nhất định đều phải có đầy đủ các thuộc tính được yêu cầu.

### 4.1.3. Interface và Type Alias

Interface và Type Alias là hai cách để định nghĩa kiểu dữ liệu tùy chỉnh trong TypeScript. Mặc dù có nhiều điểm tương đồng, chúng được sử dụng trong các ngữ cảnh khác nhau.

Interface thường được dùng để mô tả hình dạng của object hoặc để định nghĩa contract cho các class. Interface có khả năng mở rộng (extend) và hợp nhất (merge), phù hợp cho việc định nghĩa các entity trong ứng dụng. Trong dự án TodoList Collaboration, chúng ta sử dụng Interface để định nghĩa cấu trúc các entity chính:

```typescript
// Định nghĩa Interface cho Task - entity chính của dự án
interface Task {
  id: string;
  title: string;
  description?: string;  // Dấu ? nghĩa là thuộc tính tùy chọn
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdById: string;
  projectId: string;
}

// Interface cho Project - chứa nhiều Tasks
interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  tasks: Task[];
}
```

Type Alias được sử dụng để đặt tên cho các kiểu phức tạp, đặc biệt là Union Types (kiểu hợp) và Intersection Types (kiểu giao). Trong dự án, chúng ta sử dụng Type Alias để định nghĩa các trạng thái và mức độ ưu tiên của Task:

```typescript
// Union Type cho trạng thái Task
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

// Union Type cho mức độ ưu tiên Task
type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// Kết hợp Interface và Type - tạo kiểu cho việc cập nhật Task
type TaskUpdate = Partial<Task> & { updatedAt: Date };
```

Sự kết hợp giữa Interface và Type Alias giúp mã nguồn trở nên tường minh, dễ bảo trì và tận dụng được khả năng kiểm tra kiểu mạnh mẽ của TypeScript.

| Đặc điểm | Interface | Type Alias |
| :--- | :--- | :--- |
| **Kế thừa** | Sử dụng từ khóa `extends` | Sử dụng Intersection (`&`) |
| **Declaration Merging** | Có — có thể khai báo cùng tên nhiều lần, TS tự gộp | Không — báo lỗi nếu trùng tên |
| **Union Types** | Không hỗ trợ trực tiếp | Có (`type Status = 'open' \| 'closed'`) |
| **Tính ứng dụng** | Khuyên dùng cho Object, Class | Khuyên dùng cho kiểu biến hóa, logic phức tạp |

### 4.1.4. Decorators trong TypeScript

Đây là phần quan trọng nhất để hiểu NestJS. Decorator là một tính năng đặc biệt của TypeScript cho phép thêm metadata hoặc thay đổi hành vi của class, method, property hoặc parameter. Trong NestJS, Decorators đóng vai trò then chốt, được sử dụng rộng rãi để định nghĩa Controllers, Services, và các thiết lập khác.

Về mặt cú pháp, Decorator được viết với ký hiệu `@` theo sau là tên decorator. Decorator thực chất là một hàm nhận tham số và có thể thực hiện các thao tác trên đối tượng được decorate. Để minh họa, hãy xem cách các Decorators được sử dụng trong TaskController của dự án:

```typescript
// Class Decorator - đánh dấu class là Controller, route cơ sở là /tasks
@Controller('tasks')
export class TaskController {

  // Method Decorator - định nghĩa HTTP GET cho route /tasks
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  // Method Decorator - POST /tasks, Parameter Decorator - lấy data từ body
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  // Parameter Decorator - lấy giá trị :id từ URL
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }
}
```

Trong ví dụ trên, `@Controller('tasks')` là một Class Decorator đánh dấu class TaskController là một controller xử lý các request đến route `/tasks`. Các decorator `@Get()` và `@Post()` là Method Decorators định nghĩa HTTP method cho từng phương thức. Decorator `@Body()` và `@Param('id')` là Parameter Decorators dùng để lấy dữ liệu từ request body và URL parameters.

### 4.1.5. Generics cơ bản

Generics là một tính năng mạnh mẽ cho phép viết code linh hoạt và có thể tái sử dụng cho nhiều kiểu dữ liệu khác nhau. Thay vì viết nhiều hàm riêng biệt cho từng kiểu, chúng ta có thể viết một hàm generic hoạt động với bất kỳ kiểu nào được truyền vào.

Trong NestJS và Prisma, Generics được sử dụng thường xuyên. Ví dụ, khi tạo một hàm response chuẩn hóa cho API, chúng ta có thể viết hàm generic để sử dụng lại cho mọi loại dữ liệu trả về:

```typescript
// Generic response wrapper cho API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Sử dụng với Task
const taskResponse: ApiResponse<Task> = {
  success: true,
  data: { id: '1', title: 'Viết báo cáo', status: 'TODO', ... },
};

// Sử dụng với Task[] (danh sách tasks)
const tasksResponse: ApiResponse<Task[]> = {
  success: true,
  data: [{ id: '1', title: 'Viết báo cáo', ... }],
};
```

Cú pháp `<T>` định nghĩa một type parameter có tên là T. Khi gọi hàm hoặc sử dụng interface, chúng ta truyền kiểu cụ thể (Task, Task[]) vào vị trí của T. Trình biên dịch sẽ tự động suy luận kiểu trả về dựa trên type parameter được truyền vào, đảm bảo type safety xuyên suốt ứng dụng.

---

## 4.2. Modules – Đơn vị tổ chức code

### 4.2.1. Module là gì?

Trong NestJS, Module là đơn vị cơ bản để tổ chức ứng dụng. Mỗi Module đóng gói một nhóm các thành phần có liên quan với nhau, bao gồm Controllers, Services, và các Providers khác. Cách tổ chức này tuân theo nguyên tắc "Separation of Concerns" (Phân tách mối quan tâm), giúp code dễ quản lý, bảo trì và kiểm thử.

Một ứng dụng NestJS luôn có ít nhất một Module gốc (root module), thường được đặt tên là AppModule. Module gốc này import các Module con khác để tạo thành cây dependencies hoàn chỉnh. Trong sơ đồ cấu trúc module, Application Module (hay Root Module) đóng vai trò là điểm bắt đầu của ứng dụng, thực hiện việc kết nối và quản lý toàn bộ hệ thống thông qua việc import các module chức năng chính.

Module là một class được gắn decorator `@Module()`. Decorator này cung cấp metadata mà NestJS sử dụng để tổ chức cấu trúc ứng dụng. Hãy xem ví dụ TaskModule — module quản lý công việc trong dự án TodoList Collaboration:

```typescript
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Cho phép các module khác sử dụng TaskService
})
export class TaskModule {}
```

### 4.2.2. Tính đóng gói (Encapsulation) và Cấu trúc @Module

Một trong những concept quan trọng nhất của NestJS là **Tính đóng gói (Encapsulation)**. Theo mặc định, mọi thứ (Service, Provider) bạn tạo ra bên trong một Module đều là "trạng thái Private" (bí mật). Chỉ có các Controller và Service nằm cùng chung một Module mới được phép sử dụng chúng.

Để các Module có thể giao tiếp và chia sẻ Service cho nhau, chúng ta sử dụng decorator `@Module()` với 4 thuộc tính cấu hình cốt lõi: `providers`, `controllers`, `exports`, và `imports`.

Hãy xem xét một kịch bản thực tế: `TaskModule` cần truy cập cơ sở dữ liệu để tìm danh sách công việc, do đó nó cần sử dụng `PrismaService` - vốn đang nằm tít bên trong `PrismaModule`. Quá trình "trao đổi" này bắt buộc phải diễn ra qua 3 bước liên tiếp. Đầu tiên, `PrismaModule` phải "công khai" `PrismaService` ra bên ngoài thông qua mảng `exports`. Nếu không có bước này, `PrismaService` mãi mãi bị khóa chặt bên trong `PrismaModule`.

```typescript
// prisma/prisma.module.ts
@Module({
  providers: [PrismaService],  // Sinh ra PrismaService
  exports: [PrismaService],    // BƯỚC 1: Cho phép Module khác xài PrismaService
})
export class PrismaModule {}
```

Tiếp theo, `TaskModule` không thể tự ý lấy `PrismaService` về dùng trực tiếp. Thay vào đó, nó phải "xin phép kết nối" với `PrismaModule` bằng cách khai báo import toàn bộ module bên ngoài đó thông qua mảng `imports`.

```typescript
// task/task.module.ts
@Module({
  imports: [PrismaModule],     // BƯỚC 2: Kết nối với PrismaModule để dùng PrismaService đã export
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
```

Chỉ khi hoàn thành đúng 2 bước `exports` và `imports` ở 2 file Module như trên, thì bên trong file `task.service.ts`, chúng ta mới có thể "tiêm" (Inject) `PrismaService` vào constructor và sử dụng bình thường. Quy tắc quan trọng cần nhớ: ta phải import nguyên một **Module** (PrismaModule), chứ không thể import trực tiếp một **Service** (PrismaService) từ module khác.

```typescript
// task/task.service.ts
@Injectable()
export class TaskService {
  // NestJS tự động tiêm PrismaService vào đây nhờ 2 bước export/import đã khai báo ở trên
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.task.findMany();
  }
}
```

Trong một dự án thực tế, `PrismaService` (kết nối Database) là thứ mà hầu như Module nào cũng cần (Auth, User, Project, Task...). Việc bắt Module nào cũng phải khai báo `imports: [PrismaModule]` sẽ gây lặp code rườm rà. Để giải quyết, NestJS cung cấp một giải pháp gọn gàng hơn: biến `PrismaModule` thành Module toàn cầu bằng decorator `@Global()`. Khi bạn gắn decorator này lên `PrismaModule` và import nó **duy nhất một lần** tại `AppModule` (Root), `PrismaService` sẽ tự động được cung cấp cho toàn bộ ứng dụng. Lúc này, `TaskModule` hay bất kỳ Module nào khác đều có thể lấy `PrismaService` ra dùng mà không cần khai báo `imports: [PrismaModule]` nữa.

### 4.2.3. Các loại Module

Trong một ứng dụng NestJS thực tế, chúng ta thường phân loại Module thành bốn nhóm chính dựa trên mục đích sử dụng, nhằm giúp quản lý mã nguồn theo hướng Modular Design.

#### 4.2.3.1. Feature Module

Feature Module là các Module chứa logic cho một tính năng cụ thể của ứng dụng. Trong dự án TodoList Collaboration, các Feature Module bao gồm `AuthModule` (xác thực người dùng), `TaskModule` (quản lý công việc), `WorkspaceModule` (quản lý không gian làm việc), và `ProjectModule` (quản lý dự án). Mỗi Feature Module hoạt động hoàn toàn độc lập, chỉ tập trung vào một domain cụ thể và chỉ export những gì nó muốn chia sẻ với bên ngoài.

#### 4.2.3.2. Shared Module

Shared Module là các Module cung cấp các service dùng chung cho toàn bộ ứng dụng. Ví dụ điển hình là PrismaModule cung cấp kết nối database cho tất cả các Module khác. Shared Module thường được đánh dấu là `@Global()` để không cần import lặp đi lặp lại ở mọi nơi.

```typescript
// prisma/prisma.module.ts - Shared Module cho Database
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

#### 4.2.3.3. Core Module (Root Module)

Core Module thường chỉ có một trong ứng dụng, đó là AppModule. Module này đóng vai trò là điểm khởi đầu, nơi tập hợp và khởi tạo tất cả các Module khác:

```typescript
// app.module.ts - Core Module (Root Module)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,    // Shared Module
    AuthModule,      // Feature Modules
    TaskModule,
    ProjectModule,
  ],
})
export class AppModule {}
```

#### 4.2.3.4. Dynamic Module

Dynamic Module là các Module có thể được cấu hình khác nhau tùy theo nơi import. Thay vì hard-code cấu hình, Dynamic Module cho phép truyền options khi import thông qua các static methods như `forRoot()`, `forRootAsync()`, hoặc `register()`.

```typescript
// Sử dụng Dynamic Module có sẵn trong AppModule
@Module({
  imports: [
    // ConfigModule với forRoot() - cấu hình global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // JwtModule với register() - cấu hình cho JWT authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AppModule {}
```

Tóm lại, mỗi loại Module đảm nhận một vị trí riêng trong tổng thể kiến trúc: Feature Module là các "bộ phận chức năng" độc lập (TaskModule, AuthModule), Shared Module là "nguồn điện trung tâm" phục vụ cho mọi phòng ban (PrismaModule), Core Module là "Ban giám đốc" điều phối toàn bộ (AppModule), và Dynamic Module là những "thiết bị tự cài đặt" có thể cấu hình linh hoạt tùy ngữ cảnh (ConfigModule, JwtModule).

Việc tổ chức ứng dụng theo kiến trúc module hóa mang lại nhiều lợi ích thiết thực. Đầu tiên là nguyên tắc Separation of Concerns — khi mỗi module chỉ tập trung vào một domain, code trở nên dễ hiểu hơn. Tiếp theo là tính tái sử dụng code — TaskService có thể được export và sử dụng bởi nhiều module khác nhau. Ngoài ra, kiến trúc này giúp kiểm thử dễ dàng vì mỗi module có thể được test độc lập, và hỗ trợ làm việc nhóm hiệu quả vì mỗi thành viên có thể phát triển module riêng mà không gây xung đột mã nguồn.

---

## 4.3. Controllers – Xử lý HTTP Requests

### 4.3.1. Controller là gì?

Trong kiến trúc của NestJS, Controller đóng vai trò như người gác cổng của ứng dụng — nơi tiếp nhận mọi HTTP request từ phía client. Hãy hình dung Controller như một nhân viên lễ tân: tiếp nhận yêu cầu, xác định dịch vụ cần thiết, chuyển tiếp đến bộ phận xử lý (Service), và trả kết quả về cho khách.

Để đánh dấu một class là Controller, chúng ta sử dụng decorator `@Controller()` với tham số là đường dẫn route cơ sở. Trong dự án TodoList Collaboration, TaskController xử lý tất cả các request đến route `/tasks`.

### 4.3.2. HTTP Method Decorators

Trong chuẩn RESTful API, mỗi thao tác CRUD (Create, Read, Update, Delete) tương ứng với một HTTP method. NestJS cung cấp các decorator tương ứng để khai báo trực tiếp trên từng phương thức trong Controller. Decorator `@Get()` bắt yêu cầu đọc dữ liệu; khi kết hợp với tham số route như `@Get(':id')`, nó sẽ bắt yêu cầu đọc một bản ghi cụ thể theo ID. Decorator `@Post()` xử lý yêu cầu tạo mới, `@Patch(':id')` cho cập nhật một phần, và `@Delete(':id')` cho xóa bản ghi. Dưới đây là toàn bộ `TaskController` từ dự án, thể hiện rõ cách áp dụng các decorator này:

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.taskService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
```

### 4.3.3. Request Data Decorators

NestJS cung cấp bộ **Parameter Decorators** để trích xuất dữ liệu từ các phần khác nhau của HTTP request, thay thế hoàn toàn việc phải tự tay moi móc từ object `request` như trong Express.js thuần túy. Decorator `@Body()` lấy toàn bộ nội dung body dưới dạng object — đây là cách ta nhận `CreateTaskDto` khi user gọi `POST /tasks`. Nếu chỉ muốn lấy một field cụ thể, có thể dùng `@Body('title')`. Decorator `@Param('id')` trích xuất giá trị biến động trong URL — ví dụ khi URL là `/tasks/abc-123`, tham số `id` sẽ có giá trị là chuỗi `abc-123`. Decorator `@Query()` lấy tham số truy vấn (query string) từ URL — ví dụ `/tasks?status=TODO&page=1` cho phép lọc và phân trang danh sách tasks. Cuối cùng, `@Headers('authorization')` dùng để đọc giá trị JWT Token từ HTTP header khi cần xác thực thủ công.

Ví dụ endpoint tìm kiếm và lọc tasks với nhiều query parameters:

```typescript
@Get()
findAll(
  @Query('status') status?: TaskStatus,
  @Query('priority') priority?: TaskPriority,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.taskService.findAll({ status, priority, page, limit });
}
```

---

## 4.4. Providers & Services – Business Logic

### 4.4.1. Provider là gì?

Provider là một khái niệm cơ bản trong NestJS. Hầu hết các class cơ bản trong Nest đều có thể được coi là một provider: services, repositories, factories, helpers, v.v. Ý tưởng chính của một provider là nó có thể được inject (tiêm) vào các class khác làm dependency. Service là loại Provider phổ biến nhất, chứa business logic — tức là logic xử lý nghiệp vụ thực sự của ứng dụng.

### 4.4.2. @Injectable decorator

Để đánh dấu một class là Provider được NestJS quản lý, chúng ta sử dụng decorator `@Injectable()`. Decorator này làm nhiệm vụ "giơ tay báo danh" với NestJS rằng: *"Đây là một Provider, xin hãy quản lý nó giúp tôi"*. Khi đó, class này sẽ được đưa vào **IoC Container (Inversion of Control Container - Thùng chứa Đảo ngược Điều khiển)**.

Đối với người mới, "Đảo ngược điều khiển/IoC" nghe có vẻ hàn lâm nhưng thực chất rất đơn giản. Bình thường, khi cần dùng một Service (ví dụ gửi email), bạn phải tự tay khởi tạo nó bằng từ khóa `new` (Ví dụ: `const emailService = new EmailService()`). Tuy nhiên, khi dùng IoC Container, bạn "đảo ngược" (từ bỏ) quyền kiểm soát đó, giao phó hoàn toàn phần việc vất vả là cấp phát bộ nhớ, khởi tạo và dọn dẹp biến cho hệ thống NestJS tự động lo liệu. Container chính là cái "nhà kho" chứa tất cả các biến đã được NestJS tạo sẵn để nằm chờ bạn lấy ra dùng.

Hãy xem TaskService — service chứa toàn bộ business logic xử lý công việc trong dự án:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      include: {
        createdBy: { select: { id: true, name: true, avatar: true } },
        assignments: { include: { user: true } },
        labels: { include: { label: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: true,
        project: true,
        subtasks: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        createdBy: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    // Soft delete - đánh dấu xóa thay vì xóa thực sự
    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

Trong ví dụ trên, TaskService sử dụng PrismaService (được inject qua constructor) để tương tác với database. Mỗi method đại diện cho một thao tác nghiệp vụ: tìm tasks theo project, lấy chi tiết task, tạo mới, cập nhật, và xóa mềm (soft delete). Decorator `@Injectable()` cho phép NestJS tự động tạo instance của TaskService và inject PrismaService vào constructor khi cần.

Sau khi tạo Service, cần đăng ký nó vào Module tương ứng:

```typescript
@Module({
  controllers: [TaskController],
  providers: [TaskService],   // Đăng ký TaskService vào IoC Container
  exports: [TaskService],     // Export để module khác có thể sử dụng
})
export class TaskModule {}
```

---

## 4.5. Dependency Injection

### 4.5.1. DI là gì?

Dependency Injection (DI) là một design pattern quan trọng mà các dependency được "tiêm" vào từ bên ngoài thay vì class tự khởi tạo. Trong NestJS, DI là cơ chế chính để kết nối các thành phần với nhau.

Để hiểu rõ hơn, hãy so sánh hai cách tiếp cận. Cách truyền thống (không có DI), mỗi class phải tự tay tạo ra các công cụ mà nó cần dùng. Điều này dẫn đến tình trạng **Tight Coupling (Lệ thuộc chặt chẽ)** — giống như một chiếc xe hơi bị hàn chết cứng động cơ vào khung gầm, nếu động cơ hỏng là phải ném bỏ cả chiếc xe vì không thể tháo rời để bảo trì riêng.

```typescript
// ❌ Không sử dụng DI - tight coupling
class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService(new PrismaService());
  }
}
```

Vấn đề của cách viết này là `TaskController` tự tạo cả `TaskService` lẫn `PrismaService` bằng từ khóa `new`. Điều này tạo ra hai hệ quả nghiêm trọng: một là, nếu muốn thay PrismaService bằng một thư viện database khác, lập trình viên phải mở vào sửa tận trong file Controller — một nơi vốn không nên biết gì về database; hai là, không thể viết unit test cho Controller mà không có kết nối database thật, khiến việc kiểm thử trở nên chậm và rủi ro.

Trái lại, với Dependency Injection trong NestJS, bộ công cụ (dependency) được đẩy vào từ bên ngoài thông qua constructor chứ class không tự tạo. Đây gọi là **Loose Coupling (Phụ thuộc lỏng lẻ)** — các bộ phận giờ đây được lắp ghép linh hoạt như các mảnh Lego, cực kỳ dễ dàng tháo lắp và thay thế bằng các mảnh ghép khác có cùng hình dáng khi có nhu cầu đổi mới:

```typescript
// ✅ Sử dụng DI - loose coupling
@Controller('tasks')
class TaskController {
  constructor(private readonly taskService: TaskService) {}
}
```

Đoạn code rút gọn này chỉ có một dòng trong constructor, nhưng ẩn chứa rất nhiều: cú pháp `private readonly taskService: TaskService` vừa khai báo biến thành viên, vừa đánh dấu cho NestJS biết cần inject `TaskService` vào đây. NestJS sẽ tự tìm instance `TaskService` thich hợp từ IoC Container và truyền vào, Controller hoàn toàn không biết — và cũng không cần biết — `TaskService` được tạo ra như thế nào hay phụ thuộc vào gì.

### 4.5.2. Cách hoạt động

Cơ chế DI trong NestJS hoạt động qua ba bước chính liên tiếp. Đầu tiên là Đăng ký Provider — khi ứng dụng khởi động, NestJS xây dựng một danh sách gia phả (dependency graph) bao gồm toàn bộ mọi thứ dựa trên các decorator `@Module()` và `@Injectable()`. 

Bước tiếp theo là Phân tích Dependencies — NestJS sử dụng cơ chế **TypeScript Reflection** (có thể hiểu nôm na là khả năng "tự soi gương" - code có khả năng tự đọc và thấu hiểu cấu trúc của chính nó khi đang chạy) để kiểm tra constructor của mỗi class. Từ đó nó biết chính xác class này đang "đòi hỏi" những món trang bị gì, và rà soát tìm Provider tương ứng bên trong cái nhà kho IoC Container. 

Bước cuối cùng là Tạo và Inject (Tiêm) Instances — Nếu tìm thấy, NestJS sẽ tự động ra lệnh tạo instance (hiện thân của class) và "tiêm" xuyên thẳng vào constructor. Rất độc đáo là theo mặc định, NestJS áp dụng mẫu thiết kế **Singleton (Độc bản)**. Điều này có nghĩa là mỗi một loại đồ vật (ví dụ `TaskService`), NestJS sẽ chỉ sản xuất *duy nhất một chiếc* để vào bộ nhớ RAM, và đem cho dùng chung ở tất cả các Controller hay Module nào có yêu cầu. Khế ước độc bản này giúp ứng dụng tiết kiệm cực kỳ nhiều dung lượng bộ nhớ so với việc cứ mỗi nơi lại gọi từ khóa `new` đẻ ra thêm một bản sao mới.

Ví dụ cụ thể: khi TaskController "giơ tay" xin TaskService, NestJS sẽ soi thử TaskService đã được ai dùng trước đó hay tạo ra chưa. Nếu chưa, NestJS sinh mới một instance, sau đó tiêm gián tiếp PrismaService vào TaskService, rồi cuối cùng mới bứng cả cục TaskService hoàn chỉnh đó tiêm về tay cho TaskController.

### 4.5.3. Lợi ích của DI

Dependency Injection mang lại ba lợi ích chính cho việc phát triển ứng dụng.

Lợi ích đầu tiên là Loose Coupling (Giảm phụ thuộc chặt chẽ). TaskController không cần biết TaskService được tạo như thế nào hay phụ thuộc vào những gì. Nếu sau này cần thay đổi implementation (ví dụ: chuyển từ PrismaService sang TypeORM Repository), chỉ cần thay đổi ở một nơi mà không ảnh hưởng đến Controller.

Lợi ích thứ hai đến từ việc nó cực kỳ thuận lợi cho những tester (kiểm thử). Khi viết kịch bản kiểm thử (Unit Tests) cho `TaskController`, ta tuyệt nhiên không hề muốn hàm này chọc phá và làm hỏng Database chứa dữ liệu thật của khách hàng. Nhờ sự lỏng lẻo của DI, ta có thể đánh tráo `PrismaService` thật bằng các **Mock Objects (Vật đóng thế)**. 

Mock object là những đối tượng giả lập, phác họa vỏ bọc y hệt bản gốc nhưng phần lõi bên trong chỉ là dữ liệu tĩnh bịa ra khống. Bằng cách lén "tiêm" vật đóng thế này vào trong constructor, ta có thể lừa Controller để test chức năng một cách an toàn, hoàn toàn cô lập lập với bên ngoài và chạy siêu tốc (vì không phải chờ kết nối mạng hay ổ cứng truy vấn Database thật).

Ví dụ, tạo một mock PrismaService giả lập hàm tìm kiếm:

```typescript
const mockPrismaService = {
  task: {
    findMany: jest.fn().mockResolvedValue([
      { id: '1', title: 'Test Task', status: 'TODO' },
    ]),
    findUnique: jest.fn().mockResolvedValue(
      { id: '1', title: 'Test Task', status: 'TODO' },
    ),
  },
};

const module = await Test.createTestingModule({
  providers: [
    TaskService,
    { provide: PrismaService, useValue: mockPrismaService },
  ],
}).compile();
```

Có hai yếu tố kỹ thuật cần hiểu trong đoạn code này. `jest.fn().mockResolvedValue([...])` tạo ra một hàm giả (fake function): khi bất kỳ ai gọi `findMany()`, nó không thực sự chạy query database mà lập tức trả về mảng dữ liệu giả được khai báo sẵn. Phần chạy test thì dùng cú pháp `{ provide: PrismaService, useValue: mockPrismaService }` — đây là cách ra lệnh cho NestJS DI: *"Bất cứ ai xin `PrismaService`, thay vì đưa bản thật thì đưa cái `mockPrismaService` này vào"*. Kết quả là `TaskService` chạy toàn bộ logic như bình thường nhưng không bao giờ chạm vào database thật.

Lợi ích thứ ba là tái sử dụng code hiệu quả. Một Service có thể được inject vào nhiều nơi khác nhau. Ví dụ, TaskService có thể được sử dụng trong cả TaskController và NotificationService (để gửi thông báo khi task được cập nhật).

### 4.5.4. Quản lý Vòng đời (Lifecycle) tự động thông qua Hooks

Tương tự như một con người kinh qua các giai đoạn sinh ra và mất đi, các Module hay Provider trong ứng dụng NestJS cũng trải qua một **Vòng đời (Lifecycle)** cụ thể: từ khoảnh khắc ứng dụng xẹt điện khởi động, tải file vào bộ nhớ, nhận lệnh phục vụ, cho đến giây phút ứng dụng bị tắt lệnh (kill/stop).

Nhà kho NestJS IoC Container nhận trọng trách giám sát sinh tử - vòng đời này thông qua các công cụ gọi là **Lifecycle Hooks**. Bạn cứ hình dung Hooks như hàng loạt các "trạm kiểm soát" hoặc "báo thức" được NestJS gắn sẵn dọc theo trục lộ thời gian tồn tại của ứng dụng. Nhờ mắc ngoặc móc (hook) những đoạn code của ta vào các trạm này, ta có thể sai bảo NestJS: *"Ê, hãy thực thi đoạn code A này ngay khoảnh khắc mày vừa được sinh ra nhé!"* hoặc *"Nhớ chạy câu lệnh B này dọn rác ngay trước khi mày nhắm mắt nhé!"*.

Trong ứng dụng NestJS, `onModuleInit` là "chuông gọi dậy" rung ngay khi module vừa tải xong vào RAM — đây là khoảnh khắc vàng để mở các kết nối tới Database hoặc các hệ thống bên ngoài. Ngược lại, `onModuleDestroy` là "chuông cảnh báo đỏ" rung lên một vạch ngay trước khi module bị tắt nguồn hoàn toàn — thời điểm hoàn hảo để đóng cổng kết nối Database một cách an toàn, tránh tình trạng connection bị treo lơ lửng gây rò rỉ bộ nhớ.

Ví dụ điển hình nhất chính là `PrismaService` trong dự án — bắt buộc dùng Lifecycle Hooks để đảm bảo cổng kết nối Database luôn được bật và tắt đúng lúc:

```typescript
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

`PrismaService` vừa kế thừa `PrismaClient` (có được tất cả các phương thức query database), vừa implement hai interface `OnModuleInit` và `OnModuleDestroy` để móc vào vòng đời của NestJS. Method `onModuleInit()` được gọi tự động ngay sau khi module được tải xong vào bộ nhớ — đây là lúc thích hợp để gọi `$connect()` mở kết nối vì chỉ sau bước này các service mới có thể chạy query. Ngược lại, `onModuleDestroy()` được gọi ngay trước khi server nhận tín hiệu tắt (SIGTERM hoặc SIGINT) — đây là lúc cần gọi `$disconnect()` để đóng toàn bộ các kết nối trong connection pool đúng cách, tránh tình trạng kết nối bị treo lơ lửng gây rò rỉ bộ nhớ.

---


## 4.6. Lỗi thường gặp và Trade-offs (bổ sung)

Trong quá trình phát triển ứng dụng với NestJS, nhóm đã gặp phải một số lỗi phổ biến liên quan đến hệ thống module và Dependency Injection. Việc ghi nhận và phân tích các lỗi này không chỉ giúp tránh lặp lại sai lầm mà còn mang lại hiểu biết sâu hơn về cơ chế hoạt động bên trong của framework.

### 4.6.1. Circular Dependency — Phụ thuộc vòng tròn

Lỗi phụ thuộc vòng tròn xảy ra khi Module A import Module B, đồng thời Module B lại import ngược lại Module A. Khi gặp tình huống này, NestJS không thể xác định thứ tự khởi tạo và sẽ báo lỗi với thông báo tương tự:

```
Nest cannot create the AuthModule instance.
The module at index [1] of the AuthModule "imports" array is undefined.
```

Trong thực tế, lỗi này dễ xuất hiện khi `AuthModule` cần sử dụng `UserService` để tìm kiếm thông tin người dùng khi đăng nhập, trong khi `UserModule` cũng cần `AuthService` để kiểm tra quyền truy cập. Nếu hai module import lẫn nhau, hệ thống sẽ rơi vào vòng lặp phụ thuộc và không thể khởi động.

NestJS cung cấp giải pháp tạm thời thông qua hàm `forwardRef()`, cho phép tham chiếu trước đến module chưa được khởi tạo:

```typescript
// auth.module.ts
imports: [forwardRef(() => UserModule)]

// auth.service.ts
constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) {}
```

Tuy nhiên, giải pháp tốt hơn về lâu dài là tái cấu trúc thiết kế module để loại bỏ hoàn toàn phụ thuộc vòng tròn, bởi đây thường là dấu hiệu cho thấy việc phân tách trách nhiệm giữa các module chưa hợp lý.

### 4.6.2. Provider không được inject vì quên khai báo

Một lỗi phổ biến khác là khi inject một service vào module nhưng quên thực hiện đầy đủ các bước khai báo cần thiết. Ví dụ, khi inject `MailService` vào `AuthService` mà `MailModule` chưa được import vào `AuthModule`, NestJS sẽ báo lỗi:

```
Nest can't resolve dependencies of the AuthService (?).
Please make sure that the argument MailService at index [2] is available in the AuthModule context.
```

Để khắc phục, cần đảm bảo ba điều kiện được thỏa mãn đồng thời: thứ nhất, `MailService` phải được đánh dấu bằng decorator `@Injectable()`; thứ hai, `MailModule` phải khai báo `MailService` trong mảng `exports`; và thứ ba, `AuthModule` phải import `MailModule` trong mảng `imports`. Thiếu bất kỳ điều kiện nào cũng sẽ dẫn đến lỗi dependency resolution.

### 4.6.3. Trade-off: Provider Scope — Singleton vs Request vs Transient

Theo mặc định, tất cả Provider trong NestJS hoạt động ở chế độ Singleton, tức là chỉ được tạo một lần duy nhất và được tái sử dụng cho mọi request. Đây là lựa chọn tối ưu cho phần lớn các trường hợp sử dụng.

Tuy nhiên, NestJS cũng hỗ trợ hai scope khác cho những tình huống đặc biệt. Scope `REQUEST` tạo instance mới cho mỗi HTTP request, phù hợp khi cần dữ liệu riêng biệt cho từng request chẳng hạn như trong hệ thống multi-tenant cần cách ly dữ liệu giữa các tenant. Scope `TRANSIENT` tạo instance mới mỗi lần inject, dùng cho các stateful providers cần giữ trạng thái riêng.

Cần lưu ý rằng việc sử dụng `REQUEST` scope sẽ làm giảm hiệu năng một cách đáng kể do phải tạo instance mới cho mỗi request đến. Vì vậy, chỉ nên áp dụng scope này khi có nhu cầu thực sự rõ ràng — trong phần lớn trường hợp (khoảng 99%), Singleton scope mặc định là lựa chọn phù hợp nhất.

Nắm vững cả lý thuyết lẫn các lỗi thường gặp, chúng ta đã sẵn sàng thực hành xây dựng một module hoàn chỉnh trong phần bài tập ứng dụng tiếp theo.

---

## 4.7. Tổng kết

Chương này đã trình bày các khái niệm nền tảng tạo nên kiến trúc của NestJS. Hành trình bắt đầu từ TypeScript — ngôn ngữ cung cấp hệ thống kiểu dữ liệu mạnh mẽ, Decorators, và Generics làm nền tảng cho toàn bộ framework. Tiếp theo, chúng ta đã tìm hiểu cách Modules tổ chức ứng dụng thành các khối chức năng độc lập, cách Controllers đóng vai trò tiếp nhận và phân phối HTTP requests, và cách Providers (đặc biệt là Services) chứa business logic thực sự của ứng dụng.

Điểm then chốt kết nối tất cả các thành phần lại với nhau là Dependency Injection — cơ chế cho phép NestJS tự động quản lý việc tạo và inject các dependencies, giúp code loosely coupled, dễ test, và dễ bảo trì. Tất cả các ví dụ trong chương đều sử dụng module Task từ dự án TodoList Collaboration, giúp người đọc thấy được cách các khái niệm này phối hợp với nhau trong một ứng dụng thực tế.

Với nền tảng kiến thức này, chương tiếp theo sẽ đi sâu vào cách làm việc với database thông qua Prisma ORM — công cụ giúp TaskService tương tác với dữ liệu một cách type-safe và hiệu quả.
