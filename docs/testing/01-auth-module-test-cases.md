# 1. Auth Module — Test Cases

> Module: `src/auth/`
> Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password`

---

## 1.1. Unit Test — AuthService

> File: `src/auth/auth.service.spec.ts`
> Dependencies: mock PrismaService, mock JwtService, mock bcrypt

---

### 1.1.1. `register(dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-001 | should create user and return tokens when valid data | Email chưa tồn tại, data hợp lệ | Trả `{ user, tokens }`, gọi `prisma.user.create`, gọi `bcrypt.hash` |
| UT-A-002 | should throw ConflictException when email already exists | `prisma.user.findUnique` trả về user | Throw `ConflictException('Email already exists')` |
| UT-A-003 | should hash password with bcrypt salt 10 | Kiểm tra bcrypt.hash được gọi đúng | `bcrypt.hash(dto.password, 10)` |
| UT-A-004 | should not return password in response | Response object | `user` object không chứa field `password` |
| UT-A-005 | should save displayName to database | dto có displayName | `prisma.user.create` nhận `data.displayName` |
| UT-A-006 | should call generateTokens with userId and email | Register thành công | `generateTokens(user.id, user.email)` |

---

### 1.1.2. `login(dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-010 | should return user and tokens when credentials correct | Email tồn tại, password khớp | Trả `{ user, tokens }` |
| UT-A-011 | should throw UnauthorizedException when email not found | `prisma.user.findUnique` trả null | Throw `UnauthorizedException` |
| UT-A-012 | should throw UnauthorizedException when password wrong | `bcrypt.compare` trả false | Throw `UnauthorizedException` |
| UT-A-013 | should use same error message for email/password failure | Cả 2 trường hợp sai | Message = `'Email or password is not correct'` |
| UT-A-014 | should update lastLoginAt on successful login | Login thành công | `prisma.user.update` với `lastLoginAt: new Date()` |
| UT-A-015 | should not return password in response | Response object | `user` object không chứa field `password` |

---

### 1.1.3. `refreshToken(dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-020 | should return new token pair when valid refresh token | Token tồn tại, chưa revoke, chưa hết hạn | Trả `{ accessToken, refreshToken, expiresIn }` |
| UT-A-021 | should throw UnauthorizedException when token not found | `prisma.refreshToken.findUnique` trả null | Throw `UnauthorizedException` |
| UT-A-022 | should throw UnauthorizedException when token already revoked | `storedToken.revokedAt` !== null | Throw `UnauthorizedException` |
| UT-A-023 | should throw UnauthorizedException when token expired | `storedToken.expiresAt` < now | Throw `UnauthorizedException` |
| UT-A-024 | should throw UnauthorizedException when JWT verify fails | `jwtService.verifyAsync` throws | Throw `UnauthorizedException` |
| UT-A-025 | should revoke old token after issuing new one | Refresh thành công | `prisma.refreshToken.update` với `revokedAt` |

---

### 1.1.4. `logout(userId, accessToken)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-030 | should revoke all refresh tokens of the user | Logout thành công | `prisma.refreshToken.updateMany` với `userId`, `revokedAt: null` |
| UT-A-031 | should add access token to blacklist | accessToken hợp lệ | `prisma.invalidatedToken.create` với token và expiresAt |
| UT-A-032 | should return success message | Logout thành công | `{ message: 'Logout successfully' }` |
| UT-A-033 | should handle null accessToken gracefully | accessToken = null/undefined | Không throw error, vẫn revoke refresh tokens |
| UT-A-034 | should handle decode failure gracefully | `jwtService.decode` throws | Không throw error (catch bên trong) |

---

### 1.1.5. `forgotPassword(dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-040 | should create reset token and return success message | User tồn tại | Trả `{ message: 'Reset password email sent' }` |
| UT-A-041 | should throw NotFoundException when user not found | Email không tồn tại | Throw `NotFoundException('User not found')` |
| UT-A-042 | should generate random hex token (32 bytes) | Token được tạo | `crypto.randomBytes(32).toString('hex')` → 64 chars |
| UT-A-043 | should set expiresAt to 15 minutes from now | Tạo password reset | `expiresAt` ≈ now + 15 phút |

---

### 1.1.6. `resetPassword(dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-050 | should update password and mark token as used | Token hợp lệ, chưa dùng, chưa hết hạn | `prisma.$transaction` với update password + update usedAt |
| UT-A-051 | should throw BadRequestException when token not found | Token không tồn tại | Throw `BadRequestException` |
| UT-A-052 | should throw BadRequestException when token already used | `usedAt` !== null | Throw `BadRequestException` |
| UT-A-053 | should throw BadRequestException when token expired | `expiresAt` < now | Throw `BadRequestException` |
| UT-A-054 | should hash new password with bcrypt | Reset thành công | `bcrypt.hash(dto.newPassword, 10)` |

---

### 1.1.7. `generateTokens(userId, email)` (private — test gián tiếp qua register/login)

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-A-060 | should create both access and refresh tokens | Gọi register/login | Response có `accessToken` và `refreshToken` |
| UT-A-061 | should save refresh token to database | Gọi register/login | `prisma.refreshToken.create` được gọi |
| UT-A-062 | should return expiresIn = 900 | Gọi register/login | `tokens.expiresIn === 900` |

---

## 1.2. Unit Test — AuthController

> File: `src/auth/auth.controller.spec.ts`
> Dependencies: mock AuthService

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-AC-001 | should call authService.register with dto | Controller nhận dto và delegate | `authService.register(dto)` |
| UT-AC-002 | should call authService.login with dto | Controller nhận dto và delegate | `authService.login(dto)` |
| UT-AC-003 | should call authService.refreshToken with dto | Controller nhận dto | `authService.refreshToken(dto)` |
| UT-AC-004 | should call authService.logout with userId and token | Extract từ @CurrentUser và @Headers | `authService.logout(userId, accessToken)` |
| UT-AC-005 | should strip 'Bearer ' prefix from authorization header | Header = `'Bearer xxx'` | `accessToken === 'xxx'` |
| UT-AC-006 | should call authService.forgotPassword with dto | Controller delegate | `authService.forgotPassword(dto)` |
| UT-AC-007 | should call authService.resetPassword with dto | Controller delegate | `authService.resetPassword(dto)` |

---

## 1.3. Integration Test — Auth API Endpoints

> File: `src/auth/auth.integration-spec.ts`
> Dependencies: NestJS testing module, test DB, supertest

---

### 1.3.1. `POST /api/v1/auth/register`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-A-001 | Happy path — đăng ký thành công | `{"email":"new@test.com","password":"Password@123","fullname":"New User","displayName":"New"}` | `201` | `success: true`, có `user` + `tokens` |
| IT-A-002 | Email đã tồn tại | Email trùng với user đã tạo | `409` | `"Email already exists"` |
| IT-A-003 | Email không hợp lệ | `{"email":"invalid"}` | `400` | `"Invalid email address"` |
| IT-A-004 | Password quá ngắn (< 8 chars) | `{"password":"Ab@1"}` | `400` | Message chứa "at least 8 characters" |
| IT-A-005 | Password thiếu uppercase | `{"password":"password@123"}` | `400` | Message chứa validation error |
| IT-A-006 | Password thiếu special char | `{"password":"Password123"}` | `400` | Message chứa validation error |
| IT-A-007 | Fullname trống | `{"fullname":""}` | `400` | `"Fullname should not be empty"` |
| IT-A-008 | DisplayName trống | `{"displayName":""}` | `400` | `"Display name should not be empty"` |
| IT-A-009 | Body rỗng | `{}` | `400` | Nhiều validation errors |
| IT-A-010 | Response không chứa password | Register thành công | `201` | `user` object KHÔNG có field `password` |
| IT-A-011 | Response có đúng structure | Register thành công | `201` | `{ success, data: { user, tokens }, timestamp }` |

---

### 1.3.2. `POST /api/v1/auth/login`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-A-020 | Happy path — login thành công | Email + password đúng | `200` | `success: true`, có `user` + `tokens` |
| IT-A-021 | Email không tồn tại | `{"email":"noexist@test.com"}` | `401` | `"Email or password is not correct"` |
| IT-A-022 | Password sai | Email đúng, password sai | `401` | `"Email or password is not correct"` |
| IT-A-023 | Cùng error message cho email/password sai | So sánh 2 responses | `401` | Message giống nhau (bảo mật) |

---

### 1.3.3. `POST /api/v1/auth/refresh`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-A-030 | Happy path — refresh thành công | refreshToken hợp lệ | `200` | Cặp token mới |
| IT-A-031 | Token không hợp lệ | `{"refreshToken":"invalid"}` | `401` | Error message |
| IT-A-032 | Token cũ bị revoke sau refresh | Dùng lại token cũ | `401` | Error message |

---

### 1.3.4. `POST /api/v1/auth/logout`

| # | Test case | Header | Expected Status | Expected Response |
|---|-----------|--------|-----------------|-------------------|
| IT-A-040 | Happy path — logout thành công | Bearer token hợp lệ | `200` | `"Logout successfully"` |
| IT-A-041 | Dùng token sau logout | Token đã blacklist | `401` | Unauthorized |
| IT-A-042 | Không có token | Không có Authorization | `401` | Unauthorized |
| IT-A-043 | Token sai | `Bearer invalid-xyz` | `401` | Unauthorized |

---

### 1.3.5. `POST /api/v1/auth/forgot-password`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-A-050 | Happy path — gửi reset email | Email tồn tại | `200` | `"Reset password email sent"` |
| IT-A-051 | Email không tồn tại | `{"email":"noexist@test.com"}` | `404` | `"User not found"` |

---

### 1.3.6. `POST /api/v1/auth/reset-password`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-A-060 | Happy path — reset thành công | Token hợp lệ + password mới | `200` | `"Password reset successfully"` |
| IT-A-061 | Login bằng password mới sau reset | Login với newPassword | `200` | Login thành công |
| IT-A-062 | Login bằng password cũ sau reset | Login với oldPassword | `401` | Unauthorized |
| IT-A-063 | Token không tồn tại | `{"token":"fake-token"}` | `400` | `"Invalid or expired reset token"` |
| IT-A-064 | Token đã sử dụng | Dùng lại token đã reset | `400` | `"Invalid or expired reset token"` |
| IT-A-065 | Validation error | `{"token":"","newPassword":"123"}` | `400` | Validation errors |

---

## 1.4. Boundary Test Cases

> Các test giá trị biên — chạy trong cả unit test và integration test

| # | Test case | Input | Expected |
|---|-----------|-------|----------|
| BT-A-001 | Password đúng 8 ký tự (min) | `"Pass@1ab"` | `201` — hợp lệ |
| BT-A-002 | Password 7 ký tự (dưới min) | `"Pass@1a"` | `400` — quá ngắn |
| BT-A-003 | Password 100 ký tự | `"A" * 90 + "a@1bcdefg"` | `201` — hợp lệ (không có max) |
| BT-A-004 | Email 255 ký tự (max thông thường) | `"a" * 240 + "@test.com"` | Kiểm tra xử lý |
| BT-A-005 | Email chỉ có @ | `"@"` | `400` |
| BT-A-006 | Fullname 1 ký tự | `"A"` | `201` — hợp lệ |
| BT-A-007 | Reset token 15 phút + 1 giây | Token vừa hết hạn | `400` — expired |

---

## 1.5. Security Test Cases

> Các test bảo mật — chạy trong integration test

---

### 1.5.1. SQL Injection

| # | Test case | Input field | Payload | Expected |
|---|-----------|-------------|---------|----------|
| ST-A-001 | SQL injection trong email (register) | `email` | `"'; DROP TABLE users; --"` | `400` — validation reject, DB không bị ảnh hưởng |
| ST-A-002 | SQL injection trong email (login) | `email` | `"' OR '1'='1"` | `400` hoặc `401` — không bypass auth |
| ST-A-003 | SQL injection trong password | `password` | `"' OR '1'='1"` | `401` — bcrypt.compare vẫn false |
| ST-A-004 | SQL injection trong reset token | `token` | `"'; DROP TABLE users; --"` | `400` — không tìm thấy token |

---

### 1.5.2. XSS

| # | Test case | Input field | Payload | Expected |
|---|-----------|-------------|---------|----------|
| ST-A-010 | XSS trong fullname | `fullname` | `<script>alert("xss")</script>` | `201` nhưng response trả plain text (không execute) |
| ST-A-011 | XSS trong displayName | `displayName` | `<img src=x onerror=alert(1)>` | `201` nhưng response trả plain text |
| ST-A-012 | XSS trong email | `email` | `test<script>@test.com` | `400` — validation reject |

---

### 1.5.3. Token Tampering

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| ST-A-020 | JWT alg:none attack | Token với algorithm = none | `401` — reject |
| ST-A-021 | Modified payload | Token hợp lệ nhưng payload bị sửa | `401` — signature invalid |
| ST-A-022 | Expired token | Token đã hết hạn | `401` |
| ST-A-023 | Token signed with wrong secret | Dùng secret khác | `401` |

---

### 1.5.4. Brute Force Protection

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| ST-A-030 | Multiple failed logins | 10 lần login sai liên tiếp | Kiểm tra hệ thống có rate limit không (ghi nhận nếu chưa có) |
| ST-A-031 | Multiple forgot-password requests | 10 lần forgot-password cho cùng email | Kiểm tra rate limit |

> **Lưu ý:** Nếu chưa implement rate limiting, ghi nhận là **known limitation** và tạo ticket để implement sau.

---

## 1.6. Tổng hợp Test Cases

| Loại | Số lượng | File |
|------|----------|------|
| Unit Test — AuthService | 27 cases | `auth.service.spec.ts` |
| Unit Test — AuthController | 7 cases | `auth.controller.spec.ts` |
| Integration Test | 23 cases | `auth.integration-spec.ts` |
| Boundary Test | 7 cases | Trong integration test |
| Security Test | 12 cases | Trong integration test |
| **Tổng** | **76 cases** | |
