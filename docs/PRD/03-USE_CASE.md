# USE CASE SPECIFICATION
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 2.0
> **Ngày cập nhật:** 27/03/2026
> **Tổng số Use Case:** 60
> **Note:** Use cases now aligned with 36 Sequence Diagrams (individual flows)

---

## 1. DANH SÁCH ACTORS

| Actor | Mô tả | Kế thừa từ |
|-------|-------|------------|
| **Guest** | Người chưa đăng nhập, chỉ có thể đăng ký/đăng nhập | - |
| **User** | Người dùng đã đăng nhập vào hệ thống | Guest |
| **Member** | Thành viên của một workspace cụ thể | User |
| **Admin** | Quản trị viên workspace, có quyền quản lý thành viên | Member |
| **Owner** | Chủ sở hữu workspace, có toàn quyền | Admin |

---

## 2. USE CASE DIAGRAM - TỔNG QUAN

```
                                    ┌─────────────────────────────────────────────┐
                                    │           TODOLIST COLLABORATION            │
                                    └─────────────────────────────────────────────┘
                                                         │
         ┌───────────────┬───────────────┬───────────────┼───────────────┬───────────────┬───────────────┐
         ▼               ▼               ▼               ▼               ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │  Auth   │    │  User   │    │Workspace│    │ Project │    │  Task   │    │ Comment │    │ Notif   │
    │ Module  │    │ Module  │    │ Module  │    │ Module  │    │ Module  │    │ Module  │    │ Module  │
    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
         │               │               │               │               │               │               │
      6 UCs           4 UCs          10 UCs           8 UCs          18 UCs           5 UCs           4 UCs


    ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  Guest  │────────▶│  User   │────────▶│ Member  │────────▶│  Admin  │────────▶│  Owner  │
    └─────────┘         └─────────┘         └─────────┘         └─────────┘         └─────────┘
```

---

## 3. ĐẶC TẢ USE CASE CHI TIẾT

---

### 3.1. MODULE AUTHENTICATION (6 Use Cases)

#### UC01: Đăng ký tài khoản

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC01 |
| **Tên** | Đăng ký tài khoản |
| **Actor** | Guest |
| **Mô tả** | Cho phép người dùng mới tạo tài khoản trong hệ thống |
| **Tiền điều kiện** | Người dùng chưa có tài khoản |
| **Hậu điều kiện** | Tài khoản mới được tạo, email xác thực được gửi |

**Luồng chính (Main Flow):**
1. Guest truy cập trang đăng ký
2. Hệ thống hiển thị form đăng ký
3. Guest nhập thông tin: email, mật khẩu, tên hiển thị
4. Guest nhấn nút "Đăng ký"
5. Hệ thống validate thông tin
6. Hệ thống tạo tài khoản mới
7. Hệ thống gửi email xác thực
8. Hệ thống hiển thị thông báo thành công

**Luồng thay thế (Alternative Flow):**
- 5a. Email đã tồn tại → Hiển thị lỗi "Email đã được sử dụng"
- 5b. Mật khẩu không đủ mạnh → Hiển thị yêu cầu mật khẩu

**Luồng ngoại lệ (Exception Flow):**
- E1. Lỗi kết nối server → Hiển thị thông báo lỗi

---

#### UC02: Đăng nhập

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC02 |
| **Tên** | Đăng nhập |
| **Actor** | Guest |
| **Mô tả** | Cho phép người dùng đăng nhập vào hệ thống |
| **Tiền điều kiện** | Người dùng đã có tài khoản |
| **Hậu điều kiện** | Người dùng được xác thực, nhận JWT token |

**Luồng chính:**
1. Guest truy cập trang đăng nhập
2. Hệ thống hiển thị form đăng nhập
3. Guest nhập email và mật khẩu
4. Guest nhấn nút "Đăng nhập"
5. Hệ thống xác thực thông tin
6. Hệ thống tạo JWT access token và refresh token
7. Hệ thống chuyển hướng đến Dashboard

**Luồng thay thế:**
- 5a. Email không tồn tại → "Tài khoản không tồn tại"
- 5b. Mật khẩu sai → "Mật khẩu không chính xác"
- 5c. Tài khoản bị khóa → "Tài khoản đã bị khóa"

---

#### UC03: Đăng xuất

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC03 |
| **Tên** | Đăng xuất |
| **Actor** | User |
| **Mô tả** | Cho phép người dùng đăng xuất khỏi hệ thống |
| **Tiền điều kiện** | Người dùng đã đăng nhập |
| **Hậu điều kiện** | Token bị vô hiệu hóa, chuyển về trang đăng nhập |

**Luồng chính:**
1. User nhấn nút "Đăng xuất"
2. Hệ thống vô hiệu hóa refresh token
3. Hệ thống xóa token khỏi client
4. Hệ thống chuyển hướng về trang đăng nhập

---

#### UC04: Quên mật khẩu

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC04 |
| **Tên** | Quên mật khẩu |
| **Actor** | Guest |
| **Mô tả** | Cho phép người dùng yêu cầu đặt lại mật khẩu |
| **Tiền điều kiện** | Người dùng có tài khoản nhưng quên mật khẩu |
| **Hậu điều kiện** | Email chứa link đặt lại mật khẩu được gửi |

**Luồng chính:**
1. Guest nhấn "Quên mật khẩu"
2. Hệ thống hiển thị form nhập email
3. Guest nhập email đã đăng ký
4. Hệ thống kiểm tra email tồn tại
5. Hệ thống tạo token reset password
6. Hệ thống gửi email chứa link reset
7. Hiển thị thông báo "Vui lòng kiểm tra email"

**Luồng thay thế:**
- 4a. Email không tồn tại → Vẫn hiển thị thông báo thành công (bảo mật)

---

#### UC05: Đặt lại mật khẩu

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC05 |
| **Tên** | Đặt lại mật khẩu |
| **Actor** | Guest |
| **Mô tả** | Cho phép người dùng đặt mật khẩu mới |
| **Tiền điều kiện** | Người dùng có link reset password hợp lệ |
| **Hậu điều kiện** | Mật khẩu được cập nhật |

**Luồng chính:**
1. Guest click vào link trong email
2. Hệ thống validate token
3. Hệ thống hiển thị form nhập mật khẩu mới
4. Guest nhập mật khẩu mới và xác nhận
5. Hệ thống cập nhật mật khẩu
6. Hệ thống vô hiệu hóa token reset
7. Chuyển hướng đến trang đăng nhập

**Luồng thay thế:**
- 2a. Token hết hạn → "Link đã hết hạn, vui lòng yêu cầu lại"
- 2b. Token không hợp lệ → "Link không hợp lệ"

---

#### UC06: Refresh Token

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC06 |
| **Tên** | Refresh Token |
| **Actor** | User |
| **Mô tả** | Làm mới access token khi hết hạn |
| **Tiền điều kiện** | Access token hết hạn, refresh token còn hiệu lực |
| **Hậu điều kiện** | Access token mới được cấp |

**Luồng chính:**
1. Client gửi request với access token hết hạn
2. Server trả về 401 Unauthorized
3. Client gửi refresh token
4. Server validate refresh token
5. Server cấp access token mới
6. Client tiếp tục request ban đầu

---

### 3.2. MODULE USER MANAGEMENT (4 Use Cases)

#### UC07: Xem thông tin cá nhân

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC07 |
| **Tên** | Xem thông tin cá nhân |
| **Actor** | User |
| **Mô tả** | Xem thông tin profile của bản thân |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Hiển thị thông tin profile |

**Luồng chính:**
1. User truy cập trang Profile
2. Hệ thống lấy thông tin user từ database
3. Hệ thống hiển thị: tên, email, avatar, ngày tạo, lần đăng nhập cuối

---

#### UC08: Cập nhật thông tin cá nhân

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC08 |
| **Tên** | Cập nhật thông tin cá nhân |
| **Actor** | User |
| **Mô tả** | Chỉnh sửa thông tin profile |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Thông tin được cập nhật |

**Luồng chính:**
1. User truy cập trang Profile
2. User nhấn "Chỉnh sửa"
3. User sửa thông tin (tên, ...)
4. User nhấn "Lưu"
5. Hệ thống validate và cập nhật
6. Hiển thị thông báo thành công

---

#### UC09: Đổi mật khẩu

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC09 |
| **Tên** | Đổi mật khẩu |
| **Actor** | User |
| **Mô tả** | Thay đổi mật khẩu đăng nhập |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Mật khẩu được thay đổi |

**Luồng chính:**
1. User truy cập trang đổi mật khẩu
2. User nhập: mật khẩu cũ, mật khẩu mới, xác nhận
3. Hệ thống verify mật khẩu cũ
4. Hệ thống cập nhật mật khẩu mới
5. Hiển thị thông báo thành công

**Luồng thay thế:**
- 3a. Mật khẩu cũ không đúng → "Mật khẩu hiện tại không chính xác"

---

#### UC10: Upload ảnh đại diện

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC10 |
| **Tên** | Upload ảnh đại diện |
| **Actor** | User |
| **Mô tả** | Thay đổi avatar profile |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Avatar mới được lưu |

**Luồng chính:**
1. User nhấn vào avatar
2. User chọn file ảnh từ máy tính
3. Hệ thống validate file (loại, kích thước)
4. Hệ thống upload và lưu URL
5. Hệ thống cập nhật avatar
6. Hiển thị avatar mới

**Luồng thay thế:**
- 3a. File không phải ảnh → "Vui lòng chọn file ảnh"
- 3b. File quá lớn (>5MB) → "Kích thước file tối đa 5MB"

---

### 3.3. MODULE WORKSPACE MANAGEMENT (10 Use Cases)

#### UC11: Tạo workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC11 |
| **Tên** | Tạo workspace |
| **Actor** | User |
| **Mô tả** | Tạo không gian làm việc nhóm mới |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Workspace mới được tạo, User là Owner |

**Luồng chính:**
1. User nhấn "Tạo Workspace"
2. Hệ thống hiển thị form
3. User nhập tên và mô tả
4. User nhấn "Tạo"
5. Hệ thống tạo workspace
6. Hệ thống gán User là Owner
7. Chuyển hướng đến workspace mới

---

#### UC12: Xem danh sách workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC12 |
| **Tên** | Xem danh sách workspace |
| **Actor** | User |
| **Mô tả** | Xem tất cả workspace mà user tham gia |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | Hiển thị danh sách workspace |

**Luồng chính:**
1. User truy cập trang chủ
2. Hệ thống lấy danh sách workspace user tham gia
3. Hiển thị danh sách với tên, vai trò, số thành viên

---

#### UC13: Xem chi tiết workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC13 |
| **Tên** | Xem chi tiết workspace |
| **Actor** | Member |
| **Mô tả** | Xem thông tin và nội dung workspace |
| **Tiền điều kiện** | User là thành viên của workspace |
| **Hậu điều kiện** | Hiển thị dashboard workspace |

**Luồng chính:**
1. Member click vào workspace
2. Hệ thống verify quyền truy cập
3. Hệ thống hiển thị dashboard: projects, members, activities

**Luồng thay thế:**
- 2a. Không phải member → "Bạn không có quyền truy cập"

---

#### UC14: Cập nhật workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC14 |
| **Tên** | Cập nhật workspace |
| **Actor** | Owner, Admin |
| **Mô tả** | Chỉnh sửa thông tin workspace |
| **Tiền điều kiện** | User là Owner hoặc Admin |
| **Hậu điều kiện** | Thông tin workspace được cập nhật |

**Luồng chính:**
1. Owner/Admin vào Settings
2. Owner/Admin sửa tên, mô tả
3. Nhấn "Lưu"
4. Hệ thống cập nhật và thông báo thành công

---

#### UC15: Xóa workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC15 |
| **Tên** | Xóa workspace |
| **Actor** | Owner |
| **Mô tả** | Xóa vĩnh viễn workspace |
| **Tiền điều kiện** | User là Owner |
| **Hậu điều kiện** | Workspace và tất cả dữ liệu bị xóa |

**Luồng chính:**
1. Owner vào Settings
2. Owner nhấn "Xóa Workspace"
3. Hệ thống hiển thị cảnh báo xác nhận
4. Owner nhập tên workspace để xác nhận
5. Hệ thống xóa workspace và dữ liệu
6. Chuyển hướng về trang chủ

---

#### UC16: Mời thành viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC16 |
| **Tên** | Mời thành viên |
| **Actor** | Owner, Admin |
| **Mô tả** | Gửi lời mời tham gia workspace |
| **Tiền điều kiện** | User là Owner hoặc Admin |
| **Hậu điều kiện** | Lời mời được gửi qua email |

**Luồng chính:**
1. Owner/Admin vào Settings → Members
2. Nhấn "Mời thành viên"
3. Nhập email người được mời
4. Chọn vai trò (Admin/Member)
5. Nhấn "Gửi lời mời"
6. Hệ thống gửi email mời
7. Hiển thị thông báo "Đã gửi lời mời"

**Luồng thay thế:**
- 3a. Email đã là thành viên → "Người này đã là thành viên"

---

#### UC17: Chấp nhận lời mời

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC17 |
| **Tên** | Chấp nhận lời mời |
| **Actor** | User |
| **Mô tả** | Chấp nhận tham gia workspace |
| **Tiền điều kiện** | User có lời mời hợp lệ |
| **Hậu điều kiện** | User trở thành member của workspace |

**Luồng chính:**
1. User click link trong email mời
2. Hệ thống validate lời mời
3. Hệ thống thêm user vào workspace
4. Chuyển hướng đến workspace

**Luồng thay thế:**
- 2a. Lời mời hết hạn → "Lời mời đã hết hạn"
- 2b. User chưa đăng nhập → Chuyển đến đăng nhập, sau đó quay lại

---

#### UC18: Quản lý vai trò thành viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC18 |
| **Tên** | Quản lý vai trò thành viên |
| **Actor** | Owner, Admin |
| **Mô tả** | Thay đổi vai trò của thành viên |
| **Tiền điều kiện** | User là Owner hoặc Admin |
| **Hậu điều kiện** | Vai trò thành viên được cập nhật |

**Luồng chính:**
1. Owner/Admin vào Settings → Members
2. Click vào thành viên cần thay đổi
3. Chọn vai trò mới (Admin/Member)
4. Nhấn "Cập nhật"
5. Hệ thống cập nhật vai trò

**Ràng buộc:**
- Admin không thể thay đổi vai trò của Owner
- Admin không thể nâng cấp Member thành Admin (chỉ Owner)

---

#### UC19: Xóa thành viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC19 |
| **Tên** | Xóa thành viên |
| **Actor** | Owner, Admin |
| **Mô tả** | Xóa thành viên khỏi workspace |
| **Tiền điều kiện** | User là Owner hoặc Admin |
| **Hậu điều kiện** | Thành viên bị xóa khỏi workspace |

**Luồng chính:**
1. Owner/Admin vào Settings → Members
2. Click "Xóa" bên cạnh thành viên
3. Xác nhận xóa
4. Hệ thống xóa thành viên
5. Thông báo cho thành viên bị xóa

**Ràng buộc:**
- Không thể xóa Owner
- Admin không thể xóa Admin khác

---

#### UC20: Rời khỏi workspace

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC20 |
| **Tên** | Rời khỏi workspace |
| **Actor** | Member |
| **Mô tả** | Tự rời khỏi workspace |
| **Tiền điều kiện** | User là Member (không phải Owner) |
| **Hậu điều kiện** | User không còn là thành viên |

**Luồng chính:**
1. Member vào Settings
2. Nhấn "Rời khỏi workspace"
3. Xác nhận
4. Hệ thống xóa member
5. Chuyển hướng về trang chủ

**Ràng buộc:**
- Owner không thể rời (phải chuyển quyền trước)

---

### 3.4. MODULE PROJECT MANAGEMENT (8 Use Cases)

#### UC21: Tạo project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC21 |
| **Tên** | Tạo project |
| **Actor** | Member |
| **Mô tả** | Tạo dự án mới trong workspace |
| **Tiền điều kiện** | User là member của workspace |
| **Hậu điều kiện** | Project mới được tạo |

**Luồng chính:**
1. Member nhấn "Tạo Project"
2. Nhập tên, mô tả, chọn màu
3. Nhấn "Tạo"
4. Hệ thống tạo project
5. Chuyển đến project mới

---

#### UC22: Xem danh sách project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC22 |
| **Tên** | Xem danh sách project |
| **Actor** | Member |
| **Tiền điều kiện** | User là member của workspace |
| **Hậu điều kiện** | Hiển thị danh sách projects |

**Luồng chính:**
1. Member truy cập workspace
2. Hệ thống hiển thị danh sách projects (active, pinned, archived)

---

#### UC23: Xem chi tiết project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC23 |
| **Tên** | Xem chi tiết project |
| **Actor** | Member |
| **Tiền điều kiện** | User là member của workspace |
| **Hậu điều kiện** | Hiển thị Kanban board với tasks |

**Luồng chính:**
1. Member click vào project
2. Hệ thống hiển thị Kanban board (TODO, IN_PROGRESS, REVIEW, DONE)

---

#### UC24: Cập nhật project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC24 |
| **Tên** | Cập nhật project |
| **Actor** | Member |
| **Tiền điều kiện** | User là member |
| **Hậu điều kiện** | Thông tin project được cập nhật |

---

#### UC25: Xóa project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC25 |
| **Tên** | Xóa project |
| **Actor** | Owner, Admin |
| **Tiền điều kiện** | User là Owner hoặc Admin |
| **Hậu điều kiện** | Project bị xóa vĩnh viễn |

---

#### UC26: Lưu trữ project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC26 |
| **Tên** | Lưu trữ project |
| **Actor** | Member |
| **Mô tả** | Đánh dấu project là archived |
| **Hậu điều kiện** | Project chuyển sang trạng thái archived |

---

#### UC27: Khôi phục project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC27 |
| **Tên** | Khôi phục project |
| **Actor** | Member |
| **Mô tả** | Khôi phục project từ archived |
| **Hậu điều kiện** | Project chuyển về trạng thái active |

---

#### UC28: Ghim project

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC28 |
| **Tên** | Ghim project |
| **Actor** | Member |
| **Mô tả** | Đánh dấu project quan trọng để truy cập nhanh |
| **Hậu điều kiện** | Project hiển thị ở đầu danh sách |

---

### 3.5. MODULE TASK MANAGEMENT ⭐ (18 Use Cases)

#### UC29: Tạo task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC29 |
| **Tên** | Tạo task |
| **Actor** | Member |
| **Mô tả** | Tạo công việc mới trong project |
| **Tiền điều kiện** | User là member, project đang active |
| **Hậu điều kiện** | Task mới được tạo với trạng thái TODO |

**Luồng chính:**
1. Member nhấn "+" trong cột TODO
2. Nhập tiêu đề task
3. (Optional) Nhập mô tả, deadline, priority
4. Nhấn "Tạo"
5. Task xuất hiện trong cột TODO

---

#### UC30: Xem danh sách task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC30 |
| **Tên** | Xem danh sách task |
| **Actor** | Member |
| **Mô tả** | Xem tất cả tasks trong project dạng Kanban |
| **Hậu điều kiện** | Hiển thị Kanban board với tasks theo cột |

---

#### UC31: Xem chi tiết task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC31 |
| **Tên** | Xem chi tiết task |
| **Actor** | Member |
| **Mô tả** | Xem đầy đủ thông tin của task |
| **Hậu điều kiện** | Modal/Page hiển thị: tiêu đề, mô tả, subtasks, comments, attachments |

---

#### UC32: Cập nhật task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC32 |
| **Tên** | Cập nhật task |
| **Actor** | Member |
| **Mô tả** | Chỉnh sửa thông tin task |
| **Hậu điều kiện** | Task được cập nhật, activity log ghi nhận |

---

#### UC33: Xóa task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC33 |
| **Tên** | Xóa task |
| **Actor** | Member |
| **Mô tả** | Xóa vĩnh viễn task |
| **Hậu điều kiện** | Task và subtasks, comments, attachments bị xóa |

---

#### UC34: Thay đổi trạng thái task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC34 |
| **Tên** | Thay đổi trạng thái task |
| **Actor** | Member |
| **Mô tả** | Di chuyển task giữa các cột Kanban |
| **Hậu điều kiện** | Trạng thái task được cập nhật |

**Luồng chính:**
1. Member kéo thả task sang cột khác
2. Hệ thống cập nhật trạng thái
3. Nếu DONE → ghi nhận completedAt
4. Gửi notification cho người được gán

---

#### UC35: Gán task cho thành viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC35 |
| **Tên** | Gán task cho thành viên |
| **Actor** | Member |
| **Mô tả** | Phân công task cho một hoặc nhiều thành viên |
| **Hậu điều kiện** | Member được gán nhận notification |

**Luồng chính:**
1. Member mở chi tiết task
2. Click vào "Assignees"
3. Chọn thành viên từ danh sách
4. Hệ thống gán task
5. Gửi notification cho người được gán

---

#### UC36: Hủy gán task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC36 |
| **Tên** | Hủy gán task |
| **Actor** | Member |
| **Mô tả** | Bỏ phân công task khỏi thành viên |

---

#### UC37: Đặt độ ưu tiên

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC37 |
| **Tên** | Đặt độ ưu tiên |
| **Actor** | Member |
| **Mô tả** | Thiết lập mức độ ưu tiên: LOW, NORMAL, HIGH, URGENT |

---

#### UC38: Đặt deadline

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC38 |
| **Tên** | Đặt deadline |
| **Actor** | Member |
| **Mô tả** | Thiết lập ngày đến hạn |
| **Hậu điều kiện** | Reminder notification sẽ được gửi trước deadline |

---

#### UC39: Tạo subtask

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC39 |
| **Tên** | Tạo subtask |
| **Actor** | Member |
| **Mô tả** | Chia nhỏ task thành các công việc con |

**Luồng chính:**
1. Member mở chi tiết task
2. Nhấn "Thêm subtask"
3. Nhập tiêu đề subtask
4. Subtask được thêm vào danh sách

---

#### UC40: Hoàn thành subtask

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC40 |
| **Tên** | Hoàn thành subtask |
| **Actor** | Member |
| **Mô tả** | Đánh dấu subtask hoàn thành |

---

#### UC41: Xóa subtask

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC41 |
| **Tên** | Xóa subtask |
| **Actor** | Member |

---

#### UC42: Thêm nhãn (label)

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC42 |
| **Tên** | Thêm nhãn |
| **Actor** | Member |
| **Mô tả** | Gắn label để phân loại task |

---

#### UC43: Xóa nhãn

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC43 |
| **Tên** | Xóa nhãn |
| **Actor** | Member |

---

#### UC44: Upload file đính kèm

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC44 |
| **Tên** | Upload file đính kèm |
| **Actor** | Member |
| **Mô tả** | Đính kèm file vào task |
| **Ràng buộc** | Max 10MB per file |

---

#### UC45: Xóa file đính kèm

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC45 |
| **Tên** | Xóa file đính kèm |
| **Actor** | Member |

---

#### UC46: Kéo thả sắp xếp task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC46 |
| **Tên** | Kéo thả sắp xếp task |
| **Actor** | Member |
| **Mô tả** | Sắp xếp lại thứ tự task trong cùng cột |

---

### 3.6. MODULE COMMENT MANAGEMENT (5 Use Cases)

#### UC47: Thêm bình luận

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC47 |
| **Tên** | Thêm bình luận |
| **Actor** | Member |
| **Mô tả** | Viết bình luận trên task |
| **Hậu điều kiện** | Comment được thêm, notification gửi đến người được gán |

---

#### UC48: Sửa bình luận

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC48 |
| **Tên** | Sửa bình luận |
| **Actor** | Author (người viết) |
| **Mô tả** | Chỉnh sửa nội dung comment của mình |

---

#### UC49: Xóa bình luận

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC49 |
| **Tên** | Xóa bình luận |
| **Actor** | Author, Admin |

---

#### UC50: Trả lời bình luận

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC50 |
| **Tên** | Trả lời bình luận |
| **Actor** | Member |
| **Mô tả** | Reply một comment hiện có |

---

#### UC51: Đề cập (@mention)

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC51 |
| **Tên** | Đề cập (@mention) |
| **Actor** | Member |
| **Mô tả** | Mention user trong comment bằng @username |
| **Hậu điều kiện** | User được mention nhận notification |

---

### 3.7. MODULE NOTIFICATION (4 Use Cases)

#### UC52: Xem danh sách thông báo

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC52 |
| **Tên** | Xem danh sách thông báo |
| **Actor** | User |
| **Mô tả** | Xem tất cả notifications |

---

#### UC53: Đánh dấu đã đọc

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC53 |
| **Tên** | Đánh dấu đã đọc |
| **Actor** | User |

---

#### UC54: Đánh dấu tất cả đã đọc

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC54 |
| **Tên** | Đánh dấu tất cả đã đọc |
| **Actor** | User |

---

#### UC55: Cài đặt thông báo

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC55 |
| **Tên** | Cài đặt thông báo |
| **Actor** | User |
| **Mô tả** | Bật/tắt từng loại notification |

---

### 3.8. MODULE SEARCH & FILTER (5 Use Cases)

#### UC56: Tìm kiếm task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC56 |
| **Tên** | Tìm kiếm task |
| **Actor** | Member |
| **Mô tả** | Full-text search theo tiêu đề, mô tả |

---

#### UC57: Lọc task theo trạng thái

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC57 |
| **Tên** | Lọc task theo trạng thái |
| **Actor** | Member |

---

#### UC58: Lọc task theo người gán

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC58 |
| **Tên** | Lọc task theo người gán |
| **Actor** | Member |

---

#### UC59: Lọc task theo deadline

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC59 |
| **Tên** | Lọc task theo deadline |
| **Actor** | Member |
| **Mô tả** | Lọc: hôm nay, tuần này, quá hạn, không có deadline |

---

#### UC60: Sắp xếp task

| Thuộc tính | Mô tả |
|------------|-------|
| **Mã UC** | UC60 |
| **Tên** | Sắp xếp task |
| **Actor** | Member |
| **Mô tả** | Sort theo: ngày tạo, deadline, priority, tên |

---

## 4. TỔNG HỢP USE CASE THEO ACTOR

| Actor | Use Cases | Số lượng |
|-------|-----------|----------|
| **Guest** | UC01, UC02, UC04, UC05 | 4 |
| **User** | UC03, UC06, UC07-UC10, UC11-UC12, UC52-UC55 | 12 |
| **Member** | UC13, UC17, UC20-UC51, UC56-UC60 | 40 |
| **Admin** | UC14, UC16, UC18, UC19, UC25, UC49 | 6 |
| **Owner** | UC15 | 1 |
| | **TỔNG CỘNG** | **60** (có overlap) |

---

## 5. MA TRẬN USE CASE - ACTOR

| Use Case | Guest | User | Member | Admin | Owner |
|----------|-------|------|--------|-------|-------|
| UC01-UC02, UC04-UC05 | ✓ | | | | |
| UC03, UC06-UC10 | | ✓ | ✓ | ✓ | ✓ |
| UC11-UC12 | | ✓ | ✓ | ✓ | ✓ |
| UC13, UC17, UC20-UC51 | | | ✓ | ✓ | ✓ |
| UC14, UC16, UC18-UC19 | | | | ✓ | ✓ |
| UC15 | | | | | ✓ |
| UC52-UC55 | | ✓ | ✓ | ✓ | ✓ |
| UC56-UC60 | | | ✓ | ✓ | ✓ |

---

## 6. MAPPING USE CASES TO SEQUENCE DIAGRAMS

Each Use Case has a corresponding Sequence Diagram showing the detailed flow:

| UC Category | Use Cases | Sequence Diagrams | Count |
|-------------|-----------|------------------|-------|
| **Authentication** | UC01-UC06 | SD1-SD6 (User Registration, Login, OAuth, Forgot, Reset, Refresh) | 6 |
| **User Management** | UC07-UC10 | SD7-SD10 (View Profile, Update, Change Password, Upload Avatar) | 4 |
| **Workspace** | UC11-UC20 | SD11-SD16 (Create, List, Invite, Accept, Role, Remove) | 6 |
| **Project** | UC21-UC28 | SD17-SD19 (Create, View Kanban, Archive) | 3 |
| **Task** | UC29-UC46 | SD20-SD27 (Create, Update, Status, Assign, Unassign, Subtasks, Labels, My Tasks) | 8 |
| **Comment** | UC47-UC51 | SD28-SD30 (Add, Reply, Edit/Delete) | 3 |
| **Notification** | UC52-UC55 | SD31-SD34 (View, Mark Read, Mark All, Real-time) | 4 |
| **Search & Filter** | UC56-UC60 | – (Advanced features shown in Task flows) | – |
| **Attachment** | (implicitly UC44-UC45) | SD35-SD36 (Upload, Delete) | 2 |

**Total: 60 UCs → 36 Sequence Diagrams + Advanced Filtering patterns**

---

## 7. NOTES FOR DEVELOPMENT

### Role-Based Access Control (RBAC)
- **Guest**: Can register, login, forgot/reset password
- **User**: Personal operations (profile, preferences)
- **Member**: Can view/interact with workspace content
- **Admin**: Can manage members and workspace settings
- **Owner**: Can transfer ownership, delete workspace

### Key Business Rules Documented
1. **Workspace**: Only Owner can delete, Only OWNER/ADMIN can invite
2. **Task**: Created by any member, can assign to others
3. **Token Management**: Access token (15min), Refresh token (7 days), blacklist on logout
4. **Cascade Delete**: Deleting workspace deletes all projects/tasks/comments
5. **Permissions**: Always verify membership before allowing operations

### Implementation Priority
1. **Phase 1 (Auth)**: UC01-UC06
2. **Phase 2 (User)**: UC07-UC10
3. **Phase 3 (Workspace)**: UC11-UC20
4. **Phase 4 (Project)**: UC21-UC28
5. **Phase 5 (Task)**: UC29-UC46
6. **Phase 6 (Comment)**: UC47-UC51
7. **Phase 7 (Notification)**: UC52-UC55
8. **Phase 8 (Search)**: UC56-UC60
