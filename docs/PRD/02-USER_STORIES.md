# USER STORIES - TODOLIST COLLABORATION

> **Định dạng User Story:** As a [Actor], I want to [Action], so that [Benefit].
> 
> **Định dạng tiếng Việt:** Với vai trò [Actor], tôi muốn [Hành động], để [Lợi ích].

---

## 📌 ĐỊNH NGHĨA ACTOR

| Actor | Định nghĩa | Phạm vi |
|-------|------------|---------|
| **Guest** | Người chưa đăng nhập | Toàn hệ thống |
| **User** | Người đã đăng nhập | Toàn hệ thống |
| **Member** | Thành viên của workspace | Trong workspace cụ thể |
| **Admin** | Quản trị viên workspace | Trong workspace cụ thể |
| **Owner** | Chủ sở hữu workspace | Trong workspace cụ thể |
| **System** | Hệ thống tự động | Toàn hệ thống |

---

## 1. QUẢN LÝ USER (Authentication & Profile)

### US-1.1: Đăng ký tài khoản
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.1 |
| **Title** | Đăng ký tài khoản mới |
| **Actor** | Guest |
| **Story** | As a Guest, I want to register a new account using email/password or OAuth (Google, GitHub), so that I can access the TodoList system. |
| **Story (VN)** | Với vai trò Guest, tôi muốn đăng ký tài khoản mới bằng email/password hoặc OAuth (Google, GitHub), để có thể truy cập hệ thống TodoList. |
| **Priority** | High |
| **Acceptance Criteria** | - Có thể đăng ký bằng email + password<br>- Có thể đăng ký bằng Google OAuth<br>- Email phải là duy nhất trong hệ thống<br>- Password phải có ít nhất 8 ký tự<br>- Sau khi đăng ký thành công, tự động đăng nhập |

---

### US-1.2: Đăng nhập
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.2 |
| **Title** | Đăng nhập vào hệ thống |
| **Actor** | Guest |
| **Story** | As a Guest, I want to login with my credentials, so that I can access my workspaces and tasks. |
| **Story (VN)** | Với vai trò Guest, tôi muốn đăng nhập bằng thông tin đã đăng ký, để có thể truy cập các workspace và task của mình. |
| **Priority** | High |
| **Acceptance Criteria** | - Đăng nhập bằng email + password<br>- Đăng nhập bằng Google OAuth<br>- Nhận JWT token sau khi đăng nhập<br>- Hiển thị lỗi rõ ràng khi thông tin sai |

---

### US-1.3: Đăng xuất
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.3 |
| **Title** | Đăng xuất khỏi hệ thống |
| **Actor** | User |
| **Story** | As a User, I want to logout from the system, so that my session is terminated securely. |
| **Story (VN)** | Với vai trò User, tôi muốn đăng xuất khỏi hệ thống, để phiên làm việc được kết thúc an toàn. |
| **Priority** | High |
| **Acceptance Criteria** | - Token bị invalidate sau khi logout<br>- Redirect về trang login<br>- Không thể truy cập protected routes |

---

### US-1.4: Quên mật khẩu
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.4 |
| **Title** | Khôi phục mật khẩu đã quên |
| **Actor** | Guest |
| **Story** | As a Guest, I want to reset my password via email, so that I can regain access to my account. |
| **Story (VN)** | Với vai trò Guest, tôi muốn đặt lại mật khẩu qua email, để có thể truy cập lại tài khoản. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Nhập email để nhận link reset<br>- Email chứa link reset có thời hạn 24h<br>- Có thể đặt mật khẩu mới qua link |

---

### US-1.5: Cập nhật Profile
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.5 |
| **Title** | Cập nhật thông tin cá nhân |
| **Actor** | User |
| **Story** | As a User, I want to update my profile information (name, avatar), so that my information is up-to-date. |
| **Story (VN)** | Với vai trò User, tôi muốn cập nhật thông tin cá nhân (tên, avatar), để thông tin của tôi luôn chính xác. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Có thể đổi tên hiển thị<br>- Có thể upload avatar (max 2MB, jpg/png)<br>- Thay đổi được áp dụng ngay lập tức |

---

### US-1.6: Đổi mật khẩu
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-1.6 |
| **Title** | Thay đổi mật khẩu |
| **Actor** | User |
| **Story** | As a User, I want to change my password, so that I can keep my account secure. |
| **Story (VN)** | Với vai trò User, tôi muốn đổi mật khẩu, để bảo mật tài khoản. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Phải nhập đúng mật khẩu cũ<br>- Mật khẩu mới phải khác mật khẩu cũ<br>- Xác nhận mật khẩu mới phải khớp |

---

## 2. QUẢN LÝ WORKSPACE

### US-2.1: Tạo Workspace
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.1 |
| **Title** | Tạo workspace mới |
| **Actor** | User |
| **Story** | As a User, I want to create a new workspace, so that I can organize my projects and collaborate with team members. |
| **Story (VN)** | Với vai trò User, tôi muốn tạo workspace mới, để tổ chức các dự án và cộng tác với thành viên. |
| **Priority** | High |
| **Acceptance Criteria** | - Nhập tên workspace (bắt buộc)<br>- Nhập mô tả (tùy chọn)<br>- Người tạo tự động trở thành Owner<br>- Redirect đến workspace sau khi tạo |

---

### US-2.2: Xem danh sách Workspace
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.2 |
| **Title** | Xem tất cả workspace tham gia |
| **Actor** | User |
| **Story** | As a User, I want to see all workspaces I'm a member of, so that I can navigate to them easily. |
| **Story (VN)** | Với vai trò User, tôi muốn xem tất cả workspace mà tôi tham gia, để dễ dàng truy cập. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị danh sách workspace<br>- Hiển thị vai trò của mình trong mỗi workspace<br>- Có thể click để vào workspace |

---

### US-2.3: Sửa thông tin Workspace
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.3 |
| **Title** | Chỉnh sửa thông tin workspace |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to edit workspace details (name, description), so that the information stays accurate. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn chỉnh sửa thông tin workspace (tên, mô tả), để thông tin luôn chính xác. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Có thể đổi tên workspace<br>- Có thể đổi mô tả<br>- Member không có quyền sửa |

---

### US-2.4: Xóa Workspace
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.4 |
| **Title** | Xóa workspace |
| **Actor** | Owner |
| **Story** | As an Owner, I want to delete a workspace, so that I can remove unused workspaces. |
| **Story (VN)** | Với vai trò Owner, tôi muốn xóa workspace, để loại bỏ workspace không còn sử dụng. |
| **Priority** | Low |
| **Acceptance Criteria** | - Chỉ Owner mới có quyền xóa<br>- Hiển thị confirmation dialog<br>- Soft delete (có thể restore trong 30 ngày)<br>- Xóa kèm tất cả projects và tasks |

---

### US-2.5: Mời thành viên
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.5 |
| **Title** | Mời người dùng vào workspace |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to invite users to the workspace, so that we can collaborate on projects. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn mời người dùng vào workspace, để có thể cộng tác trong các dự án. |
| **Priority** | High |
| **Acceptance Criteria** | - Mời bằng email<br>- Chọn vai trò cho người được mời (Member/Admin)<br>- Gửi email invitation với link<br>- Người được mời click link để join |

---

### US-2.6: Xóa thành viên
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.6 |
| **Title** | Xóa thành viên khỏi workspace |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to remove a member from the workspace, so that they no longer have access. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn xóa thành viên khỏi workspace, để họ không còn quyền truy cập. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Owner có thể xóa Admin và Member<br>- Admin chỉ có thể xóa Member<br>- Không thể xóa Owner<br>- Thành viên bị xóa mất quyền truy cập ngay |

---

### US-2.7: Quản lý quyền thành viên
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.7 |
| **Title** | Thay đổi vai trò thành viên |
| **Actor** | Owner |
| **Story** | As an Owner, I want to change a member's role, so that I can grant or revoke permissions. |
| **Story (VN)** | Với vai trò Owner, tôi muốn thay đổi vai trò của thành viên, để cấp hoặc thu hồi quyền. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Có thể nâng Member lên Admin<br>- Có thể hạ Admin xuống Member<br>- Chỉ Owner mới có quyền này |

---

### US-2.8: Rời khỏi Workspace
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.8 |
| **Title** | Tự rời khỏi workspace |
| **Actor** | Member, Admin |
| **Story** | As a Member/Admin, I want to leave a workspace, so that I'm no longer part of it. |
| **Story (VN)** | Với vai trò Member/Admin, tôi muốn rời khỏi workspace, để không còn là thành viên. |
| **Priority** | Low |
| **Acceptance Criteria** | - Có thể tự rời workspace<br>- Owner không thể rời (phải chuyển quyền trước)<br>- Hiển thị confirmation |

---

### US-2.9: Chuyển quyền Owner
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-2.9 |
| **Title** | Chuyển quyền sở hữu workspace |
| **Actor** | Owner |
| **Story** | As an Owner, I want to transfer ownership to another member, so that they become the new Owner. |
| **Story (VN)** | Với vai trò Owner, tôi muốn chuyển quyền sở hữu cho thành viên khác, để họ trở thành Owner mới. |
| **Priority** | Low |
| **Acceptance Criteria** | - Chọn member để chuyển quyền<br>- Owner cũ trở thành Admin<br>- Member được chọn trở thành Owner |

---

## 3. QUẢN LÝ PROJECT

### US-3.1: Tạo Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.1 |
| **Title** | Tạo project mới trong workspace |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to create a new project, so that I can organize related tasks together. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn tạo project mới, để tổ chức các task liên quan lại với nhau. |
| **Priority** | High |
| **Acceptance Criteria** | - Nhập tên project (bắt buộc)<br>- Nhập mô tả (tùy chọn)<br>- Chọn màu/icon (tùy chọn)<br>- Project thuộc về workspace hiện tại |

---

### US-3.2: Xem danh sách Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.2 |
| **Title** | Xem tất cả project trong workspace |
| **Actor** | Member |
| **Story** | As a Member, I want to see all projects in the workspace, so that I can access them. |
| **Story (VN)** | Với vai trò Member, tôi muốn xem tất cả project trong workspace, để có thể truy cập. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị danh sách projects<br>- Hiển thị số task trong mỗi project<br>- Projects đã pin hiển thị trước<br>- Có thể click để vào project |

---

### US-3.3: Sửa Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.3 |
| **Title** | Chỉnh sửa thông tin project |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to edit project details, so that the information stays current. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn chỉnh sửa thông tin project, để thông tin luôn cập nhật. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Đổi tên project<br>- Đổi mô tả<br>- Đổi màu/icon |

---

### US-3.4: Xóa Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.4 |
| **Title** | Xóa project |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to delete a project, so that I can remove unused projects. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn xóa project, để loại bỏ project không còn sử dụng. |
| **Priority** | Low |
| **Acceptance Criteria** | - Hiển thị confirmation<br>- Soft delete<br>- Xóa kèm tất cả tasks |

---

### US-3.5: Pin/Unpin Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.5 |
| **Title** | Ghim project quan trọng |
| **Actor** | Member |
| **Story** | As a Member, I want to pin important projects, so that they appear at the top of the list. |
| **Story (VN)** | Với vai trò Member, tôi muốn ghim project quan trọng, để chúng hiển thị đầu danh sách. |
| **Priority** | Low |
| **Acceptance Criteria** | - Toggle pin/unpin<br>- Pinned projects hiển thị trước<br>- Pin setting là per-user |

---

### US-3.6: Archive Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-3.6 |
| **Title** | Lưu trữ project đã hoàn thành |
| **Actor** | Owner, Admin |
| **Story** | As an Owner/Admin, I want to archive a completed project, so that it's hidden but not deleted. |
| **Story (VN)** | Với vai trò Owner/Admin, tôi muốn lưu trữ project đã hoàn thành, để ẩn đi nhưng không xóa. |
| **Priority** | Low |
| **Acceptance Criteria** | - Project bị archive không hiển thị mặc định<br>- Có filter để xem archived projects<br>- Có thể restore project đã archive |

---

## 4. QUẢN LÝ TASK

### US-4.1: Tạo Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.1 |
| **Title** | Tạo task mới |
| **Actor** | Member |
| **Story** | As a Member, I want to create a new task, so that I can track work that needs to be done. |
| **Story (VN)** | Với vai trò Member, tôi muốn tạo task mới, để theo dõi công việc cần làm. |
| **Priority** | High |
| **Acceptance Criteria** | - Nhập tiêu đề (bắt buộc)<br>- Nhập mô tả (tùy chọn)<br>- Chọn priority (mặc định NORMAL)<br>- Chọn due date (tùy chọn)<br>- Task tự động ở trạng thái TODO |

---

### US-4.2: Xem danh sách Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.2 |
| **Title** | Xem tất cả task trong project |
| **Actor** | Member |
| **Story** | As a Member, I want to see all tasks in a project, so that I can understand the work. |
| **Story (VN)** | Với vai trò Member, tôi muốn xem tất cả task trong project, để hiểu được công việc. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị tasks theo columns (Kanban) hoặc list<br>- Hiển thị title, status, priority, assignee, due date<br>- Có thể click để xem chi tiết |

---

### US-4.3: Xem chi tiết Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.3 |
| **Title** | Xem đầy đủ thông tin task |
| **Actor** | Member |
| **Story** | As a Member, I want to view task details, so that I can see all information and comments. |
| **Story (VN)** | Với vai trò Member, tôi muốn xem chi tiết task, để biết đầy đủ thông tin và comments. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị tất cả thông tin task<br>- Hiển thị danh sách comments<br>- Hiển thị subtasks nếu có<br>- Hiển thị attachments nếu có |

---

### US-4.4: Sửa Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.4 |
| **Title** | Chỉnh sửa thông tin task |
| **Actor** | Member |
| **Story** | As a Member, I want to edit task details, so that the information is always up-to-date. |
| **Story (VN)** | Với vai trò Member, tôi muốn chỉnh sửa thông tin task, để thông tin luôn cập nhật. |
| **Priority** | High |
| **Acceptance Criteria** | - Sửa title, description<br>- Sửa priority, due date<br>- Thay đổi được lưu ngay lập tức |

---

### US-4.5: Xóa Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.5 |
| **Title** | Xóa task |
| **Actor** | Member |
| **Story** | As a Member, I want to delete a task, so that I can remove tasks that are no longer needed. |
| **Story (VN)** | Với vai trò Member, tôi muốn xóa task, để loại bỏ task không cần thiết. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Hiển thị confirmation<br>- Soft delete<br>- Xóa kèm subtasks và comments |

---

### US-4.6: Chuyển trạng thái Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.6 |
| **Title** | Thay đổi trạng thái task |
| **Actor** | Member |
| **Story** | As a Member, I want to change task status, so that I can track progress. |
| **Story (VN)** | Với vai trò Member, tôi muốn thay đổi trạng thái task, để theo dõi tiến độ. |
| **Priority** | High |
| **Acceptance Criteria** | - Các trạng thái: TODO → IN_PROGRESS → REVIEW → DONE<br>- Có thể kéo thả trong Kanban view<br>- Có thể chọn từ dropdown |

---

### US-4.7: Gán người thực hiện
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.7 |
| **Title** | Assign task cho thành viên |
| **Actor** | Member |
| **Story** | As a Member, I want to assign a task to someone, so that they know they're responsible. |
| **Story (VN)** | Với vai trò Member, tôi muốn gán task cho ai đó, để họ biết mình chịu trách nhiệm. |
| **Priority** | High |
| **Acceptance Criteria** | - Chọn từ danh sách members trong workspace<br>- Có thể assign nhiều người<br>- Người được assign nhận notification |

---

### US-4.8: Đặt Deadline
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.8 |
| **Title** | Đặt thời hạn cho task |
| **Actor** | Member |
| **Story** | As a Member, I want to set a due date, so that I know when the task should be completed. |
| **Story (VN)** | Với vai trò Member, tôi muốn đặt deadline, để biết task cần hoàn thành khi nào. |
| **Priority** | High |
| **Acceptance Criteria** | - Chọn ngày từ date picker<br>- Có thể chọn cả giờ (tùy chọn)<br>- Hiển thị cảnh báo khi gần/quá hạn |

---

### US-4.9: Đặt Priority
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.9 |
| **Title** | Đặt độ ưu tiên cho task |
| **Actor** | Member |
| **Story** | As a Member, I want to set task priority, so that important tasks are highlighted. |
| **Story (VN)** | Với vai trò Member, tôi muốn đặt độ ưu tiên, để task quan trọng được nổi bật. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Các mức: LOW, NORMAL, HIGH, URGENT<br>- Hiển thị màu khác nhau cho mỗi mức<br>- Có thể filter theo priority |

---

### US-4.10: Thêm Tags/Labels
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.10 |
| **Title** | Gắn nhãn cho task |
| **Actor** | Member |
| **Story** | As a Member, I want to add labels to tasks, so that I can categorize them. |
| **Story (VN)** | Với vai trò Member, tôi muốn gắn nhãn cho task, để phân loại task. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Chọn từ labels có sẵn hoặc tạo mới<br>- Mỗi label có màu riêng<br>- Có thể gắn nhiều labels cho một task |

---

### US-4.11: Đính kèm File
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.11 |
| **Title** | Upload file đính kèm |
| **Actor** | Member |
| **Story** | As a Member, I want to attach files to a task, so that relevant documents are accessible. |
| **Story (VN)** | Với vai trò Member, tôi muốn đính kèm file vào task, để tài liệu liên quan dễ truy cập. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Upload file (max 10MB)<br>- Hỗ trợ: images, pdf, doc, excel<br>- Hiển thị preview cho images |

---

### US-4.12: Tạo Subtasks
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.12 |
| **Title** | Chia task thành subtasks |
| **Actor** | Member |
| **Story** | As a Member, I want to create subtasks, so that I can break down complex tasks. |
| **Story (VN)** | Với vai trò Member, tôi muốn tạo subtasks, để chia nhỏ task phức tạp. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Thêm subtask với title<br>- Toggle complete/incomplete<br>- Hiển thị progress (2/5 completed) |

---

### US-4.13: Duplicate Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.13 |
| **Title** | Copy task |
| **Actor** | Member |
| **Story** | As a Member, I want to duplicate a task, so that I can create similar tasks quickly. |
| **Story (VN)** | Với vai trò Member, tôi muốn copy task, để tạo nhanh task tương tự. |
| **Priority** | Low |
| **Acceptance Criteria** | - Copy title, description, priority<br>- Không copy assignee, due date<br>- Task mới ở trạng thái TODO |

---

### US-4.14: Kéo thả sắp xếp
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.14 |
| **Title** | Sắp xếp tasks bằng drag & drop |
| **Actor** | Member |
| **Story** | As a Member, I want to reorder tasks by dragging, so that I can prioritize them visually. |
| **Story (VN)** | Với vai trò Member, tôi muốn sắp xếp task bằng kéo thả, để ưu tiên trực quan. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Kéo thả trong cùng column<br>- Kéo thả giữa các columns (đổi status)<br>- Thứ tự được lưu lại |

---

### US-4.15: Di chuyển Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-4.15 |
| **Title** | Move task sang project khác |
| **Actor** | Member |
| **Story** | As a Member, I want to move a task to another project, so that it's properly organized. |
| **Story (VN)** | Với vai trò Member, tôi muốn di chuyển task sang project khác, để tổ chức hợp lý. |
| **Priority** | Low |
| **Acceptance Criteria** | - Chọn project đích trong cùng workspace<br>- Task giữ nguyên thông tin<br>- Comments và subtasks theo cùng |

---

## 5. QUẢN LÝ COMMENT

### US-5.1: Thêm Comment
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-5.1 |
| **Title** | Thêm bình luận vào task |
| **Actor** | Member |
| **Story** | As a Member, I want to add a comment to a task, so that I can communicate with the team. |
| **Story (VN)** | Với vai trò Member, tôi muốn thêm bình luận vào task, để trao đổi với team. |
| **Priority** | High |
| **Acceptance Criteria** | - Nhập nội dung text<br>- Hiển thị tên người comment và thời gian<br>- Comments sắp xếp theo thời gian |

---

### US-5.2: Sửa Comment
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-5.2 |
| **Title** | Chỉnh sửa bình luận |
| **Actor** | Member |
| **Story** | As a Member, I want to edit my comment, so that I can fix mistakes. |
| **Story (VN)** | Với vai trò Member, tôi muốn sửa bình luận của mình, để chỉnh sửa lỗi. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Chỉ sửa được comment của mình<br>- Hiển thị "(edited)" sau khi sửa<br>- Lưu lịch sử chỉnh sửa |

---

### US-5.3: Xóa Comment
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-5.3 |
| **Title** | Xóa bình luận |
| **Actor** | Member, Admin |
| **Story** | As a Member/Admin, I want to delete a comment, so that inappropriate content is removed. |
| **Story (VN)** | Với vai trò Member/Admin, tôi muốn xóa bình luận, để loại bỏ nội dung không phù hợp. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Member chỉ xóa được comment của mình<br>- Admin có thể xóa comment của bất kỳ ai<br>- Soft delete |

---

### US-5.4: Mention User
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-5.4 |
| **Title** | Tag người trong comment |
| **Actor** | Member |
| **Story** | As a Member, I want to @mention someone, so that they receive a notification. |
| **Story (VN)** | Với vai trò Member, tôi muốn tag @username, để họ nhận được thông báo. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Gõ @ hiển thị autocomplete danh sách members<br>- Mention được highlight<br>- Người được mention nhận notification |

---

### US-5.5: Reply Comment
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-5.5 |
| **Title** | Trả lời bình luận |
| **Actor** | Member |
| **Story** | As a Member, I want to reply to a comment, so that conversations are threaded. |
| **Story (VN)** | Với vai trò Member, tôi muốn trả lời bình luận, để cuộc hội thoại có cấu trúc. |
| **Priority** | Low |
| **Acceptance Criteria** | - Reply hiển thị lùi vào dưới comment gốc<br>- Có thể collapse/expand replies<br>- Notification cho người được reply |

---

## 6. TÌM KIẾM & LỌC

### US-6.1: Tìm kiếm Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.1 |
| **Title** | Tìm kiếm task trong project |
| **Actor** | Member |
| **Story** | As a Member, I want to search for tasks, so that I can quickly find what I'm looking for. |
| **Story (VN)** | Với vai trò Member, tôi muốn tìm kiếm task, để nhanh chóng tìm được thứ cần tìm. |
| **Priority** | High |
| **Acceptance Criteria** | - Tìm theo title<br>- Tìm theo description<br>- Kết quả cập nhật real-time khi gõ |

---

### US-6.2: Lọc theo Status
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.2 |
| **Title** | Lọc task theo trạng thái |
| **Actor** | Member |
| **Story** | As a Member, I want to filter tasks by status, so that I can focus on specific tasks. |
| **Story (VN)** | Với vai trò Member, tôi muốn lọc task theo trạng thái, để tập trung vào các task cụ thể. |
| **Priority** | High |
| **Acceptance Criteria** | - Filter: TODO, IN_PROGRESS, REVIEW, DONE<br>- Có thể chọn nhiều status<br>- Hiển thị số lượng mỗi status |

---

### US-6.3: Lọc theo Priority
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.3 |
| **Title** | Lọc task theo độ ưu tiên |
| **Actor** | Member |
| **Story** | As a Member, I want to filter tasks by priority, so that I can see urgent tasks. |
| **Story (VN)** | Với vai trò Member, tôi muốn lọc task theo priority, để thấy task khẩn cấp. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Filter: LOW, NORMAL, HIGH, URGENT<br>- Có thể chọn nhiều priorities |

---

### US-6.4: Lọc theo Assignee
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.4 |
| **Title** | Lọc task theo người được gán |
| **Actor** | Member |
| **Story** | As a Member, I want to filter tasks by assignee, so that I can see who's working on what. |
| **Story (VN)** | Với vai trò Member, tôi muốn lọc task theo người được gán, để biết ai đang làm gì. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Filter theo tên member<br>- Có option "Assigned to me"<br>- Có option "Unassigned" |

---

### US-6.5: Lọc theo Due Date
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.5 |
| **Title** | Lọc task theo thời hạn |
| **Actor** | Member |
| **Story** | As a Member, I want to filter tasks by due date, so that I can manage deadlines. |
| **Story (VN)** | Với vai trò Member, tôi muốn lọc task theo deadline, để quản lý thời hạn. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Overdue (quá hạn)<br>- Due today (hôm nay)<br>- Due this week (tuần này)<br>- No due date |

---

### US-6.6: Sắp xếp Tasks
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-6.6 |
| **Title** | Sắp xếp danh sách task |
| **Actor** | Member |
| **Story** | As a Member, I want to sort tasks, so that I can organize them by different criteria. |
| **Story (VN)** | Với vai trò Member, tôi muốn sắp xếp task, để tổ chức theo tiêu chí khác nhau. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Sort by: Created date, Due date, Priority, Title<br>- Ascending/Descending<br>- Remember user preference |

---

## 7. THÔNG BÁO (Notifications)

### US-7.1: Xem danh sách thông báo
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.1 |
| **Title** | Xem tất cả thông báo |
| **Actor** | User |
| **Story** | As a User, I want to see all my notifications, so that I'm aware of updates. |
| **Story (VN)** | Với vai trò User, tôi muốn xem tất cả thông báo, để biết các cập nhật. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị danh sách notifications<br>- Phân biệt đã đọc/chưa đọc<br>- Click để đi đến item liên quan |

---

### US-7.2: In-app Notification
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.2 |
| **Title** | Hiển thị badge thông báo |
| **Actor** | System |
| **Story** | As a System, I want to show a notification badge, so that users know they have unread notifications. |
| **Story (VN)** | Với vai trò System, tôi muốn hiển thị badge thông báo, để user biết có thông báo chưa đọc. |
| **Priority** | High |
| **Acceptance Criteria** | - Bell icon với số lượng unread<br>- Real-time update khi có notification mới<br>- Badge biến mất khi đã đọc hết |

---

### US-7.3: Thông báo Assign Task
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.3 |
| **Title** | Gửi thông báo khi được gán task |
| **Actor** | System |
| **Story** | As a System, I should notify users when they're assigned to a task, so that they know about new responsibilities. |
| **Story (VN)** | Với vai trò System, tôi cần thông báo khi user được gán task, để họ biết về trách nhiệm mới. |
| **Priority** | High |
| **Acceptance Criteria** | - Gửi notification ngay khi assign<br>- Nội dung: "[Người assign] đã gán bạn vào task [Task name]"<br>- Link đến task |

---

### US-7.4: Thông báo Mention
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.4 |
| **Title** | Gửi thông báo khi được mention |
| **Actor** | System |
| **Story** | As a System, I should notify users when they're mentioned, so that they see relevant discussions. |
| **Story (VN)** | Với vai trò System, tôi cần thông báo khi user được mention, để họ thấy các thảo luận liên quan. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Gửi notification ngay khi mention<br>- Nội dung: "[Người mention] đã nhắc đến bạn trong [Task name]"<br>- Link đến comment |

---

### US-7.5: Thông báo Deadline
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.5 |
| **Title** | Nhắc nhở deadline |
| **Actor** | System |
| **Story** | As a System, I should remind users about upcoming deadlines, so that tasks are completed on time. |
| **Story (VN)** | Với vai trò System, tôi cần nhắc user về deadline sắp đến, để task được hoàn thành đúng hạn. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Nhắc trước 1 ngày<br>- Nhắc trước 1 giờ (optional)<br>- Chỉ gửi cho assignees |

---

### US-7.6: Đánh dấu đã đọc
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-7.6 |
| **Title** | Mark notification as read |
| **Actor** | User |
| **Story** | As a User, I want to mark notifications as read, so that I can track what I've seen. |
| **Story (VN)** | Với vai trò User, tôi muốn đánh dấu đã đọc, để theo dõi những gì đã xem. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Click notification = mark as read<br>- Button "Mark all as read"<br>- Badge count giảm |

---

## 8. DASHBOARD & THỐNG KÊ

### US-8.1: My Tasks
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-8.1 |
| **Title** | Xem tasks được gán cho mình |
| **Actor** | User |
| **Story** | As a User, I want to see all tasks assigned to me, so that I know my responsibilities. |
| **Story (VN)** | Với vai trò User, tôi muốn xem tất cả task được gán cho mình, để biết trách nhiệm của mình. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị tasks từ mọi workspaces<br>- Phân nhóm theo workspace/project<br>- Sort by due date mặc định |

---

### US-8.2: Due Today
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-8.2 |
| **Title** | Xem tasks đến hạn hôm nay |
| **Actor** | User |
| **Story** | As a User, I want to see tasks due today, so that I can prioritize my work. |
| **Story (VN)** | Với vai trò User, tôi muốn xem tasks đến hạn hôm nay, để ưu tiên công việc. |
| **Priority** | High |
| **Acceptance Criteria** | - Filter tasks với due date = today<br>- Highlight trên dashboard<br>- Count hiển thị ở sidebar |

---

### US-8.3: Overdue Tasks
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-8.3 |
| **Title** | Xem tasks quá hạn |
| **Actor** | User |
| **Story** | As a User, I want to see overdue tasks, so that I can address them immediately. |
| **Story (VN)** | Với vai trò User, tôi muốn xem tasks quá hạn, để xử lý ngay. |
| **Priority** | High |
| **Acceptance Criteria** | - Hiển thị tasks với due date < today và chưa DONE<br>- Highlight màu đỏ<br>- Warning badge |

---

### US-8.4: Tiến độ Project
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-8.4 |
| **Title** | Xem tiến độ project |
| **Actor** | Member |
| **Story** | As a Member, I want to see project progress, so that I know how much work is done. |
| **Story (VN)** | Với vai trò Member, tôi muốn xem tiến độ project, để biết đã hoàn thành bao nhiêu. |
| **Priority** | Medium |
| **Acceptance Criteria** | - Progress bar = (DONE tasks / Total tasks) %<br>- Hiển thị số liệu: 15/20 tasks completed<br>- Cập nhật real-time |

---

### US-8.5: Activity Log
| Thuộc tính | Giá trị |
|------------|---------|
| **ID** | US-8.5 |
| **Title** | Xem lịch sử hoạt động |
| **Actor** | Member |
| **Story** | As a Member, I want to see recent activities, so that I know what's happening in the workspace. |
| **Story (VN)** | Với vai trò Member, tôi muốn xem hoạt động gần đây, để biết điều gì đang xảy ra trong workspace. |
| **Priority** | Low |
| **Acceptance Criteria** | - Log: tạo task, complete task, add comment, etc.<br>- Hiển thị: [User] [action] [object] [time]<br>- Paginated list |

---

## 📊 TỔNG KẾT

| Module | Số User Stories |
|--------|-----------------|
| 1. Quản lý User | 6 |
| 2. Quản lý Workspace | 9 |
| 3. Quản lý Project | 6 |
| 4. Quản lý Task | 15 |
| 5. Quản lý Comment | 5 |
| 6. Tìm kiếm & Lọc | 6 |
| 7. Thông báo | 6 |
| 8. Dashboard & Thống kê | 5 |
| **TỔNG CỘNG** | **58 User Stories** |

---

## 📎 PHỤ LỤC: Acceptance Criteria Template

Mỗi User Story nên có Acceptance Criteria theo format:
- **Given** [context/precondition]
- **When** [action]
- **Then** [expected result]

Ví dụ cho US-4.1 (Tạo Task):
```gherkin
Given I am a Member of a workspace
And I am viewing a project
When I click "Create Task" button
And I enter title "Implement login feature"
And I select priority "HIGH"
And I click "Save"
Then a new task should be created with status "TODO"
And the task should appear in the task list
And I should see a success message
```
