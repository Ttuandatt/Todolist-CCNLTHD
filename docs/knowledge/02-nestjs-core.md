# 📘 Phần 2: NestJS Core Architecture

> **Thời gian học:** 5-7 ngày  
> **Độ khó:** ⭐⭐⭐ Trung bình - Khó  
> **Yêu cầu:** TypeScript, OOP concepts

---

## 1. Tổng quan kiến trúc NestJS

### 1.1 Triết lý thiết kế

NestJS được xây dựng dựa trên 3 nguyên tắc chính:

| Nguyên tắc | Mô tả |
|------------|-------|
| **Modularity** | Chia ứng dụng thành các modules độc lập |
| **Dependency Injection** | Quản lý dependencies tự động |
| **Decorators** | Metadata-driven development |

### 1.2 Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Root Module (AppModule)              ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ││
│  │  │ UserModule  │ │ TaskModule  │ │ AuthModule  │       ││
│  │  ├─────────────┤ ├─────────────┤ ├─────────────┤       ││
│  │  │ Controller  │ │ Controller  │ │ Controller  │       ││
│  │  │ Service     │ │ Service     │ │ Service     │       ││
│  │  │ Repository  │ │ Repository  │ │ Guards      │       ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Shared/Common                         ││
│  │  Pipes | Guards | Interceptors | Filters | Middleware   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Modules

### 2.1 Module là gì?

Module là container chứa các components liên quan. Mỗi ứng dụng NestJS có ít nhất 1 module (root module).

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [],           // Import các modules khác
  controllers: [UsersController],  // Đăng ký controllers
  providers: [UsersService, UsersRepository],  // Đăng ký services
  exports: [UsersService],  // Export để module khác sử dụng
})
export class UsersModule {}
```

### 2.2 Module Properties

| Property | Mô tả | Ví dụ |
|----------|-------|-------|
| `imports` | Các modules cần import | `[DatabaseModule, AuthModule]` |
| `controllers` | Controllers thuộc module này | `[UsersController]` |
| `providers` | Services, repositories, factories | `[UsersService]` |
| `exports` | Providers để export ra ngoài | `[UsersService]` |

### 2.3 Shared Modules

```typescript
// shared/shared.module.ts
@Module({
  providers: [LoggerService, ConfigService],
  exports: [LoggerService, ConfigService],  // Export để reuse
})
export class SharedModule {}

// users/users.module.ts
@Module({
  imports: [SharedModule],  // Import shared module
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
// UsersService có thể inject LoggerService, ConfigService
```

### 2.4 Global Modules

```typescript
// database/database.module.ts
@Global()  // Chỉ cần import 1 lần ở root module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

// Tất cả modules khác có thể inject PrismaService
// mà không cần import DatabaseModule
```

### 2.5 Dynamic Modules

```typescript
// config/config.module.ts
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

---

## 3. Controllers

### 3.1 Controller là gì?

Controller xử lý incoming HTTP requests và trả về responses.

```typescript
// users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';

@Controller('users')  // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // POST /users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

### 3.2 HTTP Method Decorators

| Decorator | HTTP Method | Ví dụ |
|-----------|-------------|-------|
| `@Get()` | GET | `@Get('profile')` |
| `@Post()` | POST | `@Post()` |
| `@Put()` | PUT | `@Put(':id')` |
| `@Patch()` | PATCH | `@Patch(':id')` |
| `@Delete()` | DELETE | `@Delete(':id')` |
| `@All()` | All methods | `@All()` |

### 3.3 Request Data Decorators

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll(
    @Query('page') page: number,           // Query params: ?page=1
    @Query('limit') limit: number,         // ?limit=10
    @Headers('authorization') auth: string, // Request headers
    @Ip() ip: string,                      // Client IP
    @Req() request: Request,               // Full request object
    @Res() response: Response,             // Response object
  ) {
    // ...
  }

  @Post()
  create(
    @Body() body: CreateUserDto,           // Full body
    @Body('name') name: string,            // Specific field
  ) {
    // ...
  }

  @Get(':id/tasks/:taskId')
  getTask(
    @Param('id') userId: string,           // Route param
    @Param('taskId') taskId: string,
    @Param() params: { id: string; taskId: string }, // All params
  ) {
    // ...
  }
}
```

### 3.4 Response Handling

```typescript
import { HttpCode, Header, Redirect } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // Custom status code
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Custom header
  @Get('export')
  @Header('Content-Type', 'text/csv')
  export() {
    return 'name,email\nJohn,john@test.com';
  }

  // Redirect
  @Get('old-route')
  @Redirect('/users', 301)
  oldRoute() {
    // Redirects to /users
  }

  // Dynamic redirect
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string) {
    if (version === 'v5') {
      return { url: 'https://docs.nestjs.com/v5' };
    }
  }
}
```

---

## 4. Providers & Services

### 4.1 Provider là gì?

Provider là bất kỳ class nào có thể được inject như dependency. Service là loại provider phổ biến nhất.

```typescript
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()  // Đánh dấu là injectable provider
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const user = {
      id: Date.now(),
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: number): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
```

### 4.2 Các loại Providers

```typescript
@Module({
  providers: [
    // 1. Standard provider (shorthand)
    UsersService,
    
    // 2. Value provider
    {
      provide: 'API_KEY',
      useValue: 'my-secret-api-key',
    },
    
    // 3. Class provider
    {
      provide: UsersService,
      useClass: process.env.NODE_ENV === 'test' 
        ? MockUsersService 
        : UsersService,
    },
    
    // 4. Factory provider
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const options = configService.get('database');
        return createConnection(options);
      },
      inject: [ConfigService],  // Dependencies cho factory
    },
    
    // 5. Existing provider (alias)
    {
      provide: 'AliasedService',
      useExisting: UsersService,
    },
  ],
})
export class UsersModule {}
```

### 4.3 Provider Scope

```typescript
import { Injectable, Scope } from '@nestjs/common';

// DEFAULT - Singleton, shared across entire application
@Injectable({ scope: Scope.DEFAULT })
export class SingletonService {}

// REQUEST - New instance for each request
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(@Inject(REQUEST) private request: Request) {}
}

// TRANSIENT - New instance for each consumer
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

---

## 5. Dependency Injection

### 5.1 Constructor Injection

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,      // Inject by type
    private readonly configService: ConfigService,
    @Inject('API_KEY') private readonly apiKey: string, // Inject by token
  ) {}
}
```

### 5.2 Property Injection (hiếm dùng)

```typescript
@Injectable()
export class UsersService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;
}
```

### 5.3 Circular Dependencies

```typescript
// Khi A depends on B và B depends on A
// Sử dụng forwardRef()

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
  ) {}
}

@Injectable()
export class TasksService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
}
```

---

## 6. Middleware

### 6.1 Function Middleware

```typescript
// common/middleware/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
```

### 6.2 Class Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

### 6.3 Applying Middleware

```typescript
// app.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

@Module({
  imports: [UsersModule, TasksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');  // Tất cả routes

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes('*');

    consumer
      .apply(CorsMiddleware, HelmetMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}
```

---

## 7. Exception Filters

### 7.1 Built-in Exceptions

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(dto: CreateUserDto) {
    const exists = this.users.find(u => u.email === dto.email);
    if (exists) {
      throw new ConflictException('Email already exists');
    }
    // ...
  }
}
```

### 7.2 Custom Exception Filter

```typescript
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### 7.3 Applying Exception Filter

```typescript
// Controller level
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}

// Method level
@Post()
@UseFilters(HttpExceptionFilter)
create() {}

// Global level (main.ts)
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## 8. Pipes

### 8.1 Built-in Pipes

```typescript
import { ParseIntPipe, ParseUUIDPipe, DefaultValuePipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // ParseIntPipe - convert string to number
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // DefaultValuePipe - default value nếu undefined
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAll({ page, limit });
  }

  // ParseUUIDPipe - validate UUID format
  @Get(':uuid')
  findByUuid(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findByUuid(uuid);
  }
}
```

### 8.2 Validation Pipe

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip không hợp lệ properties
    forbidNonWhitelisted: true, // Throw error nếu có unknown properties
    transform: true,           // Auto transform types
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  await app.listen(3000);
}
```

### 8.3 Custom Pipe

```typescript
// common/pipes/parse-int.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('Validation failed (positive integer expected)');
    }
    return val;
  }
}
```

---

## 9. Guards

### 9.1 Auth Guard

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      return false;
    }
    
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 9.2 Role Guard

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;  // No roles required
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  adminOnly() {
    return 'Admin content';
  }
}
```

---

## 10. Interceptors

### 10.1 Logging Interceptor

```typescript
// common/interceptors/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`[${method}] ${url} - Started`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[${method}] ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

### 10.2 Transform Interceptor

```typescript
// common/interceptors/transform.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

---

## 📊 Request Lifecycle (Thứ tự thực thi)

```
Incoming Request
       │
       ▼
┌─────────────────┐
│   Middleware    │  → Logging, CORS, etc.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Guards      │  → Authentication, Authorization
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Interceptors   │  → Before handler (logging, caching)
│    (Before)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Pipes       │  → Validation, Transformation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Handler      │  → Controller method
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Interceptors   │  → After handler (transform response)
│    (After)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Exception Filters│  → Handle errors
└────────┬────────┘
         │
         ▼
    Response
```

---

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Fundamentals Course](https://courses.nestjs.com)
