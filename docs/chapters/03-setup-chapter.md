# Chương 3: Cài đặt Môi trường và Khởi tạo Dự án

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ biết cách cài đặt các công cụ cần thiết cho phát triển ứng dụng NestJS, khởi tạo một project mới bằng NestJS CLI, và hiểu được cấu trúc thư mục mặc định của một ứng dụng NestJS.

---

## 3.1. Các công cụ cần thiết

Trước khi bắt đầu phát triển ứng dụng NestJS, chúng ta cần chuẩn bị một bộ công cụ phù hợp. Việc lựa chọn và cài đặt đúng công cụ ngay từ đầu không chỉ giúp quá trình phát triển diễn ra suôn sẻ mà còn tránh được nhiều lỗi phát sinh sau này.

### 3.1.1. Node.js và npm (Cài đặt trên Host Machine)

Node.js là nền tảng runtime cho phép chạy JavaScript phía server. NestJS được xây dựng trên Node.js, do đó đây là công cụ bắt buộc đầu tiên cần **cài đặt trực tiếp lên hệ điều hành (Host Machine)** của bạn. Khi cài đặt Node.js, công cụ `npm` (Node Package Manager) dùng để tải các thư viện cho dự án cũng sẽ được tự động cài đặt kèm theo.

**Các bước cài đặt chi tiết dành cho Windows/macOS:**
1. Truy cập trang chủ chính thức tại: [https://nodejs.org/](https://nodejs.org/)
2. Tại trang chủ, click vào nút tải phiên bản có chữ **LTS (Long Term Support)** (nên dùng bản v18 trở lên). Đây là phiên bản ổn định nhất, khuyên dùng cho hầu hết người dùng.
3. Mở file `.msi` (Windows) hoặc `.pkg` (macOS) vừa tải về để bắt đầu quá trình cài đặt.
4. Trong cửa sổ cài đặt, bấm **Next** liên tục, đồng ý với các điều khoản (Accept License Agreement). Đảm bảo rằng lựa chọn "Add to PATH" mặc định đã được tick chọn (điều này giúp bạn gọi được lệnh `node` từ mọi thư mục). Bấm **Install** và đợi tiến trình hoàn tất.

Sau khi cài đặt xong, hãy xác minh bằng cách mở Terminal (hoặc Command Prompt / PowerShell trên Windows) và gõ hai lệnh sau:

```bash
node --version   # Kết quả mong đợi: v18.x.x hoặc cao hơn
npm --version    # Kết quả mong đợi: 9.x.x hoặc cao hơn
```

### 3.1.2. NestJS CLI (Cài đặt qua Terminal)

NestJS CLI (Command Line Interface) là công cụ dòng lệnh chính thức của NestJS, giúp bạn tương tác với framework. CLI giống như một người trợ lý: thay vì bạn phải tự tay tạo thư mục, tạo file với hàng chục dòng code cấu hình rườm rà, bạn chỉ cần gõ một lệnh, CLI sẽ lo hết.

Công cụ này được **cài đặt thông qua lệnh trên Terminal/Command Prompt** bằng `npm` vừa cài ở bước trên.

**Các bước cài đặt:**
1. Mở Terminal (macOS/Linux) hoặc Command Prompt / PowerShell (Windows).
2. Gõ câu lệnh sau và nhấn Enter:

```bash
npm install -g @nestjs/cli
```
*Ghi chú: Cờ `-g` (global) có nghĩa là bạn cài đặt công cụ này cho toàn bộ máy tính. Do đó, sau này dù bạn đang ở bất kỳ ổ đĩa hay thư mục nào, Terminal vẫn sẽ hiểu lệnh `nest`.*

3. Để chắc chắn công cụ đã sẵn sàng, gõ lệnh kiểm tra phiên bản:

```bash
nest --version   # Kết quả mong đợi: 10.x.x
```

### 3.1.3. PostgreSQL (Khởi chạy bằng Docker)

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ. Thông thường, cài đặt Database trực tiếp lên máy tính cá nhân rất rườm rà (yêu cầu cấu hình Port, User, Service chằng chịt, dễ gây rác máy). Để giải quyết bài toán này, dự án sử dụng **Docker**. Docker giúp bạn tải và chạy cơ sở dữ liệu bên trong một chiếc "hộp chứa" (container) bị cô lập khỏi hệ điều hành gốc (Host).

Trình tự thiết lập như sau:

**Bước 1: Cài đặt Docker Desktop**
1. Truy cập [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/) tải bản Docker Desktop cho hệ điều hành của bạn.
2. Cạy file cài đặt và làm theo hướng dẫn (bấm Next và OK, giữ nguyên cài đặt mặc định). Sau khi cài xong, đôi lúc hệ thống sẽ yêu cầu khởi động lại máy tính.
3. Mở ứng dụng Docker Desktop lên và đợi biểu tượng thanh trạng thái góc dưới cùng bên trái hiện màu xanh lá cây (Running).

**Bước 2: Chuẩn bị file `docker-compose.yml`**
Thay vì gõ hàng tá lệnh cấu hình dài dòng, Docker cung cấp công cụ `docker-compose` giúp bạn khai báo cấu hình Database sẵn vào một file tên là `docker-compose.yml`. Tại thư mục gốc của dự án của bạn (ví dụ thư mục `todolist-collaboration`), tạo một file text, lưu với tên `docker-compose.yml` (hoặc mở file đã có sẵn) và paste nội dung sau vào:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: todolist_pg_db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: todolist_collaboration
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
*Giải thích:*
- `image`: Tải PostgreSQL bản số 15.
- `environment`: Chúng ta đặt User là `admin`, mật khẩu `secretpassword`, và tên database là `todolist_collaboration`.
- `ports`: Kết nối cổng 5432 của máy thật (host) với cổng 5432 bên trong Database. Bằng cách này, ứng dụng NestJS của bạn có thể giao tiếp với DB qua `localhost:5432`.
- `volumes`: Giúp dữ liệu không bị xoá mất khi bạn tắt máy ngang.

**Bước 3: Khởi chạy Database bằng lệnh**
1. Mở Terminal / Command Prompt.
2. Dùng lệnh `cd` để điều hướng vào thư mục chứa file `docker-compose.yml` (Ví dụ: `cd d:\IT\Projects\CCNLTHD`).
3. Chạy lệnh:

```bash
docker-compose up -d
```
*Giải thích: `up` là lệnh khởi động các dịch vụ khai báo trong file. Cờ `-d` (detached) có nghĩa là chạy ngầm, bạn có thể tắt tab terminal đi mà Database vẫn chạy.*

Đến đây, Database của bạn đã sẵn sàng ở địa chỉ: `postgresql://admin:secretpassword@localhost:5432/todolist_collaboration`. Bạn có thể dùng phần mềm như **DBeaver** hoặc **pgAdmin** để kết nối bằng địa chỉ này và kiểm tra dữ liệu bằng giao diện trực quan.

### 3.1.4. Code Editor và Extensions

Visual Studio Code (VS Code) là editor được khuyên dùng cho phát triển NestJS nhờ hệ sinh thái extensions phong phú. Các extensions thiết yếu bao gồm Prisma (hỗ trợ syntax highlighting và auto-complete cho Prisma schema), ESLint (kiểm tra lỗi code style), và Prettier (tự động format code). Ngoài ra, Postman hoặc Insomnia là các công cụ cần thiết để test API endpoints trong quá trình phát triển.

### 3.1.5. Git

Git là hệ thống quản lý phiên bản mã nguồn, cho phép theo dõi lịch sử thay đổi code, quản lý các nhánh (branches), và cộng tác với các thành viên khác trong nhóm. NestJS CLI tự động khởi tạo Git repository khi tạo project mới.

---

## 3.2. Khởi tạo dự án NestJS

### 3.2.1. Tạo project mới

NestJS CLI cung cấp lệnh `nest new` để tạo một project mới với cấu trúc thư mục chuẩn, các file cấu hình cần thiết, và dependencies cơ bản. Khi chạy lệnh này, CLI sẽ hỏi package manager muốn sử dụng (npm, yarn, hoặc pnpm). Đối với dự án TodoList Collaboration, chúng ta sẽ sử dụng npm:

```bash
# Tạo project mới
nest new todolist-collaboration

# Chọn npm làm package manager khi được hỏi
? Which package manager would you ❤️ to use? npm

# Kết quả: CLI tự động tạo thư mục, cài dependencies, và khởi tạo Git
```

Sau khi lệnh hoàn tất, di chuyển vào thư mục project và khởi động ứng dụng ở chế độ development:

```bash
cd todolist-collaboration
npm run start:dev
```

Lệnh `npm run start:dev` sử dụng chế độ watch mode — ứng dụng sẽ tự động restart mỗi khi có thay đổi trong code, giúp developer không cần phải dừng và khởi động lại server thủ công. Khi ứng dụng khởi động thành công, terminal sẽ hiển thị thông báo "Nest application successfully started" và ứng dụng sẵn sàng nhận request tại `http://localhost:3000`.

### 3.2.2. Kiểm tra hoạt động

Để xác nhận ứng dụng đang chạy đúng, mở trình duyệt và truy cập `http://localhost:3000`. Nếu mọi thứ được cài đặt chính xác, trang sẽ hiển thị dòng chữ "Hello World!" — đây là response mặc định từ AppController mà NestJS CLI tạo sẵn.

Ngoài ra, có thể sử dụng curl hoặc Postman để test:

```bash
curl http://localhost:3000
# Kết quả: Hello World!
```

---

## 3.3. Cấu trúc thư mục dự án

### 3.3.1. Cấu trúc mặc định

Sau khi tạo project mới, NestJS CLI sinh ra cấu trúc thư mục sau đây. Mỗi file có vai trò cụ thể trong kiến trúc của ứng dụng:

```
todolist-collaboration/
├── src/
│   ├── main.ts              → Entry point - khởi động ứng dụng
│   ├── app.module.ts        → Root module - tập hợp tất cả modules
│   ├── app.controller.ts    → Controller mặc định - xử lý GET /
│   ├── app.service.ts       → Service mặc định - chứa logic "Hello World"
│   └── app.controller.spec.ts → Unit test cho AppController
├── test/
│   ├── app.e2e-spec.ts      → End-to-end test
│   └── jest-e2e.json        → Cấu hình Jest cho E2E testing
├── node_modules/             → Thư viện dependencies
├── package.json              → Thông tin project và dependencies
├── tsconfig.json             → Cấu hình TypeScript compiler
├── tsconfig.build.json       → Cấu hình build production
├── nest-cli.json             → Cấu hình NestJS CLI
└── .eslintrc.js              → Cấu hình ESLint
```

### 3.3.2. Giải thích các file chính

File `main.ts` là điểm khởi đầu của toàn bộ ứng dụng. Khi chạy `npm run start:dev`, Node.js sẽ thực thi file này đầu tiên. Nhiệm vụ chính của `main.ts` là tạo một NestJS application instance từ AppModule và lắng nghe request trên một port cụ thể:

```typescript
// src/main.ts - Entry point của ứng dụng
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
```

File `app.module.ts` là Root Module — module gốc tập hợp tất cả các feature modules của ứng dụng. Trong giai đoạn ban đầu, file này chỉ chứa AppController và AppService. Khi dự án phát triển, chúng ta sẽ import thêm các modules như TaskModule, AuthModule, ProjectModule:

```typescript
// src/app.module.ts - Root Module
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],       // Sẽ thêm TaskModule, AuthModule, PrismaModule...
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

File `app.controller.ts` minh họa cách một Controller cơ bản hoạt động. Controller này xử lý HTTP GET request đến route gốc `/` và trả về kết quả từ AppService:

```typescript
// src/app.controller.ts - Controller mặc định
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

File `app.service.ts` chứa business logic. Trong trường hợp mặc định, logic rất đơn giản — chỉ trả về chuỗi "Hello World!". Tuy nhiên, pattern này minh họa nguyên tắc quan trọng: Controller không chứa logic, mà delegate cho Service:

```typescript
// src/app.service.ts - Service mặc định
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### 3.3.3. Cấu trúc mở rộng cho dự án TodoList Collaboration

Khi dự án phát triển, chúng ta sẽ tổ chức code theo modules. Mỗi feature có một thư mục riêng chứa controller, service, DTOs, và module file. Dưới đây là cấu trúc thực tế của dự án TodoList Collaboration:

```
src/
├── main.ts
├── app.module.ts
├── prisma/
│   ├── prisma.module.ts        → Shared Module kết nối database
│   └── prisma.service.ts       → PrismaClient wrapper
├── auth/
│   ├── auth.module.ts          → Authentication module
│   ├── auth.controller.ts      → Xử lý register, login
│   ├── auth.service.ts         → Logic xác thực
│   ├── strategies/
│   │   └── jwt.strategy.ts     → JWT validation strategy
│   ├── guards/
│   │   └── jwt-auth.guard.ts   → Route protection guard
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
├── task/
│   ├── task.module.ts          → Task feature module
│   ├── task.controller.ts      → CRUD endpoints cho tasks
│   ├── task.service.ts         → Business logic xử lý tasks
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
├── project/
│   ├── project.module.ts
│   ├── project.controller.ts
│   └── project.service.ts
└── workspace/
    ├── workspace.module.ts
    ├── workspace.controller.ts
    └── workspace.service.ts
```

Cấu trúc này tuân theo nguyên tắc "một thư mục cho một feature module", giúp code dễ tìm kiếm, dễ bảo trì, và cho phép nhiều thành viên làm việc song song trên các modules khác nhau mà ít xung đột.

---

## 3.4. Sử dụng NestJS CLI để generate components

### 3.4.1. Generate Module, Controller, Service

NestJS CLI cung cấp lệnh `nest generate` (viết tắt `nest g`) để tự động tạo các components. Đây là cách nhanh nhất và ít lỗi nhất để thêm feature mới vào dự án, vì CLI sẽ tự động tạo file với đúng cấu trúc, import cần thiết, và cập nhật module tương ứng.

Ví dụ, khi cần tạo module Task cho dự án, chúng ta chạy ba lệnh sau:

```bash
# Tạo module Task
nest g module task
# Kết quả: CREATE src/task/task.module.ts
# Kết quả: UPDATE src/app.module.ts (tự động import TaskModule)

# Tạo controller cho Task
nest g controller task --no-spec
# Kết quả: CREATE src/task/task.controller.ts
# Kết quả: UPDATE src/task/task.module.ts (tự động thêm controller)

# Tạo service cho Task
nest g service task --no-spec
# Kết quả: CREATE src/task/task.service.ts
# Kết quả: UPDATE src/task/task.module.ts (tự động thêm provider)
```

Flag `--no-spec` bỏ qua việc tạo file test (.spec.ts), giúp giữ thư mục gọn gàng trong giai đoạn phát triển ban đầu. Sau khi chạy xong ba lệnh trên, NestJS CLI đã tạo ra một TaskModule hoàn chỉnh với controller và service, đồng thời tự động import TaskModule vào AppModule.

### 3.4.2. Các lệnh generate phổ biến

Bảng dưới đây tổng hợp các lệnh generate thường dùng nhất khi phát triển dự án NestJS:

| Lệnh | Kết quả | Mô tả |
| :--- | :--- | :--- |
| `nest g module task` | `src/task/task.module.ts` | Tạo module mới |
| `nest g controller task` | `src/task/task.controller.ts` | Tạo controller |
| `nest g service task` | `src/task/task.service.ts` | Tạo service |
| `nest g resource task` | Module + Controller + Service + DTOs | Tạo trọn bộ CRUD resource |
| `nest g guard jwt-auth` | `src/jwt-auth.guard.ts` | Tạo guard |
| `nest g interceptor logging` | `src/logging.interceptor.ts` | Tạo interceptor |
| `nest g pipe validation` | `src/validation.pipe.ts` | Tạo pipe |

Lệnh `nest g resource` đặc biệt hữu ích vì nó tạo ra toàn bộ CRUD boilerplate cho một feature, bao gồm module, controller với các endpoints REST đầy đủ (GET, POST, PATCH, DELETE), service, và các DTO files. Khi được hỏi transport layer, chọn "REST API" cho dự án web application.

---

## 3.5. Tổng kết

Chương này đã hướng dẫn đầy đủ quy trình thiết lập môi trường phát triển cho dự án NestJS, từ việc cài đặt các công cụ nền tảng như Node.js, PostgreSQL và NestJS CLI, đến việc khởi tạo project và hiểu cấu trúc thư mục. Điểm quan trọng nhất cần nắm là cách NestJS tổ chức code theo modules — mỗi feature (Task, Auth, Project) nằm trong một thư mục riêng biệt với controller, service, và DTOs của riêng nó.

NestJS CLI đóng vai trò trung tâm trong việc tự động hóa quá trình phát triển, từ tạo project đến generate các components. Việc sử dụng CLI thay vì tạo file thủ công giúp đảm bảo tính nhất quán về cấu trúc và giảm thiểu lỗi phát sinh do thiếu import hay sai cú pháp. Với môi trường đã được thiết lập, chương tiếp theo sẽ đi sâu vào các khái niệm kiến trúc cốt lõi của NestJS.
