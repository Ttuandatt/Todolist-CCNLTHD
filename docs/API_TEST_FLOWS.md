# Luồng Test API — Auth & User Module

> **Base URL:** `http://localhost:3333/api/v1`
> **Tool:** Hoppscotch (import file `backend/docs/hoppscotch-collection.json` → OpenAPI)

---

## Quy ước

- `{{accessToken}}` — lấy từ response login/register, paste vào header `Authorization: Bearer {{accessToken}}`
- `{{refreshToken}}` — lấy từ response login/register
- `{{resetToken}}` — lấy từ terminal log khi gọi forgot-password
- **Điều kiện tiên quyết:** Mỗi flow ghi rõ cần chuẩn bị gì. Nếu cần account có sẵn, chạy register trước.

---

# 1. Auth Module (`/auth/*`)

> Các API: `register`, `login`, `refresh`, `logout`, `forgot-password`, `reset-password`

---

## 1.1. Đăng ký thành công

> **Mục đích:** Happy path — tạo tài khoản mới

| Bước | Method | Endpoint | Body | Expected | Ghi chú |
|------|--------|----------|------|----------|---------|
| 1 | `POST` | `/auth/register` | `{"email":"auth1@test.com","password":"Password@123","fullname":"Auth1 User","displayName":"Auth1"}` | `201` — trả `user` + `tokens` | Lưu `accessToken`, `refreshToken` |

**Kiểm tra response:**
- `user.email` = `"admin1@gmail.com"`
- `user.name` = `"Daniel Phan"`
- `tokens.accessToken` và `tokens.refreshToken` không rỗng
- `tokens.expiresIn` = `900`

---

## 1.2. Đăng ký trùng email

> **Mục đích:** Kiểm tra constraint unique email

| Bước | Method | Endpoint | Body | Expected |
|------|--------|----------|------|----------|
| 1 | `POST` | `/auth/register` | `{"email":"dup@test.com","password":"Password@123","fullname":"User A","displayName":"A"}` | `201` |
| 2 | `POST` | `/auth/register` | `{"email":"dup@test.com","password":"Password@123","fullname":"User B","displayName":"B"}` | `409` — `"Email already exists"` |

---

## 1.3. Đăng ký — Validation errors

> **Mục đích:** Kiểm tra validation pipe

| Bước | Method | Endpoint | Body | Expected |
|------|--------|----------|------|----------|
| 1 | `POST` | `/auth/register` | `{"email":"invalid","password":"Password@123","fullname":"Test","displayName":"T"}` | `400` — email không hợp lệ |
| 2 | `POST` | `/auth/register` | `{"email":"val@test.com","password":"123","fullname":"Test","displayName":"T"}` | `400` — password yếu (min 8, thiếu uppercase/special) |
| 3 | `POST` | `/auth/register` | `{"email":"val@test.com","password":"Password@123","fullname":"","displayName":"T"}` | `400` — fullname trống |
| 4 | `POST` | `/auth/register` | `{}` | `400` — thiếu tất cả fields |

---

## 1.4. Đăng nhập thành công + Sai thông tin

> **Điều kiện:** Đã có account `admin1@gmail.com` từ Flow 1.1

| Bước | Method | Endpoint | Body | Expected |
|------|--------|----------|------|----------|
| 1 | `POST` | `/auth/login` | `{"email":"admin1@gmail.com","password":"WrongPassword@1"}` | `401` — sai mật khẩu |
| 2 | `POST` | `/auth/login` | `{"email":"noexist@test.com","password":"Password@123"}` | `401` — email không tồn tại |
| 3 | `POST` | `/auth/login` | `{"email":"admin1@gmail.com","password":"Password@123"}` | `200` — login thành công, trả `user` + `tokens` |

**Kiểm tra response bước 3:**
- `user.email` = `"admin1@gmail.com"`
- `tokens.accessToken` mới (khác với token từ register)

---

## 1.5. Refresh Token

> **Điều kiện:** Đã login, có `refreshToken`

| Bước | Method | Endpoint | Body | Expected | Ghi chú |
|------|--------|----------|------|----------|---------|
| 1 | `POST` | `/auth/login` | `{"email":"admin1@gmail.com","password":"Password@123"}` | `200` | Lưu `refreshToken` = RT1 |
| 2 | `POST` | `/auth/refresh` | `{"refreshToken":"{{RT1}}"}` | `200` — cặp token mới | Lưu token mới = RT2 |
| 3 | `POST` | `/auth/refresh` | `{"refreshToken":"invalid-token-abc"}` | `401` — token không hợp lệ | |
| 4 | `POST` | `/auth/refresh` | `{"refreshToken":"{{RT1}}"}` | `401` — RT1 đã bị revoke khi refresh ở bước 2 | |

---

## 1.6. Đăng xuất

> **Điều kiện:** Đã login, có `accessToken`

| Bước | Method | Endpoint | Header | Expected | Ghi chú |
|------|--------|----------|--------|----------|---------|
| 1 | `POST` | `/auth/login` | Body: `{"email":"admin1@gmail.com","password":"Password@123"}` | `200` | Lưu `accessToken` |
| 2 | `POST` | `/auth/logout` | `Bearer {{accessToken}}` | `200` — `"Logout successfully"` | |
| 3 | `POST` | `/auth/logout` | `Bearer {{accessToken}}` (token cũ) | `401` — token đã bị blacklist | |

---

## 1.7. Forgot Password → Reset Password

> **Mục đích:** Luồng quên mật khẩu đầy đủ

| Bước | Method | Endpoint | Body | Expected | Ghi chú |
|------|--------|----------|------|----------|---------|
| 1 | `POST` | `/auth/register` | `{"email":"reset@test.com","password":"Password@123","fullname":"Reset User","displayName":"Reset"}` | `201` | |
| 2 | `POST` | `/auth/forgot-password` | `{"email":"reset@test.com"}` | `200` — `"Reset password email sent"` | Xem terminal → copy `resetToken` |
| 3 | `POST` | `/auth/reset-password` | `{"token":"{{resetToken}}","newPassword":"NewPassword@456"}` | `200` — `"Password reset successfully"` | |
| 4 | `POST` | `/auth/login` | `{"email":"reset@test.com","password":"Password@123"}` | `401` — mật khẩu cũ không dùng được | |
| 5 | `POST` | `/auth/login` | `{"email":"reset@test.com","password":"NewPassword@456"}` | `200` — login bằng mật khẩu mới | |
| 6 | `POST` | `/auth/reset-password` | `{"token":"{{resetToken}}","newPassword":"Another@789"}` | `400` — token đã sử dụng, không dùng lại được | |

---

## 1.8. Forgot/Reset Password — Error cases

| Bước | Method | Endpoint | Body | Expected |
|------|--------|----------|------|----------|
| 1 | `POST` | `/auth/forgot-password` | `{"email":"noexist@test.com"}` | `404` — User not found |
| 2 | `POST` | `/auth/reset-password` | `{"token":"fake-token-123","newPassword":"NewPassword@456"}` | `400` — Token không hợp lệ |
| 3 | `POST` | `/auth/reset-password` | `{"token":"","newPassword":"123"}` | `400` — Validation error |

---

## 1.9. Protected endpoint không có token

> **Mục đích:** Xác nhận endpoint cần JWT trả 401 khi không có token

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `POST` | `/auth/logout` | Không có header | `401` |
| 2 | `POST` | `/auth/logout` | `Bearer invalid-token-xyz` | `401` |

---

### Checklist Auth Module

- [ ] 1.1 — Register happy path (201)
- [ ] 1.2 — Register trùng email (409)
- [ ] 1.3 — Register validation: email sai (400)
- [ ] 1.3 — Register validation: password yếu (400)
- [ ] 1.3 — Register validation: fullname trống (400)
- [ ] 1.3 — Register validation: body rỗng (400)
- [ ] 1.4 — Login happy path (200)
- [ ] 1.4 — Login sai password (401)
- [ ] 1.4 — Login email không tồn tại (401)
- [ ] 1.5 — Refresh happy path (200)
- [ ] 1.5 — Refresh token không hợp lệ (401)
- [ ] 1.5 — Refresh token đã revoke (401)
- [ ] 1.6 — Logout happy path (200)
- [ ] 1.6 — Logout token đã blacklist (401)
- [ ] 1.7 — Forgot password happy path (200)
- [ ] 1.7 — Reset password happy path (200)
- [ ] 1.7 — Login bằng mật khẩu mới (200)
- [ ] 1.7 — Reset token đã dùng (400)
- [ ] 1.8 — Forgot password email không tồn tại (404)
- [ ] 1.8 — Reset token không hợp lệ (400)
- [ ] 1.9 — Logout không có token (401)
- [ ] 1.9 — Logout token sai (401)

---

# 2. User Module (`/users/*`)

> Các API: `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/change-password`, `POST /users/me/avatar`
> **Tất cả endpoint đều cần JWT token** — login trước rồi lấy `accessToken`

---

## 2.1. Xem Profile

> **Điều kiện:** Đã có account, đã login

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `POST` | `/auth/login` | Body: `{"email":"auth1@test.com","password":"Password@123"}` | `200` — lưu `accessToken` |
| 2 | `GET` | `/users/me` | `Bearer {{accessToken}}` | `200` — profile đầy đủ |

**Kiểm tra response bước 2 có đủ 11 fields:**
- `id`, `email`, `name`, `displayName`, `avatar`, `status`, `bio`, `emailVerified`, `lastLoginAt`, `createdAt`, `updatedAt`
- `email` khớp với account đã login
- Không chứa `password`

---

## 2.2. Cập nhật Profile — Happy path

> **Điều kiện:** Đã login, có `accessToken`

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `GET` | `/users/me` | `Bearer {{accessToken}}` | `200` — xem giá trị hiện tại |
| 2 | `PATCH` | `/users/me` | Header + `{"displayName":"Dat Nguyen","bio":"Backend developer"}` | `200` — cả 2 fields được cập nhật |
| 3 | `PATCH` | `/users/me` | Header + `{"displayName":"New Name"}` | `200` — chỉ displayName thay đổi, bio giữ nguyên |
| 4 | `PATCH` | `/users/me` | Header + `{"bio":"New bio only"}` | `200` — chỉ bio thay đổi, displayName giữ nguyên |
| 5 | `GET` | `/users/me` | `Bearer {{accessToken}}` | `200` — verify cả 2 fields đã cập nhật đúng |

---

## 2.3. Cập nhật Profile — Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/users/me` | Header + `{}` | `400` — `"At least one field (displayName or bio) must be provided"` |
| 2 | `PATCH` | `/users/me` | Header + `{"displayName":"aaaaaa..."}` (51 ký tự) | `400` — displayName max 50 ký tự |
| 3 | `PATCH` | `/users/me` | Header + `{"bio":"aaaaaa..."}` (161 ký tự) | `400` — bio max 160 ký tự |
| 4 | `PATCH` | `/users/me` | Không có Authorization header | `401` — Unauthorized |

---

## 2.4. Đổi mật khẩu — Happy path

> **Mục đích:** Đổi password khi đã đăng nhập, verify login lại bằng password mới

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/auth/register` | `{"email":"chpw@test.com","password":"Password@123","fullname":"PW User","displayName":"PW"}` | `201` | Lưu `accessToken` |
| 2 | `PATCH` | `/users/me/change-password` | Header + `{"currentPassword":"Password@123","newPassword":"NewPassword@456","confirmPassword":"NewPassword@456"}` | `200` — `"Password changed successfully"` | Refresh tokens bị revoke |
| 3 | `POST` | `/auth/login` | `{"email":"chpw@test.com","password":"Password@123"}` | `401` — mật khẩu cũ không dùng được | Verify mật khẩu cũ bị vô hiệu |
| 4 | `POST` | `/auth/login` | `{"email":"chpw@test.com","password":"NewPassword@456"}` | `200` — login thành công | Verify mật khẩu mới hoạt động |

---

## 2.5. Đổi mật khẩu — Error cases

> **Điều kiện:** Đã login với account có password `NewPassword@456` (từ Flow 2.4)

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/users/me/change-password` | Header + `{"currentPassword":"WrongPassword@1","newPassword":"Another@789","confirmPassword":"Another@789"}` | `400` — `"Invalid current password"` |
| 2 | `PATCH` | `/users/me/change-password` | Header + `{"currentPassword":"NewPassword@456","newPassword":"NewPassword@456","confirmPassword":"NewPassword@456"}` | `400` — `"New password cannot be the same as current"` |
| 3 | `PATCH` | `/users/me/change-password` | Header + `{"currentPassword":"NewPassword@456","newPassword":"Abc@1234","confirmPassword":"Different@789"}` | `400` — `"New password and confirm password do not match"` |
| 4 | `PATCH` | `/users/me/change-password` | Header + `{"currentPassword":"NewPassword@456","newPassword":"weak","confirmPassword":"weak"}` | `400` — Validation (min 8, pattern) |
| 5 | `PATCH` | `/users/me/change-password` | Không có Authorization header | `401` — Unauthorized |

---

## 2.6. Upload Avatar — Happy path

> **Điều kiện:** Đã login, có `accessToken`

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `GET` | `/users/me` | `Bearer {{accessToken}}` | `200` — `avatar: null` | Chưa có avatar |
| 2 | `POST` | `/users/me/avatar` | Header + form-data: field `avatar` = file JPG (< 5MB) | `201` — profile với `avatar` = filename | `avatar` không còn null |
| 3 | `GET` | `/users/me` | `Bearer {{accessToken}}` | `200` — `avatar` = filename từ bước 2 | Verify đã lưu DB |
| 4 | `POST` | `/users/me/avatar` | Header + form-data: field `avatar` = file PNG mới | `201` — avatar cập nhật filename mới | Avatar cũ bị xóa trên disk |

**Lưu ý Hoppscotch:** Chọn Body → `multipart/form-data` → thêm field `avatar` → chọn file ảnh

---

## 2.7. Upload Avatar — Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `POST` | `/users/me/avatar` | Header + form-data: `avatar` = file `.txt` | `400` — `"Only image/jpeg, image/png, image/gif files are allowed"` |
| 2 | `POST` | `/users/me/avatar` | Header + form-data: `avatar` = file > 5MB | `400` — File too large |
| 3 | `POST` | `/users/me/avatar` | Header + không gửi file | `400` — File required |
| 4 | `POST` | `/users/me/avatar` | Không có Authorization header | `401` — Unauthorized |

---

## 2.8. Protected endpoints — Không có token

> **Mục đích:** Xác nhận tất cả User endpoints đều yêu cầu JWT

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/users/me` | Không có header | `401` |
| 2 | `GET` | `/users/me` | `Bearer invalid-token-xyz` | `401` |
| 3 | `PATCH` | `/users/me` | Không có header | `401` |
| 4 | `PATCH` | `/users/me/change-password` | Không có header | `401` |
| 5 | `POST` | `/users/me/avatar` | Không có header | `401` |

---

### Checklist User Module

- [ ] 2.1 — Get profile happy path (200)
- [ ] 2.1 — Response có đủ 11 fields, không có password
- [ ] 2.2 — Update profile cả 2 fields (200)
- [ ] 2.2 — Update profile chỉ displayName (200)
- [ ] 2.2 — Update profile chỉ bio (200)
- [ ] 2.3 — Update profile body rỗng (400)
- [ ] 2.3 — Update profile displayName vượt 50 ký tự (400)
- [ ] 2.3 — Update profile bio vượt 160 ký tự (400)
- [ ] 2.3 — Update profile không có token (401)
- [ ] 2.4 — Change password happy path (200)
- [ ] 2.4 — Login bằng password mới (200)
- [ ] 2.5 — Change password sai mật khẩu hiện tại (400)
- [ ] 2.5 — Change password mật khẩu mới trùng cũ (400)
- [ ] 2.5 — Change password confirm không khớp (400)
- [ ] 2.5 — Change password yếu (400)
- [ ] 2.5 — Change password không có token (401)
- [ ] 2.6 — Upload avatar JPG thành công (201)
- [ ] 2.6 — Upload avatar thay mới, cũ bị xóa (201)
- [ ] 2.7 — Upload avatar file không hợp lệ (400)
- [ ] 2.7 — Upload avatar file quá 5MB (400)
- [ ] 2.7 — Upload avatar không gửi file (400)
- [ ] 2.7 — Upload avatar không có token (401)
- [ ] 2.8 — Tất cả endpoints không có token (401)
- [ ] 2.8 — Tất cả endpoints token sai (401)
