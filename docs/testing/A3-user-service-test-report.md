# A3. Kết quả kiểm thử UserService

**Người thực hiện:** Tuấn Đạt
**File test:** `backend/src/modules/user/user.service.spec.ts`
**File source:** `backend/src/modules/user/user.service.ts`
**Ngày thực hiện:** 30/03/2026
**Công cụ:** Jest 30 + ts-jest 29 + @nestjs/testing

---

## 1. Mô tả đối tượng kiểm thử

UserService là service quản lý hồ sơ người dùng trong hệ thống TodoList Collaboration, cung cấp 4 phương thức xử lý các thao tác liên quan đến thông tin cá nhân:

| Phương thức | Chức năng | Nghiệp vụ chính |
|---|---|---|
| `getProfile(userId)` | Lấy thông tin hồ sơ | Tìm user theo ID, trả về các field đã chọn qua `profileSelect` |
| `updateProfile(userId, dto)` | Cập nhật hồ sơ | Validate có ít nhất 1 field, update displayName và/hoặc bio |
| `changePassword(userId, dto)` | Đổi mật khẩu | Xác minh password cũ, kiểm tra password mới khác cũ, hash + update trong transaction |
| `uploadAvatar(userId, file)` | Upload ảnh đại diện | Xóa avatar cũ (nếu có), lưu file mới, cập nhật DB |

UserService chỉ phụ thuộc vào **PrismaService** để truy cập database. Ngoài ra, nó sử dụng 2 thư viện bên ngoài: **bcrypt** (hash và so sánh mật khẩu trong `changePassword`) và **fs.promises** (thao tác file hệ thống trong `uploadAvatar`).

So với AuthService (A1), UserService có đặc thù riêng là tương tác với file system (upload avatar) và có logic validation phức tạp trong `changePassword` — method này gọi `bcrypt.compare` hai lần với mục đích khác nhau: lần 1 để xác minh password hiện tại, lần 2 để đảm bảo password mới khác password cũ.

## 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Service test pattern** (Chương 8.5) tương tự A1, mock toàn bộ tầng database (PrismaService) và các thư viện bên ngoài (bcrypt, fs) để cô lập business logic của UserService.

Điểm khác biệt so với A1 là việc mock thêm module `fs` — thư viện Node.js gốc dùng để thao tác file system. Mock `fs.promises.unlink` và `fs.promises.writeFile` giúp test `uploadAvatar` mà không cần tạo/xóa file thật trên đĩa, giữ cho test nhanh và không có side effect.

Trong test `changePassword`, kỹ thuật `mockResolvedValueOnce` được sử dụng đặc biệt hiệu quả: `bcrypt.compare` được mock trả giá trị khác nhau cho 2 lần gọi liên tiếp — lần 1 trả `true` (password hiện tại đúng), lần 2 trả `false` (password mới khác password cũ). Kỹ thuật này cho phép kiểm tra logic phân nhánh phức tạp trong cùng một method call.

## 3. Danh sách test case

Tổng cộng **14 test case** bao phủ 4 phương thức:

### 3.1. getProfile() — Lấy hồ sơ người dùng

| # | Test case | Kết quả mong đợi |
|---|---|---|
| 1 | should return user profile when user exists | Trả về profile object với đúng các field từ `profileSelect` |
| 2 | should throw NotFoundException if user not found | Throw `NotFoundException` (HTTP 404) |

### 3.2. updateProfile() — Cập nhật hồ sơ

| # | Test case | Kết quả mong đợi |
|---|---|---|
| 3 | should update displayName and return updated profile | Gọi `user.update` với `data: { displayName }`, trả profile mới |
| 4 | should update bio and return updated profile | Gọi `user.update` với `data: { bio }`, trả profile mới |
| 5 | should throw BadRequestException if no fields provided | Throw `BadRequestException` khi DTO rỗng. Không gọi `user.update`. |

Test case 3 và 4 kiểm tra riêng từng field để xác nhận logic spread operator `...(dto.displayName ? {...} : {})` hoạt động đúng — chỉ field được cung cấp mới xuất hiện trong `data`. Test case 5 kiểm tra guard clause đầu method: nếu cả `displayName` và `bio` đều không có, service reject ngay mà không truy cập database.

### 3.3. changePassword() — Đổi mật khẩu

| # | Test case | Kết quả mong đợi |
|---|---|---|
| 6 | should change password successfully | Hash password mới, update trong `$transaction`, revoke tất cả refresh tokens |
| 7 | should throw BadRequestException if confirm password does not match | Throw lỗi ngay, không query DB |
| 8 | should throw NotFoundException if user not found | Throw `NotFoundException` |
| 9 | should throw BadRequestException if current password is wrong | `bcrypt.compare` trả `false` → throw lỗi |
| 10 | should throw BadRequestException if new password same as current | `bcrypt.compare` trả `true` cả 2 lần → throw lỗi |

Đây là nhóm test phức tạp nhất với 5 test case cho 5 nhánh khác nhau. Method `changePassword` có 4 điểm validation trước khi thực hiện đổi password: (1) confirmPassword khớp newPassword, (2) user tồn tại, (3) currentPassword đúng, (4) newPassword khác currentPassword. Mỗi điểm validation tương ứng với 1 test case lỗi. Test case 6 (thành công) xác nhận cả việc hash password mới lẫn revoke tất cả refresh tokens trong transaction — logic bảo mật quan trọng buộc user phải đăng nhập lại sau khi đổi password.

### 3.4. uploadAvatar() — Upload ảnh đại diện

| # | Test case | Kết quả mong đợi |
|---|---|---|
| 11 | should upload avatar successfully (no previous avatar) | Ghi file mới, update DB, trả profile có avatar |
| 12 | should delete old avatar before uploading new one | Gọi `fs.unlink` với path avatar cũ trước khi ghi file mới |
| 13 | should throw BadRequestException if no file provided | Throw lỗi khi file là `null` |
| 14 | should throw NotFoundException if user not found | Throw `NotFoundException` |

Test case 12 đặc biệt quan trọng — nó xác nhận rằng khi user đã có avatar cũ, file cũ phải bị xóa bằng `fs.promises.unlink` trước khi lưu file mới. Đây là logic ngăn chặn file rác tích lũy trên server.

## 4. Kết quả chạy kiểm thử

### 4.1. Kết quả tổng hợp

```
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        0.784 s
```

Toàn bộ 14 test case đều **PASSED** trong thời gian dưới 1 giây.

### 4.2. Code Coverage cho user.service.ts

| Chỉ số | Giá trị |
|---|---|
| **Statements** | **100%** |
| **Branches** | **96.42%** |
| **Functions** | **100%** |
| **Lines** | **100%** |

### 4.3. Phân tích nhánh chưa bao phủ

Branch coverage đạt 96.42% — dòng 17 (constructor) được coverage tool ghi nhận là chưa bao phủ 1 nhánh ngầm. Đây là nhánh tự động sinh ra bởi TypeScript cho constructor injection pattern `constructor(private prisma: PrismaService)` khi compile sang JavaScript. Nhánh này không ảnh hưởng đến logic nghiệp vụ và không thể test trực tiếp.

## 5. Kiến thức Chương 8 đã áp dụng

| Mục Chương 8 | Áp dụng trong UserService test |
|---|---|
| 8.2.2 — TestingModule | Tạo module test với 1 dependency mock (PrismaService) |
| 8.3.1 — describe/it/beforeEach | 4 describe con (getProfile, updateProfile, changePassword, uploadAvatar) |
| 8.4.2 — jest.mock() | Mock bcrypt (hash/compare) và fs (unlink/writeFile) ở cấp module |
| 8.4.2 — mockResolvedValueOnce | Mock `bcrypt.compare` trả giá trị khác nhau cho 2 lần gọi liên tiếp trong changePassword |
| 8.4.3 — Mock DI | `{ provide: PrismaService, useValue: mockPrismaService }` |
| 8.5 — Service test | Mock toàn bộ DB layer + file system, test business logic thuần |

## 6. Nhận xét và đánh giá

Bài kiểm thử UserService đạt kết quả xuất sắc với 14/14 test case passed và code coverage gần tuyệt đối (100% statements, 100% functions, 100% lines, 96.42% branches). Thời gian chạy cực nhanh (dưới 1 giây) nhờ mock toàn bộ I/O (database và file system).

Điểm mạnh nổi bật của bài test là việc xử lý method `changePassword` — một method có 4 điểm validation liên tiếp, mỗi điểm đều được kiểm tra bằng test case riêng. Đặc biệt, kỹ thuật `mockResolvedValueOnce` cho `bcrypt.compare` minh họa rõ cách mock cùng một hàm nhưng trả giá trị khác nhau cho mỗi lần gọi — một kỹ thuật cần thiết khi method under test gọi cùng dependency nhiều lần với mục đích khác nhau.

Nhóm test `uploadAvatar` cũng đáng chú ý vì đây là trường hợp duy nhất trong project cần mock file system (module `fs`). Việc mock `fs.promises.unlink` và `fs.promises.writeFile` cho phép kiểm thử logic upload mà không tạo file thật, giữ cho test suite không có side effect và có thể chạy trên bất kỳ môi trường nào.

So với AuthService test (A1 — 16 test case), UserService test có số lượng tương đương (14 test case) nhưng coverage cao hơn (100% vs 97% statements). Điều này phản ánh đúng thực tế: UserService có ít edge case "không thể trigger" hơn (không có catch block ẩn hay guard clause cho config thiếu như AuthService).
