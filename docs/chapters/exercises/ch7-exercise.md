# Chương 7 — Bài tập ứng dụng: Bảo vệ API với JWT Authentication

## 1. Mục tiêu

Bài tập này giúp người đọc vận dụng kiến thức Authentication & Authorization đã học trong Chương 7 để bảo vệ toàn bộ API StudentManager. Sau khi hoàn thành, người đọc sẽ:

- Biết cách triển khai hệ thống đăng ký (Register) và đăng nhập (Login) với JWT.
- Hiểu cơ chế hoạt động của Passport Strategy và Guards trong NestJS.
- Áp dụng được `@UseGuards(JwtAuthGuard)` để bảo vệ các route cần xác thực.
- Phân biệt được luồng request có token (200 OK) và không có token (401 Unauthorized).

## 2. Mô tả bài tập

Tiếp tục từ dự án `student-manager`, bổ sung module **Auth** để bảo vệ các endpoint quản lý sinh viên. Chỉ những người dùng đã đăng nhập và có JWT token hợp lệ mới được phép thao tác dữ liệu.

**Yêu cầu cụ thể:**

1. Thêm model `User` vào Prisma schema (id, email, password, name).
2. Tạo `AuthModule` với hai endpoint: `POST /auth/register` và `POST /auth/login`.
3. Mã hóa mật khẩu bằng `bcrypt` trước khi lưu database.
4. Khi đăng nhập thành công, trả về JWT token chứa `userId` và `email`.
5. Tạo `JwtStrategy` và `JwtAuthGuard` để xác minh token.
6. Áp dụng `@UseGuards(JwtAuthGuard)` lên toàn bộ `StudentController`.
7. Kiểm tra luồng hoàn chỉnh: Register → Login → Dùng token truy cập API.

## 3. Code minh họa

### Bước 1: Cài đặt dependencies

```bash
npm install @nestjs/passport passport @nestjs/jwt passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

- `@nestjs/passport` và `passport` cung cấp framework xác thực linh hoạt.
- `@nestjs/jwt` và `passport-jwt` xử lý việc tạo và kiểm tra JWT token.
- `bcrypt` mã hóa mật khẩu một chiều (không thể giải mã ngược).

### Bước 2: Thêm Model User vào Prisma Schema

```prisma
// prisma/schema.prisma (bổ sung)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())

  @@map("users")
}
```

Chạy migration:

```bash
npx prisma migrate dev --name add_user
```

> (Ảnh chụp: Terminal hiển thị migration add_user thành công)

### Bước 3: Tạo Auth DTOs

```typescript
// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
}
```

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  password: string;
}
```

### Bước 4: Triển khai AuthService

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

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

    // Mã hóa mật khẩu với bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // Trả về thông tin user (không bao gồm password)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login(dto: LoginDto) {
    // Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
```

Điểm cần lưu ý:
- `bcrypt.hash(password, 10)` mã hóa mật khẩu với 10 salt rounds — mật khẩu gốc không bao giờ được lưu trực tiếp vào database.
- `bcrypt.compare()` so sánh mật khẩu người dùng nhập với hash đã lưu.
- JWT payload chứa `sub` (subject = userId) và `email` — đây là thông tin được mã hóa vào token.
- Message lỗi đăng nhập cố tình không phân biệt "sai email" hay "sai mật khẩu" để tránh lộ thông tin.

### Bước 5: Tạo AuthController

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

### Bước 6: Tạo JWT Strategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'student-manager-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Giá trị trả về sẽ được gắn vào request.user
    return { userId: payload.sub, email: payload.email };
  }
}
```

- `ExtractJwt.fromAuthHeaderAsBearerToken()` tự động trích xuất token từ header `Authorization: Bearer <token>`.
- `secretOrKey` phải khớp với secret dùng để ký token trong `JwtModule`.
- Method `validate()` được gọi sau khi token đã được xác minh hợp lệ — giá trị trả về sẽ được gắn vào `request.user`.

### Bước 7: Tạo JwtAuthGuard

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Guard này kế thừa `AuthGuard('jwt')`, tự động kích hoạt `JwtStrategy` để xác minh token khi được áp dụng lên route.

### Bước 8: Cấu hình AuthModule

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'student-manager-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

Thêm `AuthModule` vào `AppModule`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, StudentModule, AuthModule],
})
export class AppModule {}
```

### Bước 9: Bảo vệ StudentController

```typescript
// src/student/student.controller.ts (bổ sung)
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
@UseGuards(JwtAuthGuard) // Bảo vệ TOÀN BỘ endpoints trong controller
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.remove(id);
  }
}
```

Chỉ cần thêm một dòng `@UseGuards(JwtAuthGuard)` ở cấp class, toàn bộ 5 endpoints trong `StudentController` đều được bảo vệ. Bất kỳ request nào không có JWT token hợp lệ sẽ bị từ chối với status 401.

### Bước 10: Kiểm tra luồng hoàn chỉnh bằng Hoppscotch

**Test 1 — Đăng ký tài khoản (Register):**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/register`
- **Body:**
```json
{
  "email": "admin@sgu.edu.vn",
  "password": "123456",
  "name": "Admin SGU"
}
```
- **Expected:** Status 201 — trả về thông tin user (không có password).

> (Ảnh chụp: Hoppscotch POST /auth/register — response 201 với id, email, name)

**Test 2 — Đăng nhập (Login):**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/login`
- **Body:**
```json
{
  "email": "admin@sgu.edu.vn",
  "password": "123456"
}
```
- **Expected:** Status 201 — trả về `{ accessToken: "eyJhbGc..." }`.

> (Ảnh chụp: Hoppscotch POST /auth/login — response 201 với accessToken JWT)

**Test 3 — Truy cập API KHÔNG CÓ token (401):**
- **Method:** GET
- **URL:** `http://localhost:3000/students`
- **Headers:** Không có Authorization
- **Expected:** Status 401 — `{ "message": "Unauthorized" }`.

> (Ảnh chụp: Hoppscotch GET /students không có token — response 401 Unauthorized)

**Test 4 — Truy cập API CÓ token (200):**
- **Method:** GET
- **URL:** `http://localhost:3000/students`
- **Headers:** `Authorization: Bearer eyJhbGc...` (copy token từ Test 2)
- **Expected:** Status 200 — danh sách sinh viên.

> (Ảnh chụp: Hoppscotch GET /students với Bearer token — response 200 với danh sách sinh viên)

**Test 5 — Đăng nhập sai mật khẩu (401):**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/login`
- **Body:**
```json
{
  "email": "admin@sgu.edu.vn",
  "password": "sai-mat-khau"
}
```
- **Expected:** Status 401 — `"Email hoặc mật khẩu không đúng"`.

> (Ảnh chụp: Hoppscotch POST /auth/login sai password — response 401)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập, chúng ta đã:

- Triển khai hệ thống xác thực hoàn chỉnh với Register và Login.
- Mật khẩu được mã hóa an toàn bằng bcrypt trước khi lưu database.
- JWT token được sinh ra khi đăng nhập, chứa thông tin user trong payload.
- JwtStrategy kiểm tra và giải mã token, JwtAuthGuard bảo vệ các route.
- Toàn bộ endpoint `StudentController` được bảo vệ — chỉ user đã đăng nhập mới truy cập được.
- Phân biệt rõ ràng giữa request có token (200) và không có token (401).

Qua 5 chương bài tập liên tiếp, mini project **StudentManager** đã đi từ một project trống (Chương 3) → có Module/Controller/Service (Chương 4) → kết nối database (Chương 5) → validation + response chuẩn hóa (Chương 6) → bảo mật JWT (Chương 7), minh họa trọn vẹn quy trình xây dựng một ứng dụng NestJS từ đầu đến cuối.
