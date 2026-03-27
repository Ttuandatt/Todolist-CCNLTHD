# SEQUENCE DIAGRAM - CORE FLOWS
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0
> **Ngày cập nhật:** 27/03/2026
> **Notation:** UML 2.0 / Mermaid
> **Mục đích:** Các luồng chức năng chính cần thiết cho quản lý Task, Project, Workspace

---

## MỤC LỤC

### Core Authentication (2 flows)
1. [User Login](#1-user-login)
2. [Refresh Token](#2-refresh-token)

### Core Workspace Management (2 flows)
3. [Create Workspace](#3-create-workspace)
4. [Invite & Accept Member](#4-invite--accept-member)

### Core Project Management (1 flow)
5. [Create Project & View Kanban Board](#5-create-project--view-kanban-board)

### Core Task Management (5 flows)
6. [Create Task](#6-create-task)
7. [Update Task](#7-update-task)
8. [Change Task Status (Drag & Drop)](#8-change-task-status-drag--drop)
9. [Assign Task](#9-assign-task)
10. [Add Comment & Notification](#10-add-comment--notification)

### Core Security (1 flow)
11. [RBAC Permission Check](#11-rbac-permission-check)

---

## 1. USER LOGIN

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
            JWT-->>AS: accessToken (15min)
            AS->>JWT: sign(payload, refreshSecret)
            JWT-->>AS: refreshToken (7 days)
            AS->>PS: update({lastLoginAt: now})
            PS->>DB: UPDATE users SET lastLoginAt = ?
            AS-->>AC: TokenResponseDto
            AC-->>FE: 200 {accessToken, refreshToken, user}
            FE->>FE: Store tokens (localStorage/sessionStorage)
            FE-->>Guest: Redirect to Dashboard
        end
    end
```

---

## 2. REFRESH TOKEN

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend
    participant INT as Axios Interceptor
    participant AC as AuthController
    participant AS as AuthService
    participant JWT as JwtService
    participant DB as PostgreSQL

    FE->>FE: API request với expired accessToken
    FE->>INT: Response 401 Unauthorized
    INT->>INT: Check refreshToken exists & valid

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
            AS->>JWT: sign(newPayload, accessSecret)
            JWT-->>AS: newAccessToken
            AS->>JWT: sign(newPayload, refreshSecret)
            JWT-->>AS: newRefreshToken (token rotation)
            AS-->>AC: {newAccessToken, newRefreshToken}
            AC-->>INT: 200 OK + new tokens
            INT->>FE: Update stored tokens
            INT->>FE: Retry original request
        end
    end
```

---

## 3. CREATE WORKSPACE

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant WC as WorkspaceController
    participant AUTH as JwtAuthGuard
    participant WS as WorkspaceService
    participant PS as PrismaService
    participant DB as PostgreSQL

    User->>FE: Fill name, description
    FE->>WC: POST /workspaces {name, description}
    WC->>AUTH: Verify JWT Token
    AUTH-->>WC: userId extracted from token

    WC->>WS: create(userId, dto)
    WS->>PS: $transaction([createWorkspace, createMember])
    PS->>DB: INSERT INTO workspaces (name, description, createdById)
    PS->>DB: INSERT INTO workspace_members (workspaceId, userId, role: OWNER)
    DB-->>PS: Workspace + Member created
    PS-->>WS: Result

    WS-->>WC: WorkspaceResponseDto
    WC-->>FE: 201 {workspace, role: OWNER}
    FE-->>User: Show new workspace
```

---

## 4. INVITE & ACCEPT MEMBER

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Owner/Admin
    participant FE as Frontend
    participant WC as WorkspaceController
    participant RBAC as WorkspaceRoleGuard
    participant WS as WorkspaceService
    participant MS as MailService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Owner->>FE: Enter email, select role
    FE->>WC: POST /workspaces/:id/invite {email, role}
    WC->>RBAC: Check OWNER/ADMIN role

    alt Not authorized
        RBAC-->>WC: throw ForbiddenException
        WC-->>FE: 403 "Unauthorized"
    else Authorized
        WC->>WS: invite(workspaceId, email, role)
        WS->>PS: findFirst({email, workspaceId})

        alt Already member
            PS-->>WS: WorkspaceMember exists
            WS-->>WC: throw ConflictException
            WC-->>FE: 409 "Already a member"
        else New invitation
            WS->>WS: generateInviteToken()
            WS->>PS: create({invitation, token, expiresAt: now+7days})
            PS->>DB: INSERT INTO invitations
            WS->>MS: sendInviteEmail(email, inviteLink)
            WS-->>WC: {message: "Invitation sent"}
            WC-->>FE: 200 OK
            FE-->>Owner: Show success
        end
    end

    Note over Owner,FE: ─── User clicks email link ───

    actor NewUser
    NewUser->>FE: Click link từ email
    FE->>WC: POST /workspaces/accept-invite/:token
    WC->>WS: acceptInvite(userId, token)
    WS->>PS: findFirst({token, expiresAt > now})

    alt Token invalid/expired
        PS-->>WS: null
        WS-->>WC: throw BadRequestException
        WC-->>FE: 400 "Invalid invitation"
    else Valid token
        WS->>PS: $transaction([deleteInvitation, createMember])
        PS->>DB: DELETE FROM invitations WHERE token = ?
        PS->>DB: INSERT INTO workspace_members
        WS-->>WC: WorkspaceResponseDto
        WC-->>FE: 200 {workspace}
        FE-->>NewUser: Redirect to workspace
    end
```

---

## 5. CREATE PROJECT & VIEW KANBAN BOARD

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant PC as ProjectController
    participant GUARD as WorkspaceMemberGuard
    participant PjS as ProjectService
    participant TS as TaskService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Click "Create Project"
    FE->>PC: POST /workspaces/:wsId/projects {name, color}
    PC->>GUARD: Verify workspace membership
    GUARD-->>PC: Authorized

    PC->>PjS: create(workspaceId, userId, dto)
    PjS->>PS: create({name, color, workspaceId})
    PS->>DB: INSERT INTO projects
    DB-->>PS: New Project
    PjS-->>PC: ProjectResponseDto
    PC-->>FE: 201 {project}

    Note over Member,FE: ─── User views project ───

    Member->>FE: Click project
    FE->>PC: GET /projects/:id
    PC->>PjS: findOne(projectId)
    PjS->>PS: findUnique({id}, {include: workspace})
    PS-->>PjS: Project with workspace

    FE->>PC: GET /projects/:id/tasks?groupBy=status
    PC->>TS: findAll(projectId, filters)
    TS->>PS: findMany({projectId}, {orderBy: position, status})
    PS->>DB: SELECT * FROM tasks WHERE projectId = ?
    DB-->>PS: Tasks[]
    PS-->>TS: Tasks grouped by status

    TS-->>PC: {TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: []}
    PC-->>FE: 200 {tasks by column}
    FE-->>Member: Render Kanban board (4 columns)
```

---

## 6. CREATE TASK

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant GUARD as TaskPermissionGuard
    participant TS as TaskService
    participant ALS as ActivityLogService
    participant NS as NotificationService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Click "Add Task", fill form
    FE->>TC: POST /projects/:projId/tasks (CreateTaskDto)
    TC->>GUARD: Verify task creation permission
    GUARD-->>TC: Member authorized

    TC->>TS: create(projectId, userId, dto)
    TS->>PS: findMany({projectId, status: dto.status})
    PS-->>TS: Existing tasks (for position calculation)
    TS->>TS: Calculate position = max+1

    TS->>PS: create({...dto, position, createdById})
    PS->>DB: INSERT INTO tasks (title, description, status, priority, dueDate, position, createdById)
    DB-->>PS: New Task

    TS->>ALS: log("CREATE", "Task", taskId, {title, status})
    ALS->>PS: create({activityLog})
    PS->>DB: INSERT INTO activity_logs

    opt Có assignees trong DTO
        loop Each assignee
            TS->>NS: create({type: TASK_ASSIGNED, taskId, userId})
            NS->>PS: create({notification})
            PS->>DB: INSERT INTO notifications
        end
    end

    TS-->>TC: TaskResponseDto
    TC-->>FE: 201 {task}
    FE-->>Member: Add task to Kanban column (TODO)
```

---

## 7. UPDATE TASK

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant GUARD as TaskPermissionGuard
    participant TS as TaskService
    participant ALS as ActivityLogService
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Edit task details (title, description, due date)
    FE->>TC: PATCH /tasks/:id (UpdateTaskDto)
    TC->>GUARD: Verify update permission (creator or assignee or admin)
    GUARD-->>TC: Authorized

    TC->>TS: update(taskId, userId, dto)
    TS->>PS: findUnique({id: taskId})
    PS->>DB: SELECT * FROM tasks WHERE id = ?
    DB-->>PS: Current task (for comparison)
    PS-->>TS: Current task

    TS->>PS: update({id: taskId}, dto)
    PS->>DB: UPDATE tasks SET title = ?, description = ?, dueDate = ?
    DB-->>PS: Updated task

    TS->>ALS: log("UPDATE", "Task", taskId, {oldValues, newValues})
    ALS->>PS: create({activityLog})

    TS-->>TC: TaskResponseDto
    TC-->>FE: 200 {task}
    FE-->>Member: Update task card UI
```

---

## 8. CHANGE TASK STATUS (DRAG & DROP)

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant GUARD as TaskPermissionGuard
    participant TS as TaskService
    participant WS as WebSocket Gateway
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Drag task to new column (e.g., DONE)
    FE->>TC: PATCH /tasks/:id/status {status, position}
    TC->>GUARD: Verify permission
    GUARD-->>TC: Authorized

    TC->>TS: updateStatus(taskId, newStatus, newPosition)
    TS->>PS: findUnique({id: taskId})
    PS-->>TS: Current task with project

    TS->>TS: Calculate position reorder
    TS->>PS: updateMany({update position adjustments})
    PS->>DB: UPDATE tasks SET position = ... (for other tasks in column)

    TS->>PS: update({id: taskId}, {status: DONE, position, completedAt: now()})
    PS->>DB: UPDATE tasks SET status = DONE, completedAt = now()
    DB-->>PS: Updated task

    TS->>WS: broadcast("task:updated", {taskId, status: DONE, projectId})
    WS-->>FE: WebSocket message to all clients
    FE->>FE: Update UI in real-time

    TS-->>TC: TaskResponseDto
    TC-->>FE: 200 {task}
    FE-->>Member: Task moved to DONE column
```

---

## 9. ASSIGN TASK

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant TC as TaskController
    participant GUARD as TaskPermissionGuard
    participant TS as TaskService
    participant NS as NotificationService
    participant WS as WebSocket Gateway
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Select assignee from dropdown
    FE->>TC: POST /tasks/:id/assignees {userId}
    TC->>GUARD: Verify permission (creator or admin)
    GUARD-->>TC: Authorized

    TC->>TS: assignUser(taskId, assigneeId)
    TS->>PS: findFirst({taskId, userId: assigneeId})

    alt Already assigned
        PS-->>TS: TaskAssignment exists
        TS-->>TC: throw ConflictException
        TC-->>FE: 409 "Already assigned"
    else Not assigned
        TS->>PS: create({taskId, userId: assigneeId})
        PS->>DB: INSERT INTO task_assignments
        DB-->>PS: TaskAssignment created

        TS->>NS: create({type: TASK_ASSIGNED, taskId, userId: assigneeId})
        NS->>PS: create({notification})
        PS->>DB: INSERT INTO notifications
        NS->>WS: emit("notification:new", {userId: assigneeId})
        WS-->>FE: Real-time notification to assignee

        TS-->>TC: Success
        TC-->>FE: 200 {assignees list}
        FE-->>Member: Show assignee avatar on task
    end
```

---

## 10. ADD COMMENT & NOTIFICATION

```mermaid
sequenceDiagram
    autonumber
    actor Member
    participant FE as Frontend
    participant CC as CommentController
    participant GUARD as TaskPermissionGuard
    participant CS as CommentService
    participant NS as NotificationService
    participant WS as WebSocket Gateway
    participant PS as PrismaService
    participant DB as PostgreSQL

    Member->>FE: Write comment on task detail
    FE->>CC: POST /tasks/:taskId/comments {content}
    CC->>GUARD: Verify permission (task member)
    GUARD-->>CC: Authorized

    CC->>CS: create(taskId, userId, content)
    CS->>CS: parseMentions(content)
    CS->>PS: create({taskId, authorId, content, mentions: JSON})
    PS->>DB: INSERT INTO comments (taskId, authorId, content)
    DB-->>PS: Comment created

    opt Has @mentions
        loop Each mentioned user
            CS->>NS: create({type: MENTIONED, userId, commentId})
            NS->>PS: create({notification})
            NS->>WS: emit("notification", {userId})
        end
    end

    CS->>NS: notifyTaskAssignees({type: COMMENT_ADDED, taskId})
    NS->>WS: broadcast("comment:new", {taskId, comment})
    WS-->>FE: WebSocket to all task viewers

    CS-->>CC: CommentResponseDto
    CC-->>FE: 201 {comment}
    FE-->>Member: Display new comment in thread
    FE->>FE: Update comment count badge
```

---

## 11. RBAC PERMISSION CHECK

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant FE as Frontend
    participant API as API Gateway
    participant GUARD as RoleGuard
    participant JWT as JwtService
    participant DECO as Reflector (metadata)
    participant PS as PrismaService
    participant DB as PostgreSQL

    Client->>FE: API request with Authorization header
    FE->>API: Authorization: Bearer {accessToken}
    API->>GUARD: Extract token from header

    GUARD->>JWT: verify(token, secret)
    JWT-->>GUARD: {userId, email, role}

    GUARD->>GUARD: Check @Public decorator

    alt Is public endpoint
        GUARD-->>API: Allow pass-through
    else Requires authentication
        GUARD->>DECO: Get required role(s) from @RequireRole decorator
        DECO-->>GUARD: [OWNER, ADMIN]

        GUARD->>PS: Query workspace/resource
        PS->>DB: SELECT workspace_members WHERE userId = ? AND workspaceId = ?
        DB-->>PS: WorkspaceMember {role: ADMIN}

        alt User role NOT in required roles
            GUARD-->>API: throw ForbiddenException
            API-->>FE: 403 "Access Denied"
        else User role in required roles
            GUARD-->>API: Allow request
            API->>API: Call Handler (Controller method)
        end
    end
```

---

## SUMMARY

**Total Core Flows: 11** - Đủ để hiểu toàn bộ quy trình

| Category | Flows | Count |
|----------|-------|-------|
| Authentication | Login, Refresh Token | 2 |
| Workspace Management | Create, Invite & Accept | 2 |
| Project Management | Create & View Kanban | 1 |
| Task Management | Create, Update, Status, Assign, Comment & Notification | 5 |
| Security | RBAC Permission Check | 1 |
| **Total** | | **11** |

### Key Takeaways
✅ **Covers**: Toàn bộ quy trình từ login → workspace → project → task → collaboration
✅ **Simplified**: Chỉ giữ lại flows chính, dễ theo dõi
✅ **Security**: Bao gồm RBAC & Permission checks
✅ **Collaboration**: Comment, Notification, Real-time updates
✅ **Database**: Hiển thị các bảng chính (users, workspaces, projects, tasks, comments, notifications)
