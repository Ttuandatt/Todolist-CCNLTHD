# A4. Kết quả kiểm thử UserController

**Người thực hiện:** Tuấn Đạt
**File test:** `backend/src/modules/user/user.controller.spec.ts`
**File source:** `backend/src/modules/user/user.controller.ts`
**Ngày thực hiện:** 30/03/2026
**Công cụ:** Jest 30 + ts-jest 29 + @nestjs/testing

---

## 1. Mô tả đối tượng kiểm thử

UserController là controller quản lý hồ sơ người dùng, tiếp nhận HTTP request và delegate xuống UserService. Tất cả endpoint đều yêu cầu JWT authentication thông qua `@UseGuards(JwtAuthGuard)` đặt ở cấp controller.

| Endpoint | HTTP Method | Phương thức controller | Đặc biệt |
|---|---|---|---|
| `GET /users/me` | GET | getProfile() | Lấy userId từ `@CurrentUser('id')` |
| `PATCH /users/me` | PATCH | updateProfile() | Nhận DTO từ `@Body()` |
| `PATCH /users/me/change-password` | PATCH | changePassword() | Nhận DTO từ `@Body()` |
| `POST /users/me/avatar` | POST | uploadAvatar() | `@UseInterceptors(FileInterceptor)` + `@UploadedFile(ParseFilePipe)` |

UserController chỉ phụ thuộc vào **UserService** duy nhất. Tương tự AuthController (A2), đây là thin controller — tất cả 4 method đều chỉ delegate xuống service mà không có logic xử lý thêm. Điểm khác biệt là method `uploadAvatar` sử dụng `FileInterceptor` và `ParseFilePipe` với `MaxFileSizeValidator` — tuy nhiên đây là các thành phần framework chạy ở tầng middleware/pipe, không nằm trong scope unit test của controller.

## 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Controller test pattern** (Chương 8.6.1) giống A2: mock UserService, kiểm tra delegation.

Một lưu ý kỹ thuật quan trọng trong quá trình viết test: UserController sử dụng **absolute import** (`src/modules/auth/guards/jwt-auth.guard` thay vì relative path `../../auth/guards/...`). Jest mặc định không resolve được absolute import. Để giải quyết, cần thêm `moduleNameMapper` vào cấu hình Jest trong `package.json`:

```json
"moduleNameMapper": {
  "^src/(.*)$": "<rootDir>/$1"
}
```

Cấu hình này map path `src/xxx` thành `<rootDir>/xxx` (với rootDir là `src/`), cho phép Jest resolve absolute import giống cách TypeScript compiler xử lý.

## 3. Danh sách test case

Tổng cộng **4 test case** bao phủ toàn bộ 4 method:

| # | Method | Test case | Kết quả mong đợi |
|---|---|---|---|
| 1 | getProfile | should call userService.getProfile and return result | Service nhận đúng userId, controller trả đúng profile |
| 2 | updateProfile | should call userService.updateProfile and return result | Service nhận đúng userId + DTO, controller trả đúng profile cập nhật |
| 3 | changePassword | should call userService.changePassword and return result | Service nhận đúng userId + DTO, controller trả success message |
| 4 | uploadAvatar | should call userService.uploadAvatar and return result | Service nhận đúng userId + file object, controller trả profile có avatar mới |

Vì controller không chứa logic xử lý (khác với `logout` trong AuthController có strip "Bearer "), mỗi method chỉ cần 1 test case để xác nhận delegation. Các trường hợp lỗi (user not found, password sai, file thiếu...) đã được kiểm tra kỹ ở tầng service (A3 — 14 test case).

## 4. Kết quả chạy kiểm thử

### 4.1. Kết quả tổng hợp

```
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.057 s
```

Toàn bộ 4 test case đều **PASSED**.

### 4.2. Code Coverage cho user.controller.ts

| Chỉ số | Giá trị |
|---|---|
| **Statements** | **100%** |
| **Branches** | **64.7%** |
| **Functions** | **100%** |
| **Lines** | **100%** |

### 4.3. Phân tích nhánh chưa bao phủ

Branch coverage đạt 64.7% — thấp hơn so với các file khác nhưng 100% statements và lines đều đạt. Nguyên nhân là do coverage tool đếm các nhánh ngầm (implicit branches) được sinh ra bởi các decorator của NestJS: `@UseGuards(JwtAuthGuard)`, `@UseInterceptors(FileInterceptor)`, `@ParseFilePipe`, `@MaxFileSizeValidator`. Những decorator này tạo ra metadata và conditional logic ở tầng framework — chúng được thực thi bởi NestJS runtime chứ không phải bởi controller code trực tiếp, do đó không thể và không cần bao phủ trong unit test.

Đây là hạn chế chung khi đo coverage cho NestJS controller có nhiều decorator. Trong thực tế, 100% statements + 100% functions + 100% lines cho thấy toàn bộ logic do developer viết đã được kiểm thử.

## 5. Kiến thức Chương 8 đã áp dụng

| Mục Chương 8 | Áp dụng trong UserController test |
|---|---|
| 8.2.2 — TestingModule | `Test.createTestingModule({ controllers: [...], providers: [...] })` |
| 8.3.1 — describe/it/beforeEach | 4 describe con, 4 it blocks |
| 8.4.3 — Mock DI | `{ provide: UserService, useValue: mockUserService }` |
| 8.6.1 — Controller test pattern | Mock service layer, verify delegation (không test HTTP decorators) |

## 6. Nhận xét và đánh giá

Bài kiểm thử UserController hoàn thành tốt vai trò với 4/4 test case passed và coverage tối đa cho các chỉ số quan trọng (100% statements, functions, lines). Số lượng test case ít (4 test case) là phù hợp với nguyên tắc thin controller — không có business logic cần test nhiều nhánh.

Bài test này cũng phát hiện và giải quyết một vấn đề cấu hình quan trọng: Jest không resolve được absolute import `src/...` mà UserController sử dụng. Việc thêm `moduleNameMapper` vào Jest config không chỉ giải quyết cho file test này mà còn cho tất cả test file trong tương lai có import từ absolute path — một thiết lập cần thiết cho toàn bộ dự án.

So sánh với AuthController test (A2 — 7 test case), UserController test có ít test case hơn vì không có method nào chứa logic ngoài delegation. Branch coverage thấp hơn (64.7% vs 75%) nhưng hoàn toàn do decorator framework, không phải do thiếu test cho logic nghiệp vụ.
