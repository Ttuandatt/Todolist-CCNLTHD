# 2. User Module — Test Cases

> Module: `src/user/`
> Endpoints: `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/change-password`, `POST /users/me/avatar`
> **Tất cả endpoints đều require JWT authentication**

---

## 2.1. Unit Test — UserService

> File: `src/user/user.service.spec.ts`
> Dependencies: mock PrismaService, mock bcrypt, mock fs

---

### 2.1.1. `getProfile(userId)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-U-001 | should return user profile with all selected fields | User tồn tại | Trả object với 11 fields từ `profileSelect` |
| UT-U-002 | should throw NotFoundException when user not found | `prisma.user.findUnique` trả null | Throw `NotFoundException('User not found')` |
| UT-U-003 | should not return password field | User tồn tại | Response KHÔNG chứa `password` |
| UT-U-004 | should query with correct profileSelect | Kiểm tra select config | `select` có đúng 11 fields: id, email, name, displayName, avatar, status, bio, emailVerified, lastLoginAt, createdAt, updatedAt |

---

### 2.1.2. `updateProfile(userId, dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-U-010 | should update both displayName and bio | dto có cả 2 fields | `prisma.user.update` với cả `displayName` và `bio` |
| UT-U-011 | should update only displayName when bio not provided | dto chỉ có displayName | `prisma.user.update` chỉ có `displayName`, không có `bio` |
| UT-U-012 | should update only bio when displayName not provided | dto chỉ có bio | `prisma.user.update` chỉ có `bio`, không có `displayName` |
| UT-U-013 | should throw BadRequestException when no fields provided | dto = `{}` | Throw `BadRequestException('At least one field...')` |
| UT-U-014 | should return updated user profile | Update thành công | Trả object với `profileSelect` fields |

---

### 2.1.3. `changePassword(userId, dto)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-U-020 | should change password and revoke refresh tokens | Tất cả đúng | `prisma.$transaction` với update password + revoke tokens |
| UT-U-021 | should throw BadRequestException when passwords do not match | `newPassword` !== `confirmPassword` | Throw `BadRequestException('...do not match')` |
| UT-U-022 | should throw NotFoundException when user not found | `prisma.user.findUnique` trả null | Throw `NotFoundException` |
| UT-U-023 | should throw BadRequestException when current password wrong | `bcrypt.compare` trả false | Throw `BadRequestException('Invalid current password')` |
| UT-U-024 | should throw BadRequestException when new password same as current | `bcrypt.compare(newPassword, hash)` trả true | Throw `BadRequestException('...cannot be the same...')` |
| UT-U-025 | should hash new password with bcrypt salt 10 | Change thành công | `bcrypt.hash(dto.newPassword, 10)` |
| UT-U-026 | should revoke all active refresh tokens | Change thành công | `prisma.refreshToken.updateMany` với `revokedAt: null` |
| UT-U-027 | should return success message | Change thành công | `{ message: 'Password changed successfully' }` |

---

### 2.1.4. `uploadAvatar(userId, file)`

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-U-030 | should update avatar filename in database | User tồn tại, file hợp lệ | `prisma.user.update` với `avatar: file.filename` |
| UT-U-031 | should throw NotFoundException when user not found | `prisma.user.findUnique` trả null | Throw `NotFoundException` |
| UT-U-032 | should delete old avatar file when exists | User đã có avatar cũ | `fs.unlink(oldPath)` được gọi |
| UT-U-033 | should not throw when old avatar file not found | `fs.unlink` throws ENOENT | Catch error, không throw ra ngoài |
| UT-U-034 | should skip delete when user has no previous avatar | `user.avatar` = null | `fs.unlink` KHÔNG được gọi |
| UT-U-035 | should return updated user profile with new avatar | Upload thành công | Response có `avatar` = filename mới |

---

## 2.2. Unit Test — UserController

> File: `src/user/user.controller.spec.ts`
> Dependencies: mock UserService

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| UT-UC-001 | should call userService.getProfile with userId | `@CurrentUser('id')` extract userId | `userService.getProfile(userId)` |
| UT-UC-002 | should call userService.updateProfile with userId and dto | PATCH /me | `userService.updateProfile(userId, dto)` |
| UT-UC-003 | should call userService.changePassword with userId and dto | PATCH /me/change-password | `userService.changePassword(userId, dto)` |
| UT-UC-004 | should call userService.uploadAvatar with userId and file | POST /me/avatar | `userService.uploadAvatar(userId, file)` |
| UT-UC-005 | should apply JwtAuthGuard at controller level | Controller decorator | `@UseGuards(JwtAuthGuard)` |

---

## 2.3. Integration Test — User API Endpoints

> File: `src/user/user.integration-spec.ts`
> Dependencies: NestJS testing module, test DB, supertest
> **Setup:** Mỗi test cần register + login để lấy accessToken (dùng `registerAndGetTokens` helper)

---

### 2.3.1. `GET /api/v1/users/me`

| # | Test case | Header | Expected Status | Expected Response |
|---|-----------|--------|-----------------|-------------------|
| IT-U-001 | Happy path — lấy profile | Bearer token hợp lệ | `200` | Profile đầy đủ 11 fields |
| IT-U-002 | Response có đúng structure | Bearer token hợp lệ | `200` | `{ success, data: { id, email, name, ... }, timestamp }` |
| IT-U-003 | Response không chứa password | Bearer token hợp lệ | `200` | `data` KHÔNG có field `password` |
| IT-U-004 | Không có token | Không gửi header | `401` | Unauthorized |
| IT-U-005 | Token không hợp lệ | `Bearer invalid-xyz` | `401` | Unauthorized |

---

### 2.3.2. `PATCH /api/v1/users/me`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-U-010 | Happy path — update cả 2 fields | `{"displayName":"New","bio":"Bio"}` | `200` | Profile có displayName + bio mới |
| IT-U-011 | Chỉ update displayName | `{"displayName":"New"}` | `200` | displayName thay đổi, bio giữ nguyên |
| IT-U-012 | Chỉ update bio | `{"bio":"New bio"}` | `200` | bio thay đổi, displayName giữ nguyên |
| IT-U-013 | Body rỗng | `{}` | `400` | `"At least one field..."` |
| IT-U-014 | displayName vượt 50 ký tự | `{"displayName":"a" * 51}` | `400` | `"Display name must be at most 50 characters"` |
| IT-U-015 | bio vượt 160 ký tự | `{"bio":"b" * 161}` | `400` | `"Bio must be at most 160 characters"` |
| IT-U-016 | Không có token | — | `401` | Unauthorized |
| IT-U-017 | Verify data persisted | GET /users/me sau update | `200` | Data đã cập nhật |

---

### 2.3.3. `PATCH /api/v1/users/me/change-password`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-U-020 | Happy path — đổi password | `{"currentPassword":"Password@123","newPassword":"NewPass@456","confirmPassword":"NewPass@456"}` | `200` | `"Password changed successfully"` |
| IT-U-021 | Login bằng password mới | Login với newPassword | `200` | Login thành công |
| IT-U-022 | Login bằng password cũ thất bại | Login với oldPassword | `401` | Unauthorized |
| IT-U-023 | Sai mật khẩu hiện tại | `{"currentPassword":"Wrong@123"}` | `400` | `"Invalid current password"` |
| IT-U-024 | Mật khẩu mới trùng cũ | `{"newPassword":"Password@123"}` (trùng current) | `400` | `"...cannot be the same..."` |
| IT-U-025 | Confirm password không khớp | `{"newPassword":"A@1","confirmPassword":"B@2"}` | `400` | `"...do not match"` |
| IT-U-026 | Password mới quá yếu | `{"newPassword":"weak","confirmPassword":"weak"}` | `400` | Validation errors |
| IT-U-027 | Không có token | — | `401` | Unauthorized |

---

### 2.3.4. `POST /api/v1/users/me/avatar`

| # | Test case | Body | Expected Status | Expected Response |
|---|-----------|------|-----------------|-------------------|
| IT-U-030 | Happy path — upload JPG | form-data: `avatar` = file.jpg | `201` | Profile với `avatar` = filename |
| IT-U-031 | Upload PNG | form-data: `avatar` = file.png | `201` | Profile với `avatar` = filename |
| IT-U-032 | Upload GIF | form-data: `avatar` = file.gif | `201` | Profile với `avatar` = filename |
| IT-U-033 | Thay avatar mới | Upload lần 2 | `201` | `avatar` = filename mới |
| IT-U-034 | Verify avatar via GET /users/me | GET sau upload | `200` | `avatar` = filename đã upload |
| IT-U-035 | File không phải ảnh (.txt) | form-data: `avatar` = file.txt | `400` | `"Only image/jpeg, image/png, image/gif..."` |
| IT-U-036 | File quá 5MB | form-data: `avatar` = 6MB file | `400` | File too large |
| IT-U-037 | Không gửi file | POST không có file | `400` | `"File is required"` |
| IT-U-038 | Không có token | — | `401` | Unauthorized |

> **Lưu ý:** Test case IT-U-035 hiện đang trả `500` thay vì `400` — đây là **known bug** (Multer fileFilter error không được catch đúng).

---

## 2.4. Boundary Test Cases

> Các test giá trị biên — chạy trong integration test

| # | Test case | Input | Expected |
|---|-----------|-------|----------|
| BT-U-001 | displayName đúng 50 ký tự (max) | `"a".repeat(50)` | `200` — hợp lệ |
| BT-U-002 | displayName 51 ký tự (vượt max) | `"a".repeat(51)` | `400` — vượt maxLength |
| BT-U-003 | displayName 1 ký tự (min hợp lệ) | `"A"` | `200` — hợp lệ |
| BT-U-004 | bio đúng 160 ký tự (max) | `"b".repeat(160)` | `200` — hợp lệ |
| BT-U-005 | bio 161 ký tự (vượt max) | `"b".repeat(161)` | `400` — vượt maxLength |
| BT-U-006 | bio chuỗi rỗng | `""` | Kiểm tra xử lý (IsOptional) |
| BT-U-007 | Password mới đúng 8 ký tự (min) | `"Pass@1ab"` | `200` — hợp lệ |
| BT-U-008 | Password mới 7 ký tự (dưới min) | `"Pass@1a"` | `400` — quá ngắn |
| BT-U-009 | Avatar file đúng 5MB | File 5,242,880 bytes | `201` — hợp lệ |
| BT-U-010 | Avatar file 5MB + 1 byte | File 5,242,881 bytes | `400` — quá lớn |
| BT-U-011 | Avatar file 0 bytes | File rỗng | Kiểm tra xử lý |

---

## 2.5. Security Test Cases

> Các test bảo mật — chạy trong integration test

---

### 2.5.1. XSS trong Profile Data

| # | Test case | Input field | Payload | Expected |
|---|-----------|-------------|---------|----------|
| ST-U-001 | XSS trong displayName | `displayName` | `<script>alert("xss")</script>` | `200` — lưu plain text, không execute |
| ST-U-002 | XSS trong bio | `bio` | `<img src=x onerror=alert(1)>` | `200` — lưu plain text, không execute |
| ST-U-003 | XSS qua avatar filename | Upload file tên `<script>.jpg` | Filename bị sanitize bởi Multer (random name) |
| ST-U-004 | HTML injection trong displayName | `displayName` | `<h1>Admin</h1>` | `200` — lưu plain text |

---

### 2.5.2. Path Traversal trong Avatar Upload

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| ST-U-010 | Path traversal via filename | File tên `../../../etc/passwd` | Multer tạo tên mới (random), KHÔNG dùng original filename |
| ST-U-011 | Path traversal via field name | Field name chứa `../` | Reject hoặc sanitize |
| ST-U-012 | Null byte trong filename | File tên `avatar.jpg%00.php` | Multer tạo tên mới, không bị bypass |

---

### 2.5.3. SQL Injection

| # | Test case | Input field | Payload | Expected |
|---|-----------|-------------|---------|----------|
| ST-U-020 | SQL injection trong displayName | `displayName` | `"'; DROP TABLE users; --"` | `200` — Prisma parameterized query, DB an toàn |
| ST-U-021 | SQL injection trong bio | `bio` | `"' OR '1'='1"` | `200` — Prisma parameterized query |
| ST-U-022 | SQL injection trong currentPassword | `currentPassword` | `"' OR '1'='1"` | `400` — bcrypt.compare vẫn false |

---

### 2.5.4. File Upload Security

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| ST-U-030 | MIME type spoofing | File .txt nhưng Content-Type: image/jpeg | Kiểm tra server reject hay accept |
| ST-U-031 | Double extension | File tên `avatar.php.jpg` | Multer tạo tên mới, extension từ originalname |
| ST-U-032 | Polyglot file | File vừa là JPEG vừa chứa PHP code | Accept (valid JPEG header) nhưng không execute (static serve) |
| ST-U-033 | SVG with script | File SVG chứa `<script>` tag | Reject (SVG không trong allowed list) |

---

### 2.5.5. Authorization

| # | Test case | Mô tả | Expected |
|---|-----------|--------|----------|
| ST-U-040 | Access other user's profile | Thay đổi userId trong token payload | `401` — signature invalid |
| ST-U-041 | Use expired token | Token đã hết hạn | `401` |
| ST-U-042 | Use blacklisted token | Token đã logout | `401` |

---

## 2.6. Tổng hợp Test Cases

| Loại | Số lượng | File |
|------|----------|------|
| Unit Test — UserService | 19 cases | `user.service.spec.ts` |
| Unit Test — UserController | 5 cases | `user.controller.spec.ts` |
| Integration Test | 27 cases | `user.integration-spec.ts` |
| Boundary Test | 11 cases | Trong integration test |
| Security Test | 16 cases | Trong integration test |
| **Tổng** | **78 cases** | |

---

## 2.7. Known Bugs (phát hiện khi test manual)

| # | Mô tả | Severity | Status |
|---|--------|----------|--------|
| BUG-U-001 | Upload file `.txt` trả HTTP 500 thay vì 400 — Multer `fileFilter` throw `Error()` không được NestJS exception filter bắt | **Medium** | Open |
