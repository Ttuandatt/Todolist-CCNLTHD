# 📖 CẤU TRÚC CHI TIẾT CHƯƠNG 4: KIẾN TRÚC NESTJS

> **Mục tiêu:** Trình bày kiến thức nền tảng NestJS với lý thuyết, ví dụ minh họa, code mẫu và demo thực hành.  
> **Áp dụng vào:** TodoList Collaboration App

---

## 📋 TỔNG QUAN CẤU TRÚC ĐỀ XUẤT

```
Chương 4: Kiến trúc NestJS và các khái niệm cốt lõi
├── 4.1 TypeScript - Nền tảng ngôn ngữ
├── 4.2 Modules - Đơn vị tổ chức
├── 4.3 Controllers - Xử lý HTTP
├── 4.4 Providers & Services - Business Logic
├── 4.5 Dependency Injection
├── 4.6 DTOs & Validation
├── 4.7 Pipes, Guards, Interceptors (Middleware)
└── 4.8 Demo: Xây dựng Auth Module hoàn chỉnh
```

---

## 📝 CHI TIẾT TỪNG MỤC

### 4.1 TypeScript - Nền tảng ngôn ngữ (5-6 trang)

> **Lý do cần học:** NestJS được viết hoàn toàn bằng TypeScript. Hiểu TypeScript là điều kiện tiên quyết.

#### 4.1.1 TypeScript là gì?
- **Lý thuyết:** TypeScript là superset của JavaScript với static typing
- **So sánh:** TypeScript vs JavaScript (bảng so sánh)
- **Sơ đồ:** TypeScript compile process → JavaScript
- **Áp dụng dự án:** Tại sao chọn TypeScript cho TodoList App

#### 4.1.2 Type System cơ bản
- **Lý thuyết:** Primitive types, Arrays, Objects
- **Code mẫu:**
```typescript
// Primitive types
const email: string = "user@example.com";
const age: number = 25;
const isActive: boolean = true;

// Arrays
const tags: string[] = ["urgent", "important"];

// Objects với interface
interface User {
  id: string;
  email: string;
  password: string;
}
```
- **Áp dụng dự án:** Type cho Task, User, Project entities

#### 4.1.3 Interface và Type Alias
- **Lý thuyết:** Khi nào dùng Interface vs Type
- **Sơ đồ:** So sánh Interface và Type
- **Code mẫu:**
```typescript
// Interface - dùng cho objects
interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
}

// Type alias - dùng cho union types
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
```

#### 4.1.4 Decorators
- **Lý thuyết:** Decorator là gì? Decorator pattern
- **Sơ đồ:** Cách Decorator hoạt động
- **Code mẫu:**
```typescript
// Class decorator
@Controller('tasks')
export class TaskController { }

// Method decorator
@Get(':id')
findOne(@Param('id') id: string) { }

// Property decorator
@IsNotEmpty()
title: string;
```
- **Áp dụng dự án:** Các decorator dùng trong AuthController, TaskController

#### 4.1.5 Generics
- **Lý thuyết:** Generic types là gì? Tại sao cần?
- **Code mẫu:**
```typescript
// Generic function
function findById<T>(id: string): Promise<T> {
  return this.prisma.findUnique({ where: { id } });
}

// Sử dụng
const user = await findById<User>('123');
const task = await findById<Task>('456');
```

---

### 4.2 Modules - Đơn vị tổ chức code (4-5 trang)

> **Mục đích:** Hiểu cách NestJS tổ chức code theo modules

#### 4.2.1 Module là gì?
- **Lý thuyết:** Module = đơn vị tổ chức độc lập, đóng gói các thành phần liên quan
- **Sơ đồ:** Module architecture diagram
```
┌─────────────────────────────────────────┐
│              AppModule                  │
├─────────────────────────────────────────┤
│  imports: [AuthModule, TaskModule, ...] │
└─────────────────────────────────────────┘
         │               │
    ┌────┴────┐     ┌────┴────┐
    │AuthModule│    │TaskModule│
    ├─────────┤    ├──────────┤
    │Controller│   │Controller │
    │Service   │   │Service    │
    └──────────┘   └───────────┘
```

#### 4.2.2 Cấu trúc @Module decorator
- **Lý thuyết:** 4 thuộc tính của @Module
- **Code mẫu:**
```typescript
@Module({
  imports: [PrismaModule],      // Modules phụ thuộc
  controllers: [TaskController], // Controllers của module
  providers: [TaskService],      // Services/Providers
  exports: [TaskService],        // Export để module khác dùng
})
export class TaskModule {}
```

#### 4.2.3 Các loại Module
- **Feature Module:** AuthModule, TaskModule, UserModule
- **Shared Module:** PrismaModule (global database access)
- **Core Module:** AppModule (root module)
- **Dynamic Module:** ConfigModule với forRoot()

---

### 4.3 Controllers - Xử lý HTTP Requests (4-5 trang)

#### 4.3.1 Controller là gì?
- **Lý thuyết:** Controller nhận HTTP request, trả về response
- **Sơ đồ:** Request lifecycle
```
Client Request → Controller → Service → Database
         ↓                      ↓
     Response ← Controller ← Service
```

#### 4.3.2 HTTP Method Decorators
- **Lý thuyết:** @Get, @Post, @Put, @Patch, @Delete
- **Code mẫu:**
```typescript
@Controller('tasks')
export class TaskController {
  @Get()           // GET /tasks
  findAll() {}
  
  @Get(':id')      // GET /tasks/:id
  findOne(@Param('id') id: string) {}
  
  @Post()          // POST /tasks
  create(@Body() dto: CreateTaskDto) {}
  
  @Patch(':id')    // PATCH /tasks/:id
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {}
  
  @Delete(':id')   // DELETE /tasks/:id
  remove(@Param('id') id: string) {}
}
```

#### 4.3.3 Request Data Decorators
- **Lý thuyết:** Cách lấy data từ request
- **Bảng tổng hợp:**

| Decorator | Mô tả | Ví dụ |
|-----------|-------|-------|
| `@Body()` | Request body | `@Body() dto: CreateTaskDto` |
| `@Param()` | URL params | `@Param('id') id: string` |
| `@Query()` | Query string | `@Query('status') status: string` |
| `@Headers()` | Request headers | `@Headers('authorization') token` |

#### 4.3.4 Response và Status Codes
- **Code mẫu:**
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)  // 201
create(@Body() dto: CreateTaskDto) {
  return this.taskService.create(dto);
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)  // 204
remove(@Param('id') id: string) {
  return this.taskService.remove(id);
}
```

---

### 4.4 Providers & Services - Business Logic (3-4 trang)

#### 4.4.1 Provider là gì?
- **Lý thuyết:** Provider = bất kỳ class nào có thể được inject
- **Các loại:** Services, Repositories, Factories, Helpers

#### 4.4.2 @Injectable decorator
- **Lý thuyết:** Đánh dấu class có thể được inject
- **Code mẫu:**
```typescript
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: dto,
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }
  
  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }
}
```

#### 4.4.3 Service vs Repository Pattern
- **Sơ đồ:** So sánh 2 patterns
- **Code mẫu:** Khi nào dùng pattern nào

---

### 4.5 Dependency Injection (3-4 trang)

#### 4.5.1 DI là gì?
- **Lý thuyết:** Inversion of Control (IoC), DI container
- **Sơ đồ:**
```
Không có DI:
┌──────────────┐
│  Controller  │──creates──▶ Service ──creates──▶ Repository
└──────────────┘

Có DI:
┌────────────────────────────────────────┐
│            IoC Container               │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐ │
│  │Controller│ │ Service │ │Repository│ │
│  └────┬─────┘ └────┬────┘ └────┬─────┘ │
│       │injects     │injects    │       │
│       ◀────────────┴───────────┘       │
└────────────────────────────────────────┘
```

#### 4.5.2 Cách hoạt động trong NestJS
- **Code mẫu:**
```typescript
// NestJS tự động inject PrismaService
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,  // Injected
    private jwtService: JwtService, // Injected
  ) {}
}
```

#### 4.5.3 Lợi ích của DI
- **Loose coupling:** Dễ thay thế implementation
- **Testability:** Dễ mock dependencies
- **Maintainability:** Code dễ bảo trì

---

### 4.6 DTOs & Validation (3-4 trang) *(MỚI)*

> **Lý do bổ sung:** Rất quan trọng cho API, dự án sử dụng nhiều DTOs

#### 4.6.1 DTO là gì?
- **Lý thuyết:** Data Transfer Object - định nghĩa shape của data
- **Sơ đồ:** Request → DTO → Validation → Service

#### 4.6.2 class-validator decorators
- **Code mẫu:**
```typescript
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  avatar?: string;
}

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}
```

#### 4.6.3 ValidationPipe
- **Code mẫu:**
```typescript
// main.ts - Global validation
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // Strip unknown properties
  forbidNonWhitelisted: true,
  transform: true,        // Auto-transform types
}));
```

---

### 4.7 Pipes, Guards, Interceptors (4-5 trang) *(MỚI)*

> **Lý do bổ sung:** Middleware layer quan trọng, dự án dùng Guards cho auth

#### 4.7.1 Pipes - Transform & Validate data
- **Lý thuyết:** Pipes xử lý data trước khi vào handler
- **Built-in pipes:** ValidationPipe, ParseIntPipe, ParseUUIDPipe
- **Code mẫu:**
```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.taskService.findOne(id);
}
```

#### 4.7.2 Guards - Authorization
- **Lý thuyết:** Guards quyết định request được xử lý hay không
- **Sơ đồ:** Guard lifecycle
- **Code mẫu:**
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// Sử dụng
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

#### 4.7.3 Interceptors - Transform response
- **Lý thuyết:** Interceptors can transform data before/after handler
- **Use cases:** Logging, Response transformation, Caching

#### 4.7.4 Request Lifecycle
- **Sơ đồ hoàn chỉnh:**
```
Request
   │
   ▼
Middleware
   │
   ▼
Guards ─────▶ 403 Forbidden
   │
   ▼
Interceptors (before)
   │
   ▼
Pipes ───────▶ 400 Bad Request
   │
   ▼
Handler (Controller method)
   │
   ▼
Interceptors (after)
   │
   ▼
Response
```

---

### 4.8 Demo: Xây dựng Auth Module (6-8 trang)

> **Mục đích:** Áp dụng tất cả kiến thức vào một module thực tế

#### 4.8.1 Yêu cầu chức năng
- Register: Tạo tài khoản mới
- Login: Đăng nhập và nhận JWT
- Protect routes: Chỉ user đã login mới truy cập được

#### 4.8.2 Cấu trúc files
```
src/auth/
├── auth.module.ts          # Module definition
├── auth.controller.ts      # HTTP endpoints
├── auth.service.ts         # Business logic
├── dto/
│   ├── register.dto.ts     # Register request
│   └── login.dto.ts        # Login request
├── guards/
│   └── jwt-auth.guard.ts   # Protect routes
├── strategies/
│   └── jwt.strategy.ts     # JWT validation
└── decorators/
    └── current-user.decorator.ts
```

#### 4.8.3 Implement từng bước

**Bước 1: DTOs**
```typescript
// dto/register.dto.ts
export class RegisterDto {
  @IsEmail()
  email: string;
  
  @MinLength(6)
  password: string;
  
  @IsNotEmpty()
  firstName: string;
  
  @IsNotEmpty()
  lastName: string;
}
```

**Bước 2: Service**
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check email exists
    // 2. Hash password
    // 3. Create user
    // 4. Return user (không password)
  }

  async login(dto: LoginDto) {
    // 1. Find user by email
    // 2. Verify password
    // 3. Generate JWT
    // 4. Return token
  }
}
```

**Bước 3: Controller**
```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

**Bước 4: Test với Postman**
- Screenshot test Register
- Screenshot test Login
- Screenshot test Protected route

---

## 📊 TỔNG KẾT CẤU TRÚC MỚI

| Mục | Số trang | Nội dung chính |
|-----|----------|----------------|
| 4.1 TypeScript | 5-6 | Types, Interface, Decorators, Generics |
| 4.2 Modules | 4-5 | @Module, Feature/Shared/Core modules |
| 4.3 Controllers | 4-5 | HTTP decorators, Request handling |
| 4.4 Providers | 3-4 | @Injectable, Services |
| 4.5 DI | 3-4 | IoC, Benefits of DI |
| 4.6 DTOs & Validation | 3-4 | class-validator, ValidationPipe |
| 4.7 Pipes, Guards | 4-5 | Request lifecycle, Auth guards |
| 4.8 Demo | 6-8 | Auth Module complete |
| **Tổng** | **~35 trang** | |

---

## ✅ CHECKLIST YÊU CẦU

| Yêu cầu | Đáp ứng |
|---------|---------|
| Lý thuyết nền tảng | ✅ TypeScript, Module, Controller, Service, DI |
| Giải thích & Sơ đồ | ✅ Mỗi section có diagram |
| Code mẫu | ✅ Code ngắn, súc tích mỗi concept |
| Demo/Thực hành | ✅ Section 4.8 build Auth Module |
| Áp dụng vào dự án | ✅ Mọi ví dụ đều từ TodoList App |

---

## 🔧 THAY ĐỔI SO VỚI BẢN CŨ

| Cũ | Mới | Lý do |
|----|-----|-------|
| 4.5 xuất hiện 2 lần | Đánh số lại đúng | Fix lỗi |
| Thiếu DTOs & Validation | Thêm mục 4.6 | Rất quan trọng cho API |
| Thiếu Guards, Pipes | Thêm mục 4.7 | Cần cho Authentication |
| Demo chung chung | Demo Auth Module cụ thể | Thực tế hơn |
