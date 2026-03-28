# CẬP NHẬT CHƯƠNG 8 — TRẠNG THÁI MODULE

> **Hướng dẫn dán vào báo cáo:** Thay thế bảng trạng thái module hiện tại ở mục **8.1.2** bằng bảng dưới đây.

---

## 8.1.2. Các module chức năng (Cập nhật tháng 3/2026)

| Module | Số endpoints | Chức năng chính | Trạng thái |
|--------|-------------|----------------|-----------|
| **Auth** | 6 | Đăng ký, đăng nhập, refresh token, logout, quên/đặt lại mật khẩu | ✅ Hoàn thành |
| **User** | 4 | Xem/cập nhật profile, đổi mật khẩu, upload avatar | ✅ Hoàn thành |
| **Workspace** | 11 | Tạo/quản lý workspace, mời thành viên, phân quyền (Owner/Admin/Member) | ✅ Hoàn thành |
| **Project** | 9 | Tạo/quản lý project, archive, pin project trong workspace | ✅ Hoàn thành |
| **Task** | 14 | CRUD task, phân công thành viên, subtask, nhãn, đổi trạng thái, filter | ✅ Hoàn thành |
| **Mail** | — | Gửi email reset mật khẩu (SendGrid + Mock mode) | ✅ Hoàn thành |
| **Comment** | — | Bình luận trên task, reply | 🔲 Chưa triển khai |
| **Notification** | — | Thông báo realtime (WebSocket) | 🔲 Chưa triển khai |

**Tổng:** 44 endpoints hoàn chỉnh, đầy đủ validation và authentication.

---

> **Hướng dẫn dán vào báo cáo:** Thêm đoạn mô tả sau ngay sau bảng trên.

### Mô tả chi tiết các module đã hoàn thành

**Auth Module** là nền tảng bảo mật của toàn hệ thống. Ngoài luồng đăng ký/đăng nhập tiêu chuẩn, module còn triển khai cơ chế **Token Blacklist** — mỗi khi user logout, access token hiện tại được lưu vào bảng `InvalidatedToken`. `JwtStrategy` kiểm tra blacklist trước mỗi request, đảm bảo token bị vô hiệu hóa tức thì, không cần chờ hết hạn tự nhiên.

**User Module** quản lý hồ sơ cá nhân. Tính năng đáng chú ý là **upload avatar** sử dụng Multer middleware — file được validate (loại file, kích thước), lưu vào `uploads/avatars/`, và phục vụ qua static file server. Khi user đổi ảnh mới, ảnh cũ tự động được xóa khỏi disk.

**Workspace Module** là trung tâm của hệ thống cộng tác. Module triển khai hệ thống phân quyền 3 cấp (Owner > Admin > Member) thông qua bảng `WorkspaceMember`. Chức năng **mời thành viên** tạo invite token duy nhất, có thể gửi qua email và có thời hạn sử dụng.

**Project Module** tổ chức công việc theo dự án bên trong workspace. Hỗ trợ **archive** (lưu trữ) và **pin** (ghim) để ưu tiên hiển thị dự án quan trọng. Mỗi thao tác đều kiểm tra quyền thành viên trong workspace trước khi thực hiện.

**Task Module** là module phức tạp nhất với 14 endpoints. Ngoài CRUD cơ bản, module hỗ trợ: **phân công nhiều người** cho một task (N-N qua `TaskAssignment`), **nhãn phân loại** (N-N qua `TaskLabel`), **subtask** để chia nhỏ công việc, và **filter đa tiêu chí** (status, priority, assignee).
