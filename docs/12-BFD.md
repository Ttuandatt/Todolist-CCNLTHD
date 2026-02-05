# BUSINESS FLOW DIAGRAM (BFD)
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Mục đích:** Thể hiện luồng nghiệp vụ chính của hệ thống

---

## 1. AUTHENTICATION BUSINESS FLOW

### 1.1. Mô tả tổng quan
Luồng nghiệp vụ xác thực người dùng bao gồm đăng ký, đăng nhập, và quản lý phiên.

### 1.2. Sơ đồ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION BUSINESS FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐                                              ┌─────────────┐
    │ START   │                                              │    END      │
    └────┬────┘                                              └──────▲──────┘
         │                                                          │
         ▼                                                          │
    ┌─────────────────────────────┐                                │
    │  Người dùng truy cập        │                                │
    │  ứng dụng                   │                                │
    └─────────────┬───────────────┘                                │
                  │                                                 │
                  ▼                                                 │
         ◇────────────────◇                                        │
        ╱ Đã có tài khoản? ╲                                       │
       ╱                    ╲                                      │
      ◇────────────────────◇                                      │
      │ NO                 │ YES                                   │
      ▼                    ▼                                       │
┌──────────────┐    ┌──────────────┐                               │
│  ĐĂNG KÝ    │    │  ĐĂNG NHẬP   │                               │
│             │    │              │                               │
│ • Email     │    │ • Email/     │                               │
│ • Password  │    │   Password   │                               │
│ • Tên       │    │   HOẶC       │                               │
│ HOẶC        │    │ • OAuth      │                               │
│ • OAuth     │    │              │                               │
└──────┬──────┘    └───────┬──────┘                               │
       │                   │                                       │
       ▼                   ▼                                       │
  ┌─────────────────────────────┐                                 │
  │  Xác thực thông tin         │                                 │
  │  (Validate & Verify)        │                                 │
  └─────────────┬───────────────┘                                 │
                │                                                  │
       ◇────────┴────────◇                                        │
      ╱ Thành công?       ╲                                       │
     ╱                     ╲                                      │
    ◇───────────────────────◇                                     │
    │ NO                    │ YES                                 │
    ▼                       ▼                                     │
┌──────────────┐     ┌──────────────────┐                         │
│ Hiển thị     │     │ Tạo JWT Tokens   │                         │
│ lỗi         │     │ • Access Token   │                         │
│             │     │ • Refresh Token  │                         │
└──────────────┘     └────────┬─────────┘                         │
                              │                                    │
                              ▼                                    │
                     ┌──────────────────┐                         │
                     │ Chuyển đến       │                         │
                     │ Dashboard        │─────────────────────────┘
                     └──────────────────┘
```

### 1.3. Business Rules

| Rule ID | Mô tả | Điều kiện |
|---------|-------|-----------|
| BR-AUTH-01 | Email phải duy nhất | Không trùng với user đã tồn tại |
| BR-AUTH-02 | Password tối thiểu 8 ký tự | Có uppercase, lowercase, số |
| BR-AUTH-03 | Rate limit đăng nhập | 5 lần thất bại → khóa 15 phút |
| BR-AUTH-04 | Access token hết hạn 15 phút | Refresh tự động bằng refresh token |
| BR-AUTH-05 | Refresh token hết hạn 7 ngày | Yêu cầu đăng nhập lại |

---

## 2. WORKSPACE MANAGEMENT BUSINESS FLOW

### 2.1. Sơ đồ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    WORKSPACE MANAGEMENT BUSINESS FLOW                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────┐
                                    │ START   │
                                    └────┬────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │ User đã đăng nhập    │
                              └──────────┬───────────┘
                                         │
                     ┌───────────────────┼───────────────────┐
                     │                   │                   │
                     ▼                   ▼                   ▼
              ┌────────────┐      ┌────────────┐      ┌────────────┐
              │TẠO WORKSPACE│     │XEM WORKSPACE│     │THAM GIA WS │
              │  MỚI       │      │ HIỆN CÓ    │      │(VIA INVITE)│
              └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
            │Nhập thông tin  │   │Danh sách       │   │Click link mời  │
            │• Tên workspace │   │workspaces      │   │từ email        │
            │• Mô tả        │   │(owned + joined)│   │                │
            └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
            │User trở thành  │   │Chọn workspace  │   │Xác nhận tham   │
            │OWNER           │   │để truy cập     │   │gia             │
            └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
                             ┌────────────────────────┐
                             │   WORKSPACE DASHBOARD   │
                             │   • Xem projects       │
                             │   • Quản lý members    │
                             │   • Settings           │
                             └────────────┬───────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
        ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
        │ MỜI THÀNH VIÊN      │ │ TẠO PROJECT    │ │ CÀI ĐẶT WORKSPACE   │
        │ (Owner/Admin only)   │ │                │ │ (Owner/Admin only)  │
        └──────────┬──────────┘ └────────┬────────┘ └──────────┬──────────┘
                   │                     │                     │
                   ▼                     ▼                     ▼
        ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
        │Nhập email + chọn    │ │Nhập tên, mô tả │ │Đổi tên, mô tả,     │
        │role (Admin/Member)  │ │project         │ │chuyển owner, xóa   │
        └──────────┬──────────┘ └────────┬────────┘ └─────────────────────┘
                   │                     │
                   ▼                     ▼
        ┌─────────────────────┐ ┌─────────────────┐
        │Gửi email invitation │ │VÀO PROJECT      │
        └─────────────────────┘ │DASHBOARD        │
                                └─────────────────┘
```

### 2.2. Roles & Permissions Matrix

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| Xem workspace | ✅ | ✅ | ✅ |
| Mời thành viên | ✅ | ✅ | ❌ |
| Xóa thành viên | ✅ | ✅ | ❌ |
| Đổi role member | ✅ | ❌ | ❌ |
| Sửa thông tin WS | ✅ | ✅ | ❌ |
| Xóa workspace | ✅ | ❌ | ❌ |
| Chuyển ownership | ✅ | ❌ | ❌ |
| Tạo project | ✅ | ✅ | ✅ |

---

## 3. TASK MANAGEMENT BUSINESS FLOW

### 3.1. Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      TASK MANAGEMENT BUSINESS FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────┐
│ START   │
└────┬────┘
     │
     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           PROJECT KANBAN BOARD                                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐                  │
│  │    TODO    │  │IN_PROGRESS │  │   REVIEW   │  │    DONE    │                  │
│  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │                  │
│  │ │ Task 1 │ │  │ │ Task 3 │ │  │ │ Task 5 │ │  │ │ Task 6 │ │                  │
│  │ └────────┘ │  │ └────────┘ │  │ └────────┘ │  │ └────────┘ │                  │
│  │ ┌────────┐ │  │ ┌────────┐ │  │            │  │ ┌────────┐ │                  │
│  │ │ Task 2 │ │  │ │ Task 4 │ │  │            │  │ │ Task 7 │ │                  │
│  │ └────────┘ │  │ └────────┘ │  │            │  │ └────────┘ │                  │
│  │  [+ Add]   │  │            │  │            │  │            │                  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
             ┌────────────┐      ┌────────────┐      ┌────────────┐
             │TẠO TASK MỚI│      │XEM/SỬA TASK│      │KÉO THẢ TASK│
             └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
                   │                   │                   │
                   ▼                   ▼                   ▼
          ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
          │• Title (bắt buộc)│ │TASK DETAIL MODAL│  │Đổi trạng thái   │
          │• Description    │ │                 │  │(drag to column) │
          │• Priority       │ │• Xem thông tin  │  │                 │
          │• Due date       │ │• Sửa nội dung   │  │                 │
          │• Assignees      │ │• Thêm subtasks  │  │                 │
          │• Labels         │ │• Thêm comments  │  │                 │
          └────────┬────────┘ │• Upload files   │  └────────┬────────┘
                   │          └────────┬────────┘           │
                   │                   │                    │
                   └───────────────────┼────────────────────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │NOTIFICATION    │
                              │(Nếu có assignee│
                              │ mới hoặc       │
                              │ status thay đổi│
                              └────────────────┘
```

### 3.2. Task Lifecycle Flow

```
                              ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
                              ┃         TASK LIFECYCLE              ┃
                              ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ╔══════════════╗         ╔══════════════╗         ╔══════════════╗
    ║              ║  START  ║              ║ SUBMIT  ║              ║
    ║     TODO     ║ ───────►║ IN_PROGRESS  ║ ───────►║    REVIEW    ║
    ║              ║         ║              ║         ║              ║
    ╚═══════╤══════╝         ╚══════╤═══════╝         ╚══════╤═══════╝
            │                       │                        │
            │◄──────────────────────┘                        │
            │        BACK TO TODO                            │
            │                                                │
            │                       ┌────────────────────────┘
            │                       │      REJECT
            │                       ▼
            │               ╔══════════════╗
            │               ║              ║ APPROVE
            │               ║ IN_PROGRESS  ║ ───────►╔══════════════╗
            │               ║              ║         ║              ║
            │               ╚══════════════╝         ║     DONE     ║
            │                                        ║              ║
            │◄───────────────────────────────────────╚══════╤═══════╝
                            REOPEN                          │
                                                            │
                                                            ▼
                                                     ┌────────────┐
                                                     │    END     │
                                                     └────────────┘
```

---

## 4. NOTIFICATION BUSINESS FLOW

### 4.1. Sơ đồ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       NOTIFICATION BUSINESS FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │           NOTIFICATION TRIGGERS          │
                    └─────────────────────┬───────────────────┘
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       │                │                 │                │                 │
       ▼                ▼                 ▼                ▼                 ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│TASK_ASSIGNED│ │ MENTIONED   │ │TASK_DUE_SOON│ │COMMENT_ADDED│ │WORKSPACE    │
│             │ │ (@mention)  │ │(1 day before)│ │             │ │  _INVITE    │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │                │                │                │                │
       └────────────────┴────────────────┼────────────────┴────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ Create Notification │
                              │ Record in DB        │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ User Online?        │
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ YES                                     │ NO
                    ▼                                         ▼
         ┌─────────────────────┐                   ┌─────────────────────┐
         │ Push via WebSocket  │                   │ Store for later     │
         │ (Real-time)         │                   │ (User fetches when  │
         └──────────┬──────────┘                   │  logging in)        │
                    │                              └─────────────────────┘
                    ▼
         ┌─────────────────────┐
         │ Show:               │
         │ • Toast notification│
         │ • Badge update      │
         │ • Bell icon count   │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ User clicks         │
         │ notification        │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ • Mark as read      │
         │ • Navigate to       │
         │   related resource  │
         │   (task, comment)   │
         └─────────────────────┘
```

### 4.2. Notification Types

| Type | Trigger | Recipient | Content |
|------|---------|-----------|---------|
| TASK_ASSIGNED | Gán task | Assignee | "You have been assigned to [task]" |
| TASK_UNASSIGNED | Hủy gán | Previous assignee | "You were removed from [task]" |
| MENTIONED | @mention trong comment | Mentioned user | "[user] mentioned you in [task]" |
| TASK_DUE_SOON | Scheduled job | Task assignees | "[task] is due tomorrow" |
| TASK_OVERDUE | Scheduled job | Task assignees | "[task] is overdue" |
| COMMENT_ADDED | New comment | Task assignees | "[user] commented on [task]" |
| WORKSPACE_INVITE | Mời vào workspace | Invited email | "You're invited to [workspace]" |

---

## 5. COMPLETE USER JOURNEY

### 5.1. End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          COMPLETE USER JOURNEY                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │ 1. ONBOARDING │     Đăng ký → Đăng nhập → Dashboard
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 2. SETUP      │     Tạo Workspace → Mời Team → Tạo Projects
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 3. DAILY WORK │     Tạo Tasks → Assign → Cập nhật Status → Comment
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 4. COLLABORATE│     Nhận Notifications → View Updates → Respond
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ 5. TRACK      │     My Tasks → Due Today → Overdue → Progress
    └───────────────┘
```

---

## 6. TỔNG KẾT

| Business Flow | Actors Involved | Key Processes |
|---------------|-----------------|---------------|
| Authentication | Guest, User, OAuth Providers | Register, Login, Token Management |
| Workspace Management | Owner, Admin, Member | Create, Invite, Manage Roles |
| Task Management | Member | CRUD, Assignment, Status Tracking |
| Notification | System, Member | Trigger, Deliver, Mark Read |
