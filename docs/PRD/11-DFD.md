# DATA FLOW DIAGRAM (DFD)
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Notation:** Gane-Sarson / Yourdon-DeMarco

---

## 1. CONTEXT DIAGRAM (DFD Level 0)

### 1.1. Mô tả
Sơ đồ ngữ cảnh thể hiện hệ thống TodoList Collaboration như một "hộp đen" và các external entities tương tác với nó.

### 1.2. Sơ đồ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONTEXT DIAGRAM (DFD Level 0)                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Email Server  │
                              │   (External)    │
                              └────────┬────────┘
                                       │
                          Email notifications
                                       │
                                       ▼
┌─────────────┐         ┌──────────────────────────────────┐         ┌─────────────┐
│             │         │                                  │         │             │
│    User     │◄───────►│     TODOLIST COLLABORATION       │◄───────►│   OAuth     │
│  (Actor)    │         │           SYSTEM                 │         │  Provider   │
│             │  Tasks, │                                  │  Auth   │  (Google,   │
│             │Comments,│              0                   │  Data   │   GitHub)   │
└─────────────┘ Workspaces└────────────┬───────────────────┘         └─────────────┘
       ▲                               │
       │                               │
       │                               ▼
       │                    ┌─────────────────┐
       │                    │  File Storage   │
       │                    │  (Local/S3)     │
       └────────────────────┤   (External)    │
           Attachments      └─────────────────┘
```

### 1.3. Data Flows

| External Entity | Data Flow IN | Data Flow OUT |
|-----------------|--------------|---------------|
| **User** | Login credentials, Task data, Comments, Files | Tasks, Notifications, Reports |
| **OAuth Provider** | Auth request | Auth token, User profile |
| **Email Server** | Send email request | Email delivery status |
| **File Storage** | Upload file request | File URL, Download |

---

## 2. DFD LEVEL 1 - MAIN PROCESSES

### 2.1. Sơ đồ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DFD LEVEL 1                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

                                                            ┌──────────────────┐
                                                            │   D1. Users      │
                                                            │   Data Store     │
                                                            └─────────┬────────┘
                                                                      │
                              ╔═══════════════════╗                   │
  ┌──────────┐   Credentials  ║                   ║   User Info       │
  │          │ ─────────────► ║   1.0             ║ ◄─────────────────┘
  │   User   │                ║   AUTHENTICATION  ║
  │          │ ◄───────────── ║   PROCESS         ║
  └──────────┘    JWT Token   ╚═════════╤═════════╝
       │                                │
       │                                │ Authenticated User
       │                                ▼
       │                      ╔═══════════════════╗          ┌──────────────────┐
       │   Workspace Data     ║                   ║          │  D2. Workspaces  │
       │ ◄──────────────────► ║   2.0             ║ ◄───────►│   Data Store     │
       │                      ║   WORKSPACE       ║          └──────────────────┘
       │                      ║   MANAGEMENT      ║
       │                      ╚═════════╤═════════╝
       │                                │
       │                                │ Workspace Context
       │                                ▼
       │                      ╔═══════════════════╗          ┌──────────────────┐
       │   Project Data       ║                   ║          │  D3. Projects    │
       │ ◄──────────────────► ║   3.0             ║ ◄───────►│   Data Store     │
       │                      ║   PROJECT         ║          └──────────────────┘
       │                      ║   MANAGEMENT      ║
       │                      ╚═════════╤═════════╝
       │                                │
       │                                │ Project Context
       │                                ▼
       │                      ╔═══════════════════╗          ┌──────────────────┐
       │   Task Data          ║                   ║          │  D4. Tasks       │
       │ ◄──────────────────► ║   4.0             ║ ◄───────►│   Data Store     │
       │                      ║   TASK            ║          └──────────────────┘
       │                      ║   MANAGEMENT      ║
       │                      ╚═════════╤═════════╝
       │                                │
       │                                │ Task Events
       │                                ▼
       │                      ╔═══════════════════╗          ┌──────────────────┐
       │   Notifications      ║                   ║          │ D5. Notifications│
       │ ◄────────────────────║   5.0             ║ ◄───────►│   Data Store     │
       │                      ║   NOTIFICATION    ║          └──────────────────┘
       │                      ║   PROCESS         ║
       │                      ╚═══════════════════╝
```

### 2.2. Process Descriptions

| Process | Name | Description | Input | Output |
|---------|------|-------------|-------|--------|
| 1.0 | Authentication | Xử lý đăng ký, đăng nhập, token management | Credentials | JWT Token, User Session |
| 2.0 | Workspace Management | Quản lý workspaces và members | Workspace Data | Workspace Info, Member List |
| 3.0 | Project Management | Quản lý projects trong workspace | Project Data | Project List, Settings |
| 4.0 | Task Management | CRUD tasks, subtasks, assignments | Task Data | Task List, Updates |
| 5.0 | Notification | Xử lý và gửi thông báo | Task Events | Notifications |

### 2.3. Data Stores

| Store | Name | Contents |
|-------|------|----------|
| D1 | Users | User accounts, profiles, credentials |
| D2 | Workspaces | Workspace info, members, roles |
| D3 | Projects | Project info, settings |
| D4 | Tasks | Tasks, subtasks, assignments, labels |
| D5 | Notifications | In-app notifications, read status |

---

## 3. DFD LEVEL 2 - AUTHENTICATION PROCESS

### 3.1. Sơ đồ chi tiết Process 1.0

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DFD LEVEL 2 - AUTHENTICATION PROCESS (1.0)                    │
└─────────────────────────────────────────────────────────────────────────────────┘

                                                 ┌─────────────────┐
                                                 │   D1. Users     │
                                                 └───────┬─────────┘
                                                         │
                                                         │
  ┌──────────┐                                           │
  │          │   Registration Data                       │
  │  Guest   │ ──────────────────────►╔═════════════════════╗
  │          │                        ║   1.1               ║
  │          │◄───────────────────────║   REGISTER          ║──────► Hashed
  │          │   Success/Error        ║   USER              ║        Password
  └──────────┘                        ╚═════════════════════╝        │
       │                                                             │
       │                                                             ▼
       │   Login Credentials          ╔═════════════════════╗    ┌───────┐
       │ ──────────────────────────►  ║   1.2               ║    │ D1    │
       │                              ║   VALIDATE          ║◄───┤Users  │
       │◄─────────────────────────────║   CREDENTIALS       ║    └───────┘
       │   Valid/Invalid              ╚══════════╤══════════╝
       │                                         │
       │                                         │ Valid User
       │                                         ▼
       │                              ╔═════════════════════╗    ┌─────────────┐
       │   JWT Tokens                 ║   1.3               ║    │ JWT Service │
       │ ◄────────────────────────────║   GENERATE          ║◄───┤             │
       │                              ║   TOKENS            ║    └─────────────┘
       │                              ╚══════════╤══════════╝
       │                                         │
       │                                         ▼
       │                              ╔═════════════════════╗    ┌───────────────┐
       │   Password Reset Link        ║   1.4               ║    │ Email Server  │
       │ ◄────────────────────────────║   RESET             ║───►│   (SMTP)      │
       │                              ║   PASSWORD          ║    └───────────────┘
       │   New Password               ╚═════════════════════╝
       │ ──────────────────────────►
       │
       │                              ╔═════════════════════╗
       │   Refresh Token              ║   1.5               ║
       │ ──────────────────────────►  ║   REFRESH           ║
       │◄─────────────────────────────║   TOKEN             ║
       │   New Access Token           ╚═════════════════════╝
```

### 3.2. Sub-processes

| Process | Name | Description |
|---------|------|-------------|
| 1.1 | Register User | Validate input, hash password, create user record |
| 1.2 | Validate Credentials | Check email/password against stored data |
| 1.3 | Generate Tokens | Create JWT access + refresh tokens |
| 1.4 | Reset Password | Generate reset link, send email, update password |
| 1.5 | Refresh Token | Validate refresh token, issue new access token |

---

## 4. DFD LEVEL 2 - TASK MANAGEMENT PROCESS

### 4.1. Sơ đồ chi tiết Process 4.0

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DFD LEVEL 2 - TASK MANAGEMENT PROCESS (4.0)                   │
└─────────────────────────────────────────────────────────────────────────────────┘

                           ┌────────────┐  ┌────────────┐  ┌────────────────┐
                           │D4.Tasks    │  │D4.2 Subtasks│ │D4.3 Assignments│
                           └─────┬──────┘  └──────┬─────┘  └───────┬────────┘
                                 │                │                 │
  ┌──────────┐                   │                │                 │
  │          │                   ▼                ▼                 ▼
  │  Member  │   Create Task   ╔═══════════════════════════════════════════╗
  │          │ ───────────────►║              4.1                          ║
  │          │                 ║         CRUD TASK                         ║
  │          │◄────────────────║                                           ║
  │          │   Task Created  ╚══════════════════╤════════════════════════╝
  │          │                                    │
  │          │                                    │ Task ID
  │          │   Status Update                    ▼
  │          │ ───────────────►╔═══════════════════════════════════════════╗
  │          │                 ║              4.2                          ║
  │          │◄────────────────║         UPDATE STATUS                     ║──────►┌───────────┐
  │          │   Updated       ║   (TODO→IN_PROGRESS→REVIEW→DONE)          ║      │ Process   │
  │          │                 ╚══════════════════╤════════════════════════╝      │ 5.0       │
  │          │                                    │                               │Notification│
  │          │   Assign User                      │ Status Changed                └───────────┘
  │          │ ───────────────►╔═══════════════════════════════════════════╗         ▲
  │          │                 ║              4.3                          ║         │
  │          │◄────────────────║         ASSIGN/UNASSIGN                   ║─────────┘
  │          │   Assigned      ║                                           ║  Notify Assignee
  │          │                 ╚══════════════════╤════════════════════════╝
  │          │                                    │
  │          │   Subtask Data                     │
  │          │ ───────────────►╔═══════════════════════════════════════════╗
  │          │                 ║              4.4                          ║
  │          │◄────────────────║         MANAGE SUBTASKS                   ║
  │          │   Subtask List  ║                                           ║
  │          │                 ╚══════════════════╤════════════════════════╝
  │          │                                    │
  │          │   Label Data                       │
  │          │ ───────────────►╔═══════════════════════════════════════════╗
  │          │                 ║              4.5                          ║◄───┌───────────┐
  │          │◄────────────────║         MANAGE LABELS                     ║    │D4.4 Labels│
  │          │   Labels        ║                                           ║───►└───────────┘
  │          │                 ╚══════════════════╤════════════════════════╝
  │          │                                    │
  │          │   Attachment                       │
  │          │ ───────────────►╔═══════════════════════════════════════════╗
  │          │                 ║              4.6                          ║◄───┌───────────┐
  │          │◄────────────────║         FILE ATTACHMENTS                  ║    │File Storage│
  │          │   File URL      ║                                           ║───►└───────────┘
  └──────────┘                 ╚═══════════════════════════════════════════╝
```

### 4.2. Sub-processes

| Process | Name | Input | Output | Data Store |
|---------|------|-------|--------|------------|
| 4.1 | CRUD Task | Task data | Task record | D4. Tasks |
| 4.2 | Update Status | Task ID, new status | Updated task | D4. Tasks |
| 4.3 | Assign/Unassign | Task ID, User ID | Assignment | D4.3 Assignments |
| 4.4 | Manage Subtasks | Subtask data | Subtask list | D4.2 Subtasks |
| 4.5 | Manage Labels | Label IDs | Task labels | D4.4 Labels |
| 4.6 | File Attachments | File data | File URL | File Storage |

---

## 5. DATA DICTIONARY

### 5.1. Data Flows

| Data Flow | Description | Content |
|-----------|-------------|---------|
| Credentials | Thông tin đăng nhập | {email, password} |
| JWT Token | Token xác thực | {accessToken, refreshToken, expiresIn} |
| Task Data | Thông tin task | {title, description, status, priority, dueDate, ...} |
| Workspace Data | Thông tin workspace | {name, description, members[], projects[]} |
| Notification | Thông báo | {type, title, message, userId, isRead} |

### 5.2. Data Stores

| Store ID | Name | Attributes |
|----------|------|------------|
| D1 | Users | id, email, password, name, avatar, status |
| D2 | Workspaces | id, name, description, ownerId |
| D3 | Projects | id, name, description, workspaceId, status |
| D4 | Tasks | id, title, description, projectId, status, priority |
| D5 | Notifications | id, type, title, message, userId, isRead |

---

## 6. TỔNG KẾT

| Level | Diagram | Processes | Data Stores |
|-------|---------|-----------|-------------|
| Level 0 | Context | 1 (System) | - |
| Level 1 | Main | 5 | 5 |
| Level 2 - Auth | Authentication | 5 | 2 |
| Level 2 - Task | Task Management | 6 | 4 |
