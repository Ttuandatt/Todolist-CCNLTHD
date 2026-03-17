# Test Data Strategy — TodoList Collaboration

> Quy chuẩn quản lý dữ liệu test: factory functions, fixtures, cleanup, reusable helpers.

---

## 1. Nguyên tắc

- **Mỗi test case phải độc lập** — không phụ thuộc vào thứ tự chạy hay dữ liệu từ test khác
- **Tự tạo, tự dọn** — test tạo data gì thì cleanup data đó
- **Không dùng data production** — luôn dùng DB riêng (`todolist_test`)
- **Deterministic** — chạy lần nào cũng cho kết quả giống nhau

---

## 2. Test Database Lifecycle

### 2.1. Setup 1 lần (trước khi chạy test suite)

```bash
# Tạo DB test (nếu chưa có)
createdb todolist_test

# Chạy migration
dotenv -e .env.test npx prisma migrate deploy
```

### 2.2. Cleanup giữa các test

```typescript
// test/helpers/db-cleanup.ts
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Truncate tất cả tables theo đúng thứ tự (tránh FK constraint)
 * Gọi trong beforeEach() của integration tests
 */
export async function cleanDatabase(prisma: PrismaService) {
  await prisma.$transaction([
    prisma.invalidatedToken.deleteMany(),
    prisma.passwordReset.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.attachment.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.taskLabel.deleteMany(),
    prisma.taskAssignment.deleteMany(),
    prisma.subtask.deleteMany(),
    prisma.task.deleteMany(),
    prisma.project.deleteMany(),
    prisma.label.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.workspaceMember.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
```

---

## 3. Factory Functions

Factory functions tạo dữ liệu test nhanh, nhất quán, có thể override từng field.

### 3.1. User Factory

```typescript
// test/factories/user.factory.ts
import * as bcrypt from 'bcrypt';

export interface CreateUserData {
  email?: string;
  password?: string;        // plain text (chưa hash)
  name?: string;
  displayName?: string;
  bio?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

const defaults: Required<CreateUserData> = {
  email: 'test@example.com',
  password: 'Password@123',
  name: 'Test User',
  displayName: 'Test',
  bio: '',
  status: 'ACTIVE',
};

/**
 * Tạo user trực tiếp trong DB (bypass service layer)
 * Dùng cho integration test khi cần user có sẵn
 */
export async function createUser(prisma: PrismaService, overrides: CreateUserData = {}) {
  const data = { ...defaults, ...overrides };
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      displayName: data.displayName,
      bio: data.bio,
      status: data.status,
    },
  });
}
```

### 3.2. Token Factory

```typescript
// test/factories/token.factory.ts

/**
 * Tạo user + login + trả về tokens
 * Dùng cho integration test khi cần authenticated request
 */
export async function createAuthenticatedUser(
  app: INestApplication,
  overrides: CreateUserData = {},
) {
  const userData = { ...userDefaults, ...overrides };

  // Register qua API
  const registerRes = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({
      email: userData.email,
      password: userData.password,
      fullname: userData.name,
      displayName: userData.displayName,
    });

  return {
    user: registerRes.body.data.user,
    accessToken: registerRes.body.data.tokens.accessToken,
    refreshToken: registerRes.body.data.tokens.refreshToken,
    password: userData.password,  // plain text, cho test change-password
  };
}
```

---

## 4. Mock Data cho Unit Test

### 4.1. Mock User Object

```typescript
// test/mocks/user.mock.ts
export const mockUser = {
  id: 'uuid-test-user-001',
  email: 'test@example.com',
  password: '$2b$10$hashedPasswordHere',  // bcrypt hash of 'Password@123'
  name: 'Test User',
  displayName: 'Test',
  avatar: null,
  bio: null,
  status: 'ACTIVE' as const,
  emailVerified: false,
  lastLoginAt: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};
```

### 4.2. Mock PrismaService

```typescript
// test/mocks/prisma.mock.ts
export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  passwordReset: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  invalidatedToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  $transaction: jest.fn((callbacks) => Promise.all(callbacks)),
};
```

### 4.3. Mock JwtService

```typescript
// test/mocks/jwt.mock.ts
export const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'uuid-test', email: 'test@test.com' }),
  decode: jest.fn().mockReturnValue({ sub: 'uuid-test', exp: Math.floor(Date.now() / 1000) + 900 }),
};
```

---

## 5. Fixtures — Dữ liệu test cố định

### 5.1. DTO Fixtures

```typescript
// test/fixtures/auth.fixtures.ts
export const validRegisterDto = {
  email: 'newuser@test.com',
  password: 'Password@123',
  fullname: 'New User',
  displayName: 'New',
};

export const validLoginDto = {
  email: 'test@example.com',
  password: 'Password@123',
};

export const validChangePasswordDto = {
  currentPassword: 'Password@123',
  newPassword: 'NewPassword@456',
  confirmPassword: 'NewPassword@456',
};

export const validUpdateProfileDto = {
  displayName: 'Updated Name',
  bio: 'Updated bio',
};
```

### 5.2. Boundary Fixtures

```typescript
// test/fixtures/boundary.fixtures.ts
export const boundary = {
  password: {
    exactly8Chars: 'Pass@1ab',           // đúng min length
    exactly7Chars: 'Pass@1a',            // dưới min → fail
  },
  displayName: {
    exactly50Chars: 'a'.repeat(50),      // đúng max
    exactly51Chars: 'a'.repeat(51),      // vượt max → fail
  },
  bio: {
    exactly160Chars: 'b'.repeat(160),    // đúng max
    exactly161Chars: 'b'.repeat(161),    // vượt max → fail
  },
  email: {
    maxLength: 'a'.repeat(240) + '@test.com',  // email cực dài
  },
  avatar: {
    maxFileSize: 5 * 1024 * 1024,        // 5MB — đúng limit
    overMaxFileSize: 5 * 1024 * 1024 + 1, // vượt limit
  },
};
```

### 5.3. Security Fixtures

```typescript
// test/fixtures/security.fixtures.ts
export const security = {
  sqlInjection: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "admin'--",
    "1; DELETE FROM users",
  ],
  xss: [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '"><script>alert(document.cookie)</script>',
  ],
  pathTraversal: [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    'avatar-../../secret.txt',
  ],
  tokenTampering: [
    'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSJ9.',  // alg:none
    'invalid.token.here',
    '',
    'Bearer ',
  ],
};
```

---

## 6. Helper Functions — Tái sử dụng

### 6.1. Auth Helper cho Integration Test

```typescript
// test/helpers/auth.helper.ts
import * as request from 'supertest';

/**
 * Register + lấy tokens — dùng khi test cần user authenticated
 */
export async function registerAndGetTokens(
  app: INestApplication,
  email = 'helper@test.com',
  password = 'Password@123',
) {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({ email, password, fullname: 'Helper User', displayName: 'Helper' });

  return {
    accessToken: res.body.data.tokens.accessToken,
    refreshToken: res.body.data.tokens.refreshToken,
    userId: res.body.data.user.id,
  };
}

/**
 * Tạo authenticated request — tự gắn Bearer token
 */
export function authGet(app: INestApplication, url: string, token: string) {
  return request(app.getHttpServer())
    .get(url)
    .set('Authorization', `Bearer ${token}`);
}

export function authPatch(app: INestApplication, url: string, token: string) {
  return request(app.getHttpServer())
    .patch(url)
    .set('Authorization', `Bearer ${token}`);
}

export function authPost(app: INestApplication, url: string, token: string) {
  return request(app.getHttpServer())
    .post(url)
    .set('Authorization', `Bearer ${token}`);
}
```

---

## 7. Cấu trúc thư mục test helpers

```
backend/
├── test/
│   ├── jest-e2e.json
│   ├── jest-integration.json       ← config cho integration test
│   ├── helpers/
│   │   ├── db-cleanup.ts           ← truncate tables
│   │   └── auth.helper.ts          ← register, login, auth request helpers
│   ├── factories/
│   │   ├── user.factory.ts         ← tạo user trong DB
│   │   └── token.factory.ts        ← tạo user + tokens
│   ├── fixtures/
│   │   ├── auth.fixtures.ts        ← DTO mẫu
│   │   ├── boundary.fixtures.ts    ← giá trị biên
│   │   └── security.fixtures.ts    ← payloads tấn công
│   └── mocks/
│       ├── prisma.mock.ts          ← mock PrismaService
│       ├── jwt.mock.ts             ← mock JwtService
│       └── user.mock.ts            ← mock User object
└── src/
    └── ...
```

---

## 8. Tóm tắt: Khi nào dùng gì?

| Loại test | Data source | Ví dụ |
|-----------|-------------|-------|
| **Unit test** | Mock objects + Fixtures | `mockPrisma.user.findUnique.mockResolvedValue(mockUser)` |
| **Integration test** | Factory functions + Test DB | `createAuthenticatedUser(app)` → tạo user thật trong DB |
| **Boundary test** | Boundary fixtures | `boundary.password.exactly8Chars` |
| **Security test** | Security fixtures | `security.xss.forEach(payload => ...)` |
