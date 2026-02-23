# SEQUENCE DIAGRAM - SƠ ĐỒ TUẦN TỰ
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 2.0  
> **Ngày cập nhật:** 05/02/2026  
> **Notation:** UML 2.0 / Mermaid

---

## MỤC LỤC

1. [Authentication Module](#1-authentication-module)
2. [User Module](#2-user-module)
3. [Workspace Module](#3-workspace-module)
4. [Project Module](#4-project-module)
5. [Task Module](#5-task-module)
6. [Comment Module](#6-comment-module)
7. [Notification Module](#7-notification-module)
8. [Attachment Module](#8-attachment-module)

---

## 1. AUTHENTICATION MODULE

### SD-1.1: Đăng ký tài khoản (Register)

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant FE as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant PS as PrismaService
    participant MS as MailService
    participant DB as PostgreSQL

    Guest->>FE: Nhập email, password, name
    FE->>FE: Validate form (email format, password strength)
    FE->>AC: POST /auth/register (RegisterDto)
    AC->>AS: register(dto)
    AS->>PS: findUnique({email})
    PS->>DB: SELECT * FROM users WHERE email = ?
    DB-->>PS: null (email chưa tồn tại)
    
    alt Email đã tồn tại
        PS-->>AS: User exists
        AS-->>AC: throw ConflictException
        AC-->>FE: 409 "Email already registered"
    else Email mới
        AS->>AS: bcrypt.hash(password, 10)
        AS->>PS: create({email, password, name})
        PS->>DB: INSERT INTO users (...)
        DB-->>PS: New User
        AS->>AS: generateTokens(user)
        AS->>MS: sendVerificationEmail(email)
        AS-->>AC: TokenResponseDto
        AC-->>FE: 201 {accessToken, refreshToken, user}
        FE->>FE: Lưu tokens
        FE-->>Guest: Redirect Dashboard
    end
```

### SD-1.2: Đăng nhập (Login)

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant FE as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant PS as PrismaService
    participant JWT as JwtService
    participant DB as PostgreSQL

    Guest->>FE: Nhập email, password
    FE->>AC: POST /auth/login (LoginDto)
    AC->>AS: login(dto)
    AS->>PS: findUnique({email})
    PS->>DB: SELECT * FROM users WHERE email = ?
    DB-->>PS: User | null
    
    alt User không tồn tại
        AS-->>AC: throw UnauthorizedException
        AC-->>FE: 401 "Invalid credentials"
    else User tồn tại
        AS->>AS: bcrypt.compare(password, hash)
        alt Password sai
            AS-->>AC: throw UnauthorizedException
            AC-->>FE: 401 "Invalid credentials"
        else Password đúng
            AS->>JWT: sign(payload, accessSecret)
            JWT-->>AS: accessToken
            AS->>JWT: sign(payload, refreshSecret)
            JWT-->>AS: refreshToken
            AS->>PS: update({lastLoginAt: now})
            PS->>DB: UPDATE users SET lastLoginAt = ?
            AS-->>AC: TokenResponseDto
            AC-->>FE: 200 {accessToken, refreshToken, user}
            FE-->>Guest: Redirect to Dashboard
        end
    end
```

### SD-1.3: Refresh Token

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend
    participant INT as Axios Interceptor
    participant AC as AuthController
    participant AS as AuthService
    participant JWT as JwtService

    FE->>FE: API request với expired accessToken
    FE->>INT: Response 401 Unauthorized
    INT->>INT: Check refreshToken exists
    
    alt No refreshToken
        INT-->>FE: Redirect to login
    else Has refreshToken
        INT->>AC: POST /auth/refresh {refreshToken}
        AC->>AS: refreshToken(token)
        AS->>JWT: verify(token, refreshSecret)
        
        alt Token invalid/expired
            AS-->>AC: throw UnauthorizedException
            AC-->>INT: 401 Unauthorized
            INT-->>FE: Clear tokens, redirect login
        else Token valid
            AS->>AS: Generate new tokens
            AS-->>AC: {newAccessToken, newRefreshToken}
            AC-->>INT: 200 OK + tokens
            INT->>INT: Update stored tokens
            INT->>INT: Retry original request
        end
    end
```

### SD-1.4: OAuth Login (Google/GitHub)

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant FE as Frontend
    participant AC as AuthController
    participant OS as OAuthStrategy
    participant AS as AuthService
    participant PS as PrismaService
    participant Provider as Google/GitHub

    Guest->>FE: Click "Login with Google"
    FE->>AC: GET /auth/google
    AC->>Provider: Redirect to OAuth consent
    Provider-->>Guest: Show consent screen
    Guest->>Provider: Grant permission
    Provider->>AC: GET /auth/google/callback?code=xxx
    AC->>OS: validate(accessToken, profile)
    OS->>PS: findFirst({provider, providerId})
    
    alt User exists
        PS-->>OS: OAuthAccount
        OS->>PS: update({accessToken})
    else New user
        OS->>PS: create({user, oauthAccount})
    end
    
    OS-->>AC: User
    AC->>AS: generateTokens(user)
    AS-->>AC: tokens
    AC-->>FE: Redirect with tokens
    FE-->>Guest: Dashboard
```

### SD-1.5: Quên mật khẩu (Forgot Password)

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant FE as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant MS as MailService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Guest->>FE: Nhập email
    FE->>AC: POST /auth/forgot-password {email}
    AC->>AS: forgotPassword(email)
    AS->>PS: findUnique({email})
    PS->>DB: SELECT * FROM users WHERE email = ?
    
    alt User exists
        AS->>AS: generateResetToken()
        AS->>PS: update({resetToken, resetTokenExpiry})
        PS->>DB: UPDATE users SET resetToken = ?
        AS->>MS: sendResetPasswordEmail(email, token)
        MS-->>Guest: Email with reset link
    end
    
    AS-->>AC: {message: "Email sent if exists"}
    AC-->>FE: 200 OK
    FE-->>Guest: "Check your email"
```

### SD-1.6: Đặt lại mật khẩu (Reset Password)

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant FE as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Guest->>FE: Click link từ email, nhập new password
    FE->>AC: POST /auth/reset-password {token, newPassword}
    AC->>AS: resetPassword(token, newPassword)
    AS->>PS: findFirst({resetToken, resetTokenExpiry > now})
    PS->>DB: SELECT * FROM users WHERE resetToken = ?
    
    alt Token invalid/expired
        AS-->>AC: throw BadRequestException
        AC-->>FE: 400 "Invalid or expired token"
    else Token valid
        AS->>AS: bcrypt.hash(newPassword)
        AS->>PS: update({password, resetToken: null})
        PS->>DB: UPDATE users SET password = ?, resetToken = NULL
        AS-->>AC: Success
        AC-->>FE: 200 "Password reset successfully"
        FE-->>Guest: Redirect to login
    end
```

---

## 2. USER MODULE

### SD-2.1: Xem Profile

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant UC as UserController
    participant AG as AuthGuard
    participant US as UserService
    participant PS as PrismaService

    User->>FE: Navigate to Profile
    FE->>UC: GET /users/me (Bearer Token)
    UC->>AG: Validate JWT
    AG-->>UC: userId
    UC->>US: getProfile(userId)
    US->>PS: findUnique({id: userId})
    PS-->>US: User
    US-->>UC: UserResponseDto
    UC-->>FE: 200 {user}
    FE-->>User: Display profile
```

### SD-2.2: Cập nhật Profile

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant UC as UserController
    participant US as UserService
    participant PS as PrismaService
    participant DB as PostgreSQL

    User->>FE: Edit name, submit
    FE->>UC: PATCH /users/me {name}
    UC->>US: updateProfile(userId, dto)
    US->>PS: update({id: userId}, {name})
    PS->>DB: UPDATE users SET name = ?
    DB-->>PS: Updated User
    US-->>UC: UserResponseDto
    UC-->>FE: 200 {user}
    FE-->>User: Show success, update UI
```

### SD-2.3: Đổi mật khẩu

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant UC as UserController
    participant US as UserService
    participant PS as PrismaService

    User->>FE: Enter current & new password
    FE->>UC: POST /users/me/change-password
    UC->>US: changePassword(userId, dto)
    US->>PS: findUnique({id: userId})
    PS-->>US: User with password hash
    US->>US: bcrypt.compare(currentPassword, hash)
    
    alt Current password wrong
        US-->>UC: throw BadRequestException
        UC-->>FE: 400 "Current password incorrect"
    else Password correct
        US->>US: bcrypt.hash(newPassword)
        US->>PS: update({password: newHash})
        US-->>UC: Success
        UC-->>FE: 200 "Password changed"
    end
```

### SD-2.4: Upload Avatar

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant UC as UserController
    participant US as UserService
    participant UPS as UploadService
    participant PS as PrismaService
    participant FS as FileStorage

    User->>FE: Select image file
    FE->>FE: Validate file (size < 5MB, type)
    FE->>UC: POST /users/me/avatar (multipart/form-data)
    UC->>UC: Validate file filter
    UC->>UPS: uploadFile(file, 'avatars/')
    UPS->>FS: Save file (local/S3)
    FS-->>UPS: fileUrl
    UC->>US: updateAvatar(userId, fileUrl)
    US->>PS: update({id: userId}, {avatar: fileUrl})
    US-->>UC: UserResponseDto
    UC-->>FE: 200 {user with new avatar}
    FE-->>User: Display new avatar
```

---

## 3. WORKSPACE MODULE

### SD-3.1: Tạo Workspace

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant WC as WorkspaceController
    participant WS as WorkspaceService
    participant PS as PrismaService
    participant DB as PostgreSQL

    User->>FE: Fill name, description
    FE->>WC: POST /workspaces {name, description}
    WC->>WS: create(userId, dto)
    WS->>PS: $transaction([createWorkspace, createMember])
    PS->>DB: INSERT INTO workspaces (...)
    PS->>DB: INSERT INTO workspace_members (role: OWNER)
    DB-->>PS: Workspace + Member
    WS-->>WC: WorkspaceResponseDto
    WC-->>FE: 201 {workspace}
    FE-->>User: Show new workspace
```

### SD-3.2: Xem danh sách Workspaces

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant WC as WorkspaceController
    participant WS as WorkspaceService
    participant PS as PrismaService

    User->>FE: Navigate to Workspaces
    FE->>WC: GET /workspaces
    WC->>WS: findAll(userId)
    WS->>PS: findMany({members: {some: {userId}}})
    PS-->>WS: Workspaces[]
    WS-->>WC: WorkspaceResponseDto[]
    WC-->>FE: 200 {data: [...], meta: {...}}
    FE-->>User: Display workspace list
```

### SD-3.3: Mời thành viên (Invite Member)

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend
    participant WC as WorkspaceController
    participant RG as RolesGuard
    participant WS as WorkspaceService
    participant MS as MailService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Admin->>FE: Enter email, select role
    FE->>WC: POST /workspaces/:id/invite {email, role}
    WC->>RG: Check role (OWNER/ADMIN required)
    RG-->>WC: Authorized
    WC->>WS: inviteMember(workspaceId, dto)
    
    WS->>PS: findFirst({email})
    alt Email đã là member
        WS-->>WC: throw ConflictException
        WC-->>FE: 409 "Already a member"
    else Email chưa là member
        WS->>WS: generateInviteToken()
        WS->>PS: create({invitation pending})
        PS->>DB: INSERT INTO workspace_invitations
        WS->>MS: sendInviteEmail(email, token, workspace)
        MS-->>FE: Email sent
        WS-->>WC: {message: "Invitation sent"}
        WC-->>FE: 200 OK
        FE-->>Admin: Show success
    end
```

### SD-3.4: Chấp nhận lời mời (Accept Invitation)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant WC as WorkspaceController
    participant WS as WorkspaceService
    participant NS as NotificationService
    participant PS as PrismaService
    participant DB as PostgreSQL

    User->>FE: Click link trong email
    FE->>WC: POST /workspaces/accept-invite/:token
    WC->>WS: acceptInvite(userId, token)
    WS->>PS: findFirst({token, expiresAt > now})
    
    alt Token invalid/expired
        WS-->>WC: throw BadRequestException
        WC-->>FE: 400 "Invalid invitation"
    else Token valid
        WS->>PS: $transaction([deleteinvitation, createMember])
        PS->>DB: DELETE FROM workspace_invitations
        PS->>DB: INSERT INTO workspace_members
        WS->>NS: notifyWorkspaceMembers("New member joined")
        WS-->>WC: WorkspaceResponseDto
        WC-->>FE: 200 {workspace}
        FE-->>User: Redirect to workspace
    end
```

### SD-3.5: Quản lý vai trò (Update Member Role)

```mermaid
sequenceDiagram
    autonumber
    actor Owner
    participant FE as Frontend
    participant WC as WorkspaceController
    participant RG as RolesGuard
    participant WS as WorkspaceService
    participant PS as PrismaService

    Owner->>FE: Change member role
    FE->>WC: PATCH /workspaces/:id/members/:userId {role}
    WC->>RG: Check role (OWNER only)
    RG-->>WC: Authorized
    WC->>WS: updateMemberRole(workspaceId, userId, newRole)
    WS->>PS: update({workspaceId, userId}, {role})
    WS-->>WC: Updated member
    WC-->>FE: 200 OK
    FE-->>Owner: Role updated
```

### SD-3.6: Xóa thành viên (Remove Member)

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant FE as Frontend
    participant WC as WorkspaceController
    participant WS as WorkspaceService
    participant PS as PrismaService

    Admin->>FE: Click remove member
    FE->>WC: DELETE /workspaces/:id/members/:userId
    WC->>WS: removeMember(workspaceId, userId)
    
    alt User là Owner
        WS-->>WC: throw ForbiddenException
        WC-->>FE: 403 "Cannot remove owner"
    else Not Owner
        WS->>PS: delete({workspaceId, userId})
        WS-->>WC: Success
        WC-->>FE: 204 No Content
        FE-->>Admin: Member removed from list
    end
```

---

## 4. PROJECT MODULE

### SD-4.1: Tạo Project

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant PC as ProjectController
    participant WG as WorkspaceGuard
    participant PjS as ProjectService
    participant NS as NotificationService
    participant PS as PrismaService

    Member->>FE: Fill project name, color
    FE->>PC: POST /workspaces/:wsId/projects
    PC->>WG: Check workspace membership
    WG-->>PC: Authorized
    PC->>PjS: create(workspaceId, dto)
    PjS->>PS: create({name, workspaceId, color})
    PS-->>PjS: New Project
    PjS->>NS: notifyWorkspace("New project created")
    PjS-->>PC: ProjectResponseDto
    PC-->>FE: 201 {project}
    FE-->>Member: Show new project
```

### SD-4.2: Xem chi tiết Project (Kanban Board)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant PC as ProjectController
    participant PjS as ProjectService
    participant TS as TaskService
    participant PS as PrismaService

    Member->>FE: Click project
    FE->>PC: GET /projects/:id
    PC->>PjS: findOne(projectId)
    PjS->>PS: findUnique({id}, {include: tasks, workspace})
    PS-->>PjS: Project with relations
    PjS-->>PC: ProjectDetailDto
    
    FE->>PC: GET /projects/:id/tasks?groupBy=status
    PC->>TS: findAll(projectId, {groupBy: status})
    TS->>PS: findMany({projectId}, {orderBy: position})
    PS-->>TS: Tasks grouped by status
    TS-->>PC: {TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: []}
    PC-->>FE: 200 {tasks by column}
    FE-->>Member: Render Kanban board
```

### SD-4.3: Archive/Unarchive Project

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant PC as ProjectController
    participant PjS as ProjectService
    participant PS as PrismaService

    Member->>FE: Click Archive
    FE->>PC: POST /projects/:id/archive
    PC->>PjS: archive(projectId)
    PjS->>PS: update({id}, {status: 'ARCHIVED'})
    PS-->>PjS: Updated project
    PjS-->>PC: ProjectResponseDto
    PC-->>FE: 200 {project}
    FE-->>Member: Move to archived list
```

---

## 5. TASK MODULE

### SD-5.1: Tạo Task

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant NS as NotificationService
    participant ALS as ActivityLogService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Click "Add Task", fill form
    FE->>TC: POST /projects/:projId/tasks (CreateTaskDto)
    TC->>TS: create(projectId, userId, dto)
    
    TS->>PS: findMany({projectId, status: dto.status})
    PS-->>TS: Existing tasks (for position)
    TS->>TS: Calculate new position
    
    TS->>PS: create({...dto, position, createdById})
    PS->>DB: INSERT INTO tasks (...)
    DB-->>PS: New Task
    
    TS->>ALS: log("CREATE", "Task", taskId, userId)
    ALS->>PS: create({activityLog})
    
    opt Có assignees
        TS->>PS: createMany({taskAssignments})
        loop Each assignee
            TS->>NS: notifyTaskAssigned(task, assigneeId)
        end
    end
    
    TS-->>TC: TaskResponseDto
    TC-->>FE: 201 {task}
    FE-->>Member: Add task to Kanban column
```

### SD-5.2: Cập nhật Task

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant ALS as ActivityLogService
    participant PS as PrismaService

    Member->>FE: Edit task details
    FE->>TC: PATCH /tasks/:id (UpdateTaskDto)
    TC->>TS: update(taskId, userId, dto)
    TS->>PS: findUnique({id: taskId})
    PS-->>TS: Current task (for comparison)
    
    TS->>PS: update({id: taskId}, dto)
    PS-->>TS: Updated task
    
    TS->>ALS: log("UPDATE", "Task", taskId, {oldValue, newValue})
    TS-->>TC: TaskResponseDto
    TC-->>FE: 200 {task}
    FE-->>Member: Update task card
```

### SD-5.3: Thay đổi trạng thái (Drag & Drop)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant NS as NotificationService
    participant WS as WebSocket Gateway
    participant PS as PrismaService

    Member->>FE: Drag task to new column
    FE->>TC: PATCH /tasks/:id/status {status, position}
    TC->>TS: updateStatus(taskId, status, position)
    
    TS->>PS: findUnique({id: taskId})
    PS-->>TS: Task with project
    
    TS->>TS: Reorder tasks in column
    TS->>PS: updateMany({position adjustments})
    TS->>PS: update({id: taskId}, {status, position})
    
    opt Status = DONE
        TS->>PS: update({completedAt: now()})
    end
    
    PS-->>TS: Updated task
    TS->>WS: broadcast("task:updated", {task, projectId})
    WS-->>FE: Real-time update to all users
    
    TS-->>TC: TaskResponseDto
    TC-->>FE: 200 {task}
    FE-->>Member: Task moved to new column
```

### SD-5.4: Gán người thực hiện (Assign Task)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant NS as NotificationService
    participant WS as WebSocket Gateway
    participant PS as PrismaService

    Member->>FE: Select assignee from dropdown
    FE->>TC: POST /tasks/:id/assignees {userId}
    TC->>TS: assignUser(taskId, assigneeId)
    
    TS->>PS: findFirst({taskId, userId: assigneeId})
    alt Already assigned
        TS-->>TC: throw ConflictException
        TC-->>FE: 409 "Already assigned"
    else Not assigned
        TS->>PS: create({taskId, userId: assigneeId})
        PS-->>TS: TaskAssignment
        
        TS->>NS: create({type: TASK_ASSIGNED, userId: assigneeId})
        NS->>PS: create({notification})
        NS->>WS: emit("notification", {userId: assigneeId, data})
        
        TS-->>TC: Success
        TC-->>FE: 200 OK
        FE-->>Member: Show assignee avatar on task
    end
```

### SD-5.5: Hủy gán (Unassign Task)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant NS as NotificationService
    participant PS as PrismaService

    Member->>FE: Click remove assignee
    FE->>TC: DELETE /tasks/:id/assignees/:userId
    TC->>TS: unassignUser(taskId, userId)
    TS->>PS: delete({taskId, userId})
    TS->>NS: create({type: TASK_UNASSIGNED, userId})
    TS-->>TC: Success
    TC-->>FE: 204 No Content
    FE-->>Member: Remove avatar from task
```

### SD-5.6: Quản lý Subtasks

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant PS as PrismaService

    Member->>FE: Add subtask
    FE->>TC: POST /tasks/:taskId/subtasks {title}
    TC->>TS: addSubtask(taskId, title)
    TS->>PS: findMany({taskId}) 
    PS-->>TS: Existing subtasks (for position)
    TS->>PS: create({taskId, title, position})
    PS-->>TS: Subtask
    TS-->>TC: SubtaskResponseDto
    TC-->>FE: 201 {subtask}
    
    Note over FE,Member: Toggle subtask completion
    
    Member->>FE: Click checkbox
    FE->>TC: PATCH /subtasks/:id/toggle
    TC->>TS: toggleSubtask(subtaskId)
    TS->>PS: update({isCompleted: !current})
    TS-->>TC: Subtask
    TC-->>FE: 200 {subtask}
    FE-->>Member: Update checkbox state
```

### SD-5.7: Thêm/Xóa Labels

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant PS as PrismaService

    Member->>FE: Select label
    FE->>TC: POST /tasks/:id/labels {labelId}
    TC->>TS: addLabel(taskId, labelId)
    TS->>PS: create({taskId, labelId})
    PS-->>TS: TaskLabel
    TS-->>TC: Success
    TC-->>FE: 200 OK
    FE-->>Member: Show label badge on task
    
    Note over FE,Member: Remove label
    
    Member->>FE: Click remove label
    FE->>TC: DELETE /tasks/:id/labels/:labelId
    TC->>TS: removeLabel(taskId, labelId)
    TS->>PS: delete({taskId, labelId})
    TS-->>TC: Success
    TC-->>FE: 204 No Content
```

### SD-5.8: My Tasks (Dashboard)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant TC as TaskController
    participant TS as TaskService
    participant PS as PrismaService

    User->>FE: Open Dashboard
    FE->>TC: GET /tasks/my-tasks?filter=all
    TC->>TS: getMyTasks(userId, filter)
    TS->>PS: findMany({assignments: {some: {userId}}})
    PS-->>TS: Tasks[]
    TS-->>TC: TaskResponseDto[]
    
    par Get due today
        FE->>TC: GET /tasks/my-tasks?filter=due_today
        TC->>TS: getMyTasks(userId, 'due_today')
        TS->>PS: findMany({dueDate: today, assignments: ...})
    and Get overdue
        FE->>TC: GET /tasks/my-tasks?filter=overdue
        TC->>TS: getMyTasks(userId, 'overdue')
        TS->>PS: findMany({dueDate < today, status != DONE})
    end
    
    TS-->>TC: Filtered tasks
    TC-->>FE: 200 {tasks}
    FE-->>User: Display task lists
```

---

## 6. COMMENT MODULE

### SD-6.1: Thêm Comment

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant CC as CommentController
    participant CS as CommentService
    participant NS as NotificationService
    participant WS as WebSocket Gateway
    participant PS as PrismaService

    Member->>FE: Write comment, submit
    FE->>CC: POST /tasks/:taskId/comments {content}
    CC->>CS: create(taskId, userId, content)
    
    CS->>CS: parseMentions(content)
    CS->>PS: create({taskId, authorId, content})
    PS-->>CS: Comment
    
    opt Has @mentions
        loop Each mentioned user
            CS->>NS: create({type: MENTIONED, userId})
            NS->>WS: emit("notification", {userId})
        end
    end
    
    CS->>NS: notifyTaskAssignees({type: COMMENT_ADDED, taskId})
    CS->>WS: broadcast("comment:new", {taskId, comment})
    
    CS-->>CC: CommentResponseDto
    CC-->>FE: 201 {comment}
    FE-->>Member: Display new comment
```

### SD-6.2: Reply Comment

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant CC as CommentController
    participant CS as CommentService
    participant NS as NotificationService
    participant PS as PrismaService

    Member->>FE: Click Reply, write content
    FE->>CC: POST /tasks/:taskId/comments {content, parentId}
    CC->>CS: create(taskId, userId, {content, parentId})
    CS->>PS: create({..., parentId})
    
    CS->>PS: findUnique({id: parentId})
    PS-->>CS: Parent comment with author
    
    CS->>NS: create({type: COMMENT_REPLY, userId: parentAuthorId})
    CS-->>CC: CommentResponseDto
    CC-->>FE: 201 {comment}
    FE-->>Member: Display threaded reply
```

### SD-6.3: Sửa/Xóa Comment

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant CC as CommentController
    participant CS as CommentService
    participant PS as PrismaService

    Note over Member,FE: Edit comment
    Member->>FE: Edit content
    FE->>CC: PATCH /comments/:id {content}
    CC->>CS: update(commentId, userId, content)
    CS->>PS: findUnique({id: commentId})
    
    alt Not author
        CS-->>CC: throw ForbiddenException
    else Is author
        CS->>PS: update({content, isEdited: true})
        CS-->>CC: CommentResponseDto
        CC-->>FE: 200 {comment}
    end
    
    Note over Member,FE: Delete comment
    Member->>FE: Click Delete
    FE->>CC: DELETE /comments/:id
    CC->>CS: delete(commentId, userId)
    CS->>PS: findUnique({id}) with task.project.workspace
    
    alt Not author AND not admin
        CS-->>CC: throw ForbiddenException
    else Authorized
        CS->>PS: delete({id: commentId})
        CS-->>CC: Success
        CC-->>FE: 204 No Content
    end
```

---

## 7. NOTIFICATION MODULE

### SD-7.1: Xem Notifications

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant NC as NotificationController
    participant NS as NotificationService
    participant PS as PrismaService

    User->>FE: Click notification bell
    FE->>NC: GET /notifications?limit=20
    NC->>NS: findAll(userId, {limit: 20})
    NS->>PS: findMany({userId}, {orderBy: createdAt desc})
    PS-->>NS: Notifications[]
    NS-->>NC: NotificationResponseDto[]
    NC-->>FE: 200 {notifications}
    FE-->>User: Display notification list
```

### SD-7.2: Đánh dấu đã đọc

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant NC as NotificationController
    participant NS as NotificationService
    participant PS as PrismaService

    User->>FE: Click notification
    FE->>NC: PATCH /notifications/:id/read
    NC->>NS: markAsRead(notificationId, userId)
    NS->>PS: update({id, userId}, {isRead: true})
    NS-->>NC: Success
    NC-->>FE: 200 OK
    FE->>FE: Navigate to referenced entity
    FE-->>User: Open task/comment
```

### SD-7.3: Mark All as Read

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant NC as NotificationController
    participant NS as NotificationService
    participant PS as PrismaService

    User->>FE: Click "Mark all as read"
    FE->>NC: POST /notifications/read-all
    NC->>NS: markAllAsRead(userId)
    NS->>PS: updateMany({userId, isRead: false}, {isRead: true})
    NS-->>NC: {count: n}
    NC-->>FE: 200 OK
    FE-->>User: Clear badge, update list
```

### SD-7.4: Real-time Notification Delivery

```mermaid
sequenceDiagram
    autonumber
    participant Trigger as Event Trigger
    participant NS as NotificationService
    participant PS as PrismaService
    participant GW as WebSocket Gateway
    participant FE as Frontend
    actor User

    Note over Trigger: Task assigned, Mentioned, etc.
    
    Trigger->>NS: create({type, userId, ...})
    NS->>PS: create(notification)
    PS-->>NS: Notification
    
    NS->>GW: sendToUser(userId, notification)
    GW->>GW: Find socket by userId
    
    alt User online
        GW->>FE: emit("notification", payload)
        FE->>FE: Update badge count
        FE->>FE: Show toast
        FE-->>User: 🔔 Notification appears
    else User offline
        Note over GW: Stored in DB, fetched on next login
    end
```

---

## 8. ATTACHMENT MODULE

### SD-8.1: Upload Attachment

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant AC as AttachmentController
    participant AS as AttachmentService
    participant UPS as UploadService
    participant PS as PrismaService
    participant FS as FileStorage

    Member->>FE: Select file
    FE->>FE: Validate (size < 10MB, allowed type)
    FE->>AC: POST /tasks/:taskId/attachments (multipart/form-data)
    
    AC->>UPS: uploadFile(file, 'attachments/')
    UPS->>FS: saveFile(buffer, path)
    FS-->>UPS: fileUrl
    
    AC->>AS: create(taskId, userId, {fileName, fileUrl, fileSize, mimeType})
    AS->>PS: create({...attachmentData})
    PS-->>AS: Attachment
    AS-->>AC: AttachmentResponseDto
    AC-->>FE: 201 {attachment}
    FE-->>Member: Show attached file
```

### SD-8.2: Delete Attachment

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant AC as AttachmentController
    participant AS as AttachmentService
    participant UPS as UploadService
    participant PS as PrismaService
    participant FS as FileStorage

    Member->>FE: Click delete attachment
    FE->>AC: DELETE /attachments/:id
    AC->>AS: delete(attachmentId, userId)
    
    AS->>PS: findUnique({id: attachmentId})
    PS-->>AS: Attachment with task
    
    alt Not uploader AND not admin
        AS-->>AC: throw ForbiddenException
    else Authorized
        AS->>UPS: deleteFile(fileUrl)
        UPS->>FS: delete(path)
        AS->>PS: delete({id: attachmentId})
        AS-->>AC: Success
        AC-->>FE: 204 No Content
        FE-->>Member: Remove from UI
    end
```

---

## 9. TỔNG KẾT

| Module | Số lượng Diagrams | Mô tả |
|--------|-------------------|-------|
| Authentication | 6 | Register, Login, Refresh, OAuth, Forgot/Reset Password |
| User | 4 | Profile, Update, Change Password, Avatar |
| Workspace | 6 | CRUD, Invite, Accept, Roles, Remove Member |
| Project | 3 | Create, View Kanban, Archive |
| Task | 8 | CRUD, Status, Assign, Subtasks, Labels, My Tasks |
| Comment | 3 | Create, Reply, Edit/Delete |
| Notification | 4 | List, Mark Read, Mark All, Real-time |
| Attachment | 2 | Upload, Delete |
| **Total** | **36** | Tất cả chức năng chính |
