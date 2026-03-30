# Luồng Test API — Tất cả Modules

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

---

# 3. Workspace Module (`/workspaces/*`)

> Các API: CRUD, invite members, role management, activity log
> **Tất cả endpoint đều cần JWT token**

---

## 3.1. Tạo Workspace — Happy path

> **Điều kiện:** Đã có account, đã login

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/auth/login` | `{"email":"ws@test.com","password":"Password@123"}` | `200` | Lưu `accessToken` |
| 2 | `POST` | `/workspaces` | Header + `{"name":"My Workspace","description":"Team project"}` | `201` — trả workspace object | Lưu `workspaceId` |
| 3 | `GET` | `/workspaces/{{workspaceId}}` | `Bearer {{accessToken}}` | `200` — workspace details | Owner = user vừa tạo |

**Kiểm tra response bước 2 có fields:**
- `id`, `name`, `description`, `ownerId`, `createdAt`, `updatedAt`
- `ownerId` = user ID của người login

---

## 3.2. Xem danh sách Workspace

> **Điều kiện:** Đã tạo ≥2 workspace từ Flow 3.1

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/workspaces` | `Bearer {{accessToken}}` | `200` — array workspaces |
| 2 | `GET` | `/workspaces?page=1&limit=10` | `Bearer {{accessToken}}` | `200` — pagination |

**Kiểm tra:**
- Array có ≥2 items
- Mỗi item có fields: `id`, `name`, `ownerId`, `memberCount`, `myRole`

---

## 3.3. Cập nhật Workspace

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/workspaces/{{workspaceId}}` | Header + `{"name":"Updated WS","description":"New desc"}` | `200` — cả 2 fields cập nhật |
| 2 | `GET` | `/workspaces/{{workspaceId}}` | `Bearer {{accessToken}}` | `200` — verify changes |
| 3 | `PATCH` | `/workspaces/{{workspaceId}}` | Header + `{"name":"aaa..."}` (101 ký tự) | `400` — name max 100 ký tự |

---

## 3.4. Xóa Workspace — Only Owner

> **Điều kiện:** Đã tạo workspace từ Flow 3.1, owner = current user

| Bước | Method | Endpoint | Header | Expected | Ghi chú |
|------|--------|----------|--------|----------|---------|
| 1 | `DELETE` | `/workspaces/{{workspaceId}}` | `Bearer {{accessToken}}` | `200` — `"Workspace deleted"` | |
| 2 | `GET` | `/workspaces/{{workspaceId}}` | `Bearer {{accessToken}}` | `404` — workspace không tồn tại | Verify delete |

---

## 3.5. Mời thành viên vào Workspace

> **Điều kiện:** Có workspace, owner permission, mục đích invite user khác

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/auth/register` | `{"email":"member@test.com","password":"Password@123","fullname":"Member","displayName":"M"}` | `201` | Lưu `memberId` |
| 2 | `POST` | `/workspaces/{{workspaceId}}/invite` | Header + `{"email":"member@test.com","role":"MEMBER"}` | `200` — tạo `WorkspaceInvitation` | Invitation pending |
| 3 | `POST` | `/auth/login` | `{"email":"member@test.com","password":"Password@123"}` | `200` | Lưu token member |
| 4 | `GET` | `/workspaces/{{workspaceId}}/invitations` | Member's token | `200` — thấy invitation từ owner | |
| 5 | `POST` | `/workspaces/{{workspaceId}}/invitations/accept` | Member's token | `200` — `"Joined workspace"` | Status → ACCEPTED |
| 6 | `GET` | `/workspaces/{{workspaceId}}/members` | Owner's token | `200` — members list gồm owner + member | |

---

## 3.6. Quản lý vai trò trong Workspace

> **Điều kiện:** Workspace có ≥2 members (owner + member từ Flow 3.5)

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/workspaces/{{workspaceId}}/members/{{memberId}}/role` | Owner's header + `{"role":"ADMIN"}` | `200` — member → ADMIN |
| 2 | `GET` | `/workspaces/{{workspaceId}}/members` | Owner's header | `200` — member role = ADMIN |
| 3 | `PATCH` | `/workspaces/{{workspaceId}}/members/{{memberId}}/role` | Owner's header + `{"role":"MEMBER"}` | `200` — ADMIN → MEMBER |
| 4 | `DELETE` | `/workspaces/{{workspaceId}}/members/{{memberId}}` | Owner's header | `200` — `"Member removed"` | Kick out member |
| 5 | `GET` | `/workspaces/{{workspaceId}}/members` | Owner's header | `200` — members list chỉ còn owner | Verify remove |

---

## 3.7. Công việc Workspace (Activity Log)

> **Mục đích:** Xem lịch sử thay đổi workspace

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/workspaces/{{workspaceId}}/activity` | `Bearer {{accessToken}}` | `200` — list activities |
| 2 | `PATCH` | `/workspaces/{{workspaceId}}` | Header + `{"name":"Changed WS"}` | `200` — update |
| 3 | `GET` | `/workspaces/{{workspaceId}}/activity` | `Bearer {{accessToken}}` | `200` — có mới activity (type: UPDATE) | |

**Kiểm tra activity log:**
- Fields: `id`, `workspaceId`, `userId`, `action`, `changes`, `createdAt`
- Actions: `CREATE`, `UPDATE`, `DELETE`, `INVITE`, `ACCEPT`, `REMOVE`, `CHANGE_ROLE`

---

## 3.8. Chuyển quyền Owner (Transfer Ownership)

> **Điều kiện:** Workspace có owner + 1 admin khác

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/workspaces/{{workspaceId}}/transfer-owner` | Owner's header + `{"newOwnerId":"{{adminId}}"}` | `200` — transfer thành công |
| 2 | `GET` | `/workspaces/{{workspaceId}}` | Owner's header | `200` — `ownerId` = adminId |
| 3 | `PATCH` | `/workspaces/{{workspaceId}}/transfer-owner` | Old owner's header + `{"newOwnerId":"..."}` | `403` — không còn quyền | Validate only new owner can change |

---

## 3.9. Workspace Permissions — Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `DELETE` | `/workspaces/{{workspaceId}}` | Member's token | `403` — chỉ owner được xóa | Forbidden |
| 2 | `PATCH` | `/workspaces/{{workspaceId}}/members/{{memberId}}/role` | Member's token | `403` — chỉ owner/admin được change role | |
| 3 | `POST` | `/workspaces/invalid-id/invite` | Owner's header + `{"email":"new@test.com","role":"MEMBER"}` | `404` — workspace không tồn tại | |

---

### Checklist Workspace Module

- [ ] 3.1 — Create workspace happy path (201)
- [ ] 3.1 — Get workspace detail (200)
- [ ] 3.2 — List workspaces (200)
- [ ] 3.2 — List with pagination (200)
- [ ] 3.3 — Update workspace name + description (200)
- [ ] 3.3 — Update workspace verify changes (200)
- [ ] 3.3 — Update workspace name vượt 100 ký tự (400)
- [ ] 3.4 — Delete workspace owner can delete (200)
- [ ] 3.4 — Get deleted workspace 404 (404)
- [ ] 3.5 — Invite member happy path (200)
- [ ] 3.5 — Accept invitation (200)
- [ ] 3.5 — Get members list-after join (200)
- [ ] 3.6 — Change member role to ADMIN (200)
- [ ] 3.6 — Change role ADMIN → MEMBER (200)
- [ ] 3.6 — Remove member from workspace (200)
- [ ] 3.6 — Verify member removed (200)
- [ ] 3.7 — Get activity log (200)
- [ ] 3.7 — Update triggers activity log (200)
- [ ] 3.8 — Transfer ownership (200)
- [ ] 3.8 — Verify new owner (200)
- [ ] 3.8 — Old owner cannot change role (403)
- [ ] 3.9 — Member cannot delete workspace (403)
- [ ] 3.9 — Member cannot change role (403)
- [ ] 3.9 — Delete invalid workspace (404)

---

# 4. Project Module (`/projects/*`)

> Các API: CRUD, workspace relation, RBAC
> **Tất cả endpoint đều cần JWT token**

---

## 4.1. Tạo Project

> **Điều kiện:** Có workspace từ Flow 3.1, owner permission

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/projects` | Header + `{"name":"Project A","description":"First project","workspaceId":"{{workspaceId}}"}` | `201` — trả project object | Lưu `projectId` |
| 2 | `GET` | `/projects/{{projectId}}` | `Bearer {{accessToken}}` | `200` — project details | |

**Kiểm tra response:**
- `id`, `name`, `description`, `workspaceId`, `createdAt`, `updatedAt`
- `workspaceId` match workspace được chỉ định

---

## 4.2. Xem danh sách Project trong Workspace

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/projects?workspaceId={{workspaceId}}` | `Bearer {{accessToken}}` | `200` — trả array projects |
| 2 | `GET` | `/projects?workspaceId={{workspaceId}}&page=1&limit=10` | `Bearer {{accessToken}}` | `200` — pagination |

**Kiểm tra:**
- Array có ≥1 item
- Tất cả projects có `workspaceId` = query param

---

## 4.3. Cập nhật Project

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/projects/{{projectId}}` | Header + `{"name":"Updated Project","description":"New desc"}` | `200` — cả 2 fields cập nhật |
| 2 | `GET` | `/projects/{{projectId}}` | `Bearer {{accessToken}}` | `200` — verify changes |

---

## 4.4. Xóa Project

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `DELETE` | `/projects/{{projectId}}` | `Bearer {{accessToken}}` | `200` — `"Project deleted"` |
| 2 | `GET` | `/projects/{{projectId}}` | `Bearer {{accessToken}}` | `404` — project không tồn tại |

---

## 4.5. Project RBAC — Member Permission

> **Điều kiện:** Workspace có member + project, member role = MEMBER

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `POST` | `/projects` | Owner's header + body | `201` | Chỉ owner/admin tạo được |
| 2 | `POST` | `/projects` | Member's header + body | `403` — chỉ OWNER/ADMIN được tạo | Forbidden |
| 3 | `GET` | `/projects/{{projectId}}` | Member's header | `200` — member vẫn xem được | Read ok |
| 4 | `PATCH` | `/projects/{{projectId}}` | Member's header + body | `403` — chỉ OWNER/ADMIN được sửa | Forbidden |

---

### Checklist Project Module

- [ ] 4.1 — Create project happy path (201)
- [ ] 4.1 — Get project detail (200)
- [ ] 4.2 — List projects by workspace (200)
- [ ] 4.2 — List with pagination (200)
- [ ] 4.3 — Update project (200)
- [ ] 4.3 — Verify changes (200)
- [ ] 4.4 — Delete project (200)
- [ ] 4.4 — Get deleted project 404 (404)
- [ ] 4.5 — Only owner/admin create (403)
- [ ] 4.5 — Member can read (200)
- [ ] 4.5 — Member cannot update (403)

---

# 5. Task Module (`/tasks/*`)

> Các API: CRUD, assignment, labels, status, filtering, attachments
> **Tất cả endpoint đều cần JWT token**

---

## 5.1. Tạo Task

> **Điều kiện:** Có project từ Flow 4.1, owner permission

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks` | Header + `{"title":"Task 1","description":"Do something","projectId":"{{projectId}}","status":"TODO","priority":"HIGH"}` | `201` — task object | Lưu `taskId` |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — task details | |

**Kiểm tra response:**
- `id`, `title`, `description`, `projectId`, `status`, `priority`, `createdAt`, `updatedAt`

---

## 5.2. Xem danh sách Task trong Project

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/tasks?projectId={{projectId}}` | `Bearer {{accessToken}}` | `200` — trả array tasks |
| 2 | `GET` | `/tasks?projectId={{projectId}}&page=1&limit=20` | `Bearer {{accessToken}}` | `200` — pagination |

**Kiểm tra:**
- Array tasks có field: `id`, `title`, `priority`, `status`, `assignee`, `dueDate`

---

## 5.3. Cập nhật Task

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/tasks/{{taskId}}` | Header + `{"title":"Updated title","description":"New desc","priority":"LOW"}` | `200` — cập nhật |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — verify changes |

---

## 5.4. Thay đổi trạng thái Task

> **Mục đích:** Workflow task: TODO → IN_PROGRESS → DONE

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/tasks/{{taskId}}/status` | Header + `{"status":"IN_PROGRESS"}` | `200` — status thay đổi |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — status = IN_PROGRESS |
| 3 | `PATCH` | `/tasks/{{taskId}}/status` | Header + `{"status":"DONE"}` | `200` — status = DONE |

---

## 5.5. Gán Task cho Assignee

> **Điều kiện:** Workspace có ≥1 member khác

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks/{{taskId}}/assign` | Header + `{"userId":"{{memberId}}"}` | `200` — task.assigneeId = memberId | |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — assignee info in response | |
| 3 | `DELETE` | `/tasks/{{taskId}}/assign` | `Bearer {{accessToken}}` | `200` — unassign (assigneeId = null) | |

---

## 5.6. Thêm/Xóa Label cho Task

> **Điều kiện:** Có label catalog trong workspace

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks/{{taskId}}/labels` | Header + `{"labelId":"{{labelId}}"}` | `201` — label attached | |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — labels array non-empty | |
| 3 | `DELETE` | `/tasks/{{taskId}}/labels/{{labelId}}` | `Bearer {{accessToken}}` | `200` — label removed | |
| 4 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — labels array empty | |

---

## 5.7. Filter & Search Task

> **Mục đích:** Test advanced filtering

| Bước | Method | Endpoint | Header | Expected |
|------|--------|----------|--------|----------|
| 1 | `GET` | `/tasks?projectId={{projectId}}&status=TODO` | `Bearer {{accessToken}}` | `200` — chỉ TODO tasks |
| 2 | `GET` | `/tasks?projectId={{projectId}}&priority=HIGH,CRITICAL` | `Bearer {{accessToken}}` | `200` — multi-priority filter |
| 3 | `GET` | `/tasks?projectId={{projectId}}&assigneeId={{userId}}` | `Bearer {{accessToken}}` | `200` — tasks gán cho user |
| 4 | `GET` | `/tasks?projectId={{projectId}}&search=keyword` | `Bearer {{accessToken}}` | `200` — search by title/description |
| 5 | `GET` | `/tasks?projectId={{projectId}}&sort=dueDate:asc` | `Bearer {{accessToken}}` | `200` — sorted by due date |

---

## 5.8. Upload Attachment cho Task

> **Điều kiện:** Task tạo từ Flow 5.1

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks/{{taskId}}/attachments` | Header + form-data: `file` = PDF (< 10MB) | `201` — attachment object | Lưu `attachmentId` |
| 2 | `GET` | `/tasks/{{taskId}}/attachments` | `Bearer {{accessToken}}` | `200` — list attachments | |
| 3 | `DELETE` | `/tasks/{{taskId}}/attachments/{{attachmentId}}` | `Bearer {{accessToken}}` | `200` — attachment deleted | |

---

## 5.9. Subtask CRUD

> **Mục đích:** Tạo, cập nhật, xóa subtask trong task

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks/{{taskId}}/subtasks` | Header + `{"title":"Subtask 1","description":"Do this first"}` | `201` — subtask object | Lưu `subtaskId` |
| 2 | `GET` | `/tasks/{{taskId}}/subtasks` | `Bearer {{accessToken}}` | `200` — list subtasks | |
| 3 | `PATCH` | `/tasks/{{taskId}}/subtasks/{{subtaskId}}` | Header + `{"title":"Updated subtask"}` | `200` — cập nhật | |
| 4 | `PATCH` | `/tasks/{{taskId}}/subtasks/{{subtaskId}}/complete` | `Bearer {{accessToken}}` | `200` — mark as complete | |
| 5 | `DELETE` | `/tasks/{{taskId}}/subtasks/{{subtaskId}}` | `Bearer {{accessToken}}` | `200` — subtask deleted | |

---

## 5.10. Drag-Drop Reorder Task

> **Mục đích:** Thay đổi thứ tự task trong project

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/tasks/{{taskId1}}/reorder` | Header + `{"order":1}` | `200` — set order = 1 |
| 2 | `PATCH` | `/tasks/{{taskId2}}/reorder` | Header + `{"order":2}` | `200` — set order = 2 |
| 3 | `GET` | `/tasks?projectId={{projectId}}&sort=order:asc` | `Bearer {{accessToken}}` | `200` — tasks sorted by order |

---

## 5.11. Duplicate Task

> **Mục đích:** Copy task → new task with same labels/description

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `POST` | `/tasks/{{taskId}}/duplicate` | Header + `{"newTitle":"Copy of..."}` | `201` — new task object |
| 2 | `GET` | `/tasks?projectId={{projectId}}` | `Bearer {{accessToken}}` | `200` — array có cả task gốc + copy |

---

## 5.12. Move Task (Between Projects)

> **Điều kiện:** Workspace có ≥2 projects

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/tasks/{{taskId}}/move` | Header + `{"targetProjectId":"{{projectId2}}"}` | `200` — task.projectId = projectId2 |
| 2 | `GET` | `/tasks?projectId={{projectId}}` | `Bearer {{accessToken}}` | `200` — task không còn ở project 1 |
| 3 | `GET` | `/tasks?projectId={{projectId2}}` | `Bearer {{accessToken}}` | `200` — task ở project 2 |

---

## 5.13. Time Tracking

> **Mục đích:** Log time spent on task

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `PATCH` | `/tasks/{{taskId}}/time-spent` | Header + `{"minutes":30}` | `200` — timeSpent += 30 |
| 2 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — timeSpent = 30 |
| 3 | `PATCH` | `/tasks/{{taskId}}/time-spent` | Header + `{"minutes":20}` | `200` — timeSpent += 20 |
| 4 | `GET` | `/tasks/{{taskId}}` | `Bearer {{accessToken}}` | `200` — timeSpent = 50 |

---

## 5.14. Task Validation & Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `POST` | `/tasks` | Header + `{"title":"","projectId":"..."}` | `400` — title required |
| 2 | `POST` | `/tasks` | Header + `{"title":"Task","projectId":"invalid-id"}` | `404` — project not found |
| 3 | `PATCH` | `/tasks/invalid-id` | Header + `{"title":"New"}` | `404` — task not found |
| 4 | `POST` | `/tasks` | No auth header | `401` — Unauthorized |

---

### Checklist Task Module

- [ ] 5.1 — Create task happy path (201)
- [ ] 5.1 — Get task detail (200)
- [ ] 5.2 — List tasks by project (200)
- [ ] 5.2 — List with pagination (200)
- [ ] 5.3 — Update task (200)
- [ ] 5.3 — Verify changes (200)
- [ ] 5.4 — Update status TODO→IN_PROGRESS (200)
- [ ] 5.4 — Update status IN_PROGRESS→DONE (200)
- [ ] 5.5 — Assign task to member (200)
- [ ] 5.5 — Unassign task (200)
- [ ] 5.6 — Add label to task (201)
- [ ] 5.6 — Remove label from task (200)
- [ ] 5.7 — Filter by status (200)
- [ ] 5.7 — Filter by priority multi (200)
- [ ] 5.7 — Filter by assignee (200)
- [ ] 5.7 — Search by keyword (200)
- [ ] 5.7 — Sort by due date (200)
- [ ] 5.8 — Upload attachment (201)
- [ ] 5.8 — Get attachments list (200)
- [ ] 5.8 — Delete attachment (200)
- [ ] 5.9 — Create subtask (201)
- [ ] 5.9 — Get subtasks list (200)
- [ ] 5.9 — Update subtask (200)
- [ ] 5.9 — Complete subtask (200)
- [ ] 5.9 — Delete subtask (200)
- [ ] 5.10 — Reorder task set order (200)
- [ ] 5.10 — List sorted by order (200)
- [ ] 5.11 — Duplicate task (201)
- [ ] 5.11 — Verify duplicate in list (200)
- [ ] 5.12 — Move task to another project (200)
- [ ] 5.12 — Verify task not in old project (200)
- [ ] 5.12 — Verify task in new project (200)
- [ ] 5.13 — Add time spent (200)
- [ ] 5.13 — Accumulate time spent (200)
- [ ] 5.14 — Create task title empty (400)
- [ ] 5.14 — Create task project not found (404)
- [ ] 5.14 — Update task not found (404)
- [ ] 5.14 — Create without auth (401)

---

# 6. Comment Module (`/tasks/:taskId/comments/*`)

> Các API: `create comment`, `reply comment`
> **Tất cả endpoint đều cần JWT token**

---

## 6.1. Tạo Comment cho Task — Happy path

> **Điều kiện:** Có task từ Flow 5.1, đã login

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/auth/login` | `{"email":"auth1@test.com","password":"Password@123"}` | `200` | Lưu `accessToken` |
| 2 | `POST` | `/tasks/{{taskId}}/comments` | Header + `{"content":"This is a comment"}` | `201` — comment object | Lưu `commentId` |

**Kiểm tra response bước 2:**
- `id`, `content`, `taskId`, `authorId`, `parentId` (null), `createdAt`
- `author` object: `id`, `name`, `avatar`
- `content` = `"This is a comment"`

---

## 6.2. Reply Comment — Happy path

> **Điều kiện:** Có comment từ Flow 6.1

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/tasks/{{taskId}}/comments/{{commentId}}/reply` | Header + `{"content":"This is a reply"}` | `201` — reply object | `parentId` = commentId |
| 2 | Kiểm tra | — | — | `parentId` = `{{commentId}}` | Reply gắn đúng parent |

**Kiểm tra response:**
- `parentId` = `{{commentId}}` (không null)
- `content` = `"This is a reply"`
- `author` object có đầy đủ

---

## 6.3. Comment — Notification tự động

> **Mục đích:** Kiểm tra comment tự động tạo notification cho task creator/assignees

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/auth/register` | `{"email":"commenter@test.com","password":"Password@123","fullname":"Commenter","displayName":"C"}` | `201` | User khác |
| 2 | Invite + Accept | (Flow 3.5) | — | — | commenter join workspace |
| 3 | `POST` | `/tasks/{{taskId}}/comments` | Commenter's header + `{"content":"New comment!"}` | `201` | Comment bởi người khác |
| 4 | Kiểm tra WebSocket / DB | — | — | Task creator nhận notification `COMMENT_ADDED` | Verify notification tự động |

---

## 6.4. Comment — Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `POST` | `/tasks/{{taskId}}/comments` | Header + `{"content":""}` | `400` — content required |
| 2 | `POST` | `/tasks/{{taskId}}/comments` | Header + `{}` | `400` — content required |
| 3 | `POST` | `/tasks/invalid-uuid/comments` | Header + `{"content":"Test"}` | `400` — invalid UUID |
| 4 | `POST` | `/tasks/00000000-0000-0000-0000-000000000000/comments` | Header + `{"content":"Test"}` | `404` — Task không tồn tại |
| 5 | `POST` | `/tasks/{{taskId}}/comments/00000000-0000-0000-0000-000000000000/reply` | Header + `{"content":"Reply"}` | `404` — Comment cha không tồn tại |
| 6 | `POST` | `/tasks/{{taskId}}/comments` | Không có Authorization header | `401` — Unauthorized |

---

### Checklist Comment Module

- [ ] 6.1 — Create comment happy path (201)
- [ ] 6.1 — Response có author object đầy đủ
- [ ] 6.2 — Reply comment happy path (201)
- [ ] 6.2 — Reply parentId đúng
- [ ] 6.3 — Comment tạo notification cho task creator
- [ ] 6.4 — Create comment content rỗng (400)
- [ ] 6.4 — Create comment body rỗng (400)
- [ ] 6.4 — Create comment invalid UUID (400)
- [ ] 6.4 — Create comment task không tồn tại (404)
- [ ] 6.4 — Reply parent comment không tồn tại (404)
- [ ] 6.4 — Create comment không có token (401)

---

# 7. Notification Module (`/notifications/*`)

> Các API: `create notification` (test endpoint)
> **Tất cả endpoint đều cần JWT token**
> **Lưu ý:** Notification thường được tạo tự động bởi hệ thống (khi comment, assign task, ...). Endpoint POST chỉ dùng để test.

---

## 7.1. Tạo Notification — Happy path (Test endpoint)

> **Điều kiện:** Đã login, có user ID

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | `POST` | `/notifications` | Header + `{"type":"COMMENT_ADDED","title":"Test Notification","message":"This is a test","userId":"{{targetUserId}}"}` | `201` — notification object | Lưu `notificationId` |

**Kiểm tra response:**
- `id`, `type`, `title`, `message`, `userId`, `actorId`, `isRead` (false), `createdAt`
- `type` = `"COMMENT_ADDED"`
- `isRead` = `false` (mặc định)

---

## 7.2. Notification — Tự động qua Comment

> **Mục đích:** Verify luồng end-to-end: comment → notification → WebSocket push

| Bước | Method | Endpoint | Body / Header | Expected | Ghi chú |
|------|--------|----------|---------------|----------|---------|
| 1 | User A tạo task | (Flow 5.1) | — | Task `createdById` = User A | |
| 2 | User B gán vào task | (Flow 5.5) | — | `TaskAssignment` created | |
| 3 | User C comment | `POST /tasks/{{taskId}}/comments` | C's header + `{"content":"Check this!"}` | `201` | |
| 4 | Kiểm tra DB | — | — | Notification cho User A (creator) + User B (assignee), không có cho User C (author) | |

---

## 7.3. Notification — Validation & Error cases

| Bước | Method | Endpoint | Body / Header | Expected |
|------|--------|----------|---------------|----------|
| 1 | `POST` | `/notifications` | Header + `{"type":"INVALID_TYPE","title":"Test","userId":"{{userId}}"}` | `400` — invalid enum type |
| 2 | `POST` | `/notifications` | Header + `{"type":"COMMENT_ADDED","title":"","userId":"{{userId}}"}` | `400` — title required |
| 3 | `POST` | `/notifications` | Header + `{}` | `400` — validation errors |
| 4 | `POST` | `/notifications` | Không có Authorization header | `401` — Unauthorized |

---

### Checklist Notification Module

- [ ] 7.1 — Create notification happy path (201)
- [ ] 7.1 — Response có isRead = false mặc định
- [ ] 7.2 — Comment tạo notification cho creator + assignees
- [ ] 7.2 — Comment không tạo notification cho chính author
- [ ] 7.3 — Create notification invalid type (400)
- [ ] 7.3 — Create notification title rỗng (400)
- [ ] 7.3 — Create notification body rỗng (400)
- [ ] 7.3 — Create notification không có token (401)

---

# 8. WebSocket / Events Module (`/events` namespace)

> **Protocol:** Socket.IO (namespace `/events`)
> **Connection URL:** `ws://localhost:3333/events`
> **Authentication:** Token qua `socket.handshake.auth.token` hoặc `socket.handshake.query.token`
> **Tool:** Hoppscotch Realtime → Socket.IO, hoặc dùng script Node.js bên dưới

---

## 8.1. Kết nối WebSocket — Happy path

> **Điều kiện:** Đã login, có `accessToken`

| Bước | Hành động | Expected | Ghi chú |
|------|-----------|----------|---------|
| 1 | Connect tới `ws://localhost:3333/events` với `auth: { token: "{{accessToken}}" }` | Kết nối thành công | Server log: `Socket xxx joined user:{{userId}}` |
| 2 | Kiểm tra server log | `EventsGateway: Socket xxx joined user:{{userId}}` | Tự động join room `user:{{userId}}` |

**Script test (Node.js):**

```js
const io = require('socket.io-client');
const socket = io('http://localhost:3333/events', {
  auth: { token: '{{accessToken}}' },
});
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
socket.on('notification:new', (data) => console.log('Notification:', data));
socket.on('comment:created', (data) => console.log('Comment:', data));
```

---

## 8.2. Kết nối WebSocket — Không có token / Token sai

| Bước | Hành động | Expected |
|------|-----------|----------|
| 1 | Connect tới `/events` **không gửi token** | Bị disconnect ngay lập tức |
| 2 | Connect tới `/events` với `auth: { token: "invalid-token" }` | Bị disconnect — `authentication failed` |

---

## 8.3. Join/Leave Room

> **Mục đích:** Kiểm tra subscribe/unsubscribe theo project hoặc task

| Bước | Hành động | Expected |
|------|-----------|----------|
| 1 | Emit `joinRoom` với data `"project:{{projectId}}"` | Server log: `Socket xxx joined room: project:{{projectId}}` |
| 2 | User khác tạo task trong project | Client nhận event `task:created` | Real-time push |
| 3 | Emit `leaveRoom` với data `"project:{{projectId}}"` | Server log: `Socket xxx left room: project:{{projectId}}` |
| 4 | User khác tạo task nữa | Client **không** nhận event | Đã unsubscribe |

---

## 8.4. Nhận Real-time Events — End-to-end

> **Mục đích:** Verify luồng: action → EventsService → WebSocket → client

| Bước | User A (WebSocket client) | User B (REST API) | Expected on User A |
|------|--------------------------|-------------------|-------------------|
| 1 | Connect + joinRoom `task:{{taskId}}` | — | Connected |
| 2 | Đang lắng nghe `comment:created` | `POST /tasks/{{taskId}}/comments` + `{"content":"Hello!"}` | Nhận event `comment:created` với comment data |
| 3 | Đang lắng nghe `notification:new` | (hệ thống tự tạo notification) | Nhận event `notification:new` nếu User A là creator/assignee |

---

## 8.5. WebSocket Events Reference

| Event Name | Trigger | Room | Payload |
|------------|---------|------|---------|
| `comment:created` | Tạo comment mới | `task:{{taskId}}` | Comment object + author |
| `comment:replied` | Reply comment | `task:{{taskId}}` | Reply object + author |
| `notification:new` | Notification tạo mới | `user:{{userId}}` | Notification object + actor |
| `task:created` | Tạo task (nếu emit) | `project:{{projectId}}` | Task object |
| `task:updated` | Cập nhật task (nếu emit) | `project:{{projectId}}` | Updated task |

---

### Checklist WebSocket Module

- [ ] 8.1 — Connect với valid token thành công
- [ ] 8.1 — Tự động join room user:{{userId}}
- [ ] 8.2 — Connect không token → disconnect
- [ ] 8.2 — Connect token sai → disconnect
- [ ] 8.3 — joinRoom thành công
- [ ] 8.3 — leaveRoom thành công
- [ ] 8.4 — Nhận event comment:created real-time
- [ ] 8.4 — Nhận event notification:new real-time

---

# Summary: Test Coverage

| Module | # Flows | # Test Cases | Status |
|--------|---------|--------------|--------|
| **Auth** | 9 | 22 | Ready |
| **User** | 8 | 22 | Ready |
| **Workspace** | 9 | 23 | Ready |
| **Project** | 5 | 11 | Ready |
| **Task** | 14 | 43 | Ready |
| **Comment** | 4 | 11 | Ready |
| **Notification** | 3 | 8 | Ready |
| **WebSocket** | 5 | 8 | Ready |
| **TOTAL** | **57** | **148**+ | — |

---

**Last Updated:** 30/03/2026
**Version:** 3.0 (Added Comment, Notification, WebSocket flows)
