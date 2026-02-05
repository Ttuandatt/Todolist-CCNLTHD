# DANH SÁCH CHỨC NĂNG - TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Tổng số chức năng:** 72  
> **Phương pháp ưu tiên:** MoSCoW (Must/Should/Could/Won't)

---

## 📊 TỔNG QUAN THEO MODULE

| STT | Module | Số chức năng | Must | Should | Could |
|-----|--------|--------------|------|--------|-------|
| 1 | Authentication | 8 | 6 | 2 | 0 |
| 2 | User Management | 6 | 4 | 2 | 0 |
| 3 | Workspace | 12 | 8 | 3 | 1 |
| 4 | Project | 8 | 5 | 2 | 1 |
| 5 | Task | 18 | 12 | 4 | 2 |
| 6 | Comment | 6 | 4 | 2 | 0 |
| 7 | Notification | 8 | 5 | 3 | 0 |
| 8 | Dashboard & Search | 6 | 4 | 2 | 0 |
| **Total** | **8 modules** | **72** | **48** | **20** | **4** |

---

## 1. MODULE AUTHENTICATION (8 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F1.1 | Đăng ký tài khoản | Tạo tài khoản mới với email/password | **Must** | Guest |
| F1.2 | Đăng nhập | Xác thực email/password, trả JWT token | **Must** | Guest |
| F1.3 | Đăng xuất | Vô hiệu hóa token, kết thúc phiên | **Must** | User |
| F1.4 | Quên mật khẩu | Gửi email chứa link reset password | **Must** | Guest |
| F1.5 | Đặt lại mật khẩu | Đặt password mới qua link email | **Must** | Guest |
| F1.6 | Refresh Token | Làm mới access token khi hết hạn | **Must** | System |
| F1.7 | OAuth Google | Đăng nhập/đăng ký qua Google | Should | Guest |
| F1.8 | OAuth GitHub | Đăng nhập/đăng ký qua GitHub | Should | Guest |

---

## 2. MODULE USER MANAGEMENT (6 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F2.1 | Xem thông tin cá nhân | Hiển thị profile: name, email, avatar | **Must** | User |
| F2.2 | Cập nhật profile | Sửa tên hiển thị | **Must** | User |
| F2.3 | Đổi mật khẩu | Thay đổi password (cần nhập password cũ) | **Must** | User |
| F2.4 | Upload avatar | Tải lên ảnh đại diện (max 5MB, jpg/png) | **Must** | User |
| F2.5 | Xem lịch sử đăng nhập | Hiển thị thời gian đăng nhập gần nhất | Should | User |
| F2.6 | Xóa tài khoản | Xóa vĩnh viễn tài khoản và dữ liệu | Should | User |

---

## 3. MODULE WORKSPACE (12 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F3.1 | Tạo workspace | Tạo không gian làm việc nhóm mới | **Must** | User |
| F3.2 | Xem danh sách workspace | Liệt kê tất cả workspace tham gia | **Must** | User |
| F3.3 | Xem chi tiết workspace | Hiển thị dashboard, projects, members | **Must** | Member |
| F3.4 | Cập nhật workspace | Sửa tên, mô tả workspace | **Must** | Owner, Admin |
| F3.5 | Xóa workspace | Xóa workspace và tất cả dữ liệu con | **Must** | Owner |
| F3.6 | Mời thành viên | Gửi invitation qua email | **Must** | Owner, Admin |
| F3.7 | Chấp nhận lời mời | Join workspace qua link email | **Must** | User |
| F3.8 | Quản lý vai trò | Thay đổi role: Member ↔ Admin | **Must** | Owner |
| F3.9 | Xóa thành viên | Kick member khỏi workspace | Should | Owner, Admin |
| F3.10 | Rời khỏi workspace | Tự rời workspace (không áp dụng Owner) | Should | Member, Admin |
| F3.11 | Chuyển quyền Owner | Transfer ownership cho member khác | Should | Owner |
| F3.12 | Xem activity log workspace | Lịch sử hoạt động trong workspace | Could | Member |

---

## 4. MODULE PROJECT (8 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F4.1 | Tạo project | Tạo dự án mới trong workspace | **Must** | Member |
| F4.2 | Xem danh sách project | Liệt kê projects trong workspace | **Must** | Member |
| F4.3 | Xem chi tiết project | Hiển thị Kanban board với tasks | **Must** | Member |
| F4.4 | Cập nhật project | Sửa tên, mô tả, màu project | **Must** | Member |
| F4.5 | Xóa project | Xóa project và tất cả tasks | **Must** | Owner, Admin |
| F4.6 | Lưu trữ project | Archive project đã hoàn thành | Should | Member |
| F4.7 | Khôi phục project | Restore project từ archive | Should | Member |
| F4.8 | Ghim project | Pin project lên đầu danh sách | Could | Member |

---

## 5. MODULE TASK ⭐ (18 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F5.1 | Tạo task | Tạo công việc mới trong project | **Must** | Member |
| F5.2 | Xem danh sách task | Hiển thị tasks theo Kanban/List view | **Must** | Member |
| F5.3 | Xem chi tiết task | Hiển thị full info: subtasks, comments, attachments | **Must** | Member |
| F5.4 | Cập nhật task | Sửa title, description | **Must** | Member |
| F5.5 | Xóa task | Xóa task và dữ liệu liên quan | **Must** | Member |
| F5.6 | Thay đổi trạng thái | TODO → IN_PROGRESS → REVIEW → DONE | **Must** | Member |
| F5.7 | Gán người thực hiện | Assign task cho members | **Must** | Member |
| F5.8 | Hủy gán | Unassign member khỏi task | **Must** | Member |
| F5.9 | Đặt độ ưu tiên | Set priority: LOW/NORMAL/HIGH/URGENT | **Must** | Member |
| F5.10 | Đặt deadline | Set due date cho task | **Must** | Member |
| F5.11 | Tạo subtask | Chia nhỏ task thành subtasks | **Must** | Member |
| F5.12 | Hoàn thành subtask | Toggle complete subtask | **Must** | Member |
| F5.13 | Thêm label | Gắn nhãn phân loại (workspace-level) | Should | Member |
| F5.14 | Upload attachment | Đính kèm file (max 10MB) | Should | Member |
| F5.15 | Xóa attachment | Xóa file đính kèm | Should | Member |
| F5.16 | Kéo thả sắp xếp | Drag & drop trong Kanban | Should | Member |
| F5.17 | Duplicate task | Copy task | Could | Member |
| F5.18 | Di chuyển task | Move task sang project khác | Could | Member |

---

## 6. MODULE COMMENT (6 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F6.1 | Thêm comment | Viết bình luận vào task | **Must** | Member |
| F6.2 | Xem comments | Hiển thị danh sách comments | **Must** | Member |
| F6.3 | Sửa comment | Chỉnh sửa comment của mình | **Must** | Member |
| F6.4 | Xóa comment | Xóa comment (owner hoặc admin) | **Must** | Member, Admin |
| F6.5 | Mention user | @username để notify | Should | Member |
| F6.6 | Reply comment | Trả lời comment (threaded) | Should | Member |

---

## 7. MODULE NOTIFICATION (8 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F7.1 | Xem thông báo | Hiển thị danh sách notifications | **Must** | User |
| F7.2 | Đánh dấu đã đọc | Mark notification as read | **Must** | User |
| F7.3 | Đánh dấu tất cả đã đọc | Mark all as read | **Must** | User |
| F7.4 | Thông báo assign | Notify khi được gán task | **Must** | System |
| F7.5 | Thông báo mention | Notify khi được @mention | **Must** | System |
| F7.6 | Thông báo deadline | Reminder trước deadline | Should | System |
| F7.7 | Thông báo comment | Notify khi có comment mới | Should | System |
| F7.8 | Cài đặt notification | Bật/tắt từng loại thông báo | Should | User |

---

## 8. MODULE DASHBOARD & SEARCH (6 chức năng)

| ID | Chức năng | Mô tả | Priority | Actor |
|----|-----------|-------|----------|-------|
| F8.1 | My Tasks | Xem tất cả tasks được gán cho mình | **Must** | User |
| F8.2 | Due Today | Filter tasks deadline hôm nay | **Must** | User |
| F8.3 | Overdue Tasks | Filter tasks quá hạn | **Must** | User |
| F8.4 | Tiến độ project | Hiển thị progress % | **Must** | Member |
| F8.5 | Tìm kiếm task | Full-text search trong project | Should | Member |
| F8.6 | Lọc nâng cao | Filter theo status, priority, assignee, label | Should | Member |

---

## 📈 THỐNG KÊ ƯUTIÊN

```
MUST (Must Have)     : 48 chức năng (66.7%) - Bắt buộc cho MVP
SHOULD (Should Have) : 20 chức năng (27.8%) - Nên có nếu đủ thời gian
COULD (Could Have)   :  4 chức năng ( 5.5%) - Tính năng phụ
WON'T (Won't Have)   :  0 chức năng         - Không nằm trong scope
```

---

## 🔗 MAPPING VỚI USER STORIES

| Module | Features | User Stories |
|--------|----------|--------------|
| Authentication | F1.1 - F1.8 | US-1.1 - US-1.6 |
| User Management | F2.1 - F2.6 | US-1.5, US-1.6 |
| Workspace | F3.1 - F3.12 | US-2.1 - US-2.9 |
| Project | F4.1 - F4.8 | US-3.1 - US-3.6 |
| Task | F5.1 - F5.18 | US-4.1 - US-4.15 |
| Comment | F6.1 - F6.6 | US-5.1 - US-5.5 |
| Notification | F7.1 - F7.8 | US-7.1 - US-7.6 |
| Dashboard & Search | F8.1 - F8.6 | US-6.1 - US-6.6, US-8.1 - US-8.5 |
