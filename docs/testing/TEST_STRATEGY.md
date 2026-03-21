# Test Strategy — TodoList Collaboration

> Tài liệu chiến lược testing cho toàn bộ dự án. Áp dụng cho tất cả modules hiện tại và tương lai.

---

## 1. Test Pyramid

```
        /  E2E  \          ← Ít nhất (manual via Hoppscotch)
       /----------\
      / Integration \      ← Trung bình (supertest + test DB)
     /----------------\
    /    Unit Tests     \   ← Nhiều nhất (jest + mock)
   /____________________\
```

| Tầng | Mô tả | Công cụ | Tỷ lệ |
|------|--------|---------|--------|
| **Unit Test** | Test từng service method riêng lẻ, mock dependencies | Jest + ts-jest | ~60% |
| **Integration Test** | Test API endpoint thật, boot NestJS app, kết nối test DB | Jest + supertest + @nestjs/testing | ~30% |
| **E2E / Manual** | Test luồng end-to-end hoàn chỉnh | Hoppscotch (manual) | ~10% |

---

## 2. Công cụ sử dụng

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| Jest | ^30.0.0 | Test runner + assertion |
| ts-jest | ^29.2.5 | Transpile TypeScript cho Jest |
| @nestjs/testing | ^11.0.1 | Tạo testing module, compile app |
| supertest | ^7.0.0 | Gửi HTTP request trong integration test |
| bcrypt | (existing) | Mock trong unit test, dùng thật trong integration |

---

## 3. Phân loại file test

### 3.1. Quy ước đặt tên

| Loại | Pattern | Vị trí | Ví dụ |
|------|---------|--------|-------|
| Unit test | `*.spec.ts` | Cùng thư mục với file source | `auth.service.spec.ts` |
| Integration test | `*.integration-spec.ts` | Cùng thư mục với file source | `auth.integration-spec.ts` |
| E2E test | `*.e2e-spec.ts` | `test/` | `app.e2e-spec.ts` |

### 3.2. Cấu trúc file test

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts          ← Unit test
│   │   ├── auth.controller.spec.ts       ← Unit test
│   │   └── auth.integration-spec.ts      ← Integration test
│   ├── user/
│   │   ├── user.service.ts
│   │   ├── user.service.spec.ts          ← Unit test
│   │   ├── user.controller.spec.ts       ← Unit test
│   │   └── user.integration-spec.ts      ← Integration test
│   └── ...
├── test/
│   └── jest-e2e.json
└── package.json (chứa jest config)
```

---

## 4. Cấu hình Jest

### 4.1. Unit test (đã có trong package.json)

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### 4.2. Integration test (cần thêm)

Tạo file `test/jest-integration.json`:

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "../src",
  "testRegex": ".*\\.integration-spec\\.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "testEnvironment": "node",
  "testTimeout": 30000
}
```

### 4.3. Scripts trong package.json (cần bổ sung)

```json
{
  "test": "jest",
  "test:unit": "jest --testPathPattern=\\.spec\\.ts$",
  "test:integration": "jest --config ./test/jest-integration.json",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
}
```

---

## 5. Test Database

### 5.1. Setup

- Tạo database PostgreSQL riêng cho test: `todolist_test`
- Dùng file `.env.test` riêng với `DATABASE_URL` trỏ đến `todolist_test`
- Chạy migration trước khi test: `dotenv -e .env.test npx prisma migrate deploy`

### 5.2. File `.env.test`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/todolist_test"
JWT_SECRET="test-jwt-secret"
JWT_REFRESH_SECRET="test-jwt-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 5.3. Lifecycle

```
Trước mỗi test suite (beforeAll):
  1. Kết nối test DB
  2. Compile NestJS testing module

Trước mỗi test case (beforeEach):
  1. Truncate tất cả tables (reset data sạch)

Sau tất cả test (afterAll):
  1. Đóng kết nối DB
  2. Đóng NestJS app
```

---

## 6. Coverage Targets

| Metric | Mục tiêu tối thiểu | Ghi chú |
|--------|---------------------|---------|
| **Statements** | ≥ 80% | |
| **Branches** | ≥ 75% | Bao gồm error branches |
| **Functions** | ≥ 85% | Tất cả public methods phải được test |
| **Lines** | ≥ 80% | |

### Ưu tiên coverage theo module

| Ưu tiên | Module | Lý do |
|---------|--------|-------|
| Cao | Auth | Liên quan bảo mật, logic phức tạp |
| Cao | User | Xử lý dữ liệu nhạy cảm (password, avatar) |
| Trung bình | Common (filters, interceptors) | Infrastructure code |
| Trung bình | Prisma | Chủ yếu wrapper, ít logic |

---

## 7. Quy ước viết test

### 7.1. Cấu trúc describe/it

```typescript
describe('AuthService', () => {
  // Setup: mock, DI, beforeEach

  describe('register', () => {
    it('should create user and return tokens when valid data', async () => { ... });
    it('should throw ConflictException when email exists', async () => { ... });
  });

  describe('login', () => {
    it('should return tokens when credentials are correct', async () => { ... });
    it('should throw UnauthorizedException when email not found', async () => { ... });
    it('should throw UnauthorizedException when password wrong', async () => { ... });
  });
});
```

### 7.2. Naming convention cho `it()`

- Format: `should <expected behavior> when <condition>`
- Ví dụ: `should throw ConflictException when email already exists`
- Ví dụ: `should return 200 with user profile when valid token`

### 7.3. Arrange-Act-Assert (AAA)

```typescript
it('should throw UnauthorizedException when password wrong', async () => {
  // Arrange — chuẩn bị dữ liệu
  const dto = { email: 'test@test.com', password: 'wrong' };
  mockPrisma.user.findUnique.mockResolvedValue(mockUser);
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

  // Act & Assert — thực thi và kiểm tra
  await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
});
```

---

## 8. Cách chạy test

```bash
# Chạy tất cả unit tests
npm test

# Chạy unit test cho 1 module
npx jest auth.service.spec.ts

# Chạy integration tests (cần test DB)
npm run test:integration

# Chạy với coverage report
npm run test:cov

# Chạy watch mode (tự re-run khi file thay đổi)
npm run test:watch
```

---

## 9. Phân loại Test Cases

Mỗi module sẽ có các loại test case sau:

| Loại | Mô tả | Ví dụ |
|------|--------|-------|
| **Happy path** | Luồng chính hoạt động đúng | Register thành công → 201 |
| **Validation** | Input không hợp lệ | Email sai format → 400 |
| **Error handling** | Xử lý lỗi business logic | Email trùng → 409 |
| **Boundary** | Giá trị biên | Password đúng 8 ký tự (min) |
| **Security** | Bảo mật | SQL injection, XSS, token tampering |
| **Authorization** | Kiểm soát truy cập | Không có token → 401 |

---

## 10. Quy trình thêm module mới

Khi phát triển module mới (ví dụ: Workspace, Task), làm theo các bước:

1. Tạo file test case: `docs/testing/XX-<module>-test-cases.md`
2. Viết unit test: `src/<module>/<module>.service.spec.ts`
3. Viết integration test: `src/<module>/<module>.integration-spec.ts`
4. Chạy coverage, đảm bảo đạt target
5. Cập nhật `API_TEST_FLOWS.md` với flow test manual mới
