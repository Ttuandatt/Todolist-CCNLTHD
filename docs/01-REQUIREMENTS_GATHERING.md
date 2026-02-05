# REQUIREMENTS GATHERING - THU THẬP YÊU CẦU
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Mục đích:** Tài liệu câu hỏi phỏng vấn để thu thập yêu cầu từ khách hàng

---

## MỤC LỤC

1. [Thông tin tổng quan dự án](#1-thông-tin-tổng-quan-dự-án)
2. [Đối tượng người dùng](#2-đối-tượng-người-dùng)
3. [Yêu cầu chức năng](#3-yêu-cầu-chức-năng)
4. [Yêu cầu phi chức năng](#4-yêu-cầu-phi-chức-năng)
5. [Giao diện người dùng](#5-giao-diện-người-dùng)
6. [Tích hợp hệ thống](#6-tích-hợp-hệ-thống)
7. [Bảo mật & Quyền riêng tư](#7-bảo-mật--quyền-riêng-tư)
8. [Hạn chế & Ràng buộc](#8-hạn-chế--ràng-buộc)
9. [Kỳ vọng & Tiêu chí thành công](#9-kỳ-vọng--tiêu-chí-thành-công)

---

## 1. THÔNG TIN TỔNG QUAN DỰ ÁN

### 1.1. Bối cảnh và Mục tiêu

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 1.1.1 | Vấn đề hiện tại mà quý công ty/nhóm đang gặp phải trong việc quản lý công việc là gì? | Xác định pain points |
| 1.1.2 | Hiện tại quý vị đang sử dụng công cụ/phương pháp nào để quản lý công việc? | Trello, Excel, giấy... |
| 1.1.3 | Điều gì khiến quý vị không hài lòng với giải pháp hiện tại? | Limitations |
| 1.1.4 | Mục tiêu chính mà quý vị muốn đạt được với ứng dụng mới là gì? | Primary goals |
| 1.1.5 | Quý vị mong đợi ứng dụng này sẽ giải quyết vấn đề gì cụ thể? | Expected outcomes |
| 1.1.6 | Dự án này có deadline cụ thể không? Nếu có, là khi nào? | Timeline |

### 1.2. Phạm vi dự án

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 1.2.1 | Ứng dụng này dành cho sử dụng nội bộ hay có thể mở rộng ra bên ngoài? | Scope |
| 1.2.2 | Quý vị muốn ứng dụng chạy trên nền tảng nào? (Web, Mobile, Desktop) | Platform |
| 1.2.3 | Có cần hỗ trợ đa ngôn ngữ không? Nếu có, những ngôn ngữ nào? | i18n |
| 1.2.4 | Số lượng người dùng dự kiến trong 6 tháng đầu? 1 năm sau? | Scale planning |
| 1.2.5 | Dự án có chia thành nhiều giai đoạn không? Ưu tiên tính năng nào trước? | Phasing |

---

## 2. ĐỐI TƯỢNG NGƯỜI DÙNG

### 2.1. Nhận diện người dùng

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 2.1.1 | Ai là người dùng chính của ứng dụng? (Vai trò, chức danh) | Primary users |
| 2.1.2 | Có bao nhiêu nhóm người dùng khác nhau? | User personas |
| 2.1.3 | Mỗi nhóm người dùng có những nhu cầu khác nhau như thế nào? | Different needs |
| 2.1.4 | Ai sẽ là người quản trị hệ thống? | Admin role |
| 2.1.5 | Trình độ kỹ thuật của người dùng như thế nào? (Thành thạo, Trung bình, Cơ bản) | Tech literacy |

### 2.2. Vai trò và Quyền hạn

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 2.2.1 | Quý vị hình dung có những vai trò nào trong hệ thống? | Roles definition |
| 2.2.2 | Mỗi vai trò có thể làm được những gì? | Permissions |
| 2.2.3 | Ai có quyền tạo/xóa không gian làm việc (workspace)? | Workspace admin |
| 2.2.4 | Ai có quyền mời/xóa thành viên? | Member management |
| 2.2.5 | Người dùng có thể thuộc nhiều nhóm/workspace không? | Multi-workspace |
| 2.2.6 | Có cần tính năng phê duyệt khi thêm thành viên mới không? | Approval flow |

---

## 3. YÊU CẦU CHỨC NĂNG

### 3.1. Xác thực & Tài khoản

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.1.1 | Người dùng đăng ký tài khoản bằng cách nào? (Email, SSO, OAuth) | Registration method |
| 3.1.2 | Có cần tích hợp đăng nhập bằng Google/Microsoft/GitHub không? | OAuth providers |
| 3.1.3 | Có yêu cầu xác thực 2 yếu tố (2FA) không? | 2FA requirement |
| 3.1.4 | Chính sách mật khẩu mong muốn? (Độ dài, ký tự đặc biệt) | Password policy |
| 3.1.5 | Có cần chức năng quên mật khẩu không? | Password recovery |
| 3.1.6 | Thời gian tự động đăng xuất sau bao lâu không hoạt động? | Session timeout |

### 3.2. Quản lý Workspace (Không gian làm việc)

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.2.1 | Một người dùng có thể tạo bao nhiêu workspace? | Workspace limits |
| 3.2.2 | Mỗi workspace có thể có bao nhiêu thành viên? | Member limits |
| 3.2.3 | Khi mời thành viên, quý vị muốn quy trình như thế nào? | Invitation flow |
| 3.2.4 | Có cần tính năng chia sẻ workspace ra bên ngoài (với khách) không? | Guest access |
| 3.2.5 | Khi xóa workspace, dữ liệu có cần lưu trữ không? Bao lâu? | Data retention |

### 3.3. Quản lý Project (Dự án)

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.3.1 | Mỗi workspace có thể có bao nhiêu project? | Project limits |
| 3.3.2 | Có cần tính năng lưu trữ (archive) project không? | Archive feature |
| 3.3.3 | Project có cần template mẫu không? | Project templates |
| 3.3.4 | Có cần tính năng sao chép project không? | Duplicate project |
| 3.3.5 | Có cần timeline/Gantt chart cho project không? | Timeline view |

### 3.4. Quản lý Task (Công việc)

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.4.1 | Quy trình làm việc (workflow) điển hình của một task là gì? | Workflow states |
| 3.4.2 | Các trạng thái task mong muốn? (VD: Todo, In Progress, Review, Done) | Task statuses |
| 3.4.3 | Có cần tùy chỉnh trạng thái theo từng project không? | Custom statuses |
| 3.4.4 | Mức độ ưu tiên nào cần có? (Thấp, Bình thường, Cao, Khẩn cấp) | Priority levels |
| 3.4.5 | Một task có thể gán cho nhiều người không? | Multiple assignees |
| 3.4.6 | Có cần tính năng subtask (công việc con) không? | Subtasks |
| 3.4.7 | Có cần tính năng dependencies (task phụ thuộc) không? | Dependencies |
| 3.4.8 | Có cần tính năng recurring tasks (lặp lại) không? | Recurring tasks |
| 3.4.9 | Task cần những trường thông tin nào? (Tiêu đề, Mô tả, Deadline...) | Task fields |
| 3.4.10 | Có cần custom fields (trường tùy chỉnh) không? | Custom fields |
| 3.4.11 | Có cần ước tính thời gian hoàn thành không? | Time estimation |
| 3.4.12 | Có cần theo dõi thời gian thực tế không? (Time tracking) | Time tracking |

### 3.5. Labels & Categories (Nhãn & Phân loại)

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.5.1 | Có cần hệ thống nhãn (labels) để phân loại task không? | Labels system |
| 3.5.2 | Labels có được chia sẻ trong workspace không? | Shared labels |
| 3.5.3 | Có giới hạn số nhãn trên một task không? | Label limits |
| 3.5.4 | Labels có cần màu sắc không? | Label colors |

### 3.6. Bình luận & Thảo luận

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.6.1 | Có cần tính năng bình luận trên task không? | Comments |
| 3.6.2 | Có cần trả lời bình luận (reply/thread) không? | Threaded comments |
| 3.6.3 | Có cần mention (@) người dùng trong bình luận không? | Mentions |
| 3.6.4 | Bình luận có thể chỉnh sửa/xóa không? Trong bao lâu? | Edit/Delete policy |
| 3.6.5 | Có cần rich text formatting trong bình luận không? | Rich text |
| 3.6.6 | Có cần thêm emoji/reactions không? | Reactions |

### 3.7. Tệp đính kèm

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.7.1 | Có cần đính kèm file vào task không? | Attachments |
| 3.7.2 | Giới hạn kích thước file tối đa bao nhiêu? | Size limits |
| 3.7.3 | Những định dạng file nào được phép? | Allowed formats |
| 3.7.4 | Có cần preview file trong ứng dụng không? | Preview feature |
| 3.7.5 | Dung lượng lưu trữ tối đa cho mỗi workspace? | Storage quota |

### 3.8. Thông báo

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.8.1 | Người dùng cần nhận thông báo trong những trường hợp nào? | Notification triggers |
| 3.8.2 | Thông báo qua những kênh nào? (In-app, Email, Push) | Notification channels |
| 3.8.3 | Có cần thông báo real-time không? | Real-time |
| 3.8.4 | Có cần nhắc nhở deadline không? Trước bao lâu? | Deadline reminders |
| 3.8.5 | Người dùng có thể tùy chỉnh thông báo không? | Notification settings |

### 3.9. Tìm kiếm & Lọc

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.9.1 | Có cần tìm kiếm toàn hệ thống (global search) không? | Global search |
| 3.9.2 | Tìm kiếm theo những tiêu chí nào? (Tiêu đề, Nội dung, Người gán...) | Search criteria |
| 3.9.3 | Có cần lọc task theo nhiều tiêu chí không? | Advanced filters |
| 3.9.4 | Có cần lưu bộ lọc để dùng lại không? | Saved filters |

### 3.10. Báo cáo & Thống kê

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 3.10.1 | Có cần dashboard tổng quan không? | Dashboard |
| 3.10.2 | Những chỉ số nào cần theo dõi? (Tasks completed, overdue...) | KPIs |
| 3.10.3 | Có cần xuất báo cáo không? Định dạng nào? (PDF, Excel) | Export reports |
| 3.10.4 | Có cần biểu đồ thống kê không? | Charts |
| 3.10.5 | Có cần theo dõi hiệu suất cá nhân/nhóm không? | Performance tracking |

---

## 4. YÊU CẦU PHI CHỨC NĂNG

### 4.1. Hiệu năng

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 4.1.1 | Thời gian phản hồi chấp nhận được là bao lâu? | Response time |
| 4.1.2 | Số lượng người dùng đồng thời tối đa dự kiến? | Concurrent users |
| 4.1.3 | Có yêu cầu về tốc độ tải trang không? (< 3s?) | Page load time |
| 4.1.4 | Ứng dụng cần hoạt động mượt mà với bao nhiêu tasks? | Data volume |

### 4.2. Khả dụng & Độ tin cậy

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 4.2.1 | Yêu cầu uptime là bao nhiêu %? (99%? 99.9%?) | Uptime SLA |
| 4.2.2 | Có khung giờ nào cần đảm bảo 100% khả dụng không? | Critical hours |
| 4.2.3 | Có cần chế độ offline không? | Offline mode |
| 4.2.4 | Nếu có lỗi, thời gian khôi phục chấp nhận được là bao lâu? | Recovery time |

### 4.3. Khả năng mở rộng

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 4.3.1 | Dự kiến tăng trưởng người dùng trong 1-3 năm? | Growth projection |
| 4.3.2 | Có kế hoạch mở rộng ra thị trường quốc tế không? | International expansion |
| 4.3.3 | Có cần tích hợp với hệ thống khác trong tương lai không? | Future integrations |

---

## 5. GIAO DIỆN NGƯỜI DÙNG

### 5.1. Thiết kế & Trải nghiệm

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 5.1.1 | Quý vị thích phong cách thiết kế nào? (Modern, Classic, Minimalist) | Design style |
| 5.1.2 | Có brand guidelines/màu sắc thương hiệu cần tuân theo không? | Brand colors |
| 5.1.3 | Có ứng dụng nào mà quý vị thích giao diện không? (Tham khảo) | Reference apps |
| 5.1.4 | Có cần chế độ Dark Mode không? | Dark mode |
| 5.1.5 | Có yêu cầu về accessibility (hỗ trợ người khuyết tật) không? | Accessibility |

### 5.2. View modes

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 5.2.1 | Quý vị muốn xem tasks theo dạng nào? (Kanban, List, Calendar, Gantt) | View types |
| 5.2.2 | View mặc định nên là gì? | Default view |
| 5.2.3 | Có cần chuyển đổi giữa các views không? | Switch views |
| 5.2.4 | Có cần tùy chỉnh columns trong Kanban view không? | Custom columns |

### 5.3. Responsive & Mobile

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 5.3.1 | Người dùng có sử dụng điện thoại/tablet nhiều không? | Mobile usage |
| 5.3.2 | Có cần ứng dụng mobile native không hay web responsive là đủ? | Native vs Web |
| 5.3.3 | Những tính năng nào cần thiết trên mobile? | Mobile features |

---

## 6. TÍCH HỢP HỆ THỐNG

### 6.1. Tích hợp bên thứ ba

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 6.1.1 | Có cần tích hợp với hệ thống email nào không? (Gmail, Outlook) | Email integration |
| 6.1.2 | Có cần tích hợp với calendar không? (Google Calendar, Outlook) | Calendar sync |
| 6.1.3 | Có cần tích hợp với chat tools không? (Slack, Teams, Discord) | Chat integration |
| 6.1.4 | Có cần tích hợp với cloud storage không? (Google Drive, Dropbox) | Storage integration |
| 6.1.5 | Có cần tích hợp với Git/GitHub/GitLab không? | Dev tools |
| 6.1.6 | Có hệ thống nội bộ nào cần tích hợp không? | Internal systems |

### 6.2. API & Webhooks

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 6.2.1 | Có cần cung cấp API cho bên thứ ba không? | Public API |
| 6.2.2 | Có cần webhooks để push events ra ngoài không? | Webhooks |
| 6.2.3 | Có cần import/export dữ liệu không? Định dạng nào? | Data import/export |

---

## 7. BẢO MẬT & QUYỀN RIÊNG TƯ

### 7.1. Bảo mật

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 7.1.1 | Có yêu cầu tuân thủ tiêu chuẩn bảo mật nào không? (ISO, SOC2) | Compliance |
| 7.1.2 | Dữ liệu có cần mã hóa không? (At rest, In transit) | Encryption |
| 7.1.3 | Có cần audit log (lịch sử hoạt động) không? | Audit trail |
| 7.1.4 | Có giới hạn truy cập theo IP không? | IP restrictions |
| 7.1.5 | Có yêu cầu về Single Sign-On (SSO) không? | SSO |

### 7.2. Quyền riêng tư & Dữ liệu

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 7.2.1 | Có tuân thủ GDPR không? (Nếu có người dùng EU) | GDPR |
| 7.2.2 | Dữ liệu cần lưu trữ ở đâu? (Việt Nam, Cloud global) | Data residency |
| 7.2.3 | Người dùng có quyền xóa dữ liệu của mình không? | Data deletion |
| 7.2.4 | Có cần chính sách backup không? Tần suất? | Backup policy |
| 7.2.5 | Thời gian lưu trữ dữ liệu tối đa/tối thiểu? | Data retention |

---

## 8. HẠN CHẾ & RÀNG BUỘC

### 8.1. Kỹ thuật

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 8.1.1 | Có ràng buộc về công nghệ không? (Tech stack bắt buộc) | Tech constraints |
| 8.1.2 | Có hạ tầng sẵn có không? (Server, Database) | Existing infra |
| 8.1.3 | Trình duyệt nào cần hỗ trợ? | Browser support |
| 8.1.4 | Có yêu cầu về hosting không? (Cloud, On-premise) | Hosting |

### 8.2. Ngân sách & Thời gian

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 8.2.1 | Ngân sách dự kiến cho dự án là bao nhiêu? | Budget |
| 8.2.2 | Deadline hoàn thành MVP là khi nào? | MVP deadline |
| 8.2.3 | Deadline hoàn thành toàn bộ sản phẩm? | Full release |
| 8.2.4 | Có nguồn lực dev nội bộ không hay hoàn toàn outsource? | Resources |

### 8.3. Pháp lý

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 8.3.1 | Có ràng buộc pháp lý nào cần tuân thủ không? | Legal requirements |
| 8.3.2 | Có cần license cho third-party software không? | Licensing |

---

## 9. KỲ VỌNG & TIÊU CHÍ THÀNH CÔNG

### 9.1. Định nghĩa thành công

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 9.1.1 | Làm thế nào để biết dự án thành công? | Success criteria |
| 9.1.2 | KPIs nào cần đạt được sau 3 tháng? 6 tháng? | KPIs |
| 9.1.3 | Số lượng người dùng active mong đợi? | Active users |
| 9.1.4 | Mức độ hài lòng người dùng mong đợi? (NPS Score) | User satisfaction |

### 9.2. Rủi ro & Lo ngại

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 9.2.1 | Rủi ro lớn nhất mà quý vị lo ngại với dự án này là gì? | Top risks |
| 9.2.2 | Điều gì có thể khiến dự án thất bại? | Failure factors |
| 9.2.3 | Có stakeholders nào khác cần tham gia vào quyết định không? | Stakeholders |

### 9.3. Hỗ trợ & Bảo trì

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 9.3.1 | Có cần hỗ trợ kỹ thuật sau khi go-live không? | Post-launch support |
| 9.3.2 | Ai sẽ chịu trách nhiệm bảo trì hệ thống? | Maintenance owner |
| 9.3.3 | Có cần training cho người dùng không? | User training |
| 9.3.4 | Có cần tài liệu hướng dẫn sử dụng không? | User documentation |

---

## 10. TỔNG KẾT PHỎNG VẤN

### 10.1. Câu hỏi kết thúc

| # | Câu hỏi | Ghi chú |
|---|---------|---------|
| 10.1.1 | Có điều gì khác mà quý vị muốn chia sẻ về dự án không? | Additional info |
| 10.1.2 | Trong số các tính năng đã thảo luận, 3 tính năng quan trọng nhất là gì? | Top 3 priorities |
| 10.1.3 | Có tính năng nào mà quý vị tuyệt đối không muốn có không? | Exclusions |
| 10.1.4 | Ai là người liên hệ chính cho các câu hỏi tiếp theo? | Point of contact |
| 10.1.5 | Khi nào có thể lên lịch cuộc họp tiếp theo để review yêu cầu? | Next meeting |

---

## 11. CHECKLIST TỔNG HỢP YÊU CẦU

Sau buổi phỏng vấn, đảm bảo đã thu thập đủ thông tin về:

### Yêu cầu đã thu thập

- [ ] Mục tiêu dự án rõ ràng
- [ ] Danh sách các loại người dùng (personas)
- [ ] Roles & Permissions matrix
- [ ] Danh sách chức năng chính (features)
- [ ] Workflow/States của task
- [ ] Yêu cầu thông báo
- [ ] Yêu cầu tích hợp
- [ ] Yêu cầu bảo mật
- [ ] Ràng buộc kỹ thuật
- [ ] Ngân sách & Timeline
- [ ] Tiêu chí thành công
- [ ] Người liên hệ chính

### Bước tiếp theo

1. Tổng hợp ghi chú thành Requirements Document
2. Gửi cho khách hàng review
3. Họp confirm yêu cầu cuối cùng
4. Ước lượng effort & timeline
5. Lập kế hoạch dự án

---

## 12. THỐNG KÊ

| Phần | Số câu hỏi |
|------|------------|
| Tổng quan dự án | 11 |
| Đối tượng người dùng | 11 |
| Yêu cầu chức năng | 52 |
| Yêu cầu phi chức năng | 12 |
| Giao diện người dùng | 14 |
| Tích hợp hệ thống | 9 |
| Bảo mật & Quyền riêng tư | 10 |
| Hạn chế & Ràng buộc | 10 |
| Kỳ vọng & Tiêu chí | 11 |
| Câu hỏi kết thúc | 5 |
| **Tổng cộng** | **145 câu hỏi** |
