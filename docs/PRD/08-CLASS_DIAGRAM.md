# CLASS DIAGRAM - SƠ ĐỒ LỚP
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Notation:** UML 2.0

---

## 1. DOMAIN MODEL (ENTITY CLASSES)

### 1.1. Sơ đồ tổng quan Domain Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DOMAIN MODEL                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │     User     │
                                    ├──────────────┤
                                    │ -id: UUID    │
                                    │ -email       │
                                    │ -password    │
                                    │ -name        │
                                    │ -avatar      │
                                    │ -status      │
                                    └──────┬───────┘
                                           │ 1
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼ *                    ▼ *                    ▼ *
         ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
         │ WorkspaceMember  │    │   Notification   │    │   ActivityLog    │
         ├──────────────────┤    ├──────────────────┤    ├──────────────────┤
         │ -role: Role      │    │ -type            │    │ -action          │
         │ -joinedAt        │    │ -title           │    │ -entityType      │
         └────────┬─────────┘    │ -isRead          │    │ -oldValue        │
                  │              └──────────────────┘    │ -newValue        │
                  │ *                                    └──────────────────┘
                  │
                  ▼ 1
         ┌──────────────────┐
         │    Workspace     │
         ├──────────────────┤
         │ -name            │
         │ -description     │
         └────────┬─────────┘
                  │ 1
        ┌─────────┴─────────┐
        │                   │
        ▼ *                 ▼ *
┌──────────────┐    ┌──────────────┐
│   Project    │    │    Label     │
├──────────────┤    ├──────────────┤
│ -name        │    │ -name        │
│ -description │    │ -color       │
│ -status      │    └──────────────┘
│ -isPinned    │
│ -color       │
└──────┬───────┘
       │ 1
       │
       ▼ *
┌──────────────────────────────────────────────────────┐
│                        Task                           │
├──────────────────────────────────────────────────────┤
│ -id: UUID                                            │
│ -title: String                                       │
│ -description: String                                 │
│ -status: TaskStatus                                  │
│ -priority: TaskPriority                              │
│ -dueDate: DateTime                                   │
│ -position: Integer                                   │
└────────────────────────┬─────────────────────────────┘
                         │ 1
       ┌─────────────────┼─────────────────┬──────────────────┐
       │                 │                 │                  │
       ▼ *               ▼ *               ▼ *                ▼ *
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐
│   Subtask   │   │   Comment   │   │ Attachment  │   │  TaskAssignment  │
├─────────────┤   ├─────────────┤   ├─────────────┤   ├──────────────────┤
│ -title      │   │ -content    │   │ -fileName   │   │ -assignedAt      │
│ -isCompleted│   │ -isEdited   │   │ -fileUrl    │   └──────────────────┘
│ -position   │   │ -parentId   │   │ -fileSize   │
└─────────────┘   └─────────────┘   │ -mimeType   │
                                    └─────────────┘
```

### 1.2. Chi tiết từng Entity Class

#### User Entity

```
┌────────────────────────────────────────────────┐
│                     User                        │
├────────────────────────────────────────────────┤
│ -id: string (UUID)                             │
│ -email: string                                 │
│ -password: string                              │
│ -name: string                                  │
│ -avatar: string | null                         │
│ -status: UserStatus                            │
│ -emailVerified: boolean                        │
│ -lastLoginAt: DateTime | null                  │
│ -createdAt: DateTime                           │
│ -updatedAt: DateTime                           │
├────────────────────────────────────────────────┤
│ +validatePassword(password: string): boolean   │
│ +updateProfile(data: UpdateProfileDto): void   │
│ +changePassword(oldPw, newPw): void            │
└────────────────────────────────────────────────┘
```

#### Task Entity

```
┌────────────────────────────────────────────────┐
│                     Task                        │
├────────────────────────────────────────────────┤
│ -id: string (UUID)                             │
│ -title: string                                 │
│ -description: string | null                    │
│ -projectId: string                             │
│ -createdById: string                           │
│ -status: TaskStatus                            │
│ -priority: TaskPriority                        │
│ -dueDate: DateTime | null                      │
│ -startDate: DateTime | null                    │
│ -completedAt: DateTime | null                  │
│ -position: number                              │
│ -estimatedHours: Decimal | null                │
│ -actualHours: Decimal | null                   │
│ -createdAt: DateTime                           │
│ -updatedAt: DateTime                           │
├────────────────────────────────────────────────┤
│ +updateStatus(status: TaskStatus): void        │
│ +assignUser(userId: string): TaskAssignment    │
│ +unassignUser(userId: string): void            │
│ +addSubtask(title: string): Subtask            │
│ +addComment(content: string): Comment          │
│ +addLabel(labelId: string): TaskLabel          │
│ +isOverdue(): boolean                          │
│ +isDueToday(): boolean                         │
└────────────────────────────────────────────────┘
```

---

## 2. ENUMERATIONS

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    UserStatus    │    │ WorkspaceRole    │    │  ProjectStatus   │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ ACTIVE           │    │ OWNER            │    │ ACTIVE           │
│ INACTIVE         │    │ ADMIN            │    │ ARCHIVED         │
│ BANNED           │    │ MEMBER           │    └──────────────────┘
└──────────────────┘    └──────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│    TaskStatus    │    │   TaskPriority   │    │   NotificationType   │
├──────────────────┤    ├──────────────────┤    ├──────────────────────┤
│ TODO             │    │ LOW              │    │ TASK_ASSIGNED        │
│ IN_PROGRESS      │    │ NORMAL           │    │ TASK_UNASSIGNED      │
│ REVIEW           │    │ HIGH             │    │ TASK_STATUS_CHANGED  │
│ DONE             │    │ URGENT           │    │ TASK_DUE_SOON        │
└──────────────────┘    └──────────────────┘    │ TASK_OVERDUE         │
                                                │ COMMENT_ADDED        │
                                                │ COMMENT_REPLY        │
                                                │ MENTIONED            │
                                                │ WORKSPACE_INVITE     │
                                                │ PROJECT_CREATED      │
                                                └──────────────────────┘
```

---

## 3. DTO CLASSES (Data Transfer Objects)

### 3.1. Auth DTOs

```
┌────────────────────────────────┐    ┌────────────────────────────────┐
│        RegisterDto             │    │          LoginDto              │
├────────────────────────────────┤    ├────────────────────────────────┤
│ +email: string                 │    │ +email: string                 │
│ +password: string              │    │ +password: string              │
│ +name: string                  │    └────────────────────────────────┘
└────────────────────────────────┘

┌────────────────────────────────┐    ┌────────────────────────────────┐
│       TokenResponseDto         │    │     ForgotPasswordDto          │
├────────────────────────────────┤    ├────────────────────────────────┤
│ +accessToken: string           │    │ +email: string                 │
│ +refreshToken: string          │    └────────────────────────────────┘
│ +expiresIn: number             │
│ +user: UserResponseDto         │    ┌────────────────────────────────┐
└────────────────────────────────┘    │     ResetPasswordDto           │
                                      ├────────────────────────────────┤
                                      │ +token: string                 │
                                      │ +newPassword: string           │
                                      └────────────────────────────────┘
```

### 3.2. User DTOs

```
┌────────────────────────────────┐    ┌────────────────────────────────┐
│       UserResponseDto          │    │      UpdateProfileDto          │
├────────────────────────────────┤    ├────────────────────────────────┤
│ +id: string                    │    │ +name?: string                 │
│ +email: string                 │    │ +avatar?: string               │
│ +name: string                  │    └────────────────────────────────┘
│ +avatar: string | null         │
│ +status: UserStatus            │    ┌────────────────────────────────┐
│ +createdAt: DateTime           │    │     ChangePasswordDto          │
└────────────────────────────────┘    ├────────────────────────────────┤
                                      │ +currentPassword: string       │
                                      │ +newPassword: string           │
                                      │ +confirmPassword: string       │
                                      └────────────────────────────────┘
```

### 3.3. Task DTOs

```
┌────────────────────────────────┐    ┌────────────────────────────────┐
│        CreateTaskDto           │    │        UpdateTaskDto           │
├────────────────────────────────┤    ├────────────────────────────────┤
│ +title: string                 │    │ +title?: string                │
│ +description?: string          │    │ +description?: string          │
│ +projectId: string             │    │ +status?: TaskStatus           │
│ +priority?: TaskPriority       │    │ +priority?: TaskPriority       │
│ +dueDate?: DateTime            │    │ +dueDate?: DateTime            │
│ +assigneeIds?: string[]        │    │ +assigneeIds?: string[]        │
│ +labelIds?: string[]           │    │ +labelIds?: string[]           │
└────────────────────────────────┘    └────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                          TaskResponseDto                                │
├────────────────────────────────────────────────────────────────────────┤
│ +id: string                                                            │
│ +title: string                                                         │
│ +description: string | null                                            │
│ +status: TaskStatus                                                    │
│ +priority: TaskPriority                                                │
│ +dueDate: DateTime | null                                              │
│ +position: number                                                      │
│ +project: ProjectResponseDto                                           │
│ +createdBy: UserResponseDto                                            │
│ +assignees: UserResponseDto[]                                          │
│ +labels: LabelResponseDto[]                                            │
│ +subtasks: SubtaskResponseDto[]                                        │
│ +commentsCount: number                                                 │
│ +attachmentsCount: number                                              │
│ +createdAt: DateTime                                                   │
│ +updatedAt: DateTime                                                   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐
│       FilterTaskDto            │
├────────────────────────────────┤
│ +status?: TaskStatus[]         │
│ +priority?: TaskPriority[]     │
│ +assigneeId?: string           │
│ +labelIds?: string[]           │
│ +dueDate?: 'overdue' | 'today' │
│         | 'week' | 'none'      │
│ +search?: string               │
│ +page?: number                 │
│ +limit?: number                │
│ +sortBy?: string               │
│ +sortOrder?: 'asc' | 'desc'    │
└────────────────────────────────┘
```

---

## 4. SERVICE CLASSES

### 4.1. Service Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐                   │
│    │  AuthService  │    │  UserService  │    │WorkspaceService│                  │
│    └───────┬───────┘    └───────┬───────┘    └───────┬───────┘                   │
│            │                    │                    │                           │
│            ▼                    ▼                    ▼                           │
│    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐                   │
│    │ ProjectService│    │  TaskService  │    │CommentService │                   │
│    └───────┬───────┘    └───────┬───────┘    └───────┬───────┘                   │
│            │                    │                    │                           │
│            ▼                    ▼                    ▼                           │
│    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐                   │
│    │NotificationSvc│    │ AttachmentSvc │    │ ActivityLogSvc│                   │
│    └───────────────┘    └───────────────┘    └───────────────┘                   │
│                                                                                  │
│                              ┌───────────────┐                                   │
│                              │ PrismaService │◄──────────── All services use     │
│                              └───────────────┘                                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Chi tiết Service Classes

#### AuthService

```
┌────────────────────────────────────────────────────────────────────────┐
│                           AuthService                                   │
├────────────────────────────────────────────────────────────────────────┤
│ -prisma: PrismaService                                                 │
│ -jwtService: JwtService                                                │
│ -bcrypt: BcryptService                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ +register(dto: RegisterDto): Promise<TokenResponseDto>                 │
│ +login(dto: LoginDto): Promise<TokenResponseDto>                       │
│ +logout(userId: string): Promise<void>                                 │
│ +refreshToken(token: string): Promise<TokenResponseDto>                │
│ +forgotPassword(dto: ForgotPasswordDto): Promise<void>                 │
│ +resetPassword(dto: ResetPasswordDto): Promise<void>                   │
│ +validateUser(email: string, password: string): Promise<User | null>   │
│ -generateTokens(user: User): TokenResponseDto                          │
│ -hashPassword(password: string): Promise<string>                       │
│ -comparePassword(plain: string, hash: string): Promise<boolean>        │
└────────────────────────────────────────────────────────────────────────┘
```

#### TaskService

```
┌────────────────────────────────────────────────────────────────────────┐
│                           TaskService                                   │
├────────────────────────────────────────────────────────────────────────┤
│ -prisma: PrismaService                                                 │
│ -notificationService: NotificationService                              │
│ -activityLogService: ActivityLogService                                │
├────────────────────────────────────────────────────────────────────────┤
│ +create(dto: CreateTaskDto, userId: string): Promise<Task>             │
│ +findAll(projectId: string, filter: FilterTaskDto): Promise<Task[]>    │
│ +findOne(id: string): Promise<Task>                                    │
│ +update(id: string, dto: UpdateTaskDto): Promise<Task>                 │
│ +remove(id: string): Promise<void>                                     │
│ +updateStatus(id: string, status: TaskStatus): Promise<Task>           │
│ +assignUser(taskId: string, userId: string): Promise<void>             │
│ +unassignUser(taskId: string, userId: string): Promise<void>           │
│ +addLabel(taskId: string, labelId: string): Promise<void>              │
│ +removeLabel(taskId: string, labelId: string): Promise<void>           │
│ +reorder(taskId: string, newPosition: number): Promise<void>           │
│ +getMyTasks(userId: string): Promise<Task[]>                           │
│ +getDueTodayTasks(userId: string): Promise<Task[]>                     │
│ +getOverdueTasks(userId: string): Promise<Task[]>                      │
└────────────────────────────────────────────────────────────────────────┘
```

#### NotificationService

```
┌────────────────────────────────────────────────────────────────────────┐
│                       NotificationService                               │
├────────────────────────────────────────────────────────────────────────┤
│ -prisma: PrismaService                                                 │
│ -gateway: NotificationGateway (WebSocket)                              │
├────────────────────────────────────────────────────────────────────────┤
│ +create(data: CreateNotificationDto): Promise<Notification>            │
│ +findAllByUser(userId: string): Promise<Notification[]>                │
│ +markAsRead(id: string): Promise<void>                                 │
│ +markAllAsRead(userId: string): Promise<void>                          │
│ +getUnreadCount(userId: string): Promise<number>                       │
│ +notifyTaskAssigned(task: Task, assigneeId: string): Promise<void>     │
│ +notifyMentioned(comment: Comment, mentionedIds: string[]): void       │
│ +notifyDueSoon(tasks: Task[]): Promise<void>                           │
│ -sendRealTimeNotification(userId: string, notification: any): void     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. MỐI QUAN HỆ GIỮA CÁC LỚP

### 5.1. Association Relationships

| From | To | Type | Multiplicity |
|------|----|------|--------------|
| User | Workspace | owns | 1..* |
| Workspace | WorkspaceMember | has | 1..* |
| User | WorkspaceMember | is | 1..* |
| Workspace | Project | contains | 1..* |
| Project | Task | contains | 1..* |
| Task | Subtask | has | 0..* |
| Task | Comment | has | 0..* |
| Task | Attachment | has | 0..* |
| Task | TaskAssignment | has | 0..* |
| User | TaskAssignment | assigned | 0..* |
| Workspace | Label | has | 0..* |
| Task | TaskLabel | has | 0..* |
| User | Notification | receives | 0..* |
| User | ActivityLog | performs | 0..* |

### 5.2. Dependency Relationships (Services)

```
AuthService ─────────► PrismaService
     │
     └─────────────────► JwtService

TaskService ─────────► PrismaService
     │
     ├─────────────────► NotificationService
     │
     └─────────────────► ActivityLogService

WorkspaceService ────► PrismaService
     │
     └─────────────────► NotificationService
```
