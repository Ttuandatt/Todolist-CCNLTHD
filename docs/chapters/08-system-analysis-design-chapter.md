# Chương 8: Phân tích và thiết kế hệ thống

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ nắm được toàn cảnh dự án TodoList Collaboration — từ yêu cầu chức năng, kiến trúc module, thiết kế cơ sở dữ liệu, đến các quyết định thiết kế quan trọng về API, bảo mật, và chuẩn hóa response. Đây là nền tảng thiết kế để chương tiếp theo triển khai chi tiết từng module.

---

## 8.1. Tổng quan dự án

### 8.1.1. Giới thiệu

TodoList Collaboration là ứng dụng quản lý công việc cộng tác, cho phép nhiều người dùng cùng làm việc trong các workspace chung. Dự án được xây dựng bằng NestJS (backend) và React (frontend), sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu và Prisma làm ORM.

Ứng dụng hướng đến việc giải quyết bài toán quản lý task trong môi trường nhóm — nơi mỗi thành viên cần theo dõi tiến độ công việc, phân công nhiệm vụ, và trao đổi thông qua bình luận. Khác với các ứng dụng todo đơn giản chỉ phục vụ cá nhân, TodoList Collaboration được thiết kế với hệ thống phân quyền đa cấp (Owner, Admin, Member) để phù hợp với quy trình làm việc thực tế của các nhóm dự án.

### 8.1.2. Các module chức năng

Hệ thống được chia thành các module theo nguyên tắc phân tách trách nhiệm, mỗi module đóng gói một domain nghiệp vụ riêng biệt:

| Module | Chức năng chính | Trạng thái |
|--------|----------------|------------|
| **Auth** | Đăng ký, đăng nhập, refresh token, logout, quên/đặt lại mật khẩu | Hoàn thành |
| **User** | Xem/cập nhật profile, đổi mật khẩu, upload avatar | Hoàn thành |
| **Workspace** | Tạo/quản lý workspace, mời thành viên, phân quyền | Sắp triển khai |
| **Project** | Tạo/quản lý project trong workspace | Sắp triển khai |
| **Task** | CRUD task, phân công, subtask, đổi trạng thái | Sắp triển khai |
| **Comment** | Bình luận trên task, reply | Sắp triển khai |
| **Notification** | Thông báo realtime | Sắp triển khai |
| **Label** | Nhãn phân loại task | Sắp triển khai |

Trong phạm vi báo cáo này, chúng ta tập trung phân tích thiết kế toàn hệ thống và triển khai chi tiết hai module nền tảng: **Auth** và **User**. Hai module này cung cấp hạ tầng xác thực và quản lý người dùng — nền tảng mà mọi module khác đều phụ thuộc vào.

### 8.1.3. Biểu đồ Use Case

Biểu đồ Use Case mô tả các chức năng chính mà hệ thống cung cấp cho từng loại tác nhân (actor). Trong phạm vi hai module Auth và User, hệ thống có hai tác nhân: **Guest** (người dùng chưa đăng nhập) và **Authenticated User** (người dùng đã xác thực):

```mermaid
graph LR
    Guest["👤 Guest<br/>(Chưa đăng nhập)"]
    AuthUser["👤 Authenticated User<br/>(Đã đăng nhập)"]

    subgraph AuthModule ["Module Auth"]
        UC1(("Đăng ký<br/>tài khoản"))
        UC2(("Đăng nhập"))
        UC3(("Làm mới<br/>token"))
        UC4(("Đăng xuất"))
        UC5(("Quên<br/>mật khẩu"))
        UC6(("Đặt lại<br/>mật khẩu"))
    end

    subgraph UserModule ["Module User"]
        UC7(("Xem hồ sơ<br/>cá nhân"))
        UC8(("Cập nhật<br/>hồ sơ"))
        UC9(("Đổi<br/>mật khẩu"))
        UC10(("Upload<br/>avatar"))
    end

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC5
    Guest --> UC6

    AuthUser --> UC4
    AuthUser --> UC7
    AuthUser --> UC8
    AuthUser --> UC9
    AuthUser --> UC10
```

Sơ đồ cho thấy sự phân tách rõ ràng: năm use case của Auth Module dành cho Guest (không yêu cầu đăng nhập), trong khi toàn bộ use case của User Module yêu cầu Authenticated User. Riêng use case "Đăng xuất" tuy thuộc Auth Module nhưng yêu cầu JWT — người dùng phải đang đăng nhập mới có thể đăng xuất. Thiết kế này phản ánh chiến lược Global Guard + `@Public()` đã đề cập ở phần bảo mật.

---

## 8.2. Kiến trúc hệ thống

### 8.2.1. Kiến trúc module

Ứng dụng tuân theo kiến trúc module hóa của NestJS (đã trình bày ở **Chương 4**), với `AppModule` đóng vai trò Root Module điều phối toàn bộ:

```mermaid
graph TD
    AppModule["AppModule (Root)"]
    AppModule --> ConfigModule["ConfigModule<br/>Biến môi trường (.env)"]
    AppModule --> PrismaModule["PrismaModule [@Global]<br/>Kết nối PostgreSQL (dùng chung toàn app)"]
    AppModule --> AuthModule["AuthModule<br/>Xác thực (register, login, JWT, ...)"]
    AppModule --> UserModule["UserModule<br/>Quản lý hồ sơ người dùng"]
```

Mỗi Feature Module (Auth, User) tuân theo cấu trúc ba tầng nhất quán:

```mermaid
graph LR
    Module["module.ts<br/>Khai báo module"] --> Controller["controller.ts<br/>Tầng Controller"]
    Controller --> Service["service.ts<br/>Tầng Service / Business Logic"]
    Controller -.-> DTO["dto/<br/>Data Transfer Objects"]
```

Cấu trúc ba tầng này phản ánh nguyên tắc **Separation of Concerns**: Controller chỉ tiếp nhận và phân phối request, Service chứa toàn bộ logic nghiệp vụ, DTO đảm bảo dữ liệu đầu vào hợp lệ. Khi cần thay đổi logic nghiệp vụ, chỉ cần sửa Service; khi thêm endpoint mới, chỉ cần sửa Controller. Các tầng hoàn toàn độc lập và có thể test riêng biệt.

### 8.2.2. Sơ đồ phụ thuộc giữa các module

```mermaid
graph TB
    subgraph AppModule
        ConfigModule
        GUARD["APP_GUARD: JwtAuthGuard"]

        subgraph PrismaModule ["PrismaModule [@Global]"]
            PrismaService
        end

        subgraph AuthModule
            AuthService
            JwtStrategy
        end

        subgraph UserModule
            UserService
            MulterModule
        end
    end

    AuthService -->|inject| PrismaService
    JwtStrategy -->|inject| PrismaService
    UserService -->|inject| PrismaService
    AuthModule -->|exports AuthService| UserModule
    GUARD -->|uses| JwtStrategy
```

Sơ đồ trên cho thấy mối quan hệ phụ thuộc rõ ràng. `PrismaModule` được đánh dấu `@Global()` nên mọi module đều có thể inject `PrismaService` mà không cần khai báo import. `AuthModule` export `AuthService` để các module khác sử dụng khi cần logic xác thực. `JwtAuthGuard` được đăng ký làm Global Guard tại `AppModule`, bảo vệ mọi endpoint mặc định — các endpoint công khai phải được đánh dấu tường minh bằng decorator `@Public()`.

---

## 8.3. Thiết kế cơ sở dữ liệu

### 8.3.1. Tổng quan schema

Cơ sở dữ liệu được thiết kế trên PostgreSQL với 17 bảng (models), được định nghĩa thông qua Prisma Schema (đã giới thiệu ở **Chương 5**). Trong phạm vi hai module Auth và User, chúng ta làm việc trực tiếp với bốn bảng chính:

| Bảng | Mục đích | Quan hệ chính |
|------|----------|---------------|
| `users` | Lưu thông tin người dùng | 1-N với RefreshToken, PasswordReset |
| `refresh_tokens` | Lưu refresh token (có thể thu hồi) | N-1 với User |
| `password_resets` | Lưu token đặt lại mật khẩu | N-1 với User |
| `invalidated_tokens` | Danh sách đen access token đã thu hồi | Không có FK |

### 8.3.2. Biểu đồ quan hệ thực thể (ERD)

**ERD tổng quan hệ thống** — thể hiện quan hệ giữa 17 bảng trong cơ sở dữ liệu:

```mermaid
erDiagram
    User ||--o{ RefreshToken : "has"
    User ||--o{ PasswordReset : "has"
    User ||--o{ Workspace : "owns"
    User ||--o{ WorkspaceMember : "joins"
    User ||--o{ Project : "creates"
    User ||--o{ Task : "creates"
    User ||--o{ TaskAssignment : "assigned"
    User ||--o{ Comment : "writes"
    User ||--o{ Attachment : "uploads"
    User ||--o{ Notification : "receives"
    User ||--o{ ActivityLog : "performs"
    User ||--o{ Invitation : "invites"

    Workspace ||--o{ WorkspaceMember : "has"
    Workspace ||--o{ Project : "contains"
    Workspace ||--o{ Label : "has"
    Workspace ||--o{ ActivityLog : "logs"
    Workspace ||--o{ Invitation : "has"

    Project ||--o{ Task : "contains"

    Task ||--o{ Subtask : "has"
    Task ||--o{ TaskAssignment : "assigned to"
    Task ||--o{ TaskLabel : "labeled"
    Task ||--o{ Comment : "has"
    Task ||--o{ Attachment : "has"

    Label ||--o{ TaskLabel : "used in"

    Comment ||--o{ Comment : "replies"
```

**ERD chi tiết — phạm vi Auth và User** (bốn bảng trực tiếp liên quan):

```mermaid
erDiagram
    User ||--o{ RefreshToken : "1-N"
    User ||--o{ PasswordReset : "1-N"

    User {
        uuid id PK
        string email UK
        string password
        string name
        string displayName
        string bio
        string avatar
        enum status "ACTIVE | INACTIVE | BANNED"
        boolean emailVerified
        datetime lastLoginAt
        datetime createdAt
        datetime updatedAt
    }

    RefreshToken {
        uuid id PK
        string token UK
        uuid userId FK
        datetime expiresAt
        datetime revokedAt "null = active"
        datetime createdAt
    }

    PasswordReset {
        uuid id PK
        uuid userId FK
        string token UK
        datetime expiresAt
        datetime usedAt "null = unused"
        datetime createdAt
    }

    InvalidatedToken {
        uuid id PK
        string token UK
        datetime expiresAt
        string reason "LOGOUT | BANNED | ..."
        datetime createdAt
    }
```

ERD tổng quan cho thấy bảng `User` là entity trung tâm — liên kết trực tiếp đến 12 bảng khác. Trong ERD chi tiết, bốn bảng phục vụ Auth/User được thể hiện đầy đủ với kiểu dữ liệu và constraint. Đáng chú ý, `InvalidatedToken` là bảng duy nhất không có foreign key — hoạt động độc lập như một "bộ lọc nhanh" cho cơ chế token blacklist.

### 8.3.3. Model User

Model User là entity trung tâm của toàn hệ thống, mọi module khác đều liên kết về đây:

```prisma
// prisma/schema.prisma
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  password      String
  name          String
  displayName   String?
  bio           String?
  avatar        String?
  status        UserStatus @default(ACTIVE)
  emailVerified Boolean    @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  refreshTokens  RefreshToken[]
  passwordResets  PasswordReset[]
  // ... các relations với Workspace, Task, Comment, ...

  @@index([email])
  @@map("users")
}
```

Một số quyết định thiết kế đáng chú ý. Field `id` sử dụng UUID (`@default(uuid())`) thay vì auto-increment integer — UUID không tiết lộ tổng số users trong hệ thống và không thể đoán trước, tăng cường bảo mật. Field `email` có constraint `@unique` đảm bảo không có hai tài khoản trùng email. Field `password` lưu chuỗi hash bcrypt, không bao giờ lưu plain text. Enum `UserStatus` với ba giá trị (ACTIVE, INACTIVE, BANNED) cho phép quản trị viên kiểm soát trạng thái tài khoản. Directive `@@map("users")` ánh xạ tên model PascalCase (`User`) sang tên bảng snake_case (`users`) trong PostgreSQL — tuân theo convention đặt tên của SQL.

### 8.3.4. Các model hỗ trợ Authentication

Ba model hỗ trợ phục vụ ba cơ chế bảo mật khác nhau:

```prisma
// Lưu refresh token — cho phép thu hồi khi logout
model RefreshToken {
  id        String    @id @default(uuid())
  token     String    @unique
  userId    String
  expiresAt DateTime
  revokedAt DateTime?    // null = đang hoạt động, có giá trị = đã thu hồi
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("refresh_tokens")
}

// Lưu token đặt lại mật khẩu — sử dụng một lần
model PasswordReset {
  id        String    @id @default(uuid())
  userId    String
  token     String    @unique
  expiresAt DateTime
  usedAt    DateTime?    // null = chưa dùng, có giá trị = đã dùng
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("password_resets")
}

// Danh sách đen access token — thu hồi tức thì khi logout
model InvalidatedToken {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime    // Dùng để dọn dẹp records đã hết hạn
  reason    String?     // LOGOUT, BANNED, PASSWORD_CHANGED
  createdAt DateTime @default(now())
  @@map("invalidated_tokens")
}
```

Điểm thiết kế chung của cả `RefreshToken` và `PasswordReset` là kỹ thuật **soft invalidation**: thay vì xóa record khi không còn hợp lệ, chúng ta đặt timestamp vào field `revokedAt` hoặc `usedAt`. Cách tiếp cận này giữ lại lịch sử hoạt động, phục vụ cho việc kiểm tra bảo mật (audit) sau này — ví dụ phát hiện ai đó liên tục yêu cầu reset password.

`InvalidatedToken` không có foreign key đến bảng User vì access token đã chứa sẵn userId trong payload. Bảng này đóng vai trò như một "bộ lọc nhanh" — mỗi request chỉ cần kiểm tra token có nằm trong bảng này hay không (truy vấn bằng `@unique` index, tốc độ O(1)), không cần join với bảng khác.

---

## 8.4. Thiết kế API

### 8.4.1. Quy ước chung

Toàn bộ API tuân theo các quy ước RESTful nhất quán:

| Quy ước | Giá trị | Ví dụ |
|---------|---------|-------|
| Base URL | `/api/v1` | `http://localhost:3333/api/v1/auth/login` |
| Naming | Danh từ số nhiều, lowercase | `/users`, `/workspaces`, `/tasks` |
| HTTP Methods | GET (đọc), POST (tạo), PATCH (cập nhật), DELETE (xóa) | `PATCH /users/me` |
| Status Codes | 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 409 (Conflict) | |

Prefix `/api/v1` phục vụ API versioning — khi cần thay đổi breaking changes trong tương lai, chúng ta triển khai `/api/v2` song song mà không phá vỡ client đang dùng v1.

### 8.4.2. Danh sách API endpoints

**Auth Module — 6 endpoints:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `POST` | `/auth/register` | Public | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | Public | Đăng nhập, nhận tokens |
| `POST` | `/auth/refresh` | Public | Làm mới access token |
| `POST` | `/auth/logout` | JWT | Đăng xuất, thu hồi tokens |
| `POST` | `/auth/forgot-password` | Public | Yêu cầu đặt lại mật khẩu |
| `POST` | `/auth/reset-password` | Public | Đặt lại mật khẩu bằng token |

**User Module — 4 endpoints:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `GET` | `/users/me` | JWT | Xem hồ sơ cá nhân |
| `PATCH` | `/users/me` | JWT | Cập nhật displayName, bio |
| `PATCH` | `/users/me/change-password` | JWT | Thay đổi mật khẩu |
| `POST` | `/users/me/avatar` | JWT | Upload ảnh đại diện |

Tất cả endpoints của User Module sử dụng đường dẫn `/me` thay vì `/:userId`. Thiết kế này ngăn chặn triệt để việc truy cập hồ sơ người khác — userId luôn được trích xuất từ JWT token đã xác thực, không phải từ URL do client cung cấp.

### 8.4.3. Chuẩn hóa Response

Mọi response trong hệ thống đều tuân theo một cấu trúc thống nhất, nhờ hai thành phần hoạt động ở tầng global:

**Response thành công** (qua `TransformResponseInterceptor`):

```json
{
  "success": true,
  "data": { /* dữ liệu thực tế */ },
  "timestamp": "2026-03-17T09:00:00.000Z"
}
```

**Response lỗi** (qua `HttpExceptionFilter`):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email should not be empty",
  "path": "/api/v1/auth/register",
  "timestamp": "2026-03-17T09:00:00.000Z"
}
```

Sự phối hợp giữa Interceptor (bọc response thành công) và Filter (bắt và format lỗi) tạo ra một "khế ước" rõ ràng: client chỉ cần kiểm tra field `success` để phân biệt thành công và thất bại, thay vì phải phân tích HTTP status code. Đây là nền tảng giúp frontend xử lý response một cách nhất quán cho mọi API call.

### 8.4.4. Validation dữ liệu đầu vào

Mọi dữ liệu từ client đều được validate bởi `ValidationPipe` toàn cục với ba tùy chọn bảo mật:

| Tùy chọn | Tác dụng | Ví dụ |
|----------|---------|-------|
| `whitelist: true` | Loại bỏ field không khai báo trong DTO | `{ email, password, isAdmin }` → `isAdmin` bị xóa |
| `forbidNonWhitelisted: true` | Trả lỗi 400 nếu có field lạ | `{ email, password, isAdmin }` → lỗi 400 |
| `transform: true` | Tự động chuyển kiểu dữ liệu | `?page="1"` → `page = 1` (number) |

Kết hợp với DTO classes sử dụng decorators từ `class-validator`, hệ thống đảm bảo rằng mọi request đến controller đều đã được validate đầy đủ — controller không cần kiểm tra lại dữ liệu đầu vào.

---

## 8.5. Biểu đồ tuần tự các chức năng chính

Biểu đồ tuần tự (Sequence Diagram) mô tả trình tự tương tác giữa các thành phần trong hệ thống khi xử lý một request. Dưới đây là các luồng chính của hai module Auth và User.

### 8.5.1. Đăng ký tài khoản (Register)

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AuthController
    participant Service as AuthService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Controller: POST /auth/register<br/>{email, password, fullname, displayName}
    Note over Controller: @Public() — không yêu cầu JWT
    Controller->>Service: register(dto)

    Service->>Prisma: user.findUnique({email})
    Prisma->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Prisma: null (chưa tồn tại)
    Prisma-->>Service: null

    Service->>Service: bcrypt.hash(password, 10)
    Service->>Prisma: user.create({email, password: hash, name, ...})
    Prisma->>DB: INSERT INTO users (...)
    DB-->>Prisma: User record
    Prisma-->>Service: User object

    Service->>Service: generateTokens(userId, email)
    Service->>Prisma: refreshToken.create({token, userId, expiresAt})
    Prisma->>DB: INSERT INTO refresh_tokens (...)
    DB-->>Prisma: RefreshToken record

    Service-->>Controller: {user, tokens: {accessToken, refreshToken}}
    Controller-->>Client: 201 Created<br/>{success: true, data: {user, tokens}}
```

### 8.5.2. Đăng nhập (Login)

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AuthController
    participant Service as AuthService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Controller: POST /auth/login<br/>{email, password}
    Note over Controller: @Public()
    Controller->>Service: login(dto)

    Service->>Prisma: user.findUnique({email})
    Prisma->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Prisma: User record (có password hash)
    Prisma-->>Service: User object

    Service->>Service: bcrypt.compare(password, user.password)
    Note over Service: ✓ Password khớp

    Service->>Prisma: user.update({lastLoginAt: now()})
    Service->>Service: generateTokens(userId, email)
    Service->>Prisma: refreshToken.create({token, userId, expiresAt})

    Service-->>Controller: {user, tokens}
    Controller-->>Client: 200 OK<br/>{success: true, data: {user, tokens}}
```

### 8.5.3. Làm mới token (Refresh — Token Rotation)

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AuthController
    participant Service as AuthService
    participant JWT as JwtService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Controller: POST /auth/refresh<br/>{refreshToken}
    Note over Controller: @Public()
    Controller->>Service: refreshToken(dto)

    Service->>JWT: verifyAsync(token, REFRESH_SECRET)
    JWT-->>Service: payload {sub: userId, email}

    Service->>Prisma: refreshToken.findUnique({token})
    Prisma->>DB: SELECT * FROM refresh_tokens WHERE token = ?
    DB-->>Prisma: RefreshToken record
    Note over Service: Kiểm tra: revokedAt === null<br/>và expiresAt > now()

    Service->>Prisma: refreshToken.update({revokedAt: now()})
    Note over Service: ⚡ Thu hồi token cũ (Rotation)

    Service->>Service: generateTokens(userId, email)
    Service->>Prisma: refreshToken.create({newToken, userId, expiresAt})
    Note over Service: ⚡ Tạo cặp token hoàn toàn mới

    Service-->>Controller: {accessToken, refreshToken: newToken}
    Controller-->>Client: 200 OK<br/>{success: true, data: {accessToken, refreshToken}}
```

### 8.5.4. Đăng xuất (Logout — Token Blacklist)

```mermaid
sequenceDiagram
    actor Client
    participant Guard as JwtAuthGuard
    participant Strategy as JwtStrategy
    participant Controller as AuthController
    participant Service as AuthService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Guard: POST /auth/logout<br/>Header: Bearer {accessToken}
    Guard->>Strategy: validate(request, payload)

    Strategy->>Prisma: invalidatedToken.findUnique({token})
    Prisma->>DB: SELECT FROM invalidated_tokens WHERE token = ?
    DB-->>Prisma: null (chưa bị blacklist)
    Strategy-->>Guard: ✓ Token hợp lệ, user = payload

    Guard-->>Controller: Request + user object
    Controller->>Service: logout(userId, accessToken)

    Service->>Prisma: refreshToken.updateMany({userId, revokedAt: null} → {revokedAt: now()})
    Note over Service: Thu hồi TẤT CẢ refresh tokens

    Service->>Service: jwt.decode(accessToken) → lấy exp
    Service->>Prisma: invalidatedToken.create({token, expiresAt})
    Note over Service: Đưa access token vào blacklist

    Service-->>Controller: {message: "Logged out successfully"}
    Controller-->>Client: 200 OK
```

### 8.5.5. Xem hồ sơ cá nhân (Get Profile — Luồng Authenticated)

```mermaid
sequenceDiagram
    actor Client
    participant Guard as JwtAuthGuard
    participant Strategy as JwtStrategy
    participant Controller as UserController
    participant Service as UserService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Guard: GET /users/me<br/>Header: Bearer {accessToken}

    Guard->>Guard: Kiểm tra @Public()?
    Note over Guard: Không có @Public()<br/>→ yêu cầu xác thực

    Guard->>Strategy: validate(request, payload)
    Strategy->>Prisma: invalidatedToken.findUnique({token})
    Prisma-->>Strategy: null (không bị blacklist)
    Strategy-->>Guard: {id: userId, email}

    Guard-->>Controller: Request.user = {id, email}
    Controller->>Controller: @CurrentUser('id') → userId
    Controller->>Service: getProfile(userId)

    Service->>Prisma: user.findUnique({id}, select: profileSelect)
    Note over Service: profileSelect: 11 fields<br/>(KHÔNG bao gồm password)
    Prisma->>DB: SELECT id, email, name, ... FROM users WHERE id = ?
    DB-->>Prisma: User record
    Prisma-->>Service: User profile (không có password)

    Service-->>Controller: User profile
    Controller-->>Client: 200 OK<br/>{success: true, data: {id, email, name, displayName, ...}}
```

### 8.5.6. Đổi mật khẩu (Change Password — Transaction)

```mermaid
sequenceDiagram
    actor Client
    participant Guard as JwtAuthGuard
    participant Controller as UserController
    participant Service as UserService
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    Client->>Guard: PATCH /users/me/change-password<br/>Bearer token + {currentPassword, newPassword, confirmPassword}
    Guard-->>Controller: ✓ Authenticated (user.id)

    Controller->>Service: changePassword(userId, dto)

    Service->>Service: Kiểm tra newPassword === confirmPassword
    Note over Service: ✓ Khớp

    Service->>Prisma: user.findUnique({id: userId})
    Prisma-->>Service: User (có password hash)

    Service->>Service: bcrypt.compare(currentPassword, user.password)
    Note over Service: ✓ Mật khẩu hiện tại đúng

    Service->>Service: bcrypt.compare(newPassword, user.password)
    Note over Service: ✓ Mật khẩu mới khác cũ

    Service->>Service: bcrypt.hash(newPassword, 10)

    rect rgb(240, 248, 255)
        Note over Prisma,DB: 🔒 Transaction — Atomic
        Service->>Prisma: $transaction([...])
        Prisma->>DB: UPDATE users SET password = newHash WHERE id = ?
        Prisma->>DB: UPDATE refresh_tokens SET revokedAt = now()<br/>WHERE userId = ? AND revokedAt IS NULL
        Note over DB: Thu hồi tất cả refresh tokens<br/>(buộc đăng nhập lại trên mọi thiết bị)
    end

    Service-->>Controller: {message: "Password changed successfully"}
    Controller-->>Client: 200 OK
```

### 8.5.7. Upload Avatar (File Upload)

```mermaid
sequenceDiagram
    actor Client
    participant Multer as Multer Middleware
    participant Guard as JwtAuthGuard
    participant Controller as UserController
    participant Service as UserService
    participant Prisma as PrismaService
    participant FS as File System

    Client->>Multer: POST /users/me/avatar<br/>Content-Type: multipart/form-data<br/>field "avatar" = image file

    Multer->>Multer: fileFilter: kiểm tra MIME type
    Note over Multer: Chỉ cho phép:<br/>image/jpeg, image/png, image/gif
    Multer->>Multer: limits: kiểm tra fileSize ≤ 5MB
    Multer->>FS: diskStorage.filename()<br/>Tạo tên: avatar-{timestamp}-{random}.{ext}
    FS-->>Multer: File saved → uploads/avatars/

    Multer-->>Guard: Request + file object
    Guard-->>Controller: ✓ Authenticated

    Controller->>Service: uploadAvatar(userId, file)

    Service->>Prisma: user.findUnique({id: userId})
    Prisma-->>Service: User (avatar: "old-avatar.jpg")

    alt User đã có avatar cũ
        Service->>FS: unlink(uploads/avatars/old-avatar.jpg)
        Note over FS: Xóa file cũ (tránh tích tụ)
    end

    Service->>Prisma: user.update({avatar: file.filename})
    Prisma-->>Service: Updated user

    Service-->>Controller: User profile (avatar = new filename)
    Controller-->>Client: 201 Created<br/>{success: true, data: {avatar: "avatar-1710648000-482917536.jpg"}}
```

---

## 8.6. Thiết kế bảo mật

### 8.6.1. Chiến lược xác thực — Dual Token

Hệ thống sử dụng chiến lược dual-token, kết hợp hai loại JWT token phục vụ hai mục đích khác nhau:

```mermaid
graph LR
    subgraph AccessToken ["Access Token"]
        A1["Thời hạn: 15 phút"]
        A2["Secret: JWT_SECRET"]
        A3["Stateless"]
        A4["Gửi mỗi request"]
        A5["Không thể thu hồi<br/>(trừ khi dùng blacklist)"]
    end

    subgraph RefreshToken ["Refresh Token"]
        R1["Thời hạn: 7 ngày"]
        R2["Secret: JWT_REFRESH_SECRET"]
        R3["Lưu trong database"]
        R4["Chỉ gửi khi refresh"]
        R5["Có thể thu hồi (revoke)"]
    end
```

Access Token có thời hạn ngắn (15 phút) để giảm thiểu rủi ro khi bị lộ — kẻ tấn công chỉ có cửa sổ 15 phút để khai thác. Refresh Token có thời hạn dài hơn (7 ngày) nhưng được lưu trong database, cho phép server thu hồi bất kỳ lúc nào. Hai token sử dụng **secret key riêng biệt** — ngăn chặn việc dùng refresh token (dễ bị lộ vì lưu lâu) để giả mạo access token.

### 8.6.2. Token Blacklist — Thu hồi tức thì

Bản chất JWT là stateless — server không lưu trạng thái, nên không thể "hủy" một token đã cấp. Khi user đăng xuất, access token vẫn hợp lệ cho đến khi hết hạn. Để giải quyết, hệ thống triển khai cơ chế **Token Blacklist**:

```mermaid
flowchart TD
    A["User Logout"] --> B["1. Thu hồi tất cả Refresh Tokens<br/>(updateMany → revokedAt = now)"]
    A --> C["2. Đưa Access Token vào<br/>bảng InvalidatedToken"]
    C --> D["Mỗi request sau đó"]
    D --> E{"JwtStrategy.validate()<br/>Token có trong blacklist?"}
    E -->|Có| F["401 Unauthorized"]
    E -->|Không| G["Cho phép truy cập"]
```

Bảng `InvalidatedToken` đóng vai trò "danh sách đen" nhỏ gọn. Mỗi record chứa token đã thu hồi kèm `expiresAt` — cho phép cron job định kỳ dọn dẹp các records đã hết hạn, giữ bảng luôn gọn nhẹ. Chi phí kiểm tra blacklist là một query `findUnique` theo `@unique` index — tốc độ O(1), không ảnh hưởng đáng kể đến hiệu năng.

### 8.6.3. Token Rotation

Mỗi lần client gọi `/auth/refresh` để lấy access token mới, refresh token cũ bị thu hồi và cặp token hoàn toàn mới được tạo ra. Kỹ thuật **Token Rotation** này ngăn chặn việc tái sử dụng refresh token bị đánh cắp — kẻ tấn công chỉ có thể dùng token đó đúng một lần.

### 8.6.4. Chiến lược Global Guard + @Public()

Thay vì đặt `@UseGuards(JwtAuthGuard)` trên từng controller, hệ thống đăng ký guard toàn cục qua `APP_GUARD` — triết lý **"secure by default"**:

```mermaid
flowchart LR
    A["Mọi endpoint"] --> B{"JwtAuthGuard"}
    B -->|"Có @Public()?"| C["Bỏ qua JWT, cho qua"]
    B -->|"Không có @Public()"| D{"Token hợp lệ?"}
    D -->|Có| E["Cho phép truy cập"]
    D -->|Không| F["401 Unauthorized"]
```

Với thiết kế này, nếu developer quên gắn guard khi tạo endpoint mới, endpoint đó vẫn được bảo vệ. Chỉ khi cố ý đánh dấu `@Public()` thì endpoint mới được truy cập công khai. Cách tiếp cận này an toàn hơn nhiều so với mô hình ngược lại (mặc định mở, phải gắn guard để bảo vệ).

### 8.6.5. Hash mật khẩu

Mật khẩu được hash bằng bcrypt với 10 salt rounds trước khi lưu vào database. Bcrypt tự động tích hợp giá trị salt ngẫu nhiên vào quá trình hash — hai user có cùng mật khẩu sẽ cho ra hai chuỗi hash hoàn toàn khác nhau, chống tấn công Rainbow Table. Tham số 10 salt rounds tạo ra khoảng 2^10 = 1024 vòng lặp tính toán, cân bằng giữa bảo mật và hiệu năng.

### 8.6.6. Validate mật khẩu

Mật khẩu đầu vào phải thỏa mãn năm điều kiện: tối thiểu 8 ký tự, có ít nhất một chữ hoa, một chữ thường, một chữ số, và một ký tự đặc biệt. Quy tắc này tuân theo khuyến nghị của OWASP (Open Web Application Security Project), đảm bảo mật khẩu có đủ entropy để chống lại tấn công từ điển (dictionary attack) và brute-force.

---

## 8.7. Thiết kế File Upload

### 8.7.1. Chiến lược lưu trữ

Avatar upload sử dụng Multer — middleware xử lý multipart/form-data — với chiến lược `diskStorage` lưu file trực tiếp lên ổ đĩa:

```
uploads/
└── avatars/
    ├── avatar-1710648000000-482917536.jpg
    ├── avatar-1710648001000-193847562.png
    └── ...
```

Tên file được tạo theo format `{fieldname}-{timestamp}-{random}.{ext}`, đảm bảo tính duy nhất và ngăn chặn tấn công path traversal — original filename từ client bị loại bỏ hoàn toàn, chỉ giữ lại phần extension.

### 8.7.2. Quy tắc bảo mật file upload

| Quy tắc | Giá trị | Mục đích |
|---------|---------|----------|
| MIME type | Chỉ `image/jpeg`, `image/png`, `image/gif` | Chặn file thực thi (PHP, EXE), SVG chứa script |
| Kích thước | Tối đa 5MB | Tránh DoS qua file cực lớn |
| Tên file | Random (timestamp + Math.random) | Chống path traversal, trùng tên |
| Xóa file cũ | Tự động khi upload avatar mới | Tránh tích tụ file rác |

### 8.7.3. Phục vụ Static File

File đã upload được phục vụ qua NestJS static assets với prefix `/uploads/`. Client truy cập avatar qua URL: `GET /uploads/avatars/{filename}`. Cấu hình prefix giới hạn phạm vi truy cập — chỉ file trong thư mục `uploads/` được serve, các file nhạy cảm khác của dự án không bị lộ.

---

## 8.8. Cấu hình Global — File main.ts

File `main.ts` là nơi thiết lập tất cả các thành phần hoạt động ở cấp toàn cục, áp dụng các khái niệm đã học ở **Chương 6** (Pipes, Interceptors, Filters) vào thực tế:

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');                          // API versioning

  app.useGlobalPipes(new ValidationPipe({                 // Validate đầu vào
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(
    new LoggingInterceptor(),                             // Log mọi request
    new TransformResponseInterceptor(),                   // Bọc response chuẩn
  );

  app.useGlobalFilters(new HttpExceptionFilter());        // Format lỗi chuẩn

  app.useStaticAssets(join(process.cwd(), 'uploads'), {   // Serve file upload
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3333);
}
```

Năm lớp cấu hình này hoạt động như một pipeline xử lý mọi request đi qua ứng dụng. Request đầu tiên được định tuyến bởi Global Prefix, sau đó được validate bởi ValidationPipe, đi qua các Guards (đăng ký ở AppModule), rồi đến Interceptors (logging + transform response). Nếu có lỗi xảy ra ở bất kỳ tầng nào, HttpExceptionFilter bắt và format thành response lỗi chuẩn. Nhờ thiết kế tập trung này, mỗi module chỉ cần tập trung vào business logic — phần cross-cutting concerns (logging, validation, error handling) đã được xử lý ở tầng global.

---

## 8.9. Tổng kết

Chương này đã phân tích và thiết kế toàn bộ hệ thống TodoList Collaboration từ góc nhìn kiến trúc. Hệ thống được tổ chức theo kiến trúc module hóa với ba tầng rõ ràng (Controller → Service → Database qua Prisma ORM), cơ sở dữ liệu PostgreSQL gồm 17 bảng phục vụ các domain nghiệp vụ khác nhau, và API tuân theo chuẩn RESTful với response format thống nhất.

Về mặt bảo mật, hệ thống triển khai chiến lược dual-token kết hợp Token Blacklist và Token Rotation, đảm bảo cân bằng giữa trải nghiệm người dùng (không phải đăng nhập lại liên tục) và an toàn (thu hồi token tức thì khi cần). Global Guard với cơ chế `@Public()` áp dụng triết lý "secure by default" — mọi endpoint đều được bảo vệ trừ khi được đánh dấu tường minh là công khai.

Với nền tảng thiết kế này, chương tiếp theo sẽ triển khai chi tiết từng module — bắt đầu từ Auth Module (hệ thống xác thực) đến User Module (quản lý hồ sơ người dùng), kèm theo mã nguồn cụ thể và giải thích kỹ thuật từng bước.
