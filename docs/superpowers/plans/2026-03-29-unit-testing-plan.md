# Unit Testing Implementation Plan (Chương 8)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Viết bộ unit test hoàn chỉnh cho toàn bộ modules backend theo lý thuyết Chương 8, áp dụng mocking, TestingModule, và đo code coverage.

**Architecture:** Theo kim tự tháp kiểm thử (Testing Pyramid) từ Chương 8 — tập trung unit test ở đáy kim tự tháp. Mỗi service test mock tất cả dependency (PrismaService, EventsService, JwtService,...) qua DI container. Controller test mock service layer. Tất cả test file đặt cạnh source file theo quy ước `*.spec.ts`.

**Tech Stack:** Jest 30, @nestjs/testing, TypeScript, jest.fn() / jest.spyOn() cho mocking

---

## Mục lục

1. [Hướng dẫn Unit Test từng bước (Step-by-step)](#hướng-dẫn-unit-test-từng-bước)
2. [Bảng phân công thành viên](#bảng-phân-công-thành-viên)
3. [Phân công chi tiết: Đạt — AuthService, AuthController, UserService, UserController](#đạt--authservice-authcontroller-userservice-usercontroller)
4. [Phân công chi tiết: Vy — WorkspaceService, WorkspaceController, ProjectService, ProjectController](#vy--workspaceservice-workspacecontroller-projectservice-projectcontroller)
5. [Phân công chi tiết: Phú — TaskService, TaskController](#phú--taskservice-taskcontroller)
6. [Phân công chi tiết: Huyền — CommentService, CommentController, NotificationService, NotificationController](#huyền--commentservice-commentcontroller-notificationservice-notificationcontroller)
7. [Chạy toàn bộ + Coverage](#chạy-toàn-bộ--coverage)

---

## Hướng dẫn Unit Test từng bước

> Đọc kỹ phần này trước khi bắt tay viết test. Đây là bản tóm tắt thực hành từ Chương 8 (mục 8.2 → 8.7), áp dụng cụ thể cho dự án TodoList Collaboration.

### Bước 0: Kiểm tra môi trường

Đảm bảo bạn đã cài đặt đầy đủ dependencies:

```bash
cd backend
npm install
```

Kiểm tra Jest đã sẵn sàng:

```bash
npx jest --version
# Expected: 30.x.x
```

**Những thứ ĐÃ CÓ SẴN — KHÔNG cần tạo thêm:**

| Thành phần | Vị trí | Ghi chú |
|-----------|--------|---------|
| Jest config | `backend/package.json` → mục `"jest"` | Đã cấu hình `ts-jest`, `rootDir: "src"`, `testRegex: *.spec.ts` |
| Test scripts | `backend/package.json` → mục `"scripts"` | `npm run test`, `npm run test:watch`, `npm run test:cov` |
| `@nestjs/testing` | `devDependencies` | Đã cài sẵn v11 |
| `@types/jest` | `devDependencies` | Đã cài sẵn v30 |
| `ts-jest` | `devDependencies` | Đã cài sẵn v29 (tương thích Jest 30) |

**Những thứ KHÔNG CẦN khi chạy unit test:**

| Không cần | Lý do |
|----------|-------|
| File `.env` / `.env.test` | Unit test mock tất cả dependency → không kết nối DB, không gửi mail thật, không cần JWT secret |
| Docker / PostgreSQL chạy | Prisma được mock hoàn toàn bằng `jest.fn()`, không gọi database thật |
| `jest.config.ts` riêng | Config đã nằm trong `package.json`, không cần file riêng |
| `tsconfig.test.json` riêng | Dùng chung `tsconfig.json` của project, `ts-jest` tự đọc |

**Lưu ý quan trọng về import:**

Project dùng `"moduleResolution": "nodenext"` trong `tsconfig.json`. Khi viết file test, **import bình thường** là được — `ts-jest` xử lý tự động:

```typescript
// ✅ ĐÚNG — import bình thường
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

// ❌ SAI — KHÔNG thêm .js extension
import { TaskService } from './task.service.js';
```

**Kiểm tra nhanh:** Chạy lệnh sau để verify Jest hoạt động đúng:

```bash
# Chạy mà không có test nào → phải exit code 0
npx jest --passWithNoTests
# Expected: "No tests found, exiting with code 0"
```

### Bước 1: Tạo file test (quy ước đặt tên — mục 8.2.3)

File test **đặt cạnh** file source code tương ứng, thêm đuôi `.spec.ts`:

```
src/modules/task/
  ├── task.service.ts          ← source code
  ├── task.service.spec.ts     ← unit test (TẠO FILE NÀY)
  ├── task.controller.ts       ← source code
  └── task.controller.spec.ts  ← unit test (TẠO FILE NÀY)
```

### Bước 2: Import các module cần thiết (mục 8.4.3)

Mọi file test đều cần import 3 thứ:

```typescript
// 1. NestJS testing utilities
import { Test, TestingModule } from '@nestjs/testing';

// 2. Exceptions cần kiểm tra
import { NotFoundException, ForbiddenException } from '@nestjs/common';

// 3. Service/Controller cần test + các dependency của nó
import { TaskService } from './task.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
```

### Bước 3: Tạo Mock Objects (mục 8.4.2)

**Nguyên tắc:** Mock TẤT CẢ dependency mà service inject qua constructor. Xem constructor của service để biết cần mock gì.

**Cách xác định dependency cần mock:**

```typescript
// Mở file service, xem constructor:
export class TaskService {
  constructor(
    private prisma: PrismaService,        // ← CẦN MOCK
    private eventsService: EventsService,  // ← CẦN MOCK
  ) {}
}
```

**Cách tạo mock:**

```typescript
// Mock PrismaService — tạo jest.fn() cho MỌI method mà service gọi
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock EventsService
const mockEventsService = {
  emitToProject: jest.fn(),
  emitToTask: jest.fn(),
  emitToUser: jest.fn(),
};
```

> **Mẹo:** Nếu service gọi `this.prisma.task.create(...)` thì mock cần có `task.create: jest.fn()`.
> Nếu service gọi `this.prisma.$transaction(...)` thì mock cần có `$transaction: jest.fn()`.

### Bước 4: Thiết lập TestingModule trong beforeEach (mục 8.4.3)

```typescript
describe('TaskService', () => {
  let service: TaskService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    // Tạo module test — thay dependency thật bằng mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,  // Service thật (cái cần test)
        { provide: PrismaService, useValue: mockPrismaService },  // Mock thay thế
        { provide: EventsService, useValue: mockEventsService },  // Mock thay thế
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get(PrismaService);

    // QUAN TRỌNG: Reset mock trước mỗi test để đảm bảo cô lập
    jest.clearAllMocks();
  });
});
```

**Đối với Controller test:** Thay `providers` bằng `controllers` + mock Service:

```typescript
const module = await Test.createTestingModule({
  controllers: [TaskController],
  providers: [
    { provide: TaskService, useValue: mockTaskService },
  ],
}).compile();
```

### Bước 5: Viết test cases (mục 8.3, 8.5, 8.6)

**Pattern cho Service test — kiểm tra business logic:**

```typescript
describe('create', () => {
  // Test 1: Happy path — trường hợp thành công
  it('should create a task and return it', async () => {
    // 1. ARRANGE: Lập trình mock trả về giá trị mong muốn
    mockPrismaService.task.create.mockResolvedValue({ id: 'task-1', title: 'Test' });

    // 2. ACT: Gọi method cần test
    const result = await service.create('user-1', 'project-1', dto);

    // 3. ASSERT: Kiểm tra kết quả
    expect(result).toEqual({ id: 'task-1', title: 'Test' });           // Giá trị trả về đúng
    expect(mockPrismaService.task.create).toHaveBeenCalledTimes(1);     // Gọi đúng 1 lần
    expect(mockPrismaService.task.create).toHaveBeenCalledWith(         // Gọi với đúng params
      expect.objectContaining({ data: expect.objectContaining({ title: 'Test' }) }),
    );
  });

  // Test 2: Error case — trường hợp lỗi
  it('should throw NotFoundException when project not found', async () => {
    mockPrismaService.project.findUnique.mockResolvedValue(null);

    await expect(
      service.create('user-1', 'bad-id', dto),
    ).rejects.toThrow(NotFoundException);
  });
});
```

**Pattern cho Controller test — kiểm tra delegation:**

```typescript
describe('create', () => {
  it('should call taskService.create with correct params', async () => {
    const expected = { id: 'task-1', title: 'Test' };
    mockTaskService.create.mockResolvedValue(expected);

    const result = await controller.create('user-1', 'project-1', dto);

    expect(result).toEqual(expected);
    expect(service.create).toHaveBeenCalledWith('user-1', 'project-1', dto);
  });
});
```

### Bước 6: Chạy test (mục 8.2.3)

```bash
# Chạy test cho 1 file cụ thể
npx jest src/modules/task/task.service.spec.ts --verbose

# Chạy toàn bộ unit test
npm run test

# Chạy test ở chế độ watch (tự động chạy lại khi sửa code)
npm run test:watch

# Chạy test + đo code coverage
npm run test:cov
```

### Bước 7: Đọc kết quả Coverage (mục 8.7)

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
 task.service.ts       |   85.71 |    66.67 |     100 |   83.33 |
 task.controller.ts    |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|
```

- **% Stmts:** Tỷ lệ câu lệnh đã chạy qua
- **% Branch:** Tỷ lệ nhánh if/else đã kiểm tra (quan trọng nhất!)
- **% Funcs:** Tỷ lệ hàm đã được gọi
- **% Lines:** Tỷ lệ dòng code đã chạy qua
- **Mục tiêu:** ≥ 70% cho mỗi tiêu chí

### Checklist kiểm tra trước khi nộp

- [ ] Mỗi method có ít nhất 2 test: 1 happy path + 1 error case
- [ ] Tất cả mock được `clearAllMocks()` trong `beforeEach()`
- [ ] Test chạy pass: `npm run test`
- [ ] Coverage ≥ 70%: `npm run test:cov`
- [ ] File test đặt đúng vị trí (cạnh file source, đuôi `.spec.ts`)
- [ ] Commit code lên branch đúng quy ước

---

## Bảng phân công thành viên

| Thành viên | Module test | File test cần tạo | Số methods | Số test tối thiểu |
|------------|-------------|-------------------|------------|-------------------|
| **Đạt** (Team Lead) | Auth + User | `auth.service.spec.ts`, `auth.controller.spec.ts`, `user.service.spec.ts`, `user.controller.spec.ts` | 6 + 6 + 4 + 4 = **20** | **~40** |
| **Vy** | Workspace + Project | `workspace.service.spec.ts`, `workspace.controller.spec.ts`, `project.service.spec.ts`, `project.controller.spec.ts` | 11 + 11 + 9 + 9 = **40** | **~50** |
| **Phú** | Task | `task.service.spec.ts`, `task.controller.spec.ts` | 14 + 14 = **28** | **~57** |
| **Huyền** | Comment + Notification | `comment.service.spec.ts`, `comment.controller.spec.ts`, `notification.service.spec.ts`, `notification.controller.spec.ts` | 2 + 2 + 1 + 1 = **6** | **~12** |

**Tổng cộng:** ~159 test cases, bao phủ toàn bộ backend modules.

**Quy tắc chung:**
- Mỗi người làm trên **branch riêng**: `feature/<tên>-unit-test` (ví dụ: `feature/phu-unit-test`)
- Code xong → chạy `npm run test` → pass hết → commit → tạo PR vào `develop`
- **Đạt** review tất cả PR trước khi merge

---

## Đạt — AuthService, AuthController, UserService, UserController

### A1. AuthService Test

**File:** `backend/src/modules/auth/auth.service.spec.ts`

**Dependencies cần mock:** `JwtService`, `PrismaService`, `MailService`, `ConfigService`

> **Kiến thức Chương 8 áp dụng:**
> - **8.2.2** `@nestjs/testing` — Dùng `Test.createTestingModule()` để tạo module test cô lập
> - **8.2.3** Quy ước đặt tên — File đặt cạnh source: `auth.service.spec.ts`
> - **8.3.1** Cấu trúc test — `describe()` nhóm theo method, `it()` cho từng test case, `beforeEach()` reset state
> - **8.4.1** Vấn đề dependency — AuthService phụ thuộc 4 service (Jwt, Prisma, Mail, Config), cần mock tất cả để cô lập
> - **8.4.2** Jest mock functions — `jest.fn()` tạo mock, `mockResolvedValue()` lập trình giá trị trả về async
> - **8.4.3** TestingModule với mock DI — `{ provide: JwtService, useValue: mockJwtService }` thay thế dependency thật
> - **8.5** Kiểm thử Service — Test business logic: happy path (register thành công) + error case (email trùng → ConflictException)
> - Kỹ thuật bổ sung: `jest.mock('bcrypt')` — mock module bên ngoài (không phải NestJS provider)

**Mock setup:**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findFirst: jest.fn(),
    deleteMany: jest.fn(),
    delete: jest.fn(),
  },
  invalidatedToken: {
    create: jest.fn(),
  },
  passwordReset: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockMailService = {
  sendPasswordResetEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '15m',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      FRONTEND_URL: 'http://localhost:3000',
    };
    return config[key];
  }),
};
```

**Test cases cần viết (12 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `register()` | Đăng ký thành công | Trả về `{ user, accessToken, refreshToken }` |
| 2 | `register()` | Email đã tồn tại | Throw `ConflictException` |
| 3 | `login()` | Đăng nhập thành công | Trả về tokens |
| 4 | `login()` | Email không tồn tại | Throw `UnauthorizedException` |
| 5 | `login()` | Sai mật khẩu | Throw `UnauthorizedException` |
| 6 | `refreshToken()` | Refresh thành công | Trả về accessToken mới |
| 7 | `refreshToken()` | Token không hợp lệ | Throw `UnauthorizedException` |
| 8 | `logout()` | Logout thành công | Trả về `{ message }` |
| 9 | `forgotPassword()` | Gửi email reset thành công | `mailService.sendPasswordResetEmail` được gọi |
| 10 | `forgotPassword()` | Email không tồn tại | Không throw (bảo mật) nhưng không gửi email |
| 11 | `resetPassword()` | Reset mật khẩu thành công | User password được update |
| 12 | `resetPassword()` | Token hết hạn/không hợp lệ | Throw `BadRequestException` |

> **Lưu ý đặc biệt cho AuthService:** Cần mock `bcrypt.hash()` và `bcrypt.compare()`. Sử dụng `jest.mock('bcrypt')` ở đầu file.

### A2. AuthController Test

**File:** `backend/src/modules/auth/auth.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Sự khác biệt Service vs Controller test — Controller test chỉ kiểm tra delegation (gọi đúng service method, trả đúng kết quả), không test business logic
> - **8.4.3** TestingModule — Dùng `controllers: [AuthController]` thay vì `providers`
> - **8.4.2** Mock functions — Mock toàn bộ AuthService, verify bằng `toHaveBeenCalledWith()`

**Mock:** Chỉ cần mock `AuthService` (6 methods)

```typescript
const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
};
```

**Test cases (6 tests):** Mỗi endpoint 1 test — kiểm tra controller gọi đúng service method với đúng params.

### A3. UserService Test

**File:** `backend/src/modules/user/user.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.4.2** Jest mock functions — `mockResolvedValue()` để mock Prisma trả về user data, `mockResolvedValue(null)` để test trường hợp không tìm thấy
> - **8.5** Kiểm thử Service — Pattern Arrange-Act-Assert: (1) setup mock trả về, (2) gọi method, (3) verify kết quả + verify mock được gọi
> - **8.3.1** `expect().rejects.toThrow()` — Kiểm tra async function throw đúng exception type (NotFoundException, BadRequestException)
> - Kỹ thuật bổ sung: `jest.mock('bcrypt')` dùng lại cho `changePassword()` (tương tự AuthService)

**Dependencies cần mock:** `PrismaService`

```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};
```

**Test cases (8 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `getProfile()` | Lấy profile thành công | Trả về user data |
| 2 | `getProfile()` | User không tồn tại | Throw `NotFoundException` |
| 3 | `updateProfile()` | Cập nhật thành công | Trả về updated user |
| 4 | `updateProfile()` | User không tồn tại | Throw `NotFoundException` |
| 5 | `changePassword()` | Đổi mật khẩu thành công | User password updated |
| 6 | `changePassword()` | Mật khẩu cũ sai | Throw `BadRequestException` |
| 7 | `uploadAvatar()` | Upload thành công | Trả về avatar URL |
| 8 | `uploadAvatar()` | User không tồn tại | Throw `NotFoundException` |

### A4. UserController Test

**File:** `backend/src/modules/user/user.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Controller test pattern — Mock UserService, verify mỗi endpoint gọi đúng service method với đúng params
> - **8.4.2** `toHaveBeenCalledWith()` — Đảm bảo controller truyền đúng userId, dto xuống service

**Test cases (4 tests):** Mỗi endpoint 1 test.

---

## Vy — WorkspaceService, WorkspaceController, ProjectService, ProjectController

### V1. WorkspaceService Test

**File:** `backend/src/modules/workspace/workspace.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.4.1** Vấn đề dependency — WorkspaceService phụ thuộc PrismaService (nhiều delegate: workspace, workspaceMember, workspaceInvite) + EventsService
> - **8.4.2** Jest mock functions — `jest.fn()` cho từng Prisma delegate method; mock `$transaction` bằng callback pattern: `jest.fn((cb) => cb(mockPrismaService))`
> - **8.4.3** TestingModule với mock DI — Inject 2 mock providers thay thế dependency thật
> - **8.5** Kiểm thử Service — Nhiều test case phân nhánh theo role (OWNER/ADMIN/MEMBER → ForbiddenException), áp dụng test cả happy path lẫn permission error
> - **8.3.1** `beforeEach()` + `jest.clearAllMocks()` — Đảm bảo mỗi test cô lập, mock không "rò rỉ" state giữa các test
> - Kỹ thuật bổ sung: Mock `$transaction` — kỹ thuật nâng cao, callback nhận chính mockPrismaService làm `tx` param

**Dependencies cần mock:** `PrismaService` (bao gồm `$transaction`), `EventsService`

```typescript
const mockPrismaService = {
  workspace: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workspaceMember: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  workspaceInvite: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
  // ↑ $transaction mock: callback nhận chính mockPrismaService làm tx
};

const mockEventsService = {
  emitToWorkspace: jest.fn(),
  emitToUser: jest.fn(),
};
```

**Test cases (22 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `create()` | Tạo workspace thành công | Trả về workspace + tự tạo OWNER member |
| 2 | `create()` | Transaction rollback khi lỗi | Throw error |
| 3 | `findAllForUser()` | Trả về danh sách workspaces | Array of workspaces |
| 4 | `findAllForUser()` | User chưa join workspace nào | Empty array |
| 5 | `findOne()` | Lấy chi tiết thành công | Trả về workspace |
| 6 | `findOne()` | Workspace không tồn tại | Throw `NotFoundException` |
| 7 | `findOne()` | User không phải member | Throw `ForbiddenException` |
| 8 | `update()` | Cập nhật thành công | Trả về updated workspace |
| 9 | `update()` | Không phải OWNER/ADMIN | Throw `ForbiddenException` |
| 10 | `remove()` | Xóa workspace thành công | Message success |
| 11 | `remove()` | Không phải OWNER | Throw `ForbiddenException` |
| 12 | `createInvite()` | Tạo invite thành công | Trả về invite token |
| 13 | `createInvite()` | Email đã là member | Throw error |
| 14 | `acceptInvite()` | Accept thành công | Tạo member mới |
| 15 | `acceptInvite()` | Token hết hạn | Throw error |
| 16 | `getMembers()` | Trả về danh sách members | Array of members |
| 17 | `changeMemberRole()` | Đổi role thành công | Updated member |
| 18 | `changeMemberRole()` | Không phải OWNER | Throw `ForbiddenException` |
| 19 | `removeMember()` | Xóa member thành công | Message success |
| 20 | `removeMember()` | Xóa chính mình | Throw error |
| 21 | `leaveWorkspace()` | Rời workspace thành công | Message success |
| 22 | `leaveWorkspace()` | OWNER không thể rời | Throw `ForbiddenException` |

### V2. WorkspaceController Test

**File:** `backend/src/modules/workspace/workspace.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Controller test pattern — Mock WorkspaceService (11 methods), verify delegation cho mỗi endpoint
> - **8.4.2** `toHaveBeenCalledWith()` — Kiểm tra controller truyền đúng params (userId, workspaceId, dto, memberId)

```typescript
const mockWorkspaceService = {
  create: jest.fn(),
  findAllForUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createInvite: jest.fn(),
  acceptInvite: jest.fn(),
  getMembers: jest.fn(),
  changeMemberRole: jest.fn(),
  removeMember: jest.fn(),
  leaveWorkspace: jest.fn(),
};
```

**Test cases (11 tests):** Mỗi endpoint 1 test — verify delegation.

### V3. ProjectService Test

**File:** `backend/src/modules/project/project.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.4.2** Jest mock functions — Mock 2 Prisma delegate (`project`, `workspaceMember`) với `jest.fn()` cho CRUD + `count()`
> - **8.5** Kiểm thử Service — Test CRUD đầy đủ theo pattern mục 8.5.2 (create), 8.5.3 (findAll), 8.5.5 (update), mở rộng thêm archive/unarchive/pin
> - **8.3.1** Pattern Arrange-Act-Assert — Mỗi test case: (1) mock return value, (2) gọi service method, (3) expect kết quả + expect mock calls
> - **8.4.2** `mockResolvedValue(null)` — Test trường hợp entity không tồn tại → NotFoundException

**Dependencies cần mock:** `PrismaService`

```typescript
const mockPrismaService = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  workspaceMember: {
    findUnique: jest.fn(),
  },
};
```

**Test cases (18 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `create()` | Tạo project thành công | Trả về project |
| 2 | `create()` | Không phải ADMIN/OWNER | Throw `ForbiddenException` |
| 3 | `findAllByWorkspace()` | Trả về danh sách projects | Paginated result |
| 4 | `findAllByWorkspace()` | Không có project | Empty array |
| 5 | `findOne()` | Lấy chi tiết thành công | Trả về project |
| 6 | `findOne()` | Project không tồn tại | Throw `NotFoundException` |
| 7 | `findOne()` | Không phải member | Throw `ForbiddenException` |
| 8 | `update()` | Cập nhật thành công | Trả về updated project |
| 9 | `update()` | Không phải ADMIN/OWNER | Throw `ForbiddenException` |
| 10 | `remove()` | Xóa project thành công | Message success |
| 11 | `remove()` | Không phải ADMIN/OWNER | Throw `ForbiddenException` |
| 12 | `archive()` | Archive thành công | Status = ARCHIVED |
| 13 | `archive()` | Không phải ADMIN/OWNER | Throw `ForbiddenException` |
| 14 | `unarchive()` | Unarchive thành công | Status = ACTIVE |
| 15 | `unarchive()` | Không phải ADMIN/OWNER | Throw `ForbiddenException` |
| 16 | `pin()` | Pin thành công | isPinned = true |
| 17 | `unpin()` | Unpin thành công | isPinned = false |
| 18 | `pin/unpin()` | Không phải member | Throw `ForbiddenException` |

### V4. ProjectController Test

**File:** `backend/src/modules/project/project.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Controller test pattern — Mock ProjectService, verify 9 endpoints gọi đúng service method
> - **8.4.2** `toHaveBeenCalledWith()` + `toHaveBeenCalledTimes(1)` — Đảm bảo mỗi endpoint gọi đúng 1 lần với đúng params

**Test cases (9 tests):** Mỗi endpoint 1 test.

---

## Phú — TaskService, TaskController

### P1. TaskService Test

**File:** `backend/src/modules/task/task.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.1.3** Kim tự tháp kiểm thử — Đây là unit test ở đáy kim tự tháp, mock toàn bộ database + external services
> - **8.4.1** Vấn đề dependency — TaskService có nhiều dependency nhất (PrismaService với 7 delegate + EventsService), minh họa rõ tại sao cần mock
> - **8.4.2** Jest mock functions — Mock đa cấp: `mockPrismaService.task.create`, `mockPrismaService.taskAssignment.findUnique`, `mockPrismaService.subtask.aggregate`
> - **8.4.3** TestingModule với mock DI — Thay thế 2 dependency bằng mock objects qua `{ provide, useValue }`
> - **8.5.2** Test method create() — Happy path: mock Prisma trả về task → verify kết quả + verify emitToProject được gọi
> - **8.5.3** Test method findAll() — Pagination: verify `skip/take` params truyền đúng vào Prisma
> - **8.5.5** Test method update() — Logic phân nhánh: status DONE → set completedAt, status khác → clear completedAt
> - **8.3.1** Cấu trúc test — `describe()` lồng nhau nhóm theo method, helper functions dùng chung (`mockMembershipSuccess`, `mockTaskAccessSuccess`)
> - Kỹ thuật bổ sung: Helper functions — Tạo mock setup dùng lại cho nhiều test (DRY principle trong testing)

**Dependencies cần mock:** `PrismaService`, `EventsService`

```typescript
const mockPrismaService = {
  project: { findUnique: jest.fn() },
  workspaceMember: { findUnique: jest.fn() },
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  taskAssignment: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  taskLabel: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  label: { findUnique: jest.fn() },
  subtask: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    aggregate: jest.fn(),
  },
};

const mockEventsService = {
  emitToProject: jest.fn(),
  emitToTask: jest.fn(),
  emitToUser: jest.fn(),
  emitToWorkspace: jest.fn(),
  emitToRoom: jest.fn(),
};
```

**Helper functions (đặt trong describe block, dùng chung cho nhiều test):**

```typescript
// Mock checkProjectMembership thành công
const mockMembershipSuccess = () => {
  mockPrismaService.project.findUnique.mockResolvedValue({
    id: 'project-1', workspaceId: 'ws-1',
  });
  mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
    id: 'member-1', workspaceId: 'ws-1', userId: 'user-1', role: 'MEMBER',
  });
};

// Mock checkTaskAccess thành công
const mockTaskAccessSuccess = (taskOverrides = {}) => {
  const task = {
    id: 'task-1', title: 'Test task', projectId: 'project-1',
    project: { id: 'project-1', workspaceId: 'ws-1' },
    ...taskOverrides,
  };
  mockPrismaService.task.findUnique.mockResolvedValue(task);
  mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
    id: 'member-1', workspaceId: 'ws-1', userId: 'user-1', role: 'MEMBER',
  });
  return task;
};
```

**Test cases (42 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `create()` | Tạo task thành công | Trả về task, emitToProject gọi |
| 2 | `create()` | Position = 1 khi chưa có task | position: 1 |
| 3 | `create()` | Project không tồn tại | Throw `NotFoundException` |
| 4 | `create()` | Không phải member | Throw `ForbiddenException` |
| 5 | `findAllByProject()` | Trả về paginated tasks | `{ data, meta }` |
| 6 | `findAllByProject()` | Không có task | Empty array, total = 0 |
| 7 | `findAllByProject()` | Pagination params | skip/take đúng |
| 8 | `findAllByProject()` | Không phải member | Throw `ForbiddenException` |
| 9 | `findOne()` | Trả về task detail | Task với includes |
| 10 | `findOne()` | Task không tồn tại | Throw `NotFoundException` |
| 11 | `findOne()` | Không có quyền truy cập | Throw `ForbiddenException` |
| 12 | `update()` | Cập nhật thành công | Trả về updated task, emit events |
| 13 | `update()` | Status = DONE → set completedAt | `completedAt: Date` |
| 14 | `update()` | Status khác DONE → clear completedAt | `completedAt: null` |
| 15 | `update()` | Task không tồn tại | Throw `NotFoundException` |
| 16 | `remove()` | Xóa task thành công | Message success, emitToProject |
| 17 | `remove()` | Task không tồn tại | Throw `NotFoundException` |
| 18 | `updateStatus()` | Chuyển status thành công | emit events |
| 19 | `updateStatus()` | Status DONE → set completedAt | `completedAt: Date` |
| 20 | `updateStatus()` | Status khác → clear completedAt | `completedAt: null` |
| 21 | `updateStatus()` | Task không tồn tại | Throw `NotFoundException` |
| 22 | `assignMember()` | Assign thành công | Message + assignment |
| 23 | `assignMember()` | Target không phải member WS | Throw `ForbiddenException` |
| 24 | `assignMember()` | Đã assign rồi | Throw `ConflictException` |
| 25 | `unassignMember()` | Unassign thành công | Message success |
| 26 | `unassignMember()` | Chưa assign | Throw `NotFoundException` |
| 27 | `addLabel()` | Gắn label thành công | Message + taskLabel |
| 28 | `addLabel()` | Label không thuộc workspace | Throw `NotFoundException` |
| 29 | `addLabel()` | Label đã gắn rồi | Throw `ConflictException` |
| 30 | `removeLabel()` | Gỡ label thành công | Message success |
| 31 | `removeLabel()` | Label chưa gắn | Throw `NotFoundException` |
| 32 | `createSubtask()` | Tạo subtask thành công | position đúng |
| 33 | `createSubtask()` | Position = 1 khi chưa có subtask | position: 1 |
| 34 | `toggleSubtask()` | Toggle false → true | `isCompleted: true` |
| 35 | `toggleSubtask()` | Subtask không tồn tại | Throw `NotFoundException` |
| 36 | `toggleSubtask()` | Không có quyền | Throw `ForbiddenException` |
| 37 | `findSubtasks()` | Trả về subtasks sorted | orderBy position asc |
| 38 | `removeSubtask()` | Xóa subtask thành công | Message success |
| 39 | `removeSubtask()` | Subtask không tồn tại | Throw `NotFoundException` |
| 40-42 | (bổ sung) | Edge cases phát sinh khi viết | Tùy logic |

### P2. TaskController Test

**File:** `backend/src/modules/task/task.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Sự khác biệt Service vs Controller test — Controller KHÔNG test business logic, chỉ verify delegation (14 endpoints → 14 tests)
> - **8.4.3** TestingModule — `controllers: [TaskController]` + mock TaskService (14 methods)
> - **8.4.2** `toHaveBeenCalledWith()` — Verify mỗi controller method truyền đúng params xuống service (userId, id, dto, query)

```typescript
const mockTaskService = {
  create: jest.fn(),
  findAllByProject: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  updateStatus: jest.fn(),
  assignMember: jest.fn(),
  unassignMember: jest.fn(),
  addLabel: jest.fn(),
  removeLabel: jest.fn(),
  createSubtask: jest.fn(),
  toggleSubtask: jest.fn(),
  findSubtasks: jest.fn(),
  removeSubtask: jest.fn(),
};
```

**Test cases (14 tests):** Mỗi endpoint 1 test — verify controller gọi đúng service method.

| # | Endpoint | Verify |
|---|----------|--------|
| 1 | `create()` | `service.create(userId, projectId, dto)` |
| 2 | `findAll()` | `service.findAllByProject(userId, projectId, query)` |
| 3 | `findOne()` | `service.findOne(userId, id)` |
| 4 | `update()` | `service.update(userId, id, dto)` |
| 5 | `remove()` | `service.remove(userId, id)` |
| 6 | `updateStatus()` | `service.updateStatus(userId, id, dto)` |
| 7 | `assignMember()` | `service.assignMember(userId, id, dto.userId)` |
| 8 | `unassignMember()` | `service.unassignMember(userId, id, targetUserId)` |
| 9 | `addLabel()` | `service.addLabel(userId, id, dto.labelId)` |
| 10 | `removeLabel()` | `service.removeLabel(userId, id, labelId)` |
| 11 | `createSubtask()` | `service.createSubtask(userId, id, dto)` |
| 12 | `findSubtasks()` | `service.findSubtasks(userId, id)` |
| 13 | `toggleSubtask()` | `service.toggleSubtask(userId, id)` |
| 14 | `removeSubtask()` | `service.removeSubtask(userId, id)` |

---

## Huyền — CommentService, CommentController, NotificationService, NotificationController

### H1. CommentService Test

**File:** `backend/src/modules/comment/comment.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.4.1** Vấn đề dependency — CommentService phụ thuộc 3 service (Prisma, Events, Notification), mock tất cả để cô lập
> - **8.4.2** Jest mock functions — `jest.fn()` cho Prisma delegate (`task.findUnique`, `comment.create`) + service methods (`emitToTask`, `notificationService.create`)
> - **8.4.3** TestingModule với mock DI — Inject 3 mock providers
> - **8.5** Kiểm thử Service — Test cả side-effects: verify `emitToTask` được gọi khi tạo comment, verify `notificationService.create` được gọi cho task owner
> - **8.3.1** `expect().rejects.toThrow(NotFoundException)` — Test async error: task không tồn tại, parent comment không tồn tại
> - **8.4.2** `toHaveBeenCalledWith()` — Verify mock được gọi với đúng params (kiểm tra notification gửi đúng userId, đúng type)

**Dependencies cần mock:** `PrismaService`, `EventsService`, `NotificationService`

```typescript
const mockPrismaService = {
  task: { findUnique: jest.fn() },
  comment: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockEventsService = {
  emitToTask: jest.fn(),
};

const mockNotificationService = {
  create: jest.fn(),
};
```

**Test cases (6 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `create()` | Tạo comment thành công | Trả về comment, emitToTask gọi |
| 2 | `create()` | Task không tồn tại | Throw `NotFoundException` |
| 3 | `create()` | Gửi notification cho task owner | `notificationService.create` gọi |
| 4 | `reply()` | Reply thành công | parentId đúng |
| 5 | `reply()` | Task không tồn tại | Throw `NotFoundException` |
| 6 | `reply()` | Parent comment không tồn tại | Throw `NotFoundException` |

### H2. CommentController Test

**File:** `backend/src/modules/comment/comment.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Controller test pattern — Mock CommentService (2 methods: create, reply), verify delegation
> - **8.4.2** `toHaveBeenCalledWith(userId, taskId, content)` — Verify controller truyền đúng params từ decorator (@CurrentUser, @Param, @Body)

```typescript
const mockCommentService = {
  create: jest.fn(),
  reply: jest.fn(),
};
```

**Test cases (2 tests):** Mỗi endpoint 1 test.

### H3. NotificationService Test

**File:** `backend/src/modules/notification/notification.service.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.4.2** Jest mock functions — Mock `prisma.notification.create` và `eventsService.emitToUser`
> - **8.5** Kiểm thử Service — Test service đơn giản (1 method): verify tạo notification trong DB + verify emit WebSocket event đúng room
> - **8.4.2** `toHaveBeenCalledWith('userId', 'notification:new', ...)` — Verify side-effect: đúng userId, đúng event name, đúng payload

**Dependencies cần mock:** `PrismaService`, `EventsService`

```typescript
const mockPrismaService = {
  notification: {
    create: jest.fn(),
  },
};

const mockEventsService = {
  emitToUser: jest.fn(),
};
```

**Test cases (2 tests):**

| # | Method | Test case | Assert |
|---|--------|-----------|--------|
| 1 | `create()` | Tạo notification thành công | Trả về notification, emitToUser gọi |
| 2 | `create()` | Emit đúng userId và event name | `emitToUser('userId', 'notification:new', ...)` |

### H4. NotificationController Test

**File:** `backend/src/modules/notification/notification.controller.spec.ts`

> **Kiến thức Chương 8 áp dụng:**
> - **8.6.1** Controller test pattern — Mock NotificationService (1 method: create), verify delegation
> - **8.4.3** TestingModule — Controller test đơn giản nhất: 1 controller + 1 mock provider

```typescript
const mockNotificationService = {
  create: jest.fn(),
};
```

**Test cases (1 test):** Verify delegation.

---

## Chạy toàn bộ + Coverage

Sau khi TẤT CẢ thành viên merge PR vào `develop`:

```bash
cd backend

# 1. Chạy toàn bộ test
npm run test

# Expected: ~159 tests passed

# 2. Chạy coverage
npm run test:cov

# Expected: Mỗi file service/controller đều ≥ 70%
```

**Kết quả mong đợi:**

```
------------------------------------|---------|----------|---------|---------|
File                                | % Stmts | % Branch | % Funcs | % Lines |
------------------------------------|---------|----------|---------|---------|
 modules/auth/                      |         |          |         |         |
  auth.service.ts                   |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  auth.controller.ts                |     100 |      100 |     100 |     100 |
 modules/user/                      |         |          |         |         |
  user.service.ts                   |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  user.controller.ts                |     100 |      100 |     100 |     100 |
 modules/workspace/                 |         |          |         |         |
  workspace.service.ts              |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  workspace.controller.ts           |     100 |      100 |     100 |     100 |
 modules/project/                   |         |          |         |         |
  project.service.ts                |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  project.controller.ts             |     100 |      100 |     100 |     100 |
 modules/task/                      |         |          |         |         |
  task.service.ts                   |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  task.controller.ts                |     100 |      100 |     100 |     100 |
 modules/comment/                   |         |          |         |         |
  comment.service.ts                |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  comment.controller.ts             |     100 |      100 |     100 |     100 |
 modules/notification/              |         |          |         |         |
  notification.service.ts           |   ≥ 80  |   ≥ 70   |    100  |   ≥ 80  |
  notification.controller.ts        |     100 |      100 |     100 |     100 |
------------------------------------|---------|----------|---------|---------|
```

---

## Tổng kết

| Thành viên | Files | Tests | Kỹ thuật chính | Kiến thức Chương 8 nổi bật |
|------------|-------|-------|----------------|---------------------------|
| **Đạt** | 4 spec files | ~40 | Mock JwtService, bcrypt, MailService, ConfigService | 8.4.2 (jest.fn, mockResolvedValue), 8.4.3 (TestingModule DI), 8.5 (Service test), 8.6.1 (Controller test), mock module ngoài (`jest.mock('bcrypt')`) |
| **Vy** | 4 spec files | ~50 | Mock $transaction, nhiều role-based tests | 8.4.2 (mock callback pattern cho $transaction), 8.4.1 (multi-delegate dependency), 8.3.1 (beforeEach + clearAllMocks), 8.5 (CRUD + permission test) |
| **Phú** | 2 spec files | ~57 | Mock PrismaService đa delegate, EventsService | 8.1.3 (Kim tự tháp kiểm thử), 8.5.2/8.5.3/8.5.5 (test create/findAll/update), 8.4.2 (mock đa cấp), helper functions (DRY testing) |
| **Huyền** | 4 spec files | ~12 | Mock EventsService, NotificationService | 8.4.2 (verify side-effects bằng toHaveBeenCalledWith), 8.5 (test service có side-effect: emit event + tạo notification), 8.6.1 (controller delegation) |
| **Tổng** | **14 spec files** | **~159** | — | — |

### Bảng tổng hợp: Kiến thức Chương 8 → Thực hành trong đồ án

| Mục Chương 8 | Nội dung lý thuyết | Áp dụng thực tế trong đồ án |
|-------------|-------------------|----------------------------|
| **8.1.1** Định nghĩa và tầm quan trọng | Unit test phát hiện lỗi sớm, giảm chi phí sửa | Viết 159 test cases cho toàn bộ 8 modules trước khi deploy |
| **8.1.3** Kim tự tháp kiểm thử | Unit test ở đáy, số lượng nhiều nhất, chạy nhanh nhất | Toàn bộ test đều là unit test, mock hết database + external services |
| **8.2.1** Jest framework | Cú pháp `describe`, `it`, `expect`, matchers | Mọi file spec đều dùng Jest syntax: `toEqual`, `toThrow`, `toHaveBeenCalledWith` |
| **8.2.2** @nestjs/testing | `Test.createTestingModule()` tạo module test cô lập | 14 file spec đều dùng TestingModule để bootstrap service/controller |
| **8.2.3** Quy ước đặt tên + chạy test | File `.spec.ts` đặt cạnh source, `npm run test` | Tất cả file đặt đúng quy ước: `auth.service.spec.ts` cạnh `auth.service.ts` |
| **8.3.1** Cấu trúc test cơ bản | `describe` nhóm, `it` từng case, `beforeEach` setup | Mỗi file: `describe('ServiceName')` → `describe('methodName')` → `it('should...')` |
| **8.4.1** Vấn đề dependency | Service phụ thuộc DB, JWT, Mail → cần cô lập | AuthService mock 4 deps, TaskService mock 2 deps, CommentService mock 3 deps |
| **8.4.2** Jest mock functions | `jest.fn()`, `mockResolvedValue()`, `toHaveBeenCalledWith()` | Mock tất cả Prisma delegates + external services, verify cả return value lẫn mock calls |
| **8.4.3** TestingModule với mock DI | `{ provide: X, useValue: mockX }` thay dependency thật | Pattern dùng xuyên suốt 14 files, mỗi file inject mock qua providers array |
| **8.5** Kiểm thử Service | Test business logic: happy path + error case | Mỗi method ≥ 2 test: thành công + lỗi (NotFoundException, ForbiddenException, ConflictException) |
| **8.6.1** Kiểm thử Controller | Controller test chỉ verify delegation, không test logic | 7 controller spec files, mỗi endpoint 1 test verify `toHaveBeenCalledWith()` |
| **8.7** Code Coverage | `npm run test:cov`, đọc % Stmts/Branch/Funcs/Lines | Mục tiêu ≥ 70% cho mỗi file, chạy sau khi tất cả thành viên merge |
