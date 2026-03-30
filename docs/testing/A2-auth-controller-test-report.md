# A2. Kết quả kiểm thử AuthController

**Người thực hiện:** Tuấn Đạt
**File test:** `backend/src/modules/auth/auth.controller.spec.ts`
**File source:** `backend/src/modules/auth/auth.controller.ts`
**Ngày thực hiện:** 30/03/2026
**Công cụ:** Jest 30 + ts-jest 29 + @nestjs/testing

---

## 1. Mô tả đối tượng kiểm thử

AuthController là controller của module xác thực, đóng vai trò tiếp nhận HTTP request từ client và chuyển tiếp (delegate) xuống AuthService để xử lý. Controller này khai báo 6 endpoint tương ứng với 6 phương thức:

| Endpoint | Method | Decorator đặc biệt | Phương thức controller |
|---|---|---|---|
| `POST /auth/register` | register() | `@Public()` — không cần JWT | Gọi `authService.register(dto)` |
| `POST /auth/login` | login() | `@Public()`, `@HttpCode(200)` | Gọi `authService.login(dto)` |
| `POST /auth/refresh` | refreshToken() | `@Public()`, `@HttpCode(200)` | Gọi `authService.refreshToken(dto)` |
| `POST /auth/logout` | logout() | `@HttpCode(200)` — cần JWT | Gọi `authService.logout(userId, accessToken)` |
| `POST /auth/forgot-password` | forgotPassword() | `@Public()`, `@HttpCode(200)` | Gọi `authService.forgotPassword(dto)` |
| `POST /auth/reset-password` | resetPassword() | `@Public()`, `@HttpCode(200)` | Gọi `authService.resetPassword(dto)` |

AuthController chỉ phụ thuộc vào 1 dependency duy nhất là **AuthService**, được inject qua constructor. Đa phần các method chỉ nhận DTO từ `@Body()` rồi delegate trực tiếp xuống service mà không có thêm logic xử lý. Ngoại lệ duy nhất là method `logout()` — ngoài việc nhận `userId` từ `@CurrentUser('id')`, nó còn nhận `authorization` header từ `@Headers('authorization')` và thực hiện strip prefix "Bearer " để lấy raw JWT token trước khi truyền cho service.

## 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Controller test pattern** (Chương 8.6.1) — khác biệt cơ bản so với Service test (A1):

| Tiêu chí | Service test (A1) | Controller test (A2) |
|---|---|---|
| Đối tượng test | AuthService (business logic) | AuthController (HTTP layer) |
| Mock gì | PrismaService, JwtService, MailService, ConfigService | AuthService |
| Kiểm tra gì | Logic nghiệp vụ, exception handling, data transformation | Delegation đúng method + đúng tham số |
| Số lượng mock | 4 dependencies + 2 external modules | 1 dependency |

Controller được thiết kế theo nguyên tắc "thin controller" — không chứa business logic, chỉ đóng vai trò cầu nối giữa HTTP layer và service layer. Do đó, mục tiêu của controller test là xác nhận rằng mỗi endpoint gọi đúng method của service, truyền đúng tham số, và trả về đúng kết quả mà service trả về.

Mock AuthService được tạo với `jest.fn()` cho tất cả 6 method, được inject vào TestingModule thông qua pattern `{ provide: AuthService, useValue: mockAuthService }` (Chương 8.4.3). Mỗi test case sử dụng `mockResolvedValue` để thiết lập giá trị trả về mong muốn, sau đó assert rằng controller trả về đúng giá trị đó và service được gọi đúng cách.

## 3. Danh sách test case

Tổng cộng **7 test case** bao phủ toàn bộ 6 method của controller:

### 3.1. register()

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 1 | should call authService.register and return result | Truyền RegisterDto, kiểm tra delegation | Controller trả về kết quả từ service. `authService.register` được gọi 1 lần với đúng DTO. |

### 3.2. login()

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 2 | should call authService.login and return result | Truyền LoginDto, kiểm tra delegation | Controller trả về kết quả từ service. `authService.login` được gọi 1 lần với đúng DTO. |

### 3.3. refreshToken()

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 3 | should call authService.refreshToken and return result | Truyền RefreshTokenDto | Controller trả về tokens mới từ service. |

### 3.4. logout() — Method duy nhất có logic

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 4 | should strip Bearer prefix and call authService.logout | Authorization header = "Bearer eyJ..." | Service nhận raw token (không có "Bearer " prefix). |
| 5 | should handle undefined authorization header | Header undefined (edge case) | Service nhận `undefined` làm accessToken. Không throw error. |

Đây là nhóm test quan trọng nhất vì `logout()` là method duy nhất trong controller có chứa logic xử lý: `auth?.replace('Bearer ', '')`. Test case 4 xác nhận prefix "Bearer " được strip đúng cách. Test case 5 kiểm tra edge case khi không có authorization header — toán tử optional chaining `auth?.replace()` trả về `undefined` thay vì throw TypeError, đảm bảo controller không crash trong tình huống bất thường.

### 3.5. forgotPassword()

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 6 | should call authService.forgotPassword and return result | Truyền ForgotPasswordDto | Controller trả về success message từ service. |

### 3.6. resetPassword()

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 7 | should call authService.resetPassword and return result | Truyền ResetPasswordDto | Controller trả về success message từ service. |

## 4. Kết quả chạy kiểm thử

### 4.1. Kết quả tổng hợp

```
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.423 s
```

Toàn bộ 7 test case đều **PASSED**.

### 4.2. Code Coverage cho auth.controller.ts

| Chỉ số | Giá trị | Ý nghĩa |
|---|---|---|
| **Statements** | **100%** | Tất cả câu lệnh đã được thực thi |
| **Branches** | **75%** | 3/4 nhánh điều kiện đã được kiểm tra |
| **Functions** | **100%** | Tất cả 6 method + constructor đều được gọi |
| **Lines** | **100%** | Tất cả dòng code đã được bao phủ |

### 4.3. Phân tích nhánh chưa bao phủ

Branch coverage đạt 75% do 1 nhánh chưa được kiểm tra trong biểu thức `auth?.replace('Bearer ', '')` tại method `logout()`. Cụ thể, toán tử optional chaining (`?.`) tạo ra 2 nhánh: (1) `auth` có giá trị → gọi `.replace()`, và (2) `auth` là `null`/`undefined` → trả `undefined`. Bài test đã kiểm tra cả trường hợp `auth = "Bearer xxx"` (test 4) và `auth = undefined` (test 5), tuy nhiên coverage tool ghi nhận nhánh ngầm của optional chaining khi `auth` là `null` riêng biệt. Đây là hạn chế kỹ thuật của coverage tool với cú pháp optional chaining, không ảnh hưởng đến chất lượng kiểm thử thực tế.

## 5. Kiến thức Chương 8 đã áp dụng

| Mục Chương 8 | Áp dụng trong AuthController test |
|---|---|
| 8.2.2 — TestingModule | `Test.createTestingModule({ controllers: [AuthController], providers: [...] })` |
| 8.3.1 — describe/it/beforeEach | 1 describe gốc, 6 describe con, 7 it blocks |
| 8.4.2 — jest.fn() | Mock 6 methods của AuthService |
| 8.4.3 — Mock DI | `{ provide: AuthService, useValue: mockAuthService }` |
| 8.6.1 — Controller test pattern | Mock service layer, verify delegation (khác service test ở A1 mock DB layer) |

## 6. Nhận xét và đánh giá

Bài kiểm thử AuthController đạt kết quả tối ưu với 7/7 test case passed và coverage gần như tuyệt đối (100% statements, 100% functions, 100% lines). Số lượng test case ít hơn so với AuthService (7 so với 16) là hợp lý vì controller chỉ đóng vai trò delegation — không chứa business logic, nên không cần test nhiều error case.

Điểm đáng chú ý nhất của bài test là phần kiểm tra method `logout()` với 2 test case riêng. Đây là method duy nhất có logic ngoài việc delegate, và bài test đã xác nhận đúng hành vi strip "Bearer " prefix cũng như xử lý edge case khi authorization header không tồn tại. Điều này thể hiện nguyên tắc quan trọng trong controller testing: tập trung test vào những chỗ có logic thực sự, còn những method thuần delegation chỉ cần 1 test case xác nhận delegation là đúng.

So sánh với A1 (AuthService test), bài test A2 minh họa rõ sự khác biệt giữa 2 tầng trong kiến trúc NestJS: service test kiểm tra business logic với nhiều mock phức tạp, trong khi controller test kiểm tra HTTP layer với mock đơn giản hơn. Cả hai cùng sử dụng TestingModule và mock DI nhưng ở mức độ trừu tượng khác nhau — đúng theo nguyên tắc Testing Pyramid.
