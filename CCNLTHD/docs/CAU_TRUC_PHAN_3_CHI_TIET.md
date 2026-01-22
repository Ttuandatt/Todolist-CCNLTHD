# 📋 CẤU TRÚC CHI TIẾT BÁO CÁO - PHẦN 3

> **Gợi ý cấu trúc Phần 3: Nội dung cốt lõi và thực hành**  
> Mỗi mục có mapping trực tiếp với dự án TodoList Collaboration

---

## Chương 3: Cài đặt môi trường và "Hello World"
*Thời lượng: 3-5 trang*

### 3.1 Các công cụ cần thiết
- Node.js (v18+) và npm
- NestJS CLI (`npm install -g @nestjs/cli`)
- PostgreSQL database
- Visual Studio Code + Extensions (Prisma, ESLint)
- Postman/Insomnia (test API)
- Git

### 3.2 Cài đặt chi tiết từng bước
- Cài Node.js (kèm hình ảnh)
- Cài NestJS CLI
- Cài PostgreSQL
- Tạo database

### 3.3 Tạo project "Hello World"
```bash
nest new hello-nestjs
cd hello-nestjs
npm run start:dev
```

### 3.4 Giải thích cấu trúc thư mục
```
src/
├── app.controller.ts   → Xử lý HTTP request
├── app.service.ts      → Business logic
├── app.module.ts       → Root module
└── main.ts             → Entry point
```

### 🔗 Áp dụng trong dự án:
> Khởi tạo project `todolist-backend` với cấu trúc tương tự

---

## Chương 4: Kiến trúc NestJS
*Thời lượng: 8-12 trang* ⭐ **QUAN TRỌNG**

### 4.1 Modules - Đơn vị tổ chức code

#### 4.1.1 Module là gì?
- Container chứa controllers, providers, imports, exports
- Mỗi feature là 1 module riêng biệt

#### 4.1.2 Cấu trúc @Module decorator
```typescript
@Module({
  imports: [],      // Modules cần import
  controllers: [],  // Controllers của module
  providers: [],    // Services của module
  exports: [],      // Providers export ra ngoài
})
export class UsersModule {}
```

#### 4.1.3 Module types
- Feature modules (UsersModule, TasksModule)
- Shared modules (export providers để reuse)
- Global modules (@Global)
- Dynamic modules (configuration)

### 🔗 Áp dụng trong dự án:
| Module | Chức năng |
|--------|-----------|
| `AuthModule` | Đăng nhập, đăng ký, OAuth |
| `UsersModule` | Quản lý users |
| `WorkspacesModule` | Quản lý workspace |
| `ProjectsModule` | Quản lý projects |
| `TasksModule` | Quản lý tasks |
| `CommentsModule` | Bình luận tasks |

---

### 4.2 Controllers - Xử lý HTTP Requests

#### 4.2.1 Controller là gì?
- Nhận requests từ client
- Gọi services để xử lý
- Trả về response

#### 4.2.2 HTTP Method Decorators
```typescript
@Controller('tasks')
export class TasksController {
  @Get()              // GET /tasks
  @Get(':id')         // GET /tasks/1
  @Post()             // POST /tasks
  @Put(':id')         // PUT /tasks/1
  @Patch(':id')       // PATCH /tasks/1
  @Delete(':id')      // DELETE /tasks/1
}
```

#### 4.2.3 Request Data Decorators
```typescript
@Get(':id')
findOne(
  @Param('id') id: string,      // Route params
  @Query('filter') filter: string,  // Query params
  @Body() body: CreateDto,      // Request body
  @Headers('auth') auth: string // Headers
) {}
```

### 🔗 Áp dụng trong dự án:
```typescript
// TasksController endpoints
GET    /api/tasks          → Lấy danh sách tasks
GET    /api/tasks/:id      → Lấy chi tiết task
POST   /api/tasks          → Tạo task mới
PATCH  /api/tasks/:id      → Cập nhật task
DELETE /api/tasks/:id      → Xóa task
```

---

### 4.3 Providers & Services - Business Logic

#### 4.3.1 Provider là gì?
- Bất kỳ class nào có thể được inject
- Service là loại provider phổ biến nhất

#### 4.3.2 @Injectable decorator
```typescript
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany();
  }

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({ data: dto });
  }
}
```

### 🔗 Áp dụng trong dự án:
| Service | Methods |
|---------|---------|
| `AuthService` | `register()`, `login()`, `validateUser()` |
| `TasksService` | `findAll()`, `findOne()`, `create()`, `update()`, `delete()` |
| `WorkspacesService` | `create()`, `addMember()`, `removeMember()` |

---

### 4.4 Dependency Injection

#### 4.4.1 DI là gì?
- NestJS tự động tạo và inject dependencies
- Dựa trên type trong constructor

#### 4.4.2 Cách hoạt động
```typescript
@Controller('tasks')
export class TasksController {
  // NestJS tự động inject TasksService
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}
```

#### 4.4.3 Lợi ích của DI
- Loose coupling
- Dễ testing (mock dependencies)
- Code maintainable

### 🔗 Áp dụng trong dự án:
```
TasksController
    └── inject TasksService
            └── inject PrismaService
                    └── inject ConfigService
```

---

### 4.5 Demo: Xây dựng Users Module

[Code demo tạo UsersModule với đầy đủ Controller, Service, DTOs]

---

## Chương 5: Database với Prisma ORM
*Thời lượng: 10-15 trang* ⭐ **QUAN TRỌNG**

### 5.1 ORM là gì? Tại sao chọn Prisma?

#### 5.1.1 ORM (Object-Relational Mapping)
- Cầu nối giữa code và database
- Không cần viết SQL thuần

#### 5.1.2 Prisma vs TypeORM
| Tiêu chí | Prisma | TypeORM |
|----------|--------|---------|
| Type Safety | Excellent | Good |
| Migrations | Auto-generate | Manual |
| Learning curve | Thấp | Trung bình |

### 5.2 Cài đặt và cấu hình Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### 5.3 Schema Definition

#### 5.3.1 Cấu trúc file schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

#### 5.3.2 Định nghĩa Models
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  tasks     Task[]   // Relation 1-N
  createdAt DateTime @default(now())
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

### 🔗 Áp dụng trong dự án:
| Model | Fields chính |
|-------|--------------|
| `User` | id, email, name, password, avatar |
| `Workspace` | id, name, ownerId |
| `Project` | id, name, workspaceId |
| `Task` | id, title, status, priority, projectId |
| `Comment` | id, content, taskId, userId |

---

### 5.4 Migrations

```bash
# Tạo migration
npx prisma migrate dev --name init

# Apply production
npx prisma migrate deploy
```

### 5.5 CRUD Operations

```typescript
// Create
const task = await prisma.task.create({
  data: { title: 'New task', userId: 1 }
});

// Read
const tasks = await prisma.task.findMany({
  where: { userId: 1 },
  include: { user: true }
});

// Update
await prisma.task.update({
  where: { id: 1 },
  data: { title: 'Updated' }
});

// Delete
await prisma.task.delete({ where: { id: 1 } });
```

### 5.6 Relations

#### One-to-Many
```prisma
model User {
  tasks Task[]  // User có nhiều tasks
}

model Task {
  userId Int
  user   User @relation(fields: [userId], references: [id])
}
```

#### Many-to-Many
```prisma
model Task {
  labels TaskLabel[]
}

model Label {
  tasks TaskLabel[]
}

model TaskLabel {
  taskId  Int
  labelId Int
  task    Task  @relation(...)
  label   Label @relation(...)
  @@id([taskId, labelId])
}
```

### 🔗 Áp dụng trong dự án:
- User → Tasks (1-N)
- Project → Tasks (1-N)
- Task → Labels (N-N qua TaskLabel)
- Task → Comments (1-N)
- Workspace → Members (N-N qua WorkspaceMember)

### 5.7 Demo: Tạo schema cho Todo App

[Code demo tạo đầy đủ schema với 5-6 models]

---

## Chương 6: Authentication & Authorization
*Thời lượng: 12-15 trang* ⭐ **QUAN TRỌNG**

### 6.1 Khái niệm cơ bản

#### 6.1.1 Authentication vs Authorization
| | Authentication | Authorization |
|-|----------------|---------------|
| Câu hỏi | Bạn là ai? | Bạn được làm gì? |
| Khi nào | Login | Mỗi request |
| Kết quả | User identity | Allow/Deny |

#### 6.1.2 JWT (JSON Web Token)
- Cấu trúc: Header.Payload.Signature
- Stateless authentication
- Access Token vs Refresh Token

### 6.2 Cài đặt packages

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
```

### 6.3 Tạo Auth Module

#### 6.3.1 Register flow
```typescript
async register(dto: RegisterDto) {
  // 1. Check email exists
  // 2. Hash password
  // 3. Create user
  // 4. Generate JWT
  // 5. Return tokens
}
```

#### 6.3.2 Login flow
```typescript
async login(dto: LoginDto) {
  // 1. Find user by email
  // 2. Compare password
  // 3. Generate JWT
  // 4. Return tokens
}
```

### 6.4 JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 6.5 Guards - Bảo vệ routes

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Usage
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### 6.6 OAuth với Google

#### 6.6.1 Cấu hình Google Console
#### 6.6.2 Google Strategy
#### 6.6.3 Callback handling

### 🔗 Áp dụng trong dự án:
| Feature | Implementation |
|---------|----------------|
| Đăng ký | `POST /auth/register` |
| Đăng nhập | `POST /auth/login` |
| Google OAuth | `GET /auth/google` |
| Protected routes | `@UseGuards(JwtAuthGuard)` |
| Current user | `@CurrentUser() decorator` |

### 6.7 Demo: Implement Auth cho ứng dụng

[Code demo đầy đủ AuthModule]

---

## Chương 7: Kỹ thuật nâng cao
*Thời lượng: 8-10 trang*

### 7.1 Validation với Pipes

#### 7.1.1 Class Validator
```typescript
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

#### 7.1.2 Global ValidationPipe
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

### 🔗 Áp dụng trong dự án:
- Validate CreateTaskDto (title required)
- Validate RegisterDto (email format, password min length)

---

### 7.2 Interceptors

#### 7.2.1 Logging Interceptor
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`${Date.now() - now}ms`))
    );
  }
}
```

#### 7.2.2 Transform Response Interceptor
```typescript
// Transform all responses to { data, status, timestamp }
```

### 🔗 Áp dụng trong dự án:
- Log tất cả API requests
- Transform response format thống nhất

---

### 7.3 Exception Filters

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Custom error response
  }
}
```

### 🔗 Áp dụng trong dự án:
- Custom error messages
- Logging errors

---

### 7.4 Swagger API Documentation

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('TodoList API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 🔗 Áp dụng trong dự án:
- API docs tại `/api/docs`
- Document tất cả endpoints

### 7.5 Demo: Thêm validation và Swagger

[Code demo]

---

## Chương 8: Real-time với WebSocket *(THÊM MỚI)*
*Thời lượng: 8-10 trang* ⭐ **CẦN CHO COLLABORATION**

### 8.1 WebSocket là gì?

#### 8.1.1 HTTP vs WebSocket
| | HTTP | WebSocket |
|-|------|-----------|
| Connection | Request-Response | Persistent |
| Direction | One-way | Bidirectional |
| Use case | REST API | Real-time |

#### 8.1.2 Khi nào dùng WebSocket
- Chat applications
- Live notifications
- Collaborative editing
- Real-time dashboards

### 8.2 Socket.io với NestJS

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 8.3 WebSocket Gateway

```typescript
@WebSocketGateway({ cors: true })
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinWorkspace')
  handleJoin(client: Socket, workspaceId: number) {
    client.join(`workspace:${workspaceId}`);
  }

  emitTaskCreated(workspaceId: number, task: Task) {
    this.server.to(`workspace:${workspaceId}`).emit('taskCreated', task);
  }
}
```

### 8.4 Rooms và Broadcasting

- Join room khi user vào workspace
- Broadcast events khi có thay đổi
- Leave room khi disconnect

### 8.5 Authentication cho WebSocket

```typescript
// Verify JWT in handshake
server.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify token...
  next();
});
```

### 🔗 Áp dụng trong dự án:
| Event | Trigger | Receivers |
|-------|---------|-----------|
| `taskCreated` | Tạo task mới | Members trong workspace |
| `taskUpdated` | Cập nhật task | Members trong workspace |
| `taskDeleted` | Xóa task | Members trong workspace |
| `commentAdded` | Thêm comment | Members đang xem task |

### 8.6 Demo: Real-time task updates

[Code demo gateway + frontend integration]

---

## 📊 TỔNG KẾT MAPPING

| Chương | Kiến thức | Sử dụng trong dự án |
|--------|-----------|---------------------|
| 3 | Setup | Khởi tạo project |
| 4 | Modules, DI | Tất cả modules (6+) |
| 5 | Prisma | Database 8+ models |
| 6 | Auth | Login, OAuth, Guards |
| 7 | Validation, Swagger | DTO validation, API docs |
| 8 | WebSocket | Real-time collaboration |

---

> **Lưu ý:** Mỗi chương nên có phần "Demo" hoặc "Thực hành" nhỏ, và code demo đó sẽ được tích hợp vào dự án lớn ở Phần 4.
