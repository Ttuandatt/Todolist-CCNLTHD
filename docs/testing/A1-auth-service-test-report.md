# A1. Kết quả kiểm thử AuthService

**Người thực hiện:** Tuấn Đạt
**File test:** `backend/src/modules/auth/auth.service.spec.ts`
**File source:** `backend/src/modules/auth/auth.service.ts`
**Ngày thực hiện:** 30/03/2026
**Công cụ:** Jest 30 + ts-jest 29 + @nestjs/testing

---

## 1. Mô tả đối tượng kiểm thử

AuthService là service trung tâm của module xác thực, chịu trách nhiệm xử lý toàn bộ luồng nghiệp vụ liên quan đến tài khoản người dùng trong hệ thống TodoList Collaboration. Service này quản lý 6 phương thức public bao gồm đăng ký tài khoản (register), đăng nhập (login), làm mới token (refreshToken), đăng xuất (logout), yêu cầu đặt lại mật khẩu (forgotPassword) và thực hiện đặt lại mật khẩu (resetPassword), cùng 1 phương thức private hỗ trợ là generateTokens.

AuthService phụ thuộc vào 4 dependency được inject qua constructor theo cơ chế Dependency Injection của NestJS:

| Dependency | Vai trò | Các method được sử dụng |
|---|---|---|
| **PrismaService** | Truy cập cơ sở dữ liệu thông qua Prisma ORM | `user.findUnique`, `user.create`, `user.update`, `refreshToken.findUnique`, `refreshToken.create`, `refreshToken.update`, `refreshToken.updateMany`, `invalidatedToken.create`, `passwordReset.create`, `passwordReset.findUnique`, `passwordReset.update`, `$transaction` |
| **JwtService** | Tạo và xác thực JSON Web Token | `signAsync`, `verifyAsync`, `decode` |
| **MailService** | Gửi email thông qua Brevo API | `sendPasswordResetEmail` |
| **ConfigService** | Đọc biến môi trường (.env) | `get` |

Ngoài ra, AuthService còn sử dụng 2 thư viện bên ngoài: **bcrypt** (hash và so sánh mật khẩu) và **crypto** (tạo token reset ngẫu nhiên).

## 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng phương pháp **unit test cô lập** (isolated unit testing) theo mô hình Testing Pyramid (Chương 8.1.3), trong đó AuthService được kiểm thử độc lập với toàn bộ dependency được thay thế bằng mock object. Cách tiếp cận này đảm bảo rằng khi một test case thất bại, nguyên nhân chắc chắn nằm trong logic nghiệp vụ của AuthService chứ không phải do lỗi từ database, JWT library hay email service.

Các kỹ thuật cụ thể được áp dụng:

**Tạo môi trường test với TestingModule (Chương 8.2.2):** Sử dụng `Test.createTestingModule()` từ `@nestjs/testing` để tạo một NestJS module giả lập. Trong module này, AuthService được đăng ký là provider thật, còn tất cả dependency được đăng ký dưới dạng mock thông qua pattern `{ provide: RealService, useValue: mockObject }`. Khi NestJS khởi tạo AuthService, cơ chế DI sẽ tự động inject các mock object thay vì service thật.

**Mock function với jest.fn() (Chương 8.4.2):** Mỗi method của dependency được thay thế bằng `jest.fn()` — một hàm giả lập cho phép kiểm soát giá trị trả về (`mockResolvedValue`, `mockReturnValue`) và theo dõi lịch sử gọi (`toHaveBeenCalledWith`, `toHaveBeenCalledTimes`). Đối với bcrypt và crypto, sử dụng `jest.mock()` ở cấp module để thay thế toàn bộ thư viện trước khi import.

**Cấu trúc test Arrange-Act-Assert (Chương 8.3.1):** Mỗi test case được tổ chức theo 3 bước rõ ràng: (1) **Arrange** — thiết lập mock behavior và dữ liệu đầu vào, (2) **Act** — gọi method cần test, (3) **Assert** — kiểm tra kết quả trả về và xác nhận các dependency được gọi đúng cách.

**Đảm bảo tính độc lập giữa các test:** Trước mỗi test case, `jest.clearAllMocks()` được gọi trong `beforeEach` để reset toàn bộ mock về trạng thái ban đầu, sau đó thiết lập lại các giá trị mock mặc định. Điều này đảm bảo test A không ảnh hưởng đến kết quả của test B.

## 3. Danh sách test case

Tổng cộng **16 test case** được viết cho 6 nhóm phương thức, bao phủ cả luồng thành công (happy path) và các trường hợp lỗi (error cases):

### 3.1. register() — Đăng ký tài khoản

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 1 | should register a new user successfully | Đăng ký với email chưa tồn tại, password hợp lệ | Trả về object chứa `user` (id, email, name, avatar, status) và `tokens` (accessToken, refreshToken, expiresIn). Password phải được hash qua bcrypt trước khi lưu DB. |
| 2 | should throw ConflictException if email already exists | Đăng ký với email đã có trong hệ thống | Throw `ConflictException` (HTTP 409). Không gọi `user.create`, không tạo token. |

Ở test case 1, ngoài việc kiểm tra giá trị trả về, bài test còn xác nhận rằng: `user.findUnique` được gọi với đúng email để kiểm tra trùng lặp, `bcrypt.hash` được gọi với password gốc và salt rounds = 10, `user.create` nhận đúng data (bao gồm việc map `dto.fullname` thành field `name` trong database, và truyền `dto.displayName`), và `signAsync` được gọi đúng 2 lần để tạo cặp access/refresh token.

### 3.2. login() — Đăng nhập

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 3 | should login successfully with correct credentials | Đăng nhập đúng email và password | Trả về `user` + `tokens`. `lastLoginAt` được cập nhật. |
| 4 | should throw UnauthorizedException if user not found | Đăng nhập với email không tồn tại | Throw `UnauthorizedException` (HTTP 401). Không gọi `bcrypt.compare`. |
| 5 | should throw UnauthorizedException if password is wrong | Đăng nhập đúng email nhưng sai password | Throw `UnauthorizedException`. Không cập nhật `lastLoginAt`. |

Điểm đáng chú ý trong thiết kế test: cả trường hợp "email không tồn tại" và "password sai" đều throw cùng một loại exception `UnauthorizedException` với message giống nhau ("Email or password is not correct"). Đây là best practice bảo mật nhằm tránh cho attacker biết email nào đã đăng ký trong hệ thống. Test case 5 sử dụng kỹ thuật override mock — ghi đè `bcrypt.compare` trả về `false` thay vì giá trị mặc định `true` đã thiết lập trong `beforeEach`.

### 3.3. refreshToken() — Làm mới token

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 6 | should return new tokens when refresh token is valid | Token hợp lệ, chưa revoke, chưa hết hạn | Trả về cặp token mới. Token cũ bị revoke (set `revokedAt`). |
| 7 | should throw UnauthorizedException if token not found | Token không tồn tại trong DB | Throw `UnauthorizedException`. |
| 8 | should throw UnauthorizedException if token is expired | Token tồn tại nhưng `expiresAt < now` | Throw `UnauthorizedException`. |
| 9 | should throw UnauthorizedException if token is revoked | Token đã bị thu hồi (`revokedAt !== null`) | Throw `UnauthorizedException`. |

Nhóm test này kiểm tra đầy đủ 3 điều kiện reject của refresh token: không tồn tại, đã hết hạn, và đã bị revoke. Kỹ thuật spread operator (`{ ...mockStoredToken, expiresAt: ... }`) được sử dụng để tạo biến thể từ mock data gốc mà không cần khai báo lại toàn bộ object.

### 3.4. logout() — Đăng xuất

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 10 | should revoke all tokens and return success message | Logout với userId và accessToken hợp lệ | Trả về `{ message: "Logout successfully" }`. Tất cả refresh token bị revoke. Access token bị blacklist. |

Test case này xác nhận 2 hành động quan trọng của logout: (1) `refreshToken.updateMany` được gọi với filter `{ userId, revokedAt: null }` để chỉ revoke những token chưa bị revoke, và (2) `invalidatedToken.create` được gọi để thêm access token vào blacklist với `reason: "LOGOUT"` và `expiresAt` tính từ trường `exp` trong JWT payload.

### 3.5. forgotPassword() — Yêu cầu đặt lại mật khẩu

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 11 | should create reset token and send email | Email tồn tại trong hệ thống | Tạo token reset trong DB, gửi email chứa link reset. |
| 12 | should throw NotFoundException if user does not exist | Email không tồn tại | Throw `NotFoundException`. Không tạo token, không gửi email. |

Test case 11 sử dụng `expect.stringContaining('mock_reset_token')` để xác nhận reset link gửi qua email có chứa token đã tạo, mà không cần kiểm tra toàn bộ URL (vì URL phụ thuộc vào biến môi trường `FRONTEND_URL`). Token "mock_reset_token" là giá trị cố định từ `crypto.randomBytes` đã được mock ở đầu file.

### 3.6. resetPassword() — Thực hiện đặt lại mật khẩu

| # | Test case | Mô tả | Kết quả mong đợi |
|---|---|---|---|
| 13 | should reset password successfully | Token hợp lệ, chưa dùng, chưa hết hạn | Hash password mới, cập nhật trong transaction. Trả về success message. |
| 14 | should throw BadRequestException if token not found | Token không tồn tại | Throw `BadRequestException`. |
| 15 | should throw BadRequestException if token is expired | Token đã hết hạn (`expiresAt < now`) | Throw `BadRequestException`. |
| 16 | should throw BadRequestException if token already used | Token đã được sử dụng (`usedAt !== null`) | Throw `BadRequestException`. |

Test case 13 đặc biệt kiểm tra tính atomic của thao tác reset password: việc cập nhật password và đánh dấu token đã dùng phải được thực hiện trong cùng một `$transaction` của Prisma. Mock `$transaction` được implement bằng `Promise.all(promises)` để giả lập hành vi thực thi tất cả query trong transaction. Bài test xác nhận cả `user.update` (đổi password) và `passwordReset.update` (set `usedAt`) đều được gọi đúng tham số.

## 4. Kết quả chạy kiểm thử

### 4.1. Kết quả tổng hợp

```
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        1.674 s
```

Toàn bộ 16 test case đều **PASSED** trong thời gian 1.674 giây. Không có test nào bị skip hay fail.

### 4.2. Code Coverage cho auth.service.ts

| Chỉ số | Giá trị | Ý nghĩa |
|---|---|---|
| **Statements** | **97.01%** | 97% câu lệnh trong file đã được thực thi ít nhất 1 lần |
| **Branches** | **81.81%** | 81.8% nhánh điều kiện (if/else, ternary) đã được kiểm tra |
| **Functions** | **100%** | Tất cả 7 hàm (6 public + 1 private) đều được gọi |
| **Lines** | **96.92%** | 96.9% dòng code đã được bao phủ |

### 4.3. Phân tích các dòng chưa bao phủ

Có 2 dòng trong `auth.service.ts` chưa được bao phủ bởi test:

| Dòng | Code | Lý do chưa bao phủ |
|---|---|---|
| 152 | `} catch {` (trong `refreshToken`) | Nhánh `catch` khi `jwtService.verifyAsync` throw error. Trong các test hiện tại, mock `verifyAsync` luôn resolve thành công hoặc flow bị reject trước khi đến bước verify. |
| 290 | `throw new Error('JWT secrets are not defined...')` (trong `generateTokens`) | Nhánh xử lý khi `ConfigService.get()` trả về `undefined` cho JWT_SECRET hoặc JWT_REFRESH_SECRET. Mock `ConfigService` luôn trả về giá trị hợp lệ. |

Hai dòng này thuộc về xử lý edge case: dòng 152 là catch block khi JWT verification thất bại ở bước signature (sau khi đã pass kiểm tra DB), và dòng 290 là guard clause bảo vệ khi biến môi trường chưa được cấu hình. Cả hai đều không ảnh hưởng đến logic nghiệp vụ chính và có thể bổ sung test case nếu cần nâng coverage lên 100%.

## 5. Kiến thức Chương 8 đã áp dụng

Bảng dưới đây tổng hợp các kiến thức lý thuyết từ Chương 8 (Unit Testing) và cách chúng được áp dụng cụ thể trong bài kiểm thử AuthService:

| Mục Chương 8 | Nội dung lý thuyết | Áp dụng thực tế trong AuthService test |
|---|---|---|
| 8.1.3 | Testing Pyramid — unit test là nền tảng, chiếm số lượng nhiều nhất, chạy nhanh nhất | 16 test case chạy trong ~1.7s, không cần DB/network. Mọi dependency đều mock. |
| 8.2.2 | TestingModule — tạo module NestJS giả lập cho test | `Test.createTestingModule({ providers: [...] }).compile()` trong `beforeEach` |
| 8.3.1 | Cấu trúc describe/it/beforeEach | 1 describe gốc (AuthService), 6 describe con (register, login,...), 16 it blocks, 1 beforeEach |
| 8.4.2 | jest.fn(), mockResolvedValue, jest.mock() | Mock bcrypt, crypto ở cấp module; mock methods với mockResolvedValue/mockReturnValue |
| 8.4.3 | Mock DI — `{ provide: X, useValue: mockX }` | 4 dependency (Prisma, Jwt, Mail, Config) được inject dưới dạng mock object |
| 8.5 | Service test pattern — mock DB layer, test business logic | AuthService là service layer; PrismaService (DB) hoàn toàn mock |
| 8.7 | Code coverage — đo lường mức độ bao phủ | `npm run test:cov` cho kết quả 97% Stmts, 100% Funcs, 96.9% Lines |

## 6. Nhận xét và đánh giá

Bài kiểm thử AuthService đạt kết quả tốt với 16/16 test case passed và code coverage cao (97% statements, 100% functions). Các test case bao phủ đầy đủ cả luồng thành công và các trường hợp lỗi cho tất cả 6 phương thức public của service, bao gồm các tình huống quan trọng như trùng email khi đăng ký, sai mật khẩu khi đăng nhập, token hết hạn hoặc bị thu hồi, và reset token không hợp lệ.

Điểm mạnh của bài test nằm ở việc mock được thiết kế sát với thực tế — chỉ mock đúng những method mà AuthService thực sự gọi, sử dụng đúng tên method (ví dụ `sendPasswordResetEmail` thay vì `sendVerificationEmail`), và assert đúng loại exception mà source code throw (ví dụ `ConflictException` cho duplicate email thay vì `BadRequestException`). Việc mock bcrypt và crypto ở cấp module giúp test chạy nhanh và deterministic mà không phụ thuộc vào thuật toán hash thật.

Branch coverage đạt 81.81% — thấp hơn so với các chỉ số khác — do 2 nhánh edge case chưa được test: catch block khi JWT verify thất bại ở bước signature và guard clause khi thiếu biến môi trường JWT. Đây là những tình huống hiếm gặp trong thực tế nhưng có thể bổ sung thêm test case để đạt coverage toàn diện hơn nếu cần.
