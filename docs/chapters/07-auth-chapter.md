# Chương 7: Authentication & Authorization (Bảo mật)

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ hiểu được sự khác biệt giữa Authentication và Authorization, nắm vững cơ chế hoạt động của JWT, biết cách xây dựng hệ thống đăng ký/đăng nhập với NestJS, và sử dụng Guards để bảo vệ các API endpoints — cụ thể là bảo vệ các route quản lý Task trong dự án TodoList Collaboration.

---

## 7.1. Khái niệm cơ bản

### 7.1.1. Authentication vs Authorization

Trong bảo mật ứng dụng web, hai khái niệm thường bị nhầm lẫn nhất là Authentication (Xác thực) và Authorization (Phân quyền). Mặc dù cả hai đều liên quan đến việc kiểm soát quyền truy cập, chúng giải quyết hai câu hỏi hoàn toàn khác nhau.

Authentication trả lời câu hỏi **"Bạn là ai?"** — đây là quá trình xác minh danh tính người dùng, thường thông qua việc kiểm tra email và mật khẩu. Khi user đăng nhập thành công, hệ thống xác nhận đây đúng là người dùng họ tuyên bố. Một phép ẩn dụ quen thuộc: đây giống như nhân viên bảo vệ sòng bài kiểm tra giấy tờ tùy thân của bạn ở cổng vào — mục đích duy nhất là biết **bạn là ai**.

Authorization thì khác, nó trả lời câu hỏi **"Bạn được làm gì?"** — sau khi đã biết user là ai, hệ thống mới tiến hành kiểm tra tiếp xem user đó có đủ quyền hạn để thực hiện hành động cụ thể hay không. Tiếp tục ẩn dụ sòng bài: dù bảo vệ đã nhận ra tấm thẻ VIP của bạn, nhưng thẻ thành viên Hạng Bạc chỉ cho váo phòng chơi thường, **không** được vào phòng VIP.

Trong dự án TodoList Collaboration, hai quá trình này hoạt động tuần tự và bổ trợ cho nhau. Khi một user muốn tạo Task mới (`POST /tasks`), đầu tiên hệ thống thực hiện **Authentication** bằng cách kiểm tra JWT token trong request header để xác định danh tính: *"Đây là user có ID xyz"*. Ngay sau đó, hệ thống chuyển sang **Authorization**: *"User xyz có phải là thành viên của Project này không? Nếu không, từ chối yêu cầu."* Thiếu bất kỳ bước nào trong hai bước này đều dẫn đến lỗ hổng bảo mật nghiêm trọng.

### 7.1.2. JWT (JSON Web Token)

JWT là chuẩn mở (RFC 7519) cho việc truyền tải thông tin an toàn giữa các bên dưới dạng JSON object. Trong NestJS, JWT được sử dụng phổ biến nhất cho stateless authentication — nghĩa là server không cần lưu trữ session, mà thay vào đó client gửi token trong mỗi request để chứng minh danh tính.

Một JWT token có cấu trúc gồm ba phần, được phân tách bởi dấu chấm: `Header.Payload.Signature`. Phần Header chứa thông tin về thuật toán mã hóa (thường là HS256). Phần Payload chứa các claims — dữ liệu về user như userId, email, và thời gian hết hạn. Phần Signature được tạo bằng cách mã hóa Header và Payload với một secret key, đảm bảo token không bị giả mạo.

Ưu điểm chính của JWT so với session-based authentication là khả năng stateless. Server không cần lưu trữ thông tin session trong bộ nhớ hay database, giúp ứng dụng dễ dàng scale horizontally. Mỗi request mang theo đầy đủ thông tin cần thiết trong token, server chỉ cần verify signature là có thể xác định user.

Trong dự án, chúng ta sử dụng hai loại token: Access Token (thời hạn ngắn, thường 15 phút đến 7 ngày) dùng để xác thực mỗi request, và Refresh Token (thời hạn dài hơn) dùng để cấp lại Access Token mới khi token cũ hết hạn.

---

## 7.2. Cài đặt các packages cần thiết

Để xây dựng hệ thống authentication trong NestJS, chúng ta cần cài đặt một số packages chuyên dụng. Mỗi package đảm nhận một vai trò cụ thể trong quy trình xác thực:

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

Package `@nestjs/passport` là wrapper tích hợp Passport.js (thư viện authentication phổ biến nhất của Node.js) vào NestJS thông qua Guards và Strategies. Package `@nestjs/jwt` cung cấp JwtModule và JwtService để tạo và verify JWT tokens. Package `bcrypt` dùng để hash mật khẩu trước khi lưu vào database — không bao giờ lưu mật khẩu dạng plain text. Các packages có prefix `@types/` là TypeScript type definitions, giúp IDE hỗ trợ auto-complete.

---

## 7.3. Xây dựng Auth Module

### 7.3.1. Cấu trúc Auth Module

Auth Module là feature module chịu trách nhiệm toàn bộ quy trình xác thực trong ứng dụng. Module này cần import PrismaModule (để truy cập database tìm kiếm user), JwtModule (để tạo và verify JWT tokens), và PassportModule (để sử dụng authentication strategies).

```typescript
// auth/auth.module.ts
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
      secret: process.env.JWT_SECRET || 'todolist-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

Trong cấu hình trên, `PassportModule.register({ defaultStrategy: 'jwt' })` thiết lập JWT làm strategy mặc định cho authentication. `JwtModule.register()` cấu hình secret key dùng để ký token và thời hạn token là 7 ngày. JwtStrategy được khai báo trong providers vì nó là một Injectable class mà Passport cần sử dụng.

### 7.3.2. DTOs cho Authentication

Trước khi viết logic xác thực, cần định nghĩa DTOs (Data Transfer Objects) để validate dữ liệu đầu vào từ client. DTO đảm bảo rằng request body chứa đúng các fields cần thiết với đúng kiểu dữ liệu:

```typescript
// auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

```typescript
// auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

Các decorators như `@IsEmail()`, `@MinLength(6)` đến từ thư viện `class-validator`, phối hợp với ValidationPipe của NestJS để tự động validate và trả về lỗi rõ ràng nếu dữ liệu không hợp lệ.

### 7.3.3. Auth Service – Logic xác thực

AuthService chứa toàn bộ business logic cho việc đăng ký và đăng nhập. Service này inject PrismaService để truy vấn database và JwtService để tạo token:

```typescript
// auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
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
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // 2. Hash mật khẩu với bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Tạo user mới trong database
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true }, // Không trả về password
    });

    // 4. Tạo JWT token và trả về
    const token = this.generateToken(user.id, user.email);
    return { user, accessToken: token };
  }

  async login(dto: LoginDto) {
    // 1. Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 2. So sánh mật khẩu với hash đã lưu
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // 3. Tạo JWT token
    const token = this.generateToken(user.id, user.email);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
```

Quy trình Register diễn ra qua 4 bước liên tiếp. Ở bước đầu tiên, hệ thống kiểm tra xem email đã tồn tại trong database chưa; nếu trùng, một `ConflictException` (lỗi 409) được ném ra ngay lập tức để bảo vệ tính duy nhất của tài khoản. Bước thứ hai là giai đoạn cực kỳ quan trọng về bảo mật: **hash mật khẩu bằng bcrypt**.

Bcrypt là thuật toán hash một chiều được thiết kế đặc biệt để bảo vệ mật khẩu. Điểm then chốt là tham số `salt rounds` (ở đây là `10`) — đây là số vòng lặp tính toán mà bcrypt thực hiện. Mỗi lần tăng thêm 1 round, thời gian tính toán tăng gấp đôi, khiến cho các cuộc tấn công dò mật khẩu (brute-force) trở nên cực kỳ tốn kém về mặt thời gian và tài nguyên máy tính. Thêm vào đó, bcrypt tự động tích hợp một giá trị ngẫu nhiên (gọi là `salt`) vào quá trình mã hóa, đảm bảo rằng ngay cả hai user có **cùng mật khẩu** cũng sẽ cho ra hai chuỗi hash **hoàn toàn khác nhau** trong database — đây là tường thành bảo vệ hiệu quả chống lại các cuộc tấn công Rainbow Table (bảng tra cứu hash có sẵn). Ở bước thứ ba, user mới được lưu vào database và người dùng nhận về access token.

Quy trình Login gồm 3 bước: tìm user theo email, so sánh mật khẩu, và tạo token. Lưu ý rằng thông báo lỗi cho cả trường hợp sai email và sai password đều giống nhau ("Email hoặc mật khẩu không đúng") — đây là best practice bảo mật để tránh kẻ tấn công biết được email nào tồn tại trong hệ thống.

### 7.3.4. Auth Controller – API Endpoints

AuthController expose hai endpoints chính cho client: đăng ký và đăng nhập. Controller chỉ đơn thuần tiếp nhận request và chuyển tiếp cho AuthService xử lý:

```typescript
// auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

Khi client gửi POST request đến `/auth/register` với body chứa name, email, password, NestJS sẽ tự động validate dữ liệu theo RegisterDto, sau đó gọi `authService.register()`. Tương tự cho endpoint `/auth/login`.

---

## 7.4. JWT Strategy – Xác thực Token

### 7.4.1. Strategy Pattern trong Passport

Passport.js sử dụng concept "Strategy" — mỗi phương thức xác thực (JWT, Local, Google OAuth, Facebook) được triển khai như một strategy riêng biệt. Trong dự án, chúng ta sử dụng JWT Strategy để xác thực token đi kèm mỗi request.

JwtStrategy kế thừa từ `PassportStrategy(Strategy)` và thực hiện hai nhiệm vụ: trích xuất JWT token từ Authorization header, và validate payload sau khi verify signature thành công:

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Trích xuất token từ header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Không chấp nhận token hết hạn
      ignoreExpiration: false,
      // Secret key phải khớp với key dùng khi sign token
      secretOrKey: process.env.JWT_SECRET || 'todolist-secret-key',
    });
  }

  // Method này được gọi SAU KHI Passport verify signature thành công
  async validate(payload: { sub: string; email: string }) {
    // Giá trị return sẽ được gán vào request.user
    return { userId: payload.sub, email: payload.email };
  }
}
```

Khi một request đến server với header `Authorization: Bearer eyJhbG...`, Passport sẽ tự động trích xuất token, verify signature bằng secret key, kiểm tra expiration, và nếu mọi thứ hợp lệ, gọi method `validate()`. Giá trị trả về từ `validate()` sẽ được NestJS gắn vào `request.user`, cho phép các controller và service truy cập thông tin user hiện tại.

---

## 7.5. Guards – Bảo vệ Routes

### 7.5.1. Guard là gì?

Như đã trình bày ở **Chương 6**, Guard là một trong các thành phần quan trọng bậc nhất trong Request Lifecycle của NestJS — đứng sau Middleware nhưng trước Interceptors, Pipes, và Controllers. Trong chương đó, chúng ta hiểu Guard về mặt lý thuyết và cơ chế. Chương này áp dụng Guard cụ thể vào bài toán **bảo mật API Authentication**.

### 7.5.2. JwtAuthGuard

Để sử dụng JWT Strategy, chúng ta tạo một Guard wrapping Passport authentication:

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Class trông đơn giản nhưng thực hiện rất nhiều việc ngầm: kích hoạt JWT Strategy, verify token, gọi `validate()`, và gắn user vào request. Nếu token không hợp lệ hoặc hết hạn, Guard tự động trả về lỗi 401 Unauthorized.

### 7.5.3. Áp dụng Guard vào TaskController

Bây giờ chúng ta áp dụng JwtAuthGuard vào TaskController để bảo vệ các endpoints quản lý task. Chỉ user đã đăng nhập mới có thể tạo, sửa, xóa tasks:

```typescript
// task/task.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Áp dụng cho TẤT CẢ endpoints trong controller
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(@Request() req) {
    // req.user chứa { userId, email } từ JwtStrategy.validate()
    return this.taskService.findByUser(req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    // Tự động gắn userId của người tạo vào task
    return this.taskService.create(req.user.userId, createTaskDto);
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

Decorator `@UseGuards(JwtAuthGuard)` đặt ở cấp class nghĩa là tất cả endpoints trong TaskController đều yêu cầu authentication. Nếu muốn chỉ bảo vệ một số endpoints cụ thể, có thể đặt decorator ở cấp method thay vì cấp class.

Tuy nhiên, hãy để ý cách Controller trong ví dụ trên truy cập thông tin user thông qua `@Request() req` rồi đọc `req.user` — đây là cách làm hợp lệ nhưng có phần thô thiển, bộc lộ dependency vào object `request` của Express. Phần tiếp theo sẽ giới thiệu Custom Decorator để giải quyết vấn đề này một cách thanh lịch hơn.

### 7.5.4. Custom Decorator @CurrentUser

Như đã giới thiệu ở **Chương 6**, NestJS cho phép tạo **Custom Parameter Decorator** bằng hàm `createParamDecorator()`. Đây là kỹ thuật giúp trích xuất dữ liệu từ request một cách gọn gàng và biểu đạt đúng ý định. Trong ngữ cảnh Authentication, ta áp dụng kỹ thuật đó để tạo decorator `@CurrentUser()` — thay thế hoàn toàn cách viết `@Request() req` rồi đọc `req.user` thô thiển:

```typescript
// auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Sử dụng custom decorator trong TaskController:

```typescript
@Post()
create(@CurrentUser() user, @Body() createTaskDto: CreateTaskDto) {
  return this.taskService.create(user.userId, createTaskDto);
}
```

Cách viết này rõ ràng hơn `@Request() req` rồi truy cập `req.user`, vì decorator `@CurrentUser()` thể hiện chính xác ý định: lấy thông tin user hiện tại.

---

## 7.6. Luồng hoạt động tổng thể

Để hiểu toàn cảnh cách các thành phần phối hợp với nhau, hãy xem xét luồng hoạt động khi user thực hiện thao tác tạo task mới trong ứng dụng.

Mọi thứ bắt đầu khi user gửi `POST /auth/login` với email và password. `AuthController` tiếp nhận request, chuyển giao cho `AuthService` làm việc. `AuthService` tra cứu user trong database qua `PrismaService`, so sánh mật khẩu bằng `bcrypt.compare()`, và nếu hợp lệ, sử dụng `JwtService` ký (sign) một access token mang theo payload là `{ sub: userId, email }`. Token này được trả về cho client lưu trữ phía trình duyệt.

Tiếp theo, khi user muốn tạo task mới, client đính kèm token đó vào header `Authorization: Bearer <token>` và gửi `POST /tasks` kèm với body chứa thông tin task. Request vừa đặt chân vào server liền bị `JwtAuthGuard` chặn lại. Guard kích hoạt `JwtStrategy`, strategy trích xuất token ra khỏi header, gọi hàm verify để kiểm tra chữ ký số và thời gian hết hạn. Nếu mọi thứ hợp lệ, strategy gọi method `validate()` để biến payload thô `{ sub, email }` thành object sạch sẽ `{ userId, email }` rồi gắn nó vào `request.user`. Guard nhận kết quả `true` và mở cửa.

Cuối cùng, `TaskController` nhận request với `request.user` đã sẵn sàng. Nhờ Custom Decorator `@CurrentUser()`, controller trích xuất userId một cách thanh lịch và truyền cùng `CreateTaskDto` vào `TaskService`. Service tạo bản ghi Task mới trong database với trường `createdById` được gán chính xác là userId của người tạo, đảm bảo mỗi task luôn gắn liền với chủ nhân hợp pháp của nó.

---

## 7.7. Tổng kết

Chương này đã trình bày toàn bộ quy trình xây dựng hệ thống Authentication cho ứng dụng NestJS, từ các khái niệm nền tảng đến triển khai thực tế. Hành trình bắt đầu với việc phân biệt Authentication (xác thực danh tính) và Authorization (phân quyền), tiếp theo là tìm hiểu cơ chế JWT — chuẩn token stateless cho phép server xác thực mà không cần lưu session.

Phần triển khai đã xây dựng AuthModule hoàn chỉnh với register flow (kiểm tra trùng email, hash password, tạo user, cấp token) và login flow (tìm user, so sánh password, cấp token). JwtStrategy đóng vai trò cầu nối giữa Passport.js và NestJS, tự động verify token và trích xuất user identity. Guards hoạt động như lớp bảo vệ, quyết định request nào được phép truy cập controller.

Điểm quan trọng nhất là cách các thành phần này kết nối với module Task — JwtAuthGuard bảo vệ TaskController, `@CurrentUser()` decorator cung cấp thông tin user hiện tại, và TaskService sử dụng userId để gắn task với người tạo. Mô hình này đảm bảo mỗi thao tác trên task đều được liên kết với một user đã xác thực, tạo nền tảng cho các tính năng collaboration sau này.
