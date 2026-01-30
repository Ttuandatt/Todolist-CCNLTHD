# CHƯƠNG 4: KIẾN TRÚC NESTJS VÀ CÁC KHÁI NIỆM CỐT LÕI

NestJS là một framework Node.js hiện đại được xây dựng hoàn toàn bằng TypeScript, lấy cảm hứng từ Angular với kiến trúc module hóa rõ ràng. Chương này sẽ trình bày chi tiết các khái niệm nền tảng của NestJS, từ ngôn ngữ TypeScript cho đến các thành phần cốt lõi như Modules, Controllers, Services và Dependency Injection. Mỗi khái niệm sẽ được giải thích kèm theo ví dụ minh họa cụ thể từ dự án TodoList Collaboration.

---

## 4.1 TypeScript - Nền tảng ngôn ngữ

### 4.1.1 TypeScript là gì?

TypeScript là ngôn ngữ lập trình mã nguồn mở được phát triển bởi Microsoft. Về bản chất, TypeScript là một "superset" của JavaScript, nghĩa là mọi đoạn code JavaScript hợp lệ đều là code TypeScript hợp lệ. Điểm khác biệt quan trọng nhất của TypeScript so với JavaScript nằm ở hệ thống kiểu dữ liệu tĩnh (static typing).

Trong JavaScript thuần, biến có thể thay đổi kiểu dữ liệu tùy ý trong quá trình chạy chương trình, điều này tuy linh hoạt nhưng dễ gây ra lỗi khó phát hiện. TypeScript giải quyết vấn đề này bằng cách yêu cầu khai báo kiểu dữ liệu ngay từ lúc viết code. Trình biên dịch TypeScript sẽ kiểm tra và báo lỗi nếu phát hiện sự không tương thích về kiểu, giúp lập trình viên phát hiện lỗi sớm trước khi chương trình được chạy.

NestJS được viết hoàn toàn bằng TypeScript và tận dụng triệt để các tính năng nâng cao của ngôn ngữ này như Decorators, Generics và Interfaces. Do đó, việc nắm vững TypeScript là điều kiện tiên quyết để làm việc hiệu quả với NestJS.

### 4.1.2 Hệ thống kiểu dữ liệu cơ bản

TypeScript cung cấp một hệ thống kiểu phong phú bao gồm các kiểu dữ liệu nguyên thủy (primitive types) và các kiểu dữ liệu phức hợp. Các kiểu nguyên thủy cơ bản gồm có `string` cho chuỗi ký tự, `number` cho số (bao gồm cả số nguyên và số thực), và `boolean` cho giá trị logic đúng/sai.

Trong dự án TodoList, chúng ta sử dụng các kiểu dữ liệu này để định nghĩa thuộc tính của các entity. Ví dụ, một Task sẽ có `title` là kiểu `string`, `isCompleted` là kiểu `boolean`, và `priority` là kiểu số nguyên. Việc khai báo kiểu rõ ràng giúp IDE có thể gợi ý code chính xác và phát hiện lỗi ngay khi lập trình viên nhập sai.

```typescript
// Khai báo biến với kiểu dữ liệu
const taskTitle: string = "Hoàn thành báo cáo";
const priority: number = 1;
const isCompleted: boolean = false;

// Khai báo mảng
const tags: string[] = ["urgent", "important", "review"];
```

Đối với các cấu trúc dữ liệu phức tạp hơn như object, TypeScript sử dụng Interface hoặc Type để định nghĩa hình dạng (shape) của dữ liệu. Điều này đảm bảo rằng mọi object thuộc một kiểu nhất định đều phải có đầy đủ các thuộc tính được yêu cầu.

### 4.1.3 Interface và Type Alias

Interface và Type Alias là hai cách để định nghĩa kiểu dữ liệu tùy chỉnh trong TypeScript. Mặc dù có nhiều điểm tương đồng, chúng được sử dụng trong các ngữ cảnh khác nhau.

Interface thường được dùng để mô tả hình dạng của object hoặc để định nghĩa contract cho các class. Interface có khả năng mở rộng (extend) và hợp nhất (merge), phù hợp cho việc định nghĩa các entity trong ứng dụng.

```typescript
// Định nghĩa Interface cho User
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Interface cho Task với các thuộc tính bắt buộc và tùy chọn
interface Task {
  id: string;
  title: string;
  description?: string;  // Dấu ? nghĩa là thuộc tính tùy chọn
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
}
```

Type Alias được sử dụng để đặt tên cho các kiểu phức tạp, đặc biệt là Union Types (kiểu hợp) và Intersection Types (kiểu giao). Trong dự án, chúng ta sử dụng Type Alias để định nghĩa các trạng thái của Task.

```typescript
// Union Type cho trạng thái Task
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

// Union Type cho độ ưu tiên
type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
```

Việc sử dụng Union Type thay vì string thông thường mang lại lợi ích lớn: trình biên dịch sẽ báo lỗi nếu lập trình viên gán một giá trị không nằm trong danh sách cho phép, giúp ngăn ngừa các lỗi do nhập sai giá trị.

### 4.1.4 Decorators

Decorator là một tính năng đặc biệt của TypeScript cho phép thêm metadata hoặc thay đổi hành vi của class, method, property hoặc parameter. Trong NestJS, Decorators đóng vai trò then chốt, được sử dụng rộng rãi để định nghĩa Controllers, Services, và các thiết lập khác.

Về mặt cú pháp, Decorator được viết với ký hiệu `@` theo sau là tên decorator. Decorator thực chất là một hàm nhận tham số và có thể thực hiện các thao tác trên đối tượng được decorate.

```typescript
// Class Decorator - đánh dấu một class là Controller
@Controller('tasks')
export class TaskController {
  
  // Method Decorator - định nghĩa HTTP method và route
  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }
}
```

Trong ví dụ trên, `@Controller('tasks')` là một Class Decorator đánh dấu class `TaskController` là một controller xử lý các request đến route `/tasks`. Các decorator `@Get()` và `@Post()` là Method Decorators định nghĩa HTTP method cho từng phương thức. Decorator `@Body()` là Parameter Decorator dùng để lấy dữ liệu từ request body.

### 4.1.5 Generics

Generics là một tính năng mạnh mẽ cho phép viết code linh hoạt và có thể tái sử dụng cho nhiều kiểu dữ liệu khác nhau. Thay vì viết nhiều hàm riêng biệt cho từng kiểu, chúng ta có thể viết một hàm generic hoạt động với bất kỳ kiểu nào được truyền vào.

Trong NestJS và Prisma, Generics được sử dụng thường xuyên. Ví dụ, khi tạo một hàm tìm kiếm entity theo ID, chúng ta có thể viết hàm generic để sử dụng lại cho User, Task, Project, v.v.

```typescript
// Hàm generic tìm entity theo ID
async function findById<T>(id: string): Promise<T | null> {
  // Logic tìm kiếm...
}

// Sử dụng với các kiểu khác nhau
const user = await findById<User>('user-123');
const task = await findById<Task>('task-456');
```

Cú pháp `<T>` định nghĩa một type parameter có tên là T. Khi gọi hàm, chúng ta truyền kiểu cụ thể (User, Task) vào vị trí của T. Trình biên dịch sẽ tự động suy luận kiểu trả về dựa trên type parameter được truyền vào.

---

## 4.2 Modules - Đơn vị tổ chức code

### 4.2.1 Module là gì?

Trong NestJS, Module là đơn vị cơ bản để tổ chức ứng dụng. Mỗi Module đóng gói một nhóm các thành phần có liên quan với nhau, bao gồm Controllers, Services, và các Providers khác. Cách tổ chức này tuân theo nguyên tắc "Separation of Concerns" (Phân tách mối quan tâm), giúp code dễ quản lý, bảo trì và kiểm thử.

Một ứng dụng NestJS luôn có ít nhất một Module gốc (root module), thường được đặt tên là `AppModule`. Module gốc này import các Module con khác để tạo thành cây dependencies hoàn chỉnh.

```
                ┌─────────────────────────────────────────┐
                │              AppModule                  │
                │  (Module gốc của ứng dụng)              │
                └─────────────────────────────────────────┘
                        │              │              │
            ┌───────────┘              │              └───────────┐
            ▼                          ▼                          ▼
    ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
    │  AuthModule  │          │  TaskModule  │          │ WorkspaceModule│
    ├──────────────┤          ├──────────────┤          ├──────────────┤
    │ Controller   │          │ Controller   │          │ Controller   │
    │ Service      │          │ Service      │          │ Service      │
    └──────────────┘          └──────────────┘          └──────────────┘
```

Trong sơ đồ trên, `AppModule` import ba Module con là `AuthModule`, `TaskModule`, và `WorkspaceModule`. Mỗi Module con chứa Controller và Service riêng, đảm nhiệm một phần chức năng cụ thể của ứng dụng.

### 4.2.2 Cấu trúc của @Module decorator

Để định nghĩa một Module trong NestJS, chúng ta sử dụng decorator `@Module()` với một object cấu hình chứa bốn thuộc tính chính:

```typescript
@Module({
  imports: [PrismaModule, JwtModule],    // Các Module được import
  controllers: [AuthController],          // Các Controller của Module
  providers: [AuthService, JwtStrategy],  // Các Provider/Service
  exports: [AuthService],                 // Các Provider cho phép Module khác sử dụng
})
export class AuthModule {}
```

Thuộc tính `imports` liệt kê các Module mà Module hiện tại phụ thuộc vào. Trong ví dụ trên, `AuthModule` cần sử dụng `PrismaModule` để truy cập database và `JwtModule` để xử lý JSON Web Token.

Thuộc tính `controllers` khai báo các Controller thuộc về Module này. Controller là nơi xử lý các HTTP request đến.

Thuộc tính `providers` khai báo các Provider, thường là các Service chứa business logic. Các Provider này sẽ được NestJS quản lý và inject vào nơi cần sử dụng.

Thuộc tính `exports` chỉ định những Provider nào được phép sử dụng bởi các Module khác. Nếu không export, Provider chỉ có thể sử dụng nội bộ trong Module.

### 4.2.3 Các loại Module

Trong một ứng dụng NestJS thực tế, chúng ta thường phân loại Module thành bốn nhóm chính dựa trên mục đích sử dụng.

#### Feature Module

Feature Module là các Module chứa logic cho một tính năng cụ thể của ứng dụng. Trong dự án TodoList, các Feature Module bao gồm `AuthModule` (xác thực), `TaskModule` (quản lý công việc), `WorkspaceModule` (quản lý không gian làm việc), và `ProjectModule` (quản lý dự án). Mỗi Feature Module hoạt động độc lập và chỉ tập trung vào một domain cụ thể.

```typescript
// task/task.module.ts - Feature Module cho quản lý Task
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export để WorkspaceModule có thể sử dụng
})
export class TaskModule {}
```

```typescript
// auth/auth.module.ts - Feature Module cho Authentication
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // Export để các module khác sử dụng
})
export class AuthModule {}
```

#### Shared Module

Shared Module là các Module cung cấp các service dùng chung cho toàn bộ ứng dụng. Ví dụ điển hình là `PrismaModule` cung cấp kết nối database cho tất cả các Module khác. Shared Module thường được đánh dấu là `@Global()` để không cần import lặp đi lặp lại ở mọi nơi.

```typescript
// prisma/prisma.module.ts - Shared Module cho Database
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Đánh dấu Global để mọi module đều có thể inject PrismaService
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```typescript
// prisma/prisma.service.ts - Service kết nối database
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Kết nối database khi module khởi tạo
    await this.$connect();
  }

  async onModuleDestroy() {
    // Đóng kết nối khi module bị hủy
    await this.$disconnect();
  }
}
```

Một ví dụ khác của Shared Module là `MailModule` cung cấp service gửi email:

```typescript
// mail/mail.module.ts - Shared Module cho Email
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

#### Core Module (Root Module)

Core Module thường chỉ có một trong ứng dụng, đó là `AppModule`. Module này đóng vai trò là điểm khởi đầu, nơi tập hợp và khởi tạo tất cả các Module khác. AppModule import tất cả Feature Modules và Shared Modules cần thiết.

```typescript
// app.module.ts - Core Module (Root Module)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    // Configuration - load đầu tiên
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Shared Modules
    PrismaModule,
    
    // Feature Modules
    AuthModule,
    UserModule,
    WorkspaceModule,
    ProjectModule,
    TaskModule,
  ],
})
export class AppModule {}
```

#### Dynamic Module

Dynamic Module là các Module có thể được cấu hình khác nhau tùy theo nơi import. Thay vì hard-code cấu hình, Dynamic Module cho phép truyền options khi import thông qua các static methods như `forRoot()`, `forRootAsync()`, hoặc `register()`.

```typescript
// Ví dụ sử dụng Dynamic Module có sẵn
@Module({
  imports: [
    // ConfigModule với forRoot() - cấu hình global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // JwtModule với register() - cấu hình cục bộ
    JwtModule.register({
      secret: 'my-secret',
      signOptions: { expiresIn: '1h' },
    }),
    
    // TypeOrmModule với forRootAsync() - cấu hình async
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

Chúng ta cũng có thể tự tạo Dynamic Module cho ứng dụng:

```typescript
// notification/notification.module.ts - Custom Dynamic Module
import { DynamicModule, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

export interface NotificationModuleOptions {
  provider: 'firebase' | 'onesignal' | 'sns';
  apiKey: string;
}

@Module({})
export class NotificationModule {
  static forRoot(options: NotificationModuleOptions): DynamicModule {
    return {
      module: NotificationModule,
      providers: [
        {
          provide: 'NOTIFICATION_OPTIONS',
          useValue: options,
        },
        NotificationService,
      ],
      exports: [NotificationService],
      global: true,
    };
  }
}

// Sử dụng trong AppModule
@Module({
  imports: [
    NotificationModule.forRoot({
      provider: 'firebase',
      apiKey: process.env.FIREBASE_API_KEY,
    }),
  ],
})
export class AppModule {}
```

Bảng so sánh các loại Module:

| Loại Module | Mục đích | Ví dụ | Đặc điểm |
|-------------|----------|-------|----------|
| Feature Module | Logic cho một tính năng cụ thể | TaskModule, AuthModule | Độc lập, focused, có thể export |
| Shared Module | Service dùng chung | PrismaModule, MailModule | Thường là @Global() |
| Core Module | Module gốc | AppModule | Chỉ có một, import tất cả |
| Dynamic Module | Cấu hình linh hoạt | ConfigModule, JwtModule | Sử dụng forRoot(), register() |

#### Lợi ích của việc phân chia Module

Việc tổ chức ứng dụng theo kiến trúc module hóa mang lại nhiều lợi ích thiết thực trong quá trình phát triển và bảo trì phần mềm. Để hiểu rõ hơn, chúng ta hãy xem xét một tình huống thực tế: giả sử dự án TodoList đã phát triển đến hàng chục nghìn dòng code với nhiều tính năng phức tạp. Nếu toàn bộ code được đặt trong một file hoặc một thư mục lớn, việc tìm kiếm và sửa đổi sẽ trở thành cơn ác mộng.

Lợi ích đầu tiên và quan trọng nhất của module hóa là nguyên tắc Separation of Concerns (Phân tách mối quan tâm). Khi mỗi module chỉ tập trung vào một domain hoặc tính năng cụ thể, code trở nên dễ hiểu hơn đáng kể. AuthModule chỉ xử lý các vấn đề liên quan đến xác thực, TaskModule chỉ quản lý công việc, và WorkspaceModule chỉ phụ trách không gian làm việc. Nhờ đó, khi một lập trình viên mới tham gia dự án, họ có thể nhanh chóng nắm bắt cấu trúc và bắt đầu đóng góp mà không cần phải hiểu toàn bộ hệ thống.

Từ việc phân tách mối quan tâm, chúng ta tự nhiên đạt được tính tái sử dụng code. Các Shared Module như PrismaModule hay MailModule được viết một lần nhưng có thể sử dụng ở mọi nơi trong ứng dụng. Hơn nữa, trong các dự án lớn hơn, những module này thậm chí có thể được đóng gói thành các package riêng biệt, cho phép tái sử dụng ở nhiều project khác nhau. Điều này không chỉ tiết kiệm thời gian mà còn đảm bảo tính nhất quán trong toàn bộ hệ sinh thái phần mềm của tổ chức.

Một lợi ích quan trọng khác, đặc biệt trong môi trường phát triển chuyên nghiệp, là khả năng kiểm thử dễ dàng. Khi các module được tách biệt rõ ràng với các dependencies được inject từ bên ngoài, việc viết unit test trở nên đơn giản. Chúng ta có thể test từng module một cách độc lập bằng cách thay thế các dependencies thật bằng mock objects. Ví dụ, khi test TaskService, chúng ta không cần kết nối database thật mà chỉ cần mock PrismaService để trả về dữ liệu giả định.

Trong bối cảnh làm việc nhóm, kiến trúc module hóa còn mang lại hiệu quả đáng kể. Các thành viên trong team có thể làm việc song song trên các module khác nhau mà ít xảy ra xung đột code. Trong khi một developer đang phát triển hệ thống thông báo trong NotificationModule, người khác hoàn toàn có thể tập trung vào TaskModule mà không lo ngại việc thay đổi của họ sẽ ảnh hưởng lẫn nhau. Điều này đặc biệt quan trọng trong các dự án có quy mô lớn với nhiều thành viên.

Về khía cạnh bảo trì và mở rộng, module hóa cung cấp một con đường rõ ràng để phát triển ứng dụng theo thời gian. Khi cần thêm một tính năng mới như tích hợp lịch (Calendar), chúng ta chỉ việc tạo CalendarModule mới và import vào AppModule mà không cần sửa đổi các phần code đã hoạt động ổn định. Ngược lại, khi cần sửa lỗi, việc xác định module nào chứa logic bị lỗi cũng trở nên dễ dàng hơn nhiều.

Cuối cùng, đối với các ứng dụng có quy mô lớn, NestJS còn hỗ trợ lazy loading modules, tức là chỉ load module khi thực sự cần thiết. Điều này giúp cải thiện đáng kể thời gian khởi động ứng dụng và tối ưu hóa việc sử dụng tài nguyên hệ thống.

Tóm lại, kiến trúc module hóa không đơn thuần là một quy ước kỹ thuật của NestJS, mà là một triết lý thiết kế phần mềm đã được chứng minh hiệu quả qua nhiều thập kỷ. Việc áp dụng đúng cách kiến trúc này sẽ giúp xây dựng những ứng dụng có cấu trúc rõ ràng, dễ bảo trì, dễ mở rộng, và quan trọng nhất là dễ hiểu cho cả team phát triển hiện tại lẫn những người sẽ tiếp quản dự án trong tương lai.

---


## 4.3 Controllers - Xử lý HTTP Requests

### 4.3.1 Controller là gì?

Controller trong NestJS đảm nhiệm vai trò tiếp nhận các HTTP request từ client, xử lý request đó (thường bằng cách gọi đến Service), và trả về response. Controller là lớp giao tiếp giữa client và business logic của ứng dụng.

Một Controller được định nghĩa bằng decorator `@Controller()` với tham số là đường dẫn route. Ví dụ, `@Controller('tasks')` có nghĩa là Controller này sẽ xử lý tất cả các request đến đường dẫn `/tasks`.

```
           HTTP Request                          HTTP Response
               │                                       ▲
               ▼                                       │
        ┌──────────────┐                        ┌──────────────┐
        │  Controller  │───────Business Logic───▶│   Service    │
        │  (Nhận request,│                       │  (Xử lý logic,│
        │  trả response) │◀───────Result─────────│  truy vấn DB) │
        └──────────────┘                        └──────────────┘
```

Điều quan trọng cần lưu ý là Controller không nên chứa business logic phức tạp. Vai trò của Controller chỉ là nhận request, gọi Service tương ứng, và trả về kết quả. Business logic nên được đặt trong Service để đảm bảo tính tái sử dụng và dễ kiểm thử.

### 4.3.2 HTTP Method Decorators

NestJS cung cấp các decorator tương ứng với từng HTTP method theo chuẩn RESTful. Các decorator này được đặt trước mỗi method trong Controller để xác định loại request mà method đó xử lý.

```typescript
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // GET /tasks - Lấy danh sách tất cả tasks
  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  // GET /tasks/:id - Lấy một task theo ID
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  // POST /tasks - Tạo task mới
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  // PATCH /tasks/:id - Cập nhật một phần task
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  // DELETE /tasks/:id - Xóa task
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id);
  }
}
```

Trong ví dụ trên, chúng ta thấy một Controller hoàn chỉnh với các thao tác CRUD (Create, Read, Update, Delete). Decorator `@Get()` không có tham số sẽ xử lý request đến route gốc `/tasks`. Decorator `@Get(':id')` với tham số `:id` sẽ xử lý request đến route động như `/tasks/123`, trong đó `123` là giá trị của tham số `id`.

### 4.3.3 Request Data Decorators

Để lấy dữ liệu từ HTTP request, NestJS cung cấp một bộ Parameter Decorators. Mỗi decorator tương ứng với một nguồn dữ liệu khác nhau trong request.

Decorator `@Body()` được sử dụng để lấy dữ liệu từ request body. Đây là nơi client gửi dữ liệu khi tạo mới hoặc cập nhật resource, thường ở định dạng JSON.

Decorator `@Param()` dùng để lấy giá trị từ URL parameters. Trong route `/tasks/:id`, chúng ta sử dụng `@Param('id')` để lấy giá trị của tham số `id`.

Decorator `@Query()` lấy giá trị từ query string. Ví dụ, với URL `/tasks?status=TODO&priority=HIGH`, chúng ta có thể lấy các giá trị filter bằng cách sử dụng `@Query('status')` và `@Query('priority')`.

```typescript
@Get()
findAll(
  @Query('status') status?: TaskStatus,
  @Query('priority') priority?: TaskPriority,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
): Promise<Task[]> {
  return this.taskService.findAll({ status, priority, page, limit });
}
```

Decorator `@Headers()` cho phép truy cập HTTP headers của request. Điều này hữu ích khi cần đọc thông tin như Authorization token hoặc Content-Type.

---

## 4.4 Providers và Services - Business Logic

### 4.4.1 Provider là gì?

Trong NestJS, Provider là một khái niệm cơ bản chỉ bất kỳ class nào có thể được inject như một dependency. Providers có thể là Services, Repositories, Factories, Helpers, hoặc bất kỳ class nào khác mà bạn muốn NestJS quản lý vòng đời và xử lý dependency injection.

Service là loại Provider phổ biến nhất, thường chứa business logic của ứng dụng. Trong kiến trúc của NestJS, Controller không nên xử lý logic phức tạp mà chỉ đóng vai trò "người điều phối", chuyển tiếp request đến Service tương ứng.

### 4.4.2 @Injectable Decorator

Để một class trở thành Provider có thể inject được, chúng ta sử dụng decorator `@Injectable()`. Decorator này báo cho NestJS biết rằng class có thể được quản lý bởi IoC Container và có thể nhận các dependencies khác thông qua constructor.

```typescript
@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Kiểm tra project tồn tại
    const project = await this.prisma.project.findUnique({
      where: { id: createTaskDto.projectId },
    });
    
    if (!project) {
      throw new NotFoundException('Project không tồn tại');
    }

    // Tạo task mới
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: 'TODO',
        priority: createTaskDto.priority || 'NORMAL',
        projectId: createTaskDto.projectId,
      },
    });
  }

  async findAll(filters: TaskFilterDto): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        status: filters.status,
        priority: filters.priority,
      },
      orderBy: { createdAt: 'desc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true, comments: true },
    });

    if (!task) {
      throw new NotFoundException(`Task với ID ${id} không tồn tại`);
    }

    return task;
  }
}
```

Trong ví dụ trên, `TaskService` được đánh dấu bằng `@Injectable()` và nhận `PrismaService` thông qua constructor. NestJS sẽ tự động tạo instance của `PrismaService` và truyền vào khi khởi tạo `TaskService`.

Service chứa toàn bộ logic nghiệp vụ: kiểm tra dữ liệu, truy vấn database, xử lý lỗi, và trả về kết quả. Cách tổ chức này giúp code dễ kiểm thử hơn vì chúng ta có thể mock PrismaService khi viết unit test.

---

## 4.5 Dependency Injection

### 4.5.1 Dependency Injection là gì?

Dependency Injection (DI) là một design pattern quan trọng trong lập trình hướng đối tượng, đặc biệt phổ biến trong các framework hiện đại. Ý tưởng cốt lõi của DI là: thay vì một class tự tạo các dependencies của mình, những dependencies đó sẽ được "inject" (tiêm) từ bên ngoài vào.

Để hiểu rõ hơn, hãy so sánh hai cách tiếp cận. Trong cách tiếp cận truyền thống không sử dụng DI:

```typescript
// KHÔNG sử dụng DI - class tự tạo dependency
class TaskController {
  private taskService: TaskService;
  
  constructor() {
    // Controller tự tạo instance của Service
    this.taskService = new TaskService(new PrismaService());
  }
}
```

Với cách tiếp cận này, `TaskController` phải biết cách tạo `TaskService`, và `TaskService` cũng phải biết cách tạo `PrismaService`. Điều này tạo ra sự phụ thuộc chặt chẽ (tight coupling) giữa các class, khiến việc thay đổi hoặc kiểm thử trở nên khó khăn.

Khi sử dụng Dependency Injection trong NestJS:

```typescript
// SỬ DỤNG DI - dependency được inject từ bên ngoài
@Controller('tasks')
class TaskController {
  // NestJS tự động inject TaskService
  constructor(private readonly taskService: TaskService) {}
}
```

Với DI, `TaskController` chỉ cần khai báo rằng nó cần một `TaskService`, không cần biết cách tạo service đó. NestJS IoC Container sẽ đảm nhiệm việc tạo instance và inject vào đúng chỗ.

### 4.5.2 Cách hoạt động của DI trong NestJS

NestJS sử dụng một IoC (Inversion of Control) Container để quản lý việc tạo và inject dependencies. Khi ứng dụng khởi động, NestJS quét tất cả các Module và xây dựng một "dependency graph" (đồ thị phụ thuộc), xác định class nào cần class nào.

Khi một Controller hoặc Service cần được tạo, NestJS kiểm tra constructor của class đó để biết những dependencies nào cần thiết. Container sau đó tìm kiếm các dependencies đã được đăng ký, tạo instance nếu chưa có, và inject vào constructor.

### 4.5.3 Lợi ích của Dependency Injection

Dependency Injection mang lại nhiều lợi ích quan trọng cho việc phát triển phần mềm, và việc hiểu rõ những lợi ích này sẽ giúp chúng ta áp dụng pattern một cách hiệu quả hơn.

Lợi ích đầu tiên và dễ nhận thấy nhất là việc giảm thiểu sự phụ thuộc chặt chẽ giữa các thành phần (loose coupling). Khi các class không trực tiếp tạo ra dependencies của mình mà chỉ khai báo những gì chúng cần, việc thay đổi implementation trở nên dễ dàng hơn rất nhiều. Ví dụ, nếu ban đầu TaskService sử dụng PrismaService để kết nối PostgreSQL, nhưng sau đó team quyết định chuyển sang MongoDB, chúng ta chỉ cần tạo một MongoService mới với cùng interface và thay đổi cấu hình inject mà không cần sửa đổi code của TaskService.

Từ đặc tính loose coupling này, một lợi ích quan trọng khác tự nhiên nảy sinh: khả năng kiểm thử dễ dàng. Trong quá trình viết unit test, chúng ta thường không muốn test kết nối database thật vì điều đó làm test chậm và không ổn định. Nhờ DI, chúng ta có thể dễ dàng thay thế PrismaService thật bằng một mock service trả về dữ liệu giả định. Test trở nên nhanh, đáng tin cậy, và tập trung vào logic cần test.

Cuối cùng, việc quản lý dependencies một cách tập trung giúp cả codebase trở nên dễ bảo trì hơn. Mỗi class chỉ có một trách nhiệm duy nhất và không phải lo lắng về việc khởi tạo các dependencies. Khi cần thay đổi cách một service được tạo ra hoặc cấu hình, chúng ta chỉ cần sửa đổi ở một nơi duy nhất là trong phần khai báo Module, thay vì phải tìm và sửa ở khắp nơi trong codebase. Điều này đặc biệt có giá trị trong các dự án lớn với nhiều thành viên tham gia phát triển.

---

## 4.6 DTOs và Validation

### 4.6.1 DTO là gì?

DTO (Data Transfer Object) là một pattern được sử dụng để định nghĩa cấu trúc dữ liệu được truyền giữa các tầng của ứng dụng, đặc biệt là giữa client và server. Trong NestJS, DTO thường được sử dụng để định nghĩa shape của request body và đảm bảo rằng dữ liệu đầu vào đáp ứng các yêu cầu nhất định.

Sử dụng DTO mang lại nhiều lợi ích: type-safety được đảm bảo bởi TypeScript, validation tự động với class-validator, và documentation rõ ràng về dữ liệu mong đợi.

### 4.6.2 Class-validator Decorators

NestJS tích hợp thư viện `class-validator` để thực hiện validation dữ liệu. Thư viện này cung cấp nhiều decorator để kiểm tra các điều kiện khác nhau trên các thuộc tính của DTO.

```typescript
import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ không được để trống' })
  firstName: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  lastName: string;
}

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority, { message: 'Độ ưu tiên không hợp lệ' })
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID('4', { message: 'Project ID không hợp lệ' })
  projectId: string;
}
```

Trong ví dụ trên, `RegisterDto` yêu cầu email phải đúng định dạng email, password phải có ít nhất 6 ký tự, và các trường firstName, lastName không được để trống. `CreateTaskDto` có trường description và priority là tùy chọn (optional), trong khi title và projectId là bắt buộc.

### 4.6.3 ValidationPipe

Để kích hoạt validation tự động cho tất cả các request, NestJS sử dụng `ValidationPipe`. Pipe này sẽ tự động validate request body dựa trên các decorator trong DTO và trả về lỗi 400 Bad Request nếu validation thất bại.

```typescript
// main.ts - Cấu hình ValidationPipe global
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Loại bỏ các thuộc tính không định nghĩa trong DTO
    forbidNonWhitelisted: true,  // Báo lỗi nếu có thuộc tính lạ
    transform: true,        // Tự động chuyển đổi kiểu dữ liệu
  }));
  
  await app.listen(3333);
}
```

Khi một request vi phạm validation rules, NestJS tự động trả về response lỗi với thông tin chi tiết về các trường không hợp lệ, giúp client biết được chính xác vấn đề cần sửa.

---

## 4.7 Pipes, Guards và Interceptors

### 4.7.1 Pipes - Biến đổi và Validate dữ liệu

Pipes trong NestJS là các class có khả năng biến đổi (transform) hoặc validate dữ liệu đầu vào trước khi nó đến handler method trong Controller. NestJS cung cấp một số built-in pipes hữu ích.

`ParseIntPipe` và `ParseUUIDPipe` được sử dụng để chuyển đổi và validate các tham số URL. Khi một route parameter cần phải là số nguyên hoặc UUID hợp lệ, việc sử dụng các pipes này sẽ tự động xử lý validation và trả về lỗi 400 nếu giá trị không hợp lệ.

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
  return this.taskService.findOne(id);
}
```

### 4.7.2 Guards - Kiểm soát truy cập

Guards là một thành phần quan trọng trong NestJS, đảm nhiệm việc quyết định xem một request có được phép tiếp tục xử lý hay không. Guards thường được sử dụng để implement authentication (xác thực) và authorization (phân quyền).

Trong dự án TodoList, chúng ta sử dụng `JwtAuthGuard` để bảo vệ các route yêu cầu người dùng đã đăng nhập. Guard này kiểm tra xem request có chứa JWT token hợp lệ hay không.

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Thực hiện xác thực JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return user;
  }
}
```

Để áp dụng Guard cho một route hoặc toàn bộ Controller, chúng ta sử dụng decorator `@UseGuards()`:

```typescript
@Controller('tasks')
@UseGuards(JwtAuthGuard)  // Áp dụng cho toàn bộ Controller
export class TaskController {
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.taskService.findAllByUser(user.id);
  }
}
```

### 4.7.3 Request Lifecycle

Hiểu được thứ tự xử lý của các thành phần trong NestJS giúp lập trình viên biết được vị trí phù hợp để đặt logic xử lý. Khi một request đến server, nó sẽ đi qua một chuỗi các bước xử lý được thiết kế cẩn thận.

Đầu tiên, request sẽ đi qua các Middleware. Đây là lớp xử lý ngoài cùng, thường được sử dụng cho các tác vụ chung như logging, parsing request body, hoặc xử lý CORS. Middleware hoạt động tương tự như trong Express.js và có toàn quyền kiểm soát request/response cycle.

Sau khi đi qua middleware, request sẽ gặp các Guards. Đây là cánh cửa bảo vệ quan trọng nhất của ứng dụng, nơi quyết định liệu request có được phép tiếp tục hay không. Nếu token JWT không hợp lệ hoặc user không có quyền truy cập resource, Guard sẽ chặn request ngay tại đây và trả về lỗi 401 hoặc 403.

Nếu Guard cho phép đi qua, request tiếp tục đến các Interceptors. Interceptors có khả năng đặc biệt: chúng có thể can thiệp vào request trước khi đến handler và cũng có thể biến đổi response trước khi trả về client. Ví dụ, một ResponseTransformInterceptor có thể wrap tất cả response trong một format chuẩn như `{ success: true, data: ... }`.

Tiếp theo, Pipes sẽ validate và transform dữ liệu đầu vào. Nếu dữ liệu không đáp ứng các validation rules được định nghĩa trong DTO, Pipe sẽ throw exception và request bị dừng ngay lập tức với lỗi 400 Bad Request.

Chỉ khi vượt qua tất cả các lớp trên, request mới đến được Handler, tức là method được định nghĩa trong Controller. Đây là nơi logic chính được thực thi, thường là gọi đến Service để xử lý business logic.

Cuối cùng, sau khi handler trả về kết quả, response sẽ đi ngược lại qua các Interceptors (phần "after"), cho phép thực hiện các xử lý cuối cùng như logging response time hay transform data format.

Điểm quan trọng cần nhớ là nếu bất kỳ bước nào trong chuỗi này thất bại, request sẽ bị dừng ngay lập tức và exception sẽ được propagate ra ngoài, kích hoạt Exception Filter để trả về response lỗi phù hợp. Việc hiểu rõ luồng xử lý này giúp lập trình viên biết chính xác nên đặt logic ở đâu trong ứng dụng.

---

## 4.8 Demo: Xây dựng Auth Module hoàn chỉnh

Trong phần này, chúng ta sẽ áp dụng tất cả các kiến thức đã học để xây dựng một Module Authentication hoàn chỉnh cho dự án TodoList. Module này sẽ cung cấp các chức năng đăng ký tài khoản và đăng nhập với JWT.

### 4.8.1 Cấu trúc thư mục

Auth Module được tổ chức theo cấu trúc thư mục rõ ràng, phân tách từng thành phần theo trách nhiệm:

```
src/auth/
├── auth.module.ts           # Định nghĩa Module
├── auth.controller.ts       # Xử lý HTTP requests
├── auth.service.ts          # Business logic
├── dto/
│   ├── register.dto.ts      # DTO cho đăng ký
│   └── login.dto.ts         # DTO cho đăng nhập
├── guards/
│   └── jwt-auth.guard.ts    # Guard bảo vệ routes
├── strategies/
│   └── jwt.strategy.ts      # JWT validation strategy
└── decorators/
    └── current-user.decorator.ts  # Custom decorator lấy user hiện tại
```

### 4.8.2 Implement DTOs

Bước đầu tiên là định nghĩa các DTO với validation rules phù hợp:

```typescript
// dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'Họ không được để trống' })
  firstName: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  lastName: string;
}

// dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
```

### 4.8.3 Implement Service

AuthService chứa toàn bộ business logic cho việc đăng ký và đăng nhập:

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    // Trả về user (không bao gồm password)
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    // Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
```

### 4.8.4 Implement Controller

Controller định nghĩa các endpoints cho authentication:

```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

### 4.8.5 Kiểm thử với Postman

Sau khi hoàn thành implementation, chúng ta tiến hành kiểm thử các endpoints bằng Postman hoặc bất kỳ API testing tool nào.

Để test chức năng đăng ký, ta gửi một POST request đến `http://localhost:3333/auth/register` với body chứa email, password, firstName và lastName. Nếu thành công, server sẽ trả về status code 201 Created kèm theo thông tin user vừa tạo (không bao gồm password vì lý do bảo mật).

Tiếp theo, để test chức năng đăng nhập, gửi POST request đến `http://localhost:3333/auth/login` với email và password đã đăng ký. Response thành công sẽ có status 200 OK và chứa accessToken cùng thông tin user.

Cuối cùng, để kiểm tra protected route hoạt động đúng, gửi GET request đến `http://localhost:3333/auth/profile` với header `Authorization: Bearer <accessToken>` (thay `<accessToken>` bằng token nhận được từ bước login). Nếu token hợp lệ, server trả về 200 OK với thông tin user hiện tại. Ngược lại, nếu không có token hoặc token không hợp lệ, API sẽ trả về 401 Unauthorized, chứng tỏ JwtAuthGuard đang hoạt động chính xác.

---

## 4.9 Exception Handling - Xử lý lỗi

### 4.9.1 Tầm quan trọng của Exception Handling

Trong quá trình phát triển API, việc xử lý lỗi một cách có hệ thống là vô cùng quan trọng. Một API chất lượng không chỉ cần hoạt động đúng trong trường hợp bình thường mà còn phải xử lý gracefully các tình huống lỗi, trả về thông tin lỗi rõ ràng và có cấu trúc chuẩn để client có thể hiểu và xử lý.

NestJS cung cấp một hệ thống Exception Handling mạnh mẽ với các built-in exceptions và khả năng tùy chỉnh cao. Khi một exception được throw trong ứng dụng, NestJS sẽ tự động catch và chuyển đổi thành HTTP response với status code và message phù hợp.

### 4.9.2 Built-in HTTP Exceptions

NestJS cung cấp sẵn nhiều exception classes tương ứng với các HTTP status codes thông dụng. Việc sử dụng các exception này giúp code dễ đọc hơn và đảm bảo tính nhất quán trong cách trả về lỗi.

```typescript
import {
  BadRequestException,      // 400 - Dữ liệu không hợp lệ
  UnauthorizedException,    // 401 - Chưa xác thực
  ForbiddenException,       // 403 - Không có quyền
  NotFoundException,        // 404 - Không tìm thấy resource
  ConflictException,        // 409 - Xung đột (vd: email đã tồn tại)
  InternalServerErrorException, // 500 - Lỗi server
} from '@nestjs/common';
```

Trong dự án TodoList, các exception được sử dụng phổ biến như sau:

```typescript
@Injectable()
export class TaskService {
  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    // Throw NotFoundException nếu không tìm thấy task
    if (!task) {
      throw new NotFoundException(`Không tìm thấy task với ID: ${id}`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id);

    // Kiểm tra quyền sửa task
    if (task.createdById !== userId && task.assigneeId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa task này');
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }
}
```

Khi một exception được throw, NestJS tự động trả về response có cấu trúc như sau:

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy task với ID: abc123",
  "error": "Not Found"
}
```

### 4.9.3 Custom Exceptions

Trong nhiều trường hợp, chúng ta cần tạo các exception tùy chỉnh để phù hợp với nghiệp vụ cụ thể của ứng dụng. Custom exception giúp code rõ ràng hơn và dễ trace lỗi.

```typescript
// exceptions/business.exception.ts
export class TaskAlreadyCompletedException extends HttpException {
  constructor(taskId: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Task ${taskId} đã hoàn thành, không thể thực hiện thao tác này`,
        error: 'TaskAlreadyCompleted',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WorkspaceLimitExceededException extends HttpException {
  constructor(limit: number) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: `Bạn đã đạt giới hạn ${limit} workspaces. Vui lòng nâng cấp tài khoản.`,
        error: 'WorkspaceLimitExceeded',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
```

Sử dụng trong service:

```typescript
async completeTask(taskId: string): Promise<Task> {
  const task = await this.findOne(taskId);
  
  if (task.status === 'DONE') {
    throw new TaskAlreadyCompletedException(taskId);
  }
  
  return this.prisma.task.update({
    where: { id: taskId },
    data: { status: 'DONE', completedAt: new Date() },
  });
}
```

### 4.9.4 Global Exception Filter

Exception Filter là một lớp đặc biệt trong NestJS cho phép chúng ta can thiệp vào quá trình xử lý exception toàn cục. Filter có thể log lỗi, format response, hoặc thực hiện các xử lý đặc biệt trước khi trả về client.

```typescript
// filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Xác định status code và message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã xảy ra lỗi hệ thống';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      } else {
        message = exceptionResponse as string;
      }
    }

    // Log lỗi để debug
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Trả về response chuẩn hóa
    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

Đăng ký Global Exception Filter trong `main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Đăng ký global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  await app.listen(3333);
}
```

Với Global Exception Filter, mọi lỗi trong ứng dụng sẽ được xử lý thống nhất, có log đầy đủ để debug, và trả về response với format chuẩn cho client.

---

## 4.10 Configuration - Quản lý cấu hình

### 4.10.1 Tại sao cần Configuration Module?

Trong quá trình phát triển phần mềm, ứng dụng thường cần các thông tin cấu hình khác nhau tùy theo môi trường: development, staging, hay production. Các thông tin này bao gồm database connection string, API keys, JWT secret, port number, và nhiều thiết lập khác.

Việc hard-code các giá trị này trực tiếp trong code là một anti-pattern vì nhiều lý do. Thứ nhất, nó gây ra rủi ro bảo mật khi các thông tin nhạy cảm như password hay API key bị commit lên source control. Thứ hai, việc thay đổi cấu hình đòi hỏi phải sửa code và deploy lại ứng dụng. Thứ ba, không thể sử dụng cùng codebase cho nhiều môi trường khác nhau.

NestJS cung cấp `@nestjs/config` module để giải quyết vấn đề này một cách elegant.

### 4.10.2 Cài đặt và cấu hình

Đầu tiên, chúng ta cần cài đặt package `@nestjs/config`:

```bash
npm install @nestjs/config
```

Sau đó, import `ConfigModule` vào `AppModule` và cấu hình để load từ file `.env`:

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           // Cho phép sử dụng ở mọi module
      envFilePath: '.env',      // Đường dẫn file .env
      cache: true,              // Cache giá trị để tăng performance
    }),
    // ... các module khác
  ],
})
export class AppModule {}
```

File `.env` chứa các biến môi trường:

```env
# Database
DATABASE_URL="postgresql://postgres:123@localhost:5433/CCNLTHD_postgres?schema=public"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# App
PORT=3333
NODE_ENV=development

# OAuth (nếu có)
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"
```

### 4.10.3 Sử dụng ConfigService

Để truy cập các giá trị cấu hình trong application, chúng ta inject `ConfigService`:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(userId: string): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');

    return this.jwtService.sign(
      { sub: userId },
      { secret, expiresIn },
    );
  }
}
```

ConfigService cung cấp phương thức `get<T>()` để lấy giá trị với type-safety. Nếu biến không tồn tại, method trả về `undefined` trừ khi chúng ta cung cấp giá trị mặc định:

```typescript
// Lấy PORT, mặc định 3000 nếu không có
const port = this.configService.get<number>('PORT', 3000);

// Lấy NODE_ENV
const isProduction = this.configService.get('NODE_ENV') === 'production';
```

### 4.10.4 Validation Configuration với Joi

Để đảm bảo tất cả các biến môi trường cần thiết đều được cung cấp và có giá trị hợp lệ, chúng ta có thể sử dụng Joi để validate:

```typescript
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3333),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required().min(32),
        JWT_EXPIRATION: Joi.string().default('7d'),
      }),
      validationOptions: {
        abortEarly: true, // Dừng ngay khi gặp lỗi đầu tiên
      },
    }),
  ],
})
export class AppModule {}
```

Với cấu hình này, nếu thiếu `DATABASE_URL` hoặc `JWT_SECRET`, ứng dụng sẽ không khởi động được và báo lỗi rõ ràng, giúp phát hiện vấn đề sớm thay vì gặp lỗi runtime.

### 4.10.5 Best Practices

Khi làm việc với configuration, có một số nguyên tắc quan trọng mà các lập trình viên chuyên nghiệp thường tuân thủ để đảm bảo an toàn và hiệu quả.

Nguyên tắc quan trọng nhất là không bao giờ commit file `.env` chứa thông tin thật lên source control. File này chứa các thông tin nhạy cảm như database password, API keys, và JWT secrets. Nếu vô tình push lên GitHub, những thông tin này có thể bị lộ và gây ra rủi ro bảo mật nghiêm trọng. Thay vào đó, ta nên thêm `.env` vào file `.gitignore` và tạo một file `.env.example` chỉ chứa các key cần thiết mà không có giá trị thật, để các thành viên mới trong team biết cần cấu hình những biến nào.

```env
# .env.example - Template cho team members
DATABASE_URL=
JWT_SECRET=
```

Đối với các ứng dụng có quy mô lớn với nhiều module và nhiều cấu hình, việc đặt tất cả trong một file `.env` duy nhất có thể trở nên cồng kềnh và khó quản lý. Trong trường hợp này, nên tách cấu hình thành các configuration files riêng biệt theo từng domain. Mỗi file sẽ export một hàm trả về object chứa các cấu hình liên quan, giúp code dễ tổ chức và dễ bảo trì hơn.

```typescript
// config/database.config.ts - Cấu hình riêng cho database
export default () => ({
  database: {
    url: process.env.DATABASE_URL,
    logging: process.env.NODE_ENV === 'development',
  },
});

// config/jwt.config.ts - Cấu hình riêng cho JWT
export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
});
```

Ngoài ra, một practice tốt khác là luôn cung cấp giá trị mặc định cho các biến không bắt buộc, nhưng không bao giờ cung cấp giá trị mặc định cho các biến nhạy cảm như JWT_SECRET hay DATABASE_URL. Điều này đảm bảo rằng ứng dụng sẽ fail fast nếu thiếu cấu hình quan trọng, thay vì chạy với giá trị mặc định không an toàn.

---

## 4.11 Logging - Ghi nhật ký hệ thống

### 4.11.1 Tầm quan trọng của Logging

Logging là một phần không thể thiếu trong việc vận hành và bảo trì ứng dụng. Logs giúp chúng ta theo dõi hoạt động của hệ thống, debug lỗi, phân tích performance, và đáp ứng các yêu cầu audit. Một hệ thống logging tốt cần có khả năng ghi log ở nhiều cấp độ khác nhau, từ debug messages chi tiết cho development đến error logs quan trọng cho production.

NestJS tích hợp sẵn một Logger service đơn giản nhưng hiệu quả, đồng thời cho phép tích hợp với các thư viện logging mạnh mẽ hơn như Winston hay Pino.

### 4.11.2 Built-in Logger

NestJS cung cấp class `Logger` có thể sử dụng ngay mà không cần cài đặt thêm. Logger này hỗ trợ các log levels: log, error, warn, debug, và verbose.

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  async create(dto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Tạo task mới: ${dto.title}`);
    
    try {
      const task = await this.prisma.task.create({
        data: dto,
      });
      
      this.logger.log(`Task đã tạo thành công: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Lỗi khi tạo task: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Task> {
    this.logger.debug(`Tìm task với ID: ${id}`);
    
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      this.logger.warn(`Không tìm thấy task: ${id}`);
      throw new NotFoundException(`Task ${id} không tồn tại`);
    }

    return task;
  }
}
```

Kết quả log sẽ hiển thị với format có màu sắc và context rõ ràng:

```
[Nest] 12345  - 01/30/2026, 10:30:00 AM     LOG [TaskService] Tạo task mới: Báo cáo tuần
[Nest] 12345  - 01/30/2026, 10:30:01 AM     LOG [TaskService] Task đã tạo thành công: abc123
[Nest] 12345  - 01/30/2026, 10:31:00 AM   DEBUG [TaskService] Tìm task với ID: xyz789
[Nest] 12345  - 01/30/2026, 10:31:00 AM    WARN [TaskService] Không tìm thấy task: xyz789
```

### 4.11.3 Cấu hình Log Levels

Có thể cấu hình log level khi khởi tạo ứng dụng để kiểm soát những gì được log:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']  // Production: chỉ log lỗi và cảnh báo
      : ['error', 'warn', 'log', 'debug', 'verbose'],  // Development: log tất cả
  });
  
  await app.listen(3333);
}
```

### 4.11.4 Request Logging Middleware

Để log tất cả các HTTP requests đến server, chúng ta có thể tạo một logging middleware:

```typescript
// middleware/logging.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - startTime;
      
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;
      
      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
```

Đăng ký middleware trong AppModule:

```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');  // Áp dụng cho tất cả routes
  }
}
```

Kết quả log sẽ cho thấy mọi request đến server:

```
[Nest] 12345  - 01/30/2026, 10:30:00 AM     LOG [HTTP] POST /auth/login 200 - 156ms - ::1
[Nest] 12345  - 01/30/2026, 10:30:05 AM     LOG [HTTP] GET /tasks 200 - 45ms - ::1
[Nest] 12345  - 01/30/2026, 10:30:10 AM    WARN [HTTP] GET /tasks/invalid 404 - 12ms - ::1
```

### 4.11.5 Structured Logging cho Production

Đối với môi trường production, logs thường được collect và phân tích bởi các hệ thống như ELK Stack (Elasticsearch, Logstash, Kibana) hoặc các dịch vụ cloud. Trong trường hợp này, structured logging với format JSON là lựa chọn tốt hơn:

```typescript
// logger/custom-logger.service.ts
import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  log(message: string, context?: string) {
    this.writeLog('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog('error', message, context, { trace });
  }

  warn(message: string, context?: string) {
    this.writeLog('warn', message, context);
  }

  private writeLog(
    level: string,
    message: string,
    context?: string,
    meta?: object,
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...meta,
    };

    // Trong production, output JSON
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      // Trong development, output readable format
      console.log(`[${level.toUpperCase()}] [${context}] ${message}`);
    }
  }
}
```

---

## Tổng kết chương

Chương 4 đã trình bày một cách toàn diện các khái niệm cốt lõi của NestJS framework, cung cấp nền tảng vững chắc để phát triển ứng dụng backend chuyên nghiệp.

Chúng ta đã bắt đầu với **TypeScript** - ngôn ngữ nền tảng của NestJS, tìm hiểu về hệ thống kiểu dữ liệu, Interfaces, Decorators và Generics. Những kiến thức này là tiền đề để hiểu cách NestJS hoạt động.

Tiếp theo, chúng ta đã khám phá kiến trúc **Modules, Controllers, và Services** - ba thành phần cốt lõi tạo nên cấu trúc của mọi ứng dụng NestJS. Module đóng gói các thành phần liên quan, Controller xử lý HTTP requests, và Service chứa business logic.

**Dependency Injection** là một design pattern quan trọng được NestJS áp dụng triệt để, giúp code dễ test, dễ bảo trì và có tính module hóa cao.

Phần **DTOs và Validation** hướng dẫn cách đảm bảo dữ liệu đầu vào luôn hợp lệ trước khi được xử lý, sử dụng class-validator và ValidationPipe.

**Pipes, Guards và Interceptors** cho thấy cách NestJS xử lý request qua nhiều lớp middleware, từ authentication đến data transformation.

**Exception Handling** giúp ứng dụng xử lý lỗi một cách graceful, trả về response chuẩn hóa cho client.

**Configuration** và **Logging** là hai phần quan trọng cho việc vận hành ứng dụng trong môi trường production.

Cuối cùng, phần **Demo xây dựng Auth Module** đã minh họa cách kết hợp tất cả các kiến thức trên để tạo một module hoàn chỉnh với đầy đủ chức năng đăng ký, đăng nhập và bảo vệ routes.

Với nền tảng kiến thức này, chương tiếp theo sẽ đi sâu vào việc xây dựng các chức năng cụ thể của dự án TodoList Collaboration, áp dụng thực tế những gì đã học.

