# ĐỒ ÁN: TÌM HIỂU VÀ ỨNG DỤNG CÔNG NGHỆ NESTJS

## Đề tài: Xây dựng ứng dụng TodoList Collaboration với NestJS

---

# LỜI MỞ ĐẦU

## 1. Lý do chọn đề tài

Trong bối cảnh phát triển web hiện đại, việc xây dựng các ứng dụng backend có kiến trúc rõ ràng, dễ bảo trì và mở rộng trở nên vô cùng quan trọng. **NestJS** nổi lên như một framework Node.js progressive, kết hợp những ưu điểm của TypeScript, OOP, FP và FRP.

**Lý do chọn NestJS:**
- Framework được thiết kế theo kiến trúc Angular, dễ học cho developers quen với Angular
- Hỗ trợ TypeScript native, tăng type safety và developer experience
- Kiến trúc modular giúp tổ chức code tốt cho các ứng dụng lớn
- Tích hợp sẵn WebSocket, GraphQL, Microservices
- Được sử dụng bởi nhiều công ty lớn như Adidas, Roche, Trilon

## 2. Mục tiêu của báo cáo

- Hiểu sâu về kiến trúc và các khái niệm cốt lõi của NestJS
- Nắm vững cách xây dựng RESTful API với NestJS
- Biết cách tích hợp database với Prisma ORM
- Triển khai authentication/authorization với JWT
- Xây dựng được ứng dụng TodoList hoàn chỉnh với tính năng collaboration

## 3. Phạm vi báo cáo

- Tập trung vào NestJS phiên bản 10.x
- Backend development với REST API
- Database PostgreSQL với Prisma ORM
- Authentication với JWT và Passport
- Real-time với WebSocket (Socket.io)

## 4. Cấu trúc báo cáo

| Phần | Nội dung |
|------|----------|
| **Phần 1** | Tổng quan về công nghệ NestJS |
| **Phần 2** | Nội dung cốt lõi và thực hành |
| **Phần 3** | Xây dựng đồ án TodoList Collaboration |
| **Phần 4** | Tổng kết và hướng phát triển |

---

# PHẦN 1: TỔNG QUAN VỀ CÔNG NGHỆ NESTJS

## Chương 1: Giới thiệu chung

### 1.1 Lịch sử hình thành và phát triển

#### Người sáng tạo
- **Kamil Myśliwiec** - Software Engineer người Ba Lan
- Phát hành phiên bản đầu tiên vào năm **2017**
- Công ty **Trilon** hiện đang maintain và phát triển NestJS

#### Bối cảnh ra đời

NestJS được tạo ra để giải quyết các vấn đề:

| Vấn đề với Express.js | Giải pháp của NestJS |
|----------------------|---------------------|
| Không có cấu trúc chuẩn | Kiến trúc modular, opinionated |
| Thiếu TypeScript native | TypeScript first-class support |
| Dependency Injection thủ công | DI container built-in |
| Thiếu decorators | Decorators cho routes, middleware |
| Testing phức tạp | Testing module tích hợp |

#### Các phiên bản chính

| Version | Năm | Thay đổi quan trọng |
|---------|-----|---------------------|
| 1.0 | 2017 | Phiên bản đầu tiên |
| 5.0 | 2018 | Cải thiện performance, CLI |
| 6.0 | 2019 | Fastify adapter, OpenAPI |
| 7.0 | 2020 | Improved caching, queue |
| 8.0 | 2021 | REPL, route versioning |
| 9.0 | 2022 | Config namespaces, CQRS |
| 10.0 | 2023 | Node.js 16+, SWC compiler |

### 1.2 Hệ sinh thái (Ecosystem)

```
┌─────────────────────────────────────────────────────────────┐
│                    NESTJS ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│  OFFICIAL PACKAGES                                           │
│  ├── @nestjs/common      Core utilities                     │
│  ├── @nestjs/core        DI container, app factory          │
│  ├── @nestjs/platform-*  Express/Fastify adapters           │
│  ├── @nestjs/swagger     OpenAPI documentation              │
│  ├── @nestjs/passport    Authentication                     │
│  ├── @nestjs/jwt         JWT utilities                      │
│  ├── @nestjs/typeorm     TypeORM integration                │
│  ├── @nestjs/mongoose    MongoDB integration                │
│  ├── @nestjs/graphql     GraphQL support                    │
│  ├── @nestjs/websockets  WebSocket gateway                  │
│  ├── @nestjs/microservices  Microservices support          │
│  ├── @nestjs/bull        Queue management                   │
│  └── @nestjs/cache-manager  Caching                         │
├─────────────────────────────────────────────────────────────┤
│  COMMUNITY PACKAGES                                          │
│  ├── nestjs-prisma       Prisma integration                 │
│  ├── @nestjsx/crud       Auto CRUD generator                │
│  ├── nestjs-config       Config management                  │
│  └── nestjs-i18n         Internationalization               │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Cộng đồng

| Metric | Số liệu (2024) |
|--------|---------------|
| GitHub Stars | 65,000+ |
| NPM Downloads/week | 3,000,000+ |
| Discord Members | 40,000+ |
| Contributors | 400+ |

---

## Chương 2: Cơ hội nghề nghiệp và thị trường

### 2.1 Các vị trí công việc

| Vị trí | Mô tả công việc |
|--------|----------------|
| **NestJS Developer** | Phát triển backend APIs với NestJS |
| **Node.js Backend Developer** | Backend development với Node.js ecosystem |
| **Full-stack Developer** | NestJS + React/Angular/Vue |
| **API Engineer** | Thiết kế và xây dựng REST/GraphQL APIs |
| **DevOps Engineer** | Deploy và maintain NestJS applications |

### 2.2 Nhu cầu tuyển dụng (Việt Nam 2024)

| Nguồn | Số lượng việc làm |
|-------|------------------|
| ITviec | 150+ jobs |
| TopDev | 100+ jobs |
| LinkedIn | 200+ jobs |
| VietnamWorks | 80+ jobs |

**Xu hướng:** Tăng 40% so với năm 2023

### 2.3 Mức lương tham khảo (VNĐ/tháng)

| Level | Ho Chi Minh | Ha Noi |
|-------|-------------|--------|
| **Junior** (0-2 năm) | 12-20M | 10-18M |
| **Middle** (2-4 năm) | 20-35M | 18-30M |
| **Senior** (4+ năm) | 35-60M | 30-50M |
| **Tech Lead** | 50-80M | 45-70M |

### 2.4 Các công ty sử dụng NestJS

| Công ty | Lĩnh vực | Sử dụng NestJS cho |
|---------|----------|-------------------|
| **Adidas** | E-commerce | Backend APIs |
| **Roche** | Healthcare | Microservices |
| **Capgemini** | Consulting | Enterprise apps |
| **Autodesk** | Software | Cloud services |
| **Decathlon** | Retail | E-commerce platform |

---

# PHẦN 2: NỘI DUNG CỐT LÕI VÀ THỰC HÀNH

## Chương 3: Cài đặt môi trường và Hello World

### 3.1 Công cụ cần thiết

| Tool | Version | Mục đích |
|------|---------|----------|
| Node.js | 18+ | JavaScript runtime |
| npm/yarn/pnpm | Latest | Package manager |
| VS Code | Latest | Code editor |
| PostgreSQL | 15+ | Database |
| Postman/Insomnia | Latest | API testing |
| Git | Latest | Version control |

### 3.2 Cài đặt NestJS CLI

```bash
# Cài đặt NestJS CLI globally
npm install -g @nestjs/cli

# Kiểm tra version
nest --version
```

### 3.3 Tạo dự án Hello World

```bash
# Tạo project mới
nest new hello-nestjs

# Chọn package manager (npm/yarn/pnpm)
# Di chuyển vào thư mục
cd hello-nestjs

# Chạy development server
npm run start:dev
```

### 3.4 Cấu trúc thư mục

```
hello-nestjs/
├── src/
│   ├── app.controller.ts     # Controller xử lý requests
│   ├── app.controller.spec.ts # Unit tests
│   ├── app.module.ts         # Root module
│   ├── app.service.ts        # Business logic
│   └── main.ts               # Entry point
├── test/                     # E2E tests
├── nest-cli.json             # NestJS CLI config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md
```

### 3.5 Giải thích file main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Tạo NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Lắng nghe ở port 3000
  await app.listen(3000);
}
bootstrap();
```

**Kết quả:** Truy cập `http://localhost:3000` → "Hello World!"

---

## Chương 4: Các khái niệm cơ bản

### 4.1 Modules

**Module** là đơn vị tổ chức code trong NestJS, nhóm các components liên quan.

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],  // Đăng ký controllers
  providers: [UsersService],       // Đăng ký services
  exports: [UsersService],         // Export để module khác sử dụng
})
export class UsersModule {}
```

### 4.2 Controllers

**Controller** xử lý incoming requests và trả về responses.

```typescript
// users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('users')  // Route prefix: /users
export class UsersController {
  
  @Get()  // GET /users
  findAll() {
    return 'Danh sách users';
  }

  @Get(':id')  // GET /users/:id
  findOne(@Param('id') id: string) {
    return `User có id: ${id}`;
  }

  @Post()  // POST /users
  create(@Body() body: any) {
    return `Tạo user: ${JSON.stringify(body)}`;
  }
}
```

### 4.3 Providers & Services

**Provider** là class có thể inject vào components khác. **Service** chứa business logic.

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()  // Đánh dấu là injectable
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }

  create(user: any) {
    this.users.push(user);
    return user;
  }
}
```

### 4.4 Dependency Injection

```typescript
// Inject service vào controller
@Controller('users')
export class UsersController {
  // NestJS tự động inject UsersService
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

### 4.5 DTOs (Data Transfer Objects)

```typescript
// users/dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// Sử dụng trong controller
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

---

## Chương 5: Validation và Pipes

### 5.1 Class Validator

```bash
npm install class-validator class-transformer
```

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;
}
```

### 5.2 Global Validation Pipe

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Loại bỏ fields không có trong DTO
    forbidNonWhitelisted: true,  // Báo lỗi nếu có field lạ
    transform: true,        // Tự động transform types
  }));
  
  await app.listen(3000);
}
```

---

## Chương 6: Database với Prisma

### 6.1 Cài đặt Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### 6.2 Định nghĩa Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  tasks     Task[]
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

### 6.3 Prisma Service

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 6.4 CRUD với Prisma

```typescript
// tasks/tasks.service.ts
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId: number, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...data, userId }
    });
  }

  async update(id: number, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
```

---

## Chương 7: Authentication với JWT

### 7.1 Cài đặt packages

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### 7.2 Auth Module

```typescript
// auth/auth.module.ts
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

### 7.3 JWT Strategy

```typescript
// auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 7.4 Auth Guard

```typescript
// auth/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Sử dụng trong controller
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

---

## Chương 8: WebSocket Real-time

### 8.1 Cài đặt

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 8.2 WebSocket Gateway

```typescript
// events/events.gateway.ts
@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinWorkspace')
  handleJoinWorkspace(client: Socket, workspaceId: string) {
    client.join(`workspace:${workspaceId}`);
    return { event: 'joined', data: workspaceId };
  }

  @SubscribeMessage('taskUpdated')
  handleTaskUpdate(client: Socket, payload: any) {
    this.server
      .to(`workspace:${payload.workspaceId}`)
      .emit('taskUpdated', payload);
  }
}
```

---

*Tiếp tục ở file tiếp theo: Phần 3 - Xây dựng đồ án tổng hợp*
