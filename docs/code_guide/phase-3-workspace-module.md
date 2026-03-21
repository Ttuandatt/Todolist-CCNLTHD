# Code Guide — Phase 3: Workspace Suite 🚀

> Ngày tạo: 2026-03-19
>
> Phase này là lúc ứng dụng bắt đầu "có hồn" — từ một hệ thống đăng nhập đơn thuần, ta sẽ biến nó thành nơi mọi người **cùng làm việc**. Nghĩ kiểu Trello Team, Slack Workspace, Notion Workspace — vùng đất chung để nhóm tổ chức mọi thứ.

---

## Tổng quan — Ta sẽ làm gì ở Phase này?

Nếu Phase 1 là "ai được vào cửa?" (Auth), Phase 2 là "người ta trông như thế nào?" (User Profile), thì Phase 3 là **"người ta làm việc ở đâu?"**.

Ta cần xây 3 thứ lớn:

| Module | Nhiệm vụ | Ví dụ thực tế |
|:---|:---|:---|
| **Workspace** | CRUD không gian làm việc | Tạo workspace "Dự án CCNLTHD", đổi tên, archive, xóa |
| **WorkspaceMember** | Quản lý thành viên + phân quyền | Thêm bạn vào workspace, thăng Admin, đuổi ra, chuyển quyền Owner |
| **WorkspaceInvite** | Vòng đời lời mời | Gửi email mời, accept/reject invite, revoke invite |

Ngoài ra ta còn cần dựng **permission layer** — bộ xương phân quyền dùng chung cho cả 3 module. Và **activity log** — ghi nhật ký ai làm gì, khi nào.

### Điều kiện tiên quyết
- Phase 2 (Auth + User) đã chạy ổn
- `.env` có sẵn các biến config cho workspace limits
- Docker PostgreSQL đang chạy, migration sẵn sàng

---

## Bước 1: Config giới hạn — Đừng hardcode! 🔧

### Tại sao?

Câu hỏi đầu tiên: tại sao không hardcode limit vào service luôn cho nhanh? Kiểu `if (count >= 50) throw error`?

Vì khi lên production, QA muốn test với limit 5, staging cần 20, prod cần 200 — biết điều chỉnh ở đâu? Sửa code rồi deploy lại? Không, ta đọc từ `.env` — thay đổi được mà không cần build lại.

### Kỹ thuật
- `registerAs` từ `@nestjs/config` — gom nhóm config dưới 1 namespace
- Inject typed config vào bất kỳ service nào qua `ConfigService`

### Code

📁 **File:** `src/common/config/workspace-limits.config.ts`

```typescript
import { registerAs } from '@nestjs/config';
// registerAs cho phép gom config vào 1 key
// Thay vì this.config.get('MAX_WORKSPACES'), ta viết this.config.get('workspaceLimits.maxWorkspacesPerUser')
// → Gọn hơn, type-safe hơn, không sợ typo

export interface WorkspaceLimitConfig {
  maxWorkspacesPerUser: number;     // Mỗi user tạo được bao nhiêu workspace?
  maxMembersPerWorkspace: number;   // Mỗi workspace chứa bao nhiêu người?
  inviteExpiryDays: number;         // Link mời có hiệu lực bao nhiêu ngày?
}

export default registerAs(
  'workspaceLimits',    // ← namespace key, dùng khi inject
  (): WorkspaceLimitConfig => {
    // Helper: parse chuỗi env → số, có default rõ ràng
    const toNumber = (value: string | undefined, fallback: string) =>
      parseInt(value ?? fallback, 10);

    return {
      maxWorkspacesPerUser: toNumber(process.env.WORKSPACE_LIMIT_MAX_PER_USER, '5'),
      maxMembersPerWorkspace: toNumber(process.env.WORKSPACE_LIMIT_MAX_MEMBER, '50'),
      inviteExpiryDays: toNumber(process.env.WORKSPACE_LIMIT_INVITE_EXPIRY_DAYS, '7'),
    };
  },
);
```

📁 **Thêm vào `.env`:**

```env
WORKSPACE_LIMIT_MAX_PER_USER=5
WORKSPACE_LIMIT_MAX_MEMBER=50
WORKSPACE_LIMIT_INVITE_EXPIRY_DAYS=7
```

> 💡 Nhớ import config này vào module: `ConfigModule.forFeature(workspaceLimitConfig)` — hoặc nếu `ConfigModule` đã `isGlobal: true` thì chỉ cần load file config.

---

## Bước 2: Kiểm tra Prisma Schema 🗄️

### Tại sao?

Trước khi code, ta cần chắc chắn schema đã có đủ 3 model cốt lõi: **Workspace**, **WorkspaceMember**, **WorkspaceInvite**. Tin vui: schema hiện tại (`prisma/schema.prisma`) đã thiết kế sẵn từ giai đoạn PRD rồi — ta chỉ cần hiểu nó.

### Các model liên quan đến Phase 3

📁 **File:** `prisma/schema.prisma`

#### Workspace — Không gian làm việc nhóm

```prisma
model Workspace {
  id          String    @id @default(uuid())
  name        String
  description String?
  archived    Boolean   @default(false)    // Cờ soft-delete — khi true thì block mọi mutation
  deletedAt   DateTime?                    // Timestamp xóa mềm — null = chưa xóa
  ownerId     String                       // FK đến User — ai tạo workspace này
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  owner        User              @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  members      WorkspaceMember[]
  projects     Project[]
  labels       Label[]
  activityLogs ActivityLog[]
  invites      WorkspaceInvite[]

  @@index([ownerId])          // Tìm nhanh "workspace nào của user X?"
  @@map("workspaces")         // Tên bảng trong DB = workspaces (snake_case, không PascalCase)
}
```

> **Hỏi:** Tại sao có cả `ownerId` lẫn `WorkspaceMember` với role OWNER? Vì `ownerId` là shortcut query nhanh — không cần join bảng member chỉ để biết ai là chủ. Còn `WorkspaceMember` với role OWNER dùng cho hệ thống phân quyền thống nhất.

#### WorkspaceMember — Thành viên trong workspace

```prisma
model WorkspaceMember {
  id          String        @id @default(uuid())
  workspaceId String
  userId      String
  role        WorkspaceRole @default(MEMBER)
  joinedAt    DateTime      @default(now())     // Biết member join lúc nào — hữu ích cho audit

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  invites   WorkspaceInvite[] @relation("WorkspaceInviteInviter")

  @@unique([workspaceId, userId])   // 1 user chỉ join 1 lần — chặn duplicate membership
  @@index([workspaceId])
  @@index([userId])
  @@map("workspace_members")
}
```

> **Chú ý `@@unique([workspaceId, userId])`** — nếu không có constraint này, code có thể vô tình tạo 2 membership cho cùng 1 user. Database-level protection luôn chắc hơn application-level check.

#### WorkspaceInvite — Lời mời tham gia

```prisma
model WorkspaceInvite {
  id                 String            @id @default(uuid())
  workspaceId        String
  email              String                                  // Email người được mời
  role               WorkspaceRole     @default(MEMBER)      // Role sẽ nhận khi accept
  status             InvitationStatus  @default(PENDING)
  token              String            @unique               // Token unique gửi cho client
  invitedByMemberId  String                                  // Ai mời? (FK đến WorkspaceMember)
  expiresAt          DateTime                                // Hết hạn khi nào?
  revokedAt          DateTime?                               // Bị thu hồi lúc nào? (null = chưa)
  acceptedAt         DateTime?                               // Được chấp nhận lúc nào?
  createdAt          DateTime          @default(now())

  // Relations
  workspace  Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  invitedBy  WorkspaceMember @relation("WorkspaceInviteInviter", fields: [invitedByMemberId], references: [id], onDelete: Cascade)

  @@index([workspaceId])                  // List invite theo workspace
  @@index([workspaceId, status])          // List invite PENDING nhanh
  @@index([workspaceId, email, status])   // Check "email này đã được mời chưa?"
  @@index([email])                        // Tìm tất cả invite của 1 email
  @@map("invitations")
}
```

#### Enums liên quan

```prisma
enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  REVOKED
}

enum ActivityLogAction {
  WORKSPACE_CREATED
  WORKSPACE_RENAMED
  WORKSPACE_ARCHIVED
  WORKSPACE_DELETED
  MEMBER_ADDED
  MEMBER_ROLE_CHANGED
  MEMBER_REMOVED
  INVITE_SENT
  INVITE_ACCEPTED
  INVITE_REVOKED
}
```

### Migration

Nếu schema đã có sẵn tất cả models trên (kiểm tra bằng `npx prisma validate`), chỉ cần chạy migration nếu có thay đổi gì:

```bash
npx prisma migrate dev --name workspace-suite
npx prisma generate
```

> ⚠️ Nếu migration đã chạy từ trước (Phase 1) và schema không thay đổi gì → **không cần chạy lại**. Chỉ chạy khi có diff.

---

## Bước 3: Shared Layer — Bộ xương phân quyền 🦴

Đây là bước quan trọng nhất Phase 3. Ta sẽ xây **một lần**, dùng **mãi mãi** cho mọi route của Workspace, Member, Invite.

Ý tưởng: trước khi request vào đến Controller → một Interceptor sẽ:
1. Tìm workspace theo `:workspaceId` trong URL
2. Check user hiện tại có phải member không
3. Tính toán permissions (canInvite, canDelete, canArchive...)
4. Gắn kết quả vào `request.workspaceContext` — Controller cứ lấy ra dùng

Giống security guard ở cửa club — check giấy tờ xong rồi đóng dấu lên tay. Vào bên trong, bartender chỉ cần nhìn dấu, không cần check lại. 🎫

### 3a. Types — Định nghĩa "dấu đóng tay"

📁 **File:** `src/workspace/types/workspace-context.type.ts`

```typescript
import { Workspace, WorkspaceMember } from '@prisma/client';
// Lấy type từ Prisma luôn — nếu schema đổi thì type tự cập nhật

export type WorkspaceRole = WorkspaceMember['role'];

export interface WorkspacePermissions {
  canManageMembers: boolean;   // Thêm/đuổi/thăng chức member
  canInvite: boolean;          // Gửi lời mời
  canArchive: boolean;         // Chỉ owner
  canDelete: boolean;          // Chỉ owner + đã archived
}

export interface WorkspaceContextPayload {
  workspace: Workspace;                // Record workspace — Controller khỏi query lại
  membership: WorkspaceMember | null;  // Membership hiện tại (null = chưa join)
  permissions: WorkspacePermissions;   // Các flag đã tính sẵn
}
```

📁 **File:** `src/types/express.d.ts` — mở rộng Request typing

```typescript
import { WorkspaceContextPayload } from '../workspace/types/workspace-context.type';

declare module 'express-serve-static-core' {
  interface Request {
    workspaceContext?: WorkspaceContextPayload;
    // TypeScript mặc định không biết request.workspaceContext
    // Dòng này "dạy" TypeScript: "ê, request có thêm field này nha"
  }
}
```

### 3b. Decorators — Rút data cho gọn

Giống `@CurrentUser()` ở Phase 1, ta tạo decorator để Controller chỉ cần viết `@WorkspaceCtx() ctx` thay vì `req.workspaceContext`.

📁 **File:** `src/workspace/decorators/workspace.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceContextPayload } from '../types/workspace-context.type';

// Lấy toàn bộ context (workspace + membership + permissions)
export const WorkspaceCtx = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkspaceContextPayload => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.workspaceContext) {
      throw new Error('WorkspaceContext not resolved — quên apply interceptor?');
      // Lỗi lập trình, không phải lỗi user → throw Error thường, không phải HttpException
    }
    return request.workspaceContext;
  },
);
```

### 3c. Permission Service — "Luật chơi"

Đây là nơi ta viết **toàn bộ rule phân quyền** của workspace. Mỗi khi cần check "user này có được làm X không?", ta gọi service này.

📁 **File:** `src/workspace/services/workspace-permission.service.ts`

```typescript
import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { Workspace, WorkspaceMember } from '@prisma/client';
import { WorkspacePermissions, WorkspaceRole } from '../types/workspace-context.type';

@Injectable()
export class WorkspacePermissionService {

  // Tính toán snapshot permissions cho 1 user trong 1 workspace
  getPermissions(workspace: Workspace, membership: WorkspaceMember | null): WorkspacePermissions {
    const role = membership?.role ?? null;
    const isOwner = role === 'OWNER';
    const isAdmin = role === 'ADMIN';

    return {
      canManageMembers: isOwner || isAdmin,
      canInvite: isOwner || isAdmin,
      canArchive: isOwner,                        // Chỉ owner mới được archive
      canDelete: isOwner && workspace.archived,   // Xóa hẳn = owner + đã archived
    };
  }

  // ── Assert helpers — throw nếu không đủ quyền ──

  assertActive(workspace: Workspace): void {
    if (workspace.archived) {
      throw new BadRequestException('WORKSPACE_ARCHIVED');
      // Workspace đã bị đóng băng — không cho thêm member, tạo task, mời,...
    }
  }

  assertMember(membership: WorkspaceMember | null): void {
    if (!membership) {
      throw new ForbiddenException('WORKSPACE_MEMBER_REQUIRED');
      // Chưa là thành viên → không được xem bất kỳ thứ gì bên trong
    }
  }

  assertAdminOrOwner(membership: WorkspaceMember | null): void {
    this.assertMember(membership);
    if (membership!.role !== 'OWNER' && membership!.role !== 'ADMIN') {
      throw new ForbiddenException('WORKSPACE_ADMIN_REQUIRED');
    }
  }

  assertOwner(membership: WorkspaceMember | null): void {
    this.assertMember(membership);
    if (membership!.role !== 'OWNER') {
      throw new ForbiddenException('WORKSPACE_OWNER_REQUIRED');
    }
  }

  // Check chuyển quyền hợp lệ — tránh các case vô lý
  assertRoleTransition(current: WorkspaceRole, next: WorkspaceRole, hasTransferTarget: boolean): void {
    if (next === 'OWNER' && !hasTransferTarget) {
      throw new BadRequestException('NO_TRANSFER_TARGET');
      // Muốn promote ai đó thành Owner thì phải chỉ rõ chuyển Owner cũ đi đâu
    }
    if (current === 'OWNER' && next !== 'OWNER' && !hasTransferTarget) {
      throw new BadRequestException('TRANSFER_OWNERSHIP_FIRST');
      // Owner muốn tự hạ mình → phải chuyển quyền cho người khác trước
    }
  }
}
```

### 3d. Context Interceptor — "Security guard" 🔒

Interceptor này chạy **trước** mọi route handler có `:workspaceId`. Nó làm 3 việc: tìm workspace, tìm membership, tính permissions → gắn lên request.

📁 **File:** `src/workspace/interceptors/workspace-context.interceptor.ts`

```typescript
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { WorkspaceContextPayload } from '../types/workspace-context.type';

@Injectable()
export class WorkspaceContextInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params?.workspaceId;

    // Route không có :workspaceId? Cho đi tiếp, không phải việc của ta
    if (!workspaceId) return next.handle();

    // Chưa login? Chặn luôn
    if (!request.user?.id) throw new UnauthorizedException();

    // Tìm workspace + chỉ load membership của user hiện tại (không load hết tất cả member)
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          where: { userId: request.user.id },  // Chỉ lấy membership của "mình"
        },
      },
    });

    if (!workspace) throw new NotFoundException('WORKSPACE_NOT_FOUND');

    const membership = workspace.members[0] ?? null;
    const payload: WorkspaceContextPayload = {
      workspace,
      membership,
      permissions: this.permissionService.getPermissions(workspace, membership),
    };

    // Gắn lên request — Controller và Guard phía sau cứ lấy ra dùng
    request.workspaceContext = payload;
    return next.handle();
  }
}
```

> Dùng ở Controller: `@UseInterceptors(WorkspaceContextInterceptor)` — chỉ đặt trên route nào có `:workspaceId`.

### 3e. Guards — "Bouncer" ở từng cấp độ

Ta tạo 3 guard tương ứng 3 cấp phân quyền: Member → Admin → Owner.

📁 **File:** `src/workspace/guards/workspace-member.guard.ts`

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WorkspacePermissionService } from '../services/workspace-permission.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly permissionService: WorkspacePermissionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    this.permissionService.assertMember(request.workspaceContext?.membership ?? null);
    return true;  // Nếu assertMember throw → request bị chặn, không tới đây
  }
}
```

📁 **File:** `src/workspace/guards/workspace-admin.guard.ts` — tương tự, gọi `assertAdminOrOwner`.

📁 **File:** `src/workspace/guards/workspace-owner.guard.ts` — tương tự, gọi `assertOwner`.

---

## Bước 4: Workspace CRUD — Tạo, sửa, archive, xóa 📦

### Tại sao?

Workspace là **container** — nơi chứa projects, tasks, members. Không có workspace → không có gì cả.

### 4a. DTOs

📁 **File:** `src/workspace/dto/create-workspace.dto.ts`

```typescript
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name!: string;     // Bắt buộc — workspace phải có tên

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;   // Mô tả tùy chọn
}
```

📁 **File:** `src/workspace/dto/update-workspace.dto.ts`

```typescript
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
// Cả 2 đều optional — nhưng ít nhất phải gửi 1 field, nếu body rỗng thì đang update cái gì?
```

📁 **File:** `src/workspace/dto/archive-workspace.dto.ts`

```typescript
import { IsBoolean } from 'class-validator';

export class ArchiveWorkspaceDto {
  @IsBoolean()
  archived!: boolean;  // true = archive, false = unarchive
}
```

### 4b. Controller

📁 **File:** `src/workspace/workspace.controller.ts`

```typescript
import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ArchiveWorkspaceDto } from './dto/archive-workspace.dto';
import { WorkspaceContextInterceptor } from './interceptors/workspace-context.interceptor';
import { WorkspaceOwnerGuard } from './guards/workspace-owner.guard';
import { WorkspaceAdminGuard } from './guards/workspace-admin.guard';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { WorkspaceCtx } from './decorators/workspace.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workspaces')
// Tất cả route bắt đầu bằng /api/v1/workspaces
// JwtAuthGuard đã global (Phase 1) nên không cần UseGuards ở đây
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // ── POST /workspaces — Tạo workspace mới ──
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(userId, dto);
    // Tự động tạo OWNER membership cho người tạo
  }

  // ── GET /workspaces — Danh sách workspace của tôi ──
  @Get()
  async list(@CurrentUser('id') userId: string) {
    return this.workspaceService.listWorkspaces(userId);
    // Chỉ trả về workspace mà user tham gia (member)
  }

  // ── GET /workspaces/:workspaceId — Chi tiết workspace ──
  @Get(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceMemberGuard)   // Phải là member mới được xem
  async getOverview(@WorkspaceCtx() ctx) {
    return this.workspaceService.getOverview(ctx.workspace.id);
  }

  // ── PATCH /workspaces/:workspaceId — Đổi tên/mô tả ──
  @Patch(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceAdminGuard)   // Admin hoặc Owner mới được sửa
  async update(
    @WorkspaceCtx() ctx,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.workspaceService.updateWorkspace(ctx.workspace, dto, actorId);
  }

  // ── PATCH /workspaces/:workspaceId/archive — Archive/Unarchive ──
  @Patch(':workspaceId/archive')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceOwnerGuard)   // Chỉ Owner — đây là quyết định lớn
  async toggleArchive(
    @WorkspaceCtx() ctx,
    @Body() dto: ArchiveWorkspaceDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.workspaceService.toggleArchive(ctx.workspace, dto.archived, actorId);
  }

  // ── DELETE /workspaces/:workspaceId — Xóa hẳn ──
  @Delete(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceOwnerGuard)
  async delete(@WorkspaceCtx() ctx, @Query('force') force?: string) {
    return this.workspaceService.deleteWorkspace(ctx.workspace, force === 'true');
    // Phải archive trước + truyền ?force=true mới được xóa
    // Double confirm — tránh xóa nhầm
  }
}
```

### 4c. Service

📁 **File:** `src/workspace/workspace.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacePermissionService } from './services/workspace-permission.service';
import { ConfigService } from '@nestjs/config';
import { Workspace } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
  ) {}

  // Tạo workspace + tự động gán OWNER cho người tạo
  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    // Kiểm tra quota — mỗi user chỉ được tạo tối đa N workspace
    const maxWorkspaces = this.config.get<number>('workspaceLimits.maxWorkspacesPerUser') ?? 50;
    const count = await this.prisma.workspaceMember.count({
      where: { userId, role: 'OWNER' },
      // Chỉ đếm workspace mà user SỞ HỮU, không phải workspace mà user tham gia
    });
    if (count >= maxWorkspaces) {
      throw new BadRequestException('WORKSPACE_LIMIT_REACHED');
    }

    // Transaction: tạo workspace + membership cùng lúc — hoặc cả 2 thành công, hoặc cả 2 rollback
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      const ownerMembership = await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: 'OWNER',   // Người tạo = chủ sở hữu
        },
      });

      return { workspace, membership: ownerMembership };
    });
  }

  // Liệt kê tất cả workspace mà user tham gia
  async listWorkspaces(userId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },   // Kéo luôn thông tin workspace
      orderBy: { createdAt: 'desc' },
    });
  }

  // Overview cho 1 workspace — metadata + số lượng member/invite
  async getOverview(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: {
            members: true,
            invites: true,
          },
        },
      },
    });
    return workspace;
  }

  // Cập nhật tên/mô tả
  async updateWorkspace(workspace: Workspace, dto: UpdateWorkspaceDto, actorId: string) {
    this.permissionService.assertActive(workspace);
    // Workspace đã archived → không cho sửa gì nữa

    return this.prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        // Spread conditional — chỉ update field nào client gửi lên
      },
    });
  }

  // Bật/tắt archived
  async toggleArchive(workspace: Workspace, archived: boolean, actorId: string) {
    return this.prisma.workspace.update({
      where: { id: workspace.id },
      data: { archived },
    });
  }

  // Xóa hẳn — phải archived trước + force = true
  async deleteWorkspace(workspace: Workspace, force: boolean) {
    if (!workspace.archived || !force) {
      throw new BadRequestException('ARCHIVE_REQUIRED_BEFORE_DELETE');
      // "Bạn có chắc không?" — double confirm bằng cách bắt archive trước
    }

    await this.prisma.$transaction(async (tx) => {
      // Revoke mọi invite pending trước khi xóa
      await tx.workspaceInvite.updateMany({
        where: { workspaceId: workspace.id, status: 'PENDING' },
        data: { status: 'REVOKED', revokedAt: new Date() },
      });

      await tx.workspace.delete({ where: { id: workspace.id } });
      // Cascade delete sẽ xóa members + invites nếu schema có onDelete: Cascade
    });

    return { deleted: true };
  }
}
```

---

## Bước 5: Member Management — Ai vào, ai ra, ai làm sếp? 👥

### Tại sao?

Workspace không có chỉ mình ta — cần mời bạn bè vào, phân quyền cho họ, và đôi khi... đuổi họ ra. Phần này xử lý CRUD thành viên + ownership transfer.

### 5a. DTOs

📁 **File:** `src/workspace/member/dto/add-member.dto.ts`

```typescript
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class AddMemberDto {
  @IsUUID()
  userId!: string;        // ID người muốn thêm

  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;   // Mặc định MEMBER — không thể assign OWNER trực tiếp
}
```

📁 **File:** `src/workspace/member/dto/update-member-role.dto.ts`

```typescript
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class UpdateMemberRoleDto {
  @IsEnum(WorkspaceRole)
  role!: WorkspaceRole;                 // Role mới

  @IsOptional()
  @IsUUID()
  transferOwnerTo?: string;            // Chuyển quyền Owner cho ai? (chỉ khi promote ai đó thành Owner)
}
```

### 5b. Controller

📁 **File:** `src/workspace/member/workspace-member.controller.ts`

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceContextInterceptor } from '../interceptors/workspace-context.interceptor';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { WorkspaceCtx } from '../decorators/workspace.decorator';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('workspaces/:workspaceId/members')
@UseInterceptors(WorkspaceContextInterceptor)
// Mọi route cần :workspaceId → interceptor tự resolve context
export class WorkspaceMemberController {
  constructor(private readonly memberService: WorkspaceMemberService) {}

  // GET — Danh sách thành viên (có phân trang)
  @Get()
  @UseGuards(WorkspaceAdminGuard)
  async list(@WorkspaceCtx() ctx, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.memberService.listMembers(ctx.workspace.id, Number(page), Number(limit));
  }

  // POST — Thêm thành viên mới
  @Post()
  @UseGuards(WorkspaceAdminGuard)
  async add(@WorkspaceCtx() ctx, @Body() dto: AddMemberDto) {
    return this.memberService.addMember(ctx.workspace, dto);
  }

  // PATCH — Đổi role
  @Patch(':memberId/role')
  @UseGuards(WorkspaceAdminGuard)
  async updateRole(@WorkspaceCtx() ctx, @Param('memberId') memberId: string, @Body() dto: UpdateMemberRoleDto) {
    return this.memberService.updateRole(ctx.workspace, memberId, dto);
  }

  // DELETE — Đuổi thành viên
  @Delete(':memberId')
  @UseGuards(WorkspaceAdminGuard)
  async remove(@WorkspaceCtx() ctx, @Param('memberId') memberId: string) {
    return this.memberService.removeMember(ctx.workspace, memberId);
  }
}
```

### 5c. Service

📁 **File:** `src/workspace/member/workspace-member.service.ts`

```typescript
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { ConfigService } from '@nestjs/config';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Workspace } from '@prisma/client';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
  ) {}

  // Danh sách member + phân trang
  async listMembers(workspaceId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: true },   // Eager load thông tin user (name, email, avatar)
      }),
      this.prisma.workspaceMember.count({ where: { workspaceId } }),
    ]);
    return { items, total, page, limit };
  }

  // Thêm thành viên — check limit + duplicate
  async addMember(workspace: Workspace, dto: AddMemberDto) {
    this.permissionService.assertActive(workspace);

    // Check limit
    const maxMembers = this.config.get<number>('workspaceLimits.maxMembersPerWorkspace') ?? 200;
    const count = await this.prisma.workspaceMember.count({ where: { workspaceId: workspace.id } });
    if (count >= maxMembers) {
      throw new BadRequestException('MEMBER_LIMIT_REACHED');
    }

    // Check đã là member chưa
    const existing = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: dto.userId },
    });
    if (existing) {
      throw new BadRequestException('MEMBER_ALREADY_EXISTS');
    }

    // Không cho assign OWNER trực tiếp — phải qua flow transfer
    const role = dto.role === 'OWNER' ? 'ADMIN' : dto.role ?? 'MEMBER';

    return this.prisma.workspaceMember.create({
      data: { workspaceId: workspace.id, userId: dto.userId, role },
      include: { user: true },
    });
  }

  // Đổi role — bao gồm logic chuyển quyền Owner
  async updateRole(workspace: Workspace, memberId: string, dto: UpdateMemberRoleDto) {
    this.permissionService.assertActive(workspace);

    const member = await this.prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!member || member.workspaceId !== workspace.id) {
      throw new NotFoundException('MEMBER_NOT_FOUND');
    }

    // Guard logic chuyển quyền
    this.permissionService.assertRoleTransition(member.role, dto.role, !!dto.transferOwnerTo);

    // Nếu promote thành OWNER → transaction: promote target + hạ owner cũ
    if (dto.role === 'OWNER' && dto.transferOwnerTo) {
      await this.prisma.$transaction(async (tx) => {
        await tx.workspaceMember.update({
          where: { id: dto.transferOwnerTo! },
          data: { role: 'OWNER' },
        });
        await tx.workspaceMember.update({
          where: { id: member.id },
          data: { role: 'ADMIN' },   // Owner cũ tự động xuống ADMIN
        });
      });
    } else {
      await this.prisma.workspaceMember.update({
        where: { id: member.id },
        data: { role: dto.role },
      });
    }

    return { updated: true };
  }

  // Đuổi thành viên — owner không được tự đuổi mình
  async removeMember(workspace: Workspace, memberId: string) {
    const member = await this.prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!member || member.workspaceId !== workspace.id) {
      throw new NotFoundException('MEMBER_NOT_FOUND');
    }

    if (member.role === 'OWNER') {
      throw new BadRequestException('CANNOT_REMOVE_OWNER');
      // Owner muốn rời → phải chuyển quyền trước
    }

    await this.prisma.workspaceMember.delete({ where: { id: memberId } });
    return { removed: true };
  }
}
```

---

## Bước 6: Invitation Lifecycle — Mời, nhận, từ chối 💌

### Tại sao?

Không phải lúc nào ta cũng biết userId của người muốn mời — nhiều khi chỉ biết email. Flow invite giải quyết điều này: tạo token → gửi link → người nhận click accept → tự động join workspace.

### 6a. DTOs

📁 **File:** `src/workspace/invite/dto/create-invites.dto.ts`

```typescript
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

class InviteEntryDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;
}

export class CreateInvitesDto {
  @IsArray({ message: 'invites must be an array' })
  @ArrayMinSize(1)     // Ít nhất 1 người
  @ArrayMaxSize(20)    // Tối đa 20 để tránh spam
  invites!: InviteEntryDto[];
}
// Bulk invite — gửi 1 request, mời nhiều người cùng lúc
```

### 6b. Controller

📁 **File:** `src/workspace/invite/workspace-invite.controller.ts`

```typescript
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkspaceInviteService } from './workspace-invite.service';
import { WorkspaceContextInterceptor } from '../interceptors/workspace-context.interceptor';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { WorkspaceCtx } from '../decorators/workspace.decorator';
import { CreateInvitesDto } from './dto/create-invites.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

// ═══ Controller 1: Admin quản lý invite ═══
@Controller('workspaces/:workspaceId/invites')
@UseInterceptors(WorkspaceContextInterceptor)
export class WorkspaceInviteController {
  constructor(private readonly inviteService: WorkspaceInviteService) {}

  @Post()
  @UseGuards(WorkspaceAdminGuard)
  async create(@WorkspaceCtx() ctx, @Body() dto: CreateInvitesDto, @CurrentUser('id') actorId: string) {
    return this.inviteService.createInvites(ctx.workspace, dto, actorId);
  }

  @Get()
  @UseGuards(WorkspaceAdminGuard)
  async list(@WorkspaceCtx() ctx) {
    return this.inviteService.listInvites(ctx.workspace.id);
  }

  @Delete(':inviteId')
  @UseGuards(WorkspaceAdminGuard)
  async revoke(@WorkspaceCtx() ctx, @Param('inviteId') inviteId: string, @CurrentUser('id') actorId: string) {
    return this.inviteService.revokeInvite(ctx.workspace, inviteId, actorId);
  }
}

// ═══ Controller 2: Người được mời accept/reject ═══
@Controller('workspace-invites')
export class WorkspaceInviteTokenController {
  constructor(private readonly inviteService: WorkspaceInviteService) {}

  // Accept invite — cần login (để biết ai accept)
  @Post(':token/accept')
  async accept(@Param('token') token: string, @CurrentUser() user) {
    return this.inviteService.acceptInvite(token, user);
  }

  // Reject invite
  @Post(':token/reject')
  async reject(@Param('token') token: string, @CurrentUser() user) {
    return this.inviteService.rejectInvite(token, user);
  }
}
```

### 6c. Service

📁 **File:** `src/workspace/invite/workspace-invite.service.ts`

```typescript
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { CreateInvitesDto } from './dto/create-invites.dto';
import { Workspace } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class WorkspaceInviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
  ) {}

  // Bulk create invites — dedupe email, skip member đã join, skip invite pending
  async createInvites(workspace: Workspace, dto: CreateInvitesDto, actorId: string) {
    this.permissionService.assertActive(workspace);

    const inviteExpiryDays = this.config.get<number>('workspaceLimits.inviteExpiryDays') ?? 7;
    const expiresAt = () => new Date(Date.now() + inviteExpiryDays * 24 * 60 * 60 * 1000);

    // Dedupe email: nếu client gửi trùng email → chỉ giữ 1
    const deduped = Array.from(
      new Map(dto.invites.map((e) => [e.email.toLowerCase(), e])).values(),
    );

    // Bỏ qua user đã là member
    const existingMembers = await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspace.id,
        user: { email: { in: deduped.map((i) => i.email) } },
      },
      include: { user: true },
    });

    // Bỏ qua email đã có invite pending chưa hết hạn
    const activeInvites = await this.prisma.workspaceInvite.findMany({
      where: {
        workspaceId: workspace.id,
        email: { in: deduped.map((i) => i.email) },
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
    });

    const skipped = new Set<string>();
    existingMembers.forEach((m) => skipped.add(m.user.email));
    activeInvites.forEach((i) => skipped.add(i.email));

    const toCreate = deduped.filter((entry) => !skipped.has(entry.email));

    // Tạo invite records
    const created = await this.prisma.workspaceInvite.createManyAndReturn({
      data: toCreate.map((entry) => ({
        workspaceId: workspace.id,
        email: entry.email,
        role: entry.role === 'OWNER' ? 'ADMIN' : entry.role ?? 'MEMBER',
        // Không cho mời làm OWNER — chỉ ADMIN hoặc MEMBER
        status: 'PENDING',
        token: uuid(),
        expiresAt: expiresAt(),
        invitedByMemberId: actorId,
      })),
    });

    return { created, skipped: Array.from(skipped) };
    // Trả về cả danh sách bị skip — cho client biết email nào đã tồn tại
  }

  // Liệt kê invite (cho admin dashboard)
  async listInvites(workspaceId: string) {
    return this.prisma.workspaceInvite.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Revoke invite
  async revokeInvite(workspace: Workspace, inviteId: string, actorId: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.workspaceId !== workspace.id) {
      throw new NotFoundException('INVITE_NOT_FOUND');
    }

    return this.prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
  }

  // Accept invite — join workspace
  async acceptInvite(token: string, user: { id: string; email: string }) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) throw new NotFoundException('INVITE_NOT_FOUND');

    if (invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new BadRequestException('INVITE_EXPIRED');
    }
    if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestException('INVITE_EMAIL_MISMATCH');
      // Invite gửi cho alice@mail.com mà bob@mail.com accept → chặn
    }

    const workspace = await this.prisma.workspace.findUnique({ where: { id: invite.workspaceId } });
    if (!workspace) throw new NotFoundException('WORKSPACE_NOT_FOUND');
    this.permissionService.assertActive(workspace);

    // Transaction: tạo membership + mark invite accepted
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.workspaceMember.findFirst({
        where: { workspaceId: workspace.id, userId: user.id },
      });

      if (!existing) {
        await tx.workspaceMember.create({
          data: {
            workspaceId: workspace.id,
            userId: user.id,
            role: invite.role,
          },
        });
      }

      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });
    });

    return { accepted: true };
  }

  // Reject invite — đơn giản mark REVOKED
  async rejectInvite(token: string, user: { id: string; email: string }) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) throw new NotFoundException('INVITE_NOT_FOUND');

    if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestException('INVITE_EMAIL_MISMATCH');
    }

    await this.prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });

    return { rejected: true };
  }
}
```

---

## Bước 7: Test 🧪

### Hành động

1. Chạy `npm run start:dev`
2. Import collection vào Hoppscotch (hoặc dùng Swagger tại `/api-docs`)

### Test thứ tự

**Test 1: Tạo workspace**
- Login → lấy token
- `POST /api/v1/workspaces` — body: `{ "name": "Dự án CCNLTHD", "description": "TodoList Collaboration" }`
- Kỳ vọng: 201 + workspace + membership (role = OWNER)

**Test 2: List workspaces**
- `GET /api/v1/workspaces`
- Kỳ vọng: 200 + mảng chứa workspace vừa tạo

**Test 3: Invite member**
- `POST /api/v1/workspaces/:id/invites` — body: `{ "invites": [{ "email": "friend@mail.com" }] }`
- Kỳ vọng: 201 + created array + skipped array

**Test 4: Accept invite**
- Login bằng `friend@mail.com`
- `POST /api/v1/workspace-invites/:token/accept`
- Kỳ vọng: 200 + `{ accepted: true }`

**Test 5: Archive + Delete workspace**
- `PATCH /api/v1/workspaces/:id/archive` — body: `{ "archived": true }`
- `DELETE /api/v1/workspaces/:id?force=true`
- Kỳ vọng: 200 + `{ deleted: true }`

---

## Checklist Phase 3

- [ ] Thêm workspace limit config vào `.env`
- [ ] Update Prisma schema + chạy migration
- [ ] Tạo shared layer: types, decorators, permission service, interceptor, guards
- [ ] Tạo Workspace CRUD: DTOs, controller, service
- [ ] Tạo Member management: DTOs, controller, service
- [ ] Tạo Invite lifecycle: DTOs, controllers (2), service
- [ ] Đăng ký tất cả modules vào AppModule
- [ ] Test trên Hoppscotch/Swagger
- [ ] Cập nhật Hoppscotch collection JSON

---

## Q&A

**Q1: Tại sao tách thành 3 module (Workspace, Member, Invite) mà không gộp 1?**
Vì mỗi module có service riêng với logic phức tạp riêng. Gộp hết vào 1 WorkspaceService sẽ ra file 500+ dòng, khó maintain. Tách ra thì mỗi file tập trung 1 nhiệm vụ, dễ test, dễ đọc.

**Q2: WorkspaceContextInterceptor có chạy mỗi request không? Có chậm không?**
Chỉ chạy trên route nào có `:workspaceId` VÀ dùng `@UseInterceptors(WorkspaceContextInterceptor)`. Mỗi lần chạy = 1 query Prisma (findUnique + include member). Với index trên primary key thì < 1ms.

**Q3: Tại sao Owner không thể tự xóa mình?**
Vì workspace luôn phải có ít nhất 1 Owner. Owner muốn rời → phải transfer quyền cho người khác trước. Nếu không, workspace thành "vô chủ" — không ai có quyền quản trị.

**Q4: Tại sao invite cần email mismatch check?**
Tránh trường hợp: mời alice@mail.com nhưng bob@mail.com login và bấm accept link. Đây là lỗ hổng bảo mật nếu không check.
