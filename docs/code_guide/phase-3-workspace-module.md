# Code Guide — Phase 3 Workspace Suite

> Thiết kế chi tiết đã được chốt tại [docs/superpowers/specs/2026-03-19-workspace-suite-design.md](docs/superpowers/specs/2026-03-19-workspace-suite-design.md). File này đóng vai trò “cookbook”: copy-paste code, đọc comment, và triển khai thủ công theo đúng thứ tự.
>
> Ngày tạo code guide: 2026-03-19

---

## 1. Phase Snapshot

| Track | Details |
| --- | --- |
| Goal | Ship Workspace CRUD + member management + invitation lifecycle cùng shared permission layer, logging, tests |
| Scope | 3 module NestJS: `Workspace`, `WorkspaceMember`, `WorkspaceInvite` + Prisma schema + config limits + activity log |
| Prerequisites | Phase 2 (Auth/User) đã stable, `.env` có `MAX_WORKSPACES_PER_USER`, `MAX_MEMBERS_PER_WORKSPACE`, DB migration ready |
    this.permissionService.assertMember(membership); // Tất cả member (OWNER/ADMIN/MEMBER) được phép

---

## 2. Execution Flow (checklist)

| Step | Việc cần làm | Chi tiết |
| --- | --- | --- |
| 1 | Tạo provider cấu hình giới hạn workspace/member/invite | [3.1](#31-step-1-config-limits--env-guardrails) |
| 2 | Update Prisma schema + migration (workspace.archived, invite.status, index) | [3.2](#32-step-2-prisma-schema--migration) |
| 3 | Dựng shared layer (types, decorators, interceptor, permission service, guards) | [3.3](#33-step-3-shared-workspace-context-layer) |
| 4 | Viết WorkspaceModule: DTOs, controller, service, response types | [3.4](#34-step-4-workspace-crud-module) |
| 5 | Viết WorkspaceMemberModule: DTOs, controller, service, ownership transfer | [3.5](#35-step-5-member-management-module) |
| 6 | Viết WorkspaceInviteModule: bulk invite, accept/reject token, revoke | [3.6](#36-step-6-invitation-lifecycle-module) |
| 7 | Hook activity logging, domain events, reusable helper | [3.7](#37-step-7-activity-log--events) |
| 8 | Viết test (unit + e2e) + tài liệu Hoppscotch | [3.8](#38-step-8-testing-playbook) |

---

## 3. Step-by-step Implementation

### 3.1 Step 1. Config limits & env guardrails

**Tại sao?** Không hard-code giới hạn vào service; đọc từ `.env` để QA/Prod điều chỉnh được. Cần provider riêng để inject qua `ConfigService`.

```ts
// src/common/config/workspace-limits.config.ts
import { registerAs } from '@nestjs/config';
// registerAs cho phép gom nhóm config dưới 1 key trong ConfigService.

export interface WorkspaceLimitConfig {
  maxWorkspacesPerUser: number; // Limit số workspace mà 1 user có thể tạo/sở hữu
  maxMembersPerWorkspace: number; // Limit số member trong 1 workspace (owner được tính)
  inviteExpiryDays: number; // Số ngày token invitation còn hiệu lực
}

// Register workspace limit namespace để mọi module inject và đọc typed config dễ dàng
export default registerAs(
  'workspaceLimits',
  (): WorkspaceLimitConfig => {
    const toNumber = (value: string | undefined, fallback: string) =>
      parseInt(value ?? fallback, 10); // parse chuỗi env -> số nguyên với default rõ ràng

    return {
      maxWorkspacesPerUser: toNumber(process.env.MAX_WORKSPACES_PER_USER, '50'),
      maxMembersPerWorkspace: toNumber(process.env.MAX_MEMBERS_PER_WORKSPACE, '200'),
      inviteExpiryDays: toNumber(process.env.WORKSPACE_INVITE_EXPIRY_DAYS, '7'),
    };
  },
);
```

- Trong `AppModule` (hoặc `WorkspaceModule`), nhớ `ConfigModule.forFeature(workspaceLimitConfig)`.
- Tạo helper trong service: `this.config.get<number>('workspaceLimits.maxMembersPerWorkspace')`.

### 3.2 Step 2. Prisma schema & migration

**Tại sao?** Workspace cần cờ `archived`; invite cần enum `status` + token unique + index để list nhanh.

```prisma
// prisma/schema.prisma
model Workspace {
  id          String   @id @default(cuid())   // UUID được Prisma gen
  name        String                           // Tên workspace do user nhập
  description String?                          // Mô tả optional
  archived    Boolean  @default(false)         // Cờ soft-delete, block mutation khi true
  members     WorkspaceMember[]                // One-to-many sang bảng membership
  invites     WorkspaceInvite[]                // Danh sách invite pending
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WorkspaceInvite {
  id          String            @id @default(cuid())   // Token record
  workspace   Workspace         @relation(fields: [workspaceId], references: [id])
  workspaceId String
  email       String                                 // Email người được mời
  role        WorkspaceRole     @default(MEMBER)     // Role target khi accept
  status      InvitationStatus  @default(PENDING)
  token       String            @unique              // String gửi cho client
  expiresAt   DateTime
  revokedAt   DateTime?
  acceptedAt  DateTime?
  invitedByMemberId String                           // WorkspaceMember tạo invite
  invitedBy        WorkspaceMember @relation(fields: [invitedByMemberId], references: [id])
  createdAt   DateTime @default(now())

  @@index([workspaceId, status])                    // Liệt kê pending nhanh
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  REVOKED
}
```

- Command:
  ```bash
  npx prisma migrate dev --name add-workspace-archived-and-invite-status
  npx prisma generate
  ```
- Nếu repo có seed, nhớ update để tạo cờ `archived = false` mặc định.

### 3.3 Step 3. Shared workspace context layer

#### 3.3.1 Types + Express augmentation

```ts
// src/workspace/types/workspace-context.type.ts
import { Workspace, WorkspaceMember } from '@prisma/client';
// Lấy type trực tiếp từ Prisma để tránh duplicate interface.

export type WorkspaceRole = WorkspaceMember['role'];
// Nếu sau này schema đổi enum, code ở đây tự cập nhật.

export interface WorkspacePermissions {
  canManageMembers: boolean; // Cho phép add/kick/promote member
  canInvite: boolean;        // Cho phép tạo invite
  canArchive: boolean;       // Chỉ owner được archive
  canDelete: boolean;        // Force delete chỉ khi archived + owner
}

export interface WorkspaceContextPayload {
  workspace: Workspace;                 // Bản ghi workspace để controller khỏi query lại
  membership: WorkspaceMember | null;   // Thành viên hiện tại (null nếu chưa join)
  permissions: WorkspacePermissions;    // Các flag đã tính toán sẵn
}
```

```ts
// src/types/express.d.ts (hoặc tương đương)
import { WorkspaceContextPayload } from '../workspace/types/workspace-context.type';

declare module 'express-serve-static-core' {
  interface Request {
    workspaceContext?: WorkspaceContextPayload; // Thêm field tuỳ biến vào Request typing
  }
}
```

#### 3.3.2 Decorators

```ts
// src/workspace/decorators/workspace.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WorkspaceContextPayload } from '../types/workspace-context.type';

// Lấy full payload (workspace + membership + permissions) đã nhét vào request bởi interceptor
export const WorkspaceContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkspaceContextPayload => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.workspaceContext) {
      throw new Error('WorkspaceContext not resolved. Did you apply the interceptor?');
    }
    return request.workspaceContext;
  },
);

// Shortcut decorator giúp controller chỉ cần inject workspace record
export const Workspace = createParamDecorator((_data, ctx) => {
  return WorkspaceContext(null, ctx).workspace; // Controller chỉ cần @Workspace() workspace
});

// Shortcut decorator giúp inject membership hiện tại (null nếu chưa tham gia)
export const WorkspaceMembership = createParamDecorator((_data, ctx) => {
  return WorkspaceContext(null, ctx).membership; // Hoặc lấy membership hiện tại
});
```

#### 3.3.3 Permission service

```ts
// src/workspace/services/workspace-permission.service.ts
import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { Workspace, WorkspaceMember } from '@prisma/client';
import { WorkspacePermissions, WorkspaceRole } from '../types/workspace-context.type';

@Injectable()
// Trung tâm tính toán và enforce quyền trong workspace
export class WorkspacePermissionService {
  // Ráp snapshot membership vào các flag permissions phục vụ guard/controller
  getPermissions(workspace: Workspace, membership: WorkspaceMember | null): WorkspacePermissions {
    const role = membership?.role ?? null;
    const isOwner = role === 'OWNER';
    const isAdmin = role === 'ADMIN';

    return {
      canManageMembers: isOwner || isAdmin,
      canInvite: isOwner || isAdmin,
      canArchive: isOwner,
      canDelete: isOwner && workspace.archived,
    };
  }

  // Cấm mutate khi workspace ở trạng thái archived
  assertActive(workspace: Workspace): void {
    if (workspace.archived) {
      throw new BadRequestException('WORKSPACE_ARCHIVED');
    }
  }

  // Yêu cầu user phải là thành viên
  assertMember(membership: WorkspaceMember | null): void {
    if (!membership) {
      throw new ForbiddenException('WORKSPACE_MEMBER_REQUIRED');
    }
  }

  // Allow cả ADMIN và OWNER cho các hành động quan trọng
  assertAdminOrOwner(membership: WorkspaceMember | null): void {
    this.assertMember(membership);
    if (membership!.role !== 'OWNER' && membership!.role !== 'ADMIN') {
      throw new ForbiddenException('WORKSPACE_ADMIN_REQUIRED');
    }
  }

  // Chỉ owner mới đi qua guard này
  assertOwner(membership: WorkspaceMember | null): void {
    this.assertMember(membership);
    if (membership!.role !== 'OWNER') {
      throw new ForbiddenException('WORKSPACE_OWNER_REQUIRED');
    }
  }

  // Kiểm tra logic thăng/giáng chức, đặc biệt với owner transfer
  assertRoleTransition(current: WorkspaceRole, next: WorkspaceRole, hasTransferTarget: boolean): void {
    if (next === 'OWNER' && !hasTransferTarget) {
      throw new BadRequestException('NO_TRANSFER_TARGET');
    }
    if (current === 'OWNER' && next !== 'OWNER' && !hasTransferTarget) {
      throw new BadRequestException('TRANSFER_OWNERSHIP_FIRST');
    }
    if (current === 'OWNER' && next === 'OWNER') {
      throw new BadRequestException('OWNER_ALREADY_ASSIGNED');
    }
  }
}
```

#### 3.3.4 Context interceptor

```ts
// src/workspace/interceptors/workspace-context.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { WorkspaceContextPayload } from '../types/workspace-context.type';

@Injectable()
// Interceptor inject context payload dựa trên :workspaceId trong route
export class WorkspaceContextInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
  ) {}

  // Resolve workspace + membership rồi cache thẳng lên request cho downstream dùng
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params?.workspaceId; // (1) lấy workspaceId từ params
    if (!workspaceId) {
      return next.handle(); // (2) route không cần context thì cho đi tiếp
    }
    if (!request.user?.id) {
      throw new UnauthorizedException(); // (3) bảo vệ trong trường hợp chưa login
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          where: { userId: request.user.id }, // (4) chỉ load membership của user hiện tại
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('WORKSPACE_NOT_FOUND'); // (5) workspace không tồn tại -> 404
    }

    const membership = workspace.members[0] ?? null; // (6) user có thể chưa join
    const payload: WorkspaceContextPayload = {
      workspace,
      membership,
      permissions: this.permissionService.getPermissions(workspace, membership), // (7) precompute permissions
    };

    request.workspaceContext = payload; // (8) cache vào request để guard/controller tái sử dụng
    return next.handle(); // (9) chuyển quyền cho handler tiếp theo
  }
}
```

- Apply interceptor ở controller level: `@UseInterceptors(WorkspaceContextInterceptor)` trên các route chứa `:workspaceId`.

#### 3.3.5 Guards

```ts
// src/workspace/guards/workspace-owner.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WorkspacePermissionService } from '../services/workspace-permission.service';

@Injectable()
// Guard dành cho endpoint chỉ owner truy cập
export class WorkspaceOwnerGuard implements CanActivate {
  constructor(private readonly permissionService: WorkspacePermissionService) {}

  // Throw nếu current membership không phải owner
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const membership = request.workspaceContext?.membership ?? null;
    this.permissionService.assertOwner(membership); // guard throw nếu không phải owner
    return true;
  }
}
```

```ts
// src/workspace/guards/workspace-admin.guard.ts
@Injectable()
// Guard yêu cầu ADMIN hoặc OWNER, dùng cho quản trị workspace
export class WorkspaceAdminGuard implements CanActivate {
  constructor(private readonly permissionService: WorkspacePermissionService) {}

  // Delegate sang permission service để check role
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const membership = request.workspaceContext?.membership ?? null;
    this.permissionService.assertAdminOrOwner(membership);
    return true;
  }
}
```

```ts
// src/workspace/guards/workspace-member.guard.ts
@Injectable()
// Guard cho các endpoint cần membership bất kỳ
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly permissionService: WorkspacePermissionService) {}

  // Chặn request nếu user chưa join workspace
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const membership = request.workspaceContext?.membership ?? null;
    this.permissionService.assertMember(membership);
    return true;
  }
}
```

### 3.4 Step 4. Workspace CRUD module

#### 3.4.1 DTOs + custom validator

```ts
// src/workspace/validators/at-least-one-field.validator.ts
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type Constructor<T> = new (...args: any[]) => T;

// Custom validator đảm bảo DTO truyền tối thiểu 1 trong các field định nghĩa
export function AtLeastOneField<T>(propertyNames: (keyof T)[], options?: ValidationOptions) {
  return function (target: Constructor<T>, propertyName: string) {
    registerDecorator({
      name: 'AtLeastOneField',
      target: target.constructor,
      propertyName,
      constraints: [propertyNames],
      options,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const [fields] = args.constraints as [(keyof T)[]];
          return fields.some((field) => {
            const value = (args.object as T)[field];
            return value !== undefined && value !== null && value !== '';
          });
        },
        defaultMessage(args: ValidationArguments) {
          const [fields] = args.constraints as [(keyof T)[]];
          return `At least one of: ${fields.join(', ')} must be provided.`;
        },
      },
    });
  };
}
```

```ts
// src/workspace/dto/create-workspace.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Payload dùng cho POST /workspaces
export class CreateWorkspaceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name!: string; // Chỉ cần name khi tạo

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string; // Optional description giữ trong limit
}
```

```ts
// src/workspace/dto/update-workspace.dto.ts
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AtLeastOneField } from '../validators/at-least-one-field.validator';

@AtLeastOneField<UpdateWorkspaceDto>(['name', 'description'])
// Payload cho PATCH /workspaces/:workspaceId
export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string; // Có thể đổi name

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string; // Hoặc description
}
```

```ts
// src/workspace/dto/archive-workspace.dto.ts
import { IsBoolean } from 'class-validator';

// DTO giúp bật/tắt cờ archived
export class ArchiveWorkspaceDto {
  @IsBoolean()
  archived!: boolean; // true -> archive, false -> unarchive
}
```

#### 3.4.2 Controller

```ts
// src/workspace/workspace.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ArchiveWorkspaceDto } from './dto/archive-workspace.dto';
import { WorkspaceContextInterceptor } from './interceptors/workspace-context.interceptor';
import { WorkspaceOwnerGuard } from './guards/workspace-owner.guard';
import { WorkspaceAdminGuard } from './guards/workspace-admin.guard';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { Workspace } from './decorators/workspace.decorator';
import { WorkspaceMember } from './decorators/workspace.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
// REST controller điều phối toàn bộ workspace CRUD endpoints
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // POST /workspaces -> tạo workspace mới cho user hiện tại
  @Post()
  async createWorkspace(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(userId, dto); // Tạo workspace mới + OWNER membership
  }

  // GET /workspaces -> liệt kê mọi workspace user tham gia
  @Get()
  async listWorkspaces(@CurrentUser('id') userId: string) {
    return this.workspaceService.listWorkspaces(userId); // Liệt kê mọi workspace user tham gia
  }

  // GET /workspaces/:workspaceId -> lấy overview + stats
  @Get(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceMemberGuard)
  async getOverview(@Workspace() workspace) {
    return this.workspaceService.getOverview(workspace.id); // Overview gồm counts + permissions
  }

  // PATCH /workspaces/:workspaceId -> update name/description
  @Patch(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceAdminGuard)
  async updateWorkspace(
    @Workspace() workspace,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.workspaceService.updateWorkspace(workspace, dto, actorId); // Rename/đổi description
  }

  // PATCH /workspaces/:workspaceId/archive -> toggle cờ archived
  @Patch(':workspaceId/archive')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceOwnerGuard)
  async toggleArchive(@Workspace() workspace, @Body() dto: ArchiveWorkspaceDto, @CurrentUser('id') actorId: string) {
    return this.workspaceService.toggleArchive(workspace, dto.archived, actorId); // Soft delete / restore
  }

  // DELETE /workspaces/:workspaceId -> xoá hẳn workspace (đã archived)
  @Delete(':workspaceId')
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseGuards(WorkspaceOwnerGuard)
  async deleteWorkspace(@Workspace() workspace, @Query('force') force?: string) {
    return this.workspaceService.deleteWorkspace(workspace, force === 'true'); // Hard delete (phải archived trước)
  }
}
```

#### 3.4.3 Service

```ts
// src/workspace/workspace.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacePermissionService } from './services/workspace-permission.service';
import { ConfigService } from '@nestjs/config';
import { Workspace } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
// Service chứa toàn bộ business rule của Workspace CRUD
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
    private readonly activityLog: ActivityLogService,
  ) {}

  // Sinh workspace mới + owner membership trong transaction
  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const maxWorkspaces = this.config.get<number>('workspaceLimits.maxWorkspacesPerUser') ?? 50;
    const workspaceCount = await this.prisma.workspaceMember.count({ where: { userId } }); // (1) kiểm tra quota
    if (workspaceCount >= maxWorkspaces) {
      throw new BadRequestException('WORKSPACE_LIMIT_REACHED'); // (2) chặn khi vượt giới hạn
    }

    // (3) bọc vào transaction để tất cả thao tác commit cùng lúc
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({ // (4) tạo workspace chính
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      const ownerMembership = await tx.workspaceMember.create({ // (5) gán OWNER membership cho creator
        data: {
          workspaceId: workspace.id,
          userId,
          role: 'OWNER',
        },
      });

      // (6) ghi lại activity log phục vụ audit
      await this.activityLog.logWorkspaceAction({
        workspaceId: workspace.id,
        actorId: userId,
        action: 'WORKSPACE_CREATED',
        entityId: workspace.id,
        entityType: 'Workspace',
        metadata: { name: workspace.name },
      });

      return { workspace, membership: ownerMembership };
    });
  }

  // Trả về danh sách workspace user đã tham gia để render dashboard
  async listWorkspaces(userId: string) {
    // (1) join workspace để FE có đủ dữ liệu card
    return this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Tổng hợp overview cho 1 workspace (metadata + stats)
  async getOverview(workspaceId: string) {
    // (1) chạy song song truy vấn workspace + stats count
    const [workspace, stats] = await Promise.all([
      this.prisma.workspace.findUnique({ where: { id: workspaceId } }),
      this.prisma.workspace.aggregate({
        where: { id: workspaceId },
        _count: { members: true, invites: { where: { status: 'PENDING' } } },
      }),
    ]);

    return { workspace, stats };
  }

  // Update name/description rồi log event rename
  async updateWorkspace(workspace: Workspace, dto: UpdateWorkspaceDto, actorId: string) {
    // (1) chỉ patch các field có trong payload để tránh overwrite
    const updated = await this.prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.description ? { description: dto.description } : {}),
      },
    });

    // (2) log lại rename event cho audit trail
    await this.activityLog.logWorkspaceAction({
      workspaceId: workspace.id,
      actorId,
      action: 'WORKSPACE_RENAMED',
      entityId: workspace.id,
      entityType: 'Workspace',
      metadata: { name: updated.name },
    });

    return updated;
  }

  // Bật/tắt archived flag cho workspace
  async toggleArchive(workspace: Workspace, archived: boolean, actorId: string) {
    const updated = await this.prisma.workspace.update({
      where: { id: workspace.id },
      data: { archived },
    });

    // (1) log chung cho cả archive/unarchive với metadata archived
    await this.activityLog.logWorkspaceAction({
      workspaceId: workspace.id,
      actorId,
      action: 'WORKSPACE_ARCHIVED',
      entityId: workspace.id,
      entityType: 'Workspace',
      metadata: { archived },
    });

    return updated;
  }

  // Hard delete workspace sau khi đã archive + xác nhận force
  async deleteWorkspace(workspace: Workspace, force: boolean) {
    // (1) double check workspace đã archive và client truyền force
    if (!workspace.archived || !force) {
      throw new BadRequestException('ARCHIVE_REQUIRED_BEFORE_DELETE');
    }

    // (2) bọc trong transaction vì gồm nhiều thao tác xoá
    await this.prisma.$transaction(async (tx) => {
      const invites = await tx.workspaceInvite.findMany({ // (3) fetch pending invite để revoke và log sau
        where: { workspaceId: workspace.id, status: 'PENDING' },
      });

      // (4) revoke toàn bộ invite pending trước khi xoá workspace
      await tx.workspaceInvite.updateMany({
        where: { workspaceId: workspace.id, status: 'PENDING' },
        data: { status: 'REVOKED', revokedAt: new Date() },
      });

      await tx.workspace.delete({ where: { id: workspace.id } }); // (5) xoá workspace chính

      // (6) log revoke invite ngoài transaction để không kéo dài lock
      await Promise.all(
        invites.map((invite) =>
          this.activityLog.logWorkspaceAction({
            workspaceId: workspace.id,
            actorId: workspace.id,
            action: 'INVITE_REVOKED',
            entityType: 'WorkspaceInvite',
            entityId: invite.id,
            metadata: { email: invite.email },
          }),
        ),
      );
    });

    return { deleted: true };
  }
}
```

#### 3.4.4 Response types (optional but giúp FE)

```ts
// src/workspace/types/workspace.dto.ts
// DTO trả về cho FE khi render danh sách workspace
export interface WorkspaceSummaryDto {
  id: string;
  name: string;
  description?: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.5 Step 5. Member management module

#### 3.5.1 DTOs

```ts
// src/workspace/member/dto/add-member.dto.ts
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

// Yêu cầu thêm thành viên mới vào workspace
export class AddMemberDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;
}
```

```ts
// src/workspace/member/dto/update-member-role.dto.ts
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

// Đổi role của một thành viên cụ thể
export class UpdateMemberRoleDto {
  @IsEnum(WorkspaceRole)
  role!: WorkspaceRole;

  @IsOptional()
  @IsUUID()
  transferOwnerTo?: string;
}
```

```ts
// src/workspace/member/dto/remove-member.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

// Xoá thành viên, optional transfer owner sang người khác
export class RemoveMemberDto {
  @IsOptional()
  @IsUUID()
  transferOwnerTo?: string;
}
```

#### 3.5.2 Controller

```ts
// src/workspace/member/workspace-member.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceContextInterceptor } from '../interceptors/workspace-context.interceptor';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { WorkspaceOwnerGuard } from '../guards/workspace-owner.guard';
import { Workspace } from '../decorators/workspace.decorator';
import { AddMemberDto } from './dto/add-member.dto.ts';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';

@Controller('workspaces/:workspaceId/members')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WorkspaceContextInterceptor)
// Controller handle listing/add/update/remove thành viên
export class WorkspaceMemberController {
  constructor(private readonly memberService: WorkspaceMemberService) {}

  // GET -> phân trang danh sách member (ADMIN trở lên)
  @Get()
  @UseGuards(WorkspaceAdminGuard)
  async listMembers(@Workspace() workspace, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.memberService.listMembers(workspace.id, Number(page), Number(limit));
  }

  // POST -> thêm thành viên mới dựa trên userId
  @Post()
  @UseGuards(WorkspaceAdminGuard)
  async addMember(@Workspace() workspace, @Body() dto: AddMemberDto) {
    return this.memberService.addMember(workspace, dto);
  }

  // PATCH -> đổi role của member cụ thể
  @Patch(':memberId/role')
  @UseGuards(WorkspaceAdminGuard)
  async updateRole(@Workspace() workspace, @Param('memberId') memberId: string, @Body() dto: UpdateMemberRoleDto) {
    return this.memberService.updateRole(workspace, memberId, dto);
  }

  // DELETE -> xoá member, optional transfer owner
  @Delete(':memberId')
  @UseGuards(WorkspaceAdminGuard)
  async removeMember(
    @Workspace() workspace,
    @Param('memberId') memberId: string,
    @Body() dto: RemoveMemberDto,
  ) {
    return this.memberService.removeMember(workspace, memberId, dto);
  }
}
```

#### 3.5.3 Service (logic chính)

```ts
// src/workspace/member/workspace-member.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { ConfigService } from '@nestjs/config';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { Workspace } from '@prisma/client';
import { ActivityLogService } from '../../activity-log/activity-log.service';

@Injectable()
// Đóng gói toàn bộ nghiệp vụ quản lý thành viên
export class WorkspaceMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
    private readonly activityLog: ActivityLogService,
  ) {}

  // Liệt kê thành viên trong workspace với paginate đơn giản
  async listMembers(workspaceId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId },
        skip: (page - 1) * limit, // (1) offset
        take: limit, // (2) limit
        include: { user: true }, // (3) eager load user profile
      }),
      this.prisma.workspaceMember.count({ where: { workspaceId } }), // (4) total để FE render pagination
    ]);
    return { items, total, page, limit };
  }

  // Thêm thành viên mới sau khi check limit & duplicate
  async addMember(workspace: Workspace, dto: AddMemberDto) {
    this.permissionService.assertActive(workspace); // (1) không cho invite khi archived
    const maxMembers = this.config.get<number>('workspaceLimits.maxMembersPerWorkspace') ?? 200;
    const memberCount = await this.prisma.workspaceMember.count({ where: { workspaceId: workspace.id } });
    if (memberCount >= maxMembers) {
      throw new BadRequestException('MEMBER_LIMIT_REACHED'); // (2) enforce limit từ config
    }

    const existing = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: dto.userId },
    });
    if (existing) {
      throw new BadRequestException('MEMBER_ALREADY_EXISTS'); // (3) tránh duplicate
    }

    const role = dto.role === 'OWNER' ? 'ADMIN' : dto.role ?? 'MEMBER'; // (4) không thể assign OWNER trực tiếp
    const member = await this.prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: dto.userId,
        role,
      },
      include: { user: true },
    });

    await this.activityLog.logWorkspaceAction({ // (5) log thêm member mới
      workspaceId: workspace.id,
      actorId: workspace.id,
      action: 'MEMBER_ADDED',
      entityType: 'WorkspaceMember',
      entityId: member.id,
      metadata: { role: member.role },
    });

    return member;
  }

  // Cập nhật role hoặc chuyển quyền owner cho thành viên khác
  async updateRole(workspace: Workspace, memberId: string, dto: UpdateMemberRoleDto) {
    this.permissionService.assertActive(workspace); // (1) không thể chỉnh role khi archived
    const member = await this.prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!member || member.workspaceId !== workspace.id) {
      throw new NotFoundException('MEMBER_NOT_FOUND'); // (2) validate scope
    }

    this.permissionService.assertRoleTransition(member.role, dto.role, !!dto.transferOwnerTo); // (3) guard logic chuyển chủ

    if (dto.role === 'OWNER') {
      const target = await this.prisma.workspaceMember.findUnique({ where: { id: dto.transferOwnerTo! } });
      if (!target || target.workspaceId !== workspace.id) {
        throw new BadRequestException('INVALID_TRANSFER_TARGET'); // (4) owner phải chuyển cho người cùng workspace
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.workspaceMember.update({ // (5) promote target thành OWNER
          where: { id: target.id },
          data: { role: 'OWNER' },
        });
        await tx.workspaceMember.update({ // (6) hạ owner cũ xuống ADMIN
          where: { id: member.id },
          data: { role: 'ADMIN' },
        });
      });
    } else {
      await this.prisma.workspaceMember.update({
        where: { id: member.id },
        data: { role: dto.role }, // (7) role thường update trực tiếp
      });
    }

    await this.activityLog.logWorkspaceAction({ // (8) log thay đổi quyền
      workspaceId: workspace.id,
      actorId: workspace.id,
      action: 'MEMBER_ROLE_CHANGED',
      entityType: 'WorkspaceMember',
      entityId: member.id,
      metadata: { role: dto.role },
    });

    return { updated: true };
  }

  // Xoá thành viên; nếu là owner cần chuyển quyền trước
  async removeMember(workspace: Workspace, memberId: string, dto: RemoveMemberDto) {
    const member = await this.prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!member || member.workspaceId !== workspace.id) {
      throw new NotFoundException('MEMBER_NOT_FOUND');
    }

    if (member.role === 'OWNER' && !dto.transferOwnerTo) {
      throw new BadRequestException('TRANSFER_REQUIRED'); // (1) owner muốn rời phải chuyển quyền
    }

    await this.prisma.workspaceMember.delete({ where: { id: memberId } }); // (2) xoá membership

    await this.activityLog.logWorkspaceAction({ // (3) log member bị remove
      workspaceId: workspace.id,
      actorId: workspace.id,
      action: 'MEMBER_REMOVED',
      entityType: 'WorkspaceMember',
      entityId: memberId,
    });

    return { removed: true };
  }
}
```

### 3.6 Step 6. Invitation lifecycle module

#### 3.6.1 DTOs

```ts
// src/workspace/invite/dto/create-invites.dto.ts
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

// Một dòng invite gồm email + role kỳ vọng
class InviteEntryDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;
}

export class CreateInvitesDto {
  // DTO bulk invite nhiều email cùng lúc
  @IsArray({ message: 'invites must be an array' })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  invites!: InviteEntryDto[];
}
```

```ts
// src/workspace/invite/dto/invite-token.dto.ts
import { IsString, Length } from 'class-validator';

// Token DTO dùng cho accept/reject invite API
export class InviteTokenParamDto {
  @IsString()
  @Length(10, 100)
  token!: string;
}
```

#### 3.6.2 Controller

```ts
// src/workspace/invite/workspace-invite.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkspaceInviteService } from './workspace-invite.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceContextInterceptor } from '../interceptors/workspace-context.interceptor';
import { WorkspaceAdminGuard } from '../guards/workspace-admin.guard';
import { Workspace } from '../decorators/workspace.decorator';
import { CreateInvitesDto } from './dto/create-invites.dto';
import { WorkspaceInviteParamDto } from './dto/invite-token.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('workspaces/:workspaceId/invites')
@UseGuards(JwtAuthGuard)
@UseInterceptors(WorkspaceContextInterceptor)
// Controller xử lý bulk invite + admin flows
export class WorkspaceInviteController {
  constructor(private readonly inviteService: WorkspaceInviteService) {}

  // POST -> tạo batch invites mới (ADMIN trở lên)
  @Post()
  @UseGuards(WorkspaceAdminGuard)
  async createInvites(@Workspace() workspace, @Body() dto: CreateInvitesDto, @CurrentUser('id') actorId: string) {
    return this.inviteService.createInvites(workspace, dto, actorId);
  }

  // GET -> list tất cả invite hiện có
  @Get()
  @UseGuards(WorkspaceAdminGuard)
  async listInvites(@Workspace() workspace) {
    return this.inviteService.listInvites(workspace.id);
  }

  // DELETE -> revoke 1 invite cụ thể
  @Delete(':inviteId')
  @UseGuards(WorkspaceAdminGuard)
  async revokeInvite(@Workspace() workspace, @Param('inviteId') inviteId: string, @CurrentUser('id') actorId: string) {
    return this.inviteService.revokeInvite(workspace, inviteId, actorId);
  }
}

@Controller('workspace-invites')
// Public-ish controller để accept/reject invite token
export class WorkspaceInviteTokenController {
  constructor(private readonly inviteService: WorkspaceInviteService) {}

  @Public()
  @UseGuards(JwtAuthGuard)
  // POST /workspace-invites/:token/accept -> join workspace
  @Post(':token/accept')
  async acceptInvite(@Param() params: InviteTokenParamDto, @CurrentUser() user) {
    return this.inviteService.acceptInvite(params.token, user);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  // POST /workspace-invites/:token/reject -> từ chối invite
  @Post(':token/reject')
  async rejectInvite(@Param() params: InviteTokenParamDto, @CurrentUser() user) {
    return this.inviteService.rejectInvite(params.token, user);
  }
}
```

#### 3.6.3 Service

```ts
// src/workspace/invite/workspace-invite.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacePermissionService } from '../services/workspace-permission.service';
import { CreateInvitesDto } from './dto/create-invites.dto';
import { Workspace } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { ActivityLogService } from '../../activity-log/activity-log.service';

@Injectable()
// Service quản lý lifecycle của workspace invite
export class WorkspaceInviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: WorkspacePermissionService,
    private readonly config: ConfigService,
    private readonly activityLog: ActivityLogService,
  ) {}

  // Bulk tạo invite: dedupe, skip member đã tồn tại, sinh token + expiry
  async createInvites(workspace: Workspace, dto: CreateInvitesDto, actorId: string) {
    this.permissionService.assertActive(workspace); // (1) không mời vào workspace archived

    const inviteExpiryDays = this.config.get<number>('workspaceLimits.inviteExpiryDays') ?? 7;
    const expiresAt = () => new Date(Date.now() + inviteExpiryDays * 24 * 60 * 60 * 1000); // (2) helper churn thời hạn

    const payloadDedup = Array.from(new Map(dto.invites.map((entry) => [entry.email.toLowerCase(), entry])).values());
    // (3) dedupe email theo lowercase để tránh gửi trùng

    const existingMembers = await this.prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id, user: { email: { in: payloadDedup.map((i) => i.email) } } },
      include: { user: true },
    });

    const activeInvites = await this.prisma.workspaceInvite.findMany({
      where: {
        workspaceId: workspace.id,
        email: { in: payloadDedup.map((i) => i.email) },
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
    });

    const skipped = new Set<string>();
    existingMembers.forEach((member) => skipped.add(member.user.email)); // (4) bỏ qua user đã join
    activeInvites.forEach((invite) => skipped.add(invite.email)); // (5) bỏ qua invite pending

    const toCreate = payloadDedup.filter((entry) => !skipped.has(entry.email)); // (6) danh sách thực sự cần tạo

    const created = await this.prisma.workspaceInvite.createManyAndReturn({
      data: toCreate.map((entry) => ({
        workspaceId: workspace.id,
        email: entry.email,
        role: entry.role === 'OWNER' ? 'ADMIN' : entry.role ?? 'MEMBER',
        status: 'PENDING',
        token: uuid(),
        expiresAt: expiresAt(), // (7) token expiry
        invitedById: actorId, // (8) trace người mời
      })),
    });

    await Promise.all(
      created.map((invite) =>
        this.activityLog.logWorkspaceAction({
          workspaceId: workspace.id,
          actorId,
          action: 'INVITE_SENT',
          entityType: 'WorkspaceInvite',
          entityId: invite.id,
          metadata: { email: invite.email },
        }),
      ),
    );

    return { created, skipped: Array.from(skipped) };
  }

  // Liệt kê invite trong workspace, dùng cho dashboard quản trị
  async listInvites(workspaceId: string) {
    return this.prisma.workspaceInvite.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Revoke invite cụ thể và log activity
  async revokeInvite(workspace: Workspace, inviteId: string, actorId: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.workspaceId !== workspace.id) {
      throw new NotFoundException('INVITE_NOT_FOUND'); // (1) invite không thuộc workspace này
    }

    await this.prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: 'REVOKED', revokedAt: new Date() }, // (2) đánh dấu revoke + timestamp
    });

    await this.activityLog.logWorkspaceAction({ // (3) ghi log để audit
      workspaceId: workspace.id,
      actorId,
      action: 'INVITE_REVOKED',
      entityType: 'WorkspaceInvite',
      entityId: invite.id,
      metadata: { email: invite.email },
    });

    return { revoked: true };
  }

  // Accept invite token -> thêm member nếu chưa có và đánh dấu ACCEPTED
  async acceptInvite(token: string, user: { id: string; email: string }) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) {
      throw new NotFoundException('INVITE_NOT_FOUND');
    }
    if (invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new BadRequestException('INVITE_EXPIRED'); // (1) token hết hạn hoặc ko pending
    }
    if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestException('INVITE_EMAIL_MISMATCH'); // (2) email mismatched -> chặn
    }

    const workspace = await this.prisma.workspace.findUnique({ where: { id: invite.workspaceId } });
    if (!workspace) {
      throw new NotFoundException('WORKSPACE_NOT_FOUND');
    }
    this.permissionService.assertActive(workspace); // (3) không cho join workspace archived

    const existingMember = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, userId: user.id },
    });

    await this.prisma.$transaction(async (tx) => {
      if (!existingMember) {
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
        data: { status: 'ACCEPTED', acceptedAt: new Date() }, // (4) mark accepted
      });
    });

    await this.activityLog.logWorkspaceAction({ // (5) log accepted event
      workspaceId: workspace.id,
      actorId: user.id,
      action: 'INVITE_ACCEPTED',
      entityType: 'WorkspaceInvite',
      entityId: invite.id,
    });

    return { accepted: true };
  }

  // Reject invite token -> mark revoked để ẩn khỏi queue
  async rejectInvite(token: string, user: { id: string; email: string }) {
    const invite = await this.prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) {
      throw new NotFoundException('INVITE_NOT_FOUND');
    }
    if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestException('INVITE_EMAIL_MISMATCH');
    }

    await this.prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: 'REVOKED', revokedAt: new Date() }, // (1) mark rejected
    });

    await this.activityLog.logWorkspaceAction({ // (2) log rejection để trace user từ chối
      workspaceId: invite.workspaceId,
      actorId: user.id,
      action: 'INVITE_REVOKED',
      entityType: 'WorkspaceInvite',
      entityId: invite.id,
    });

    return { rejected: true };
  }
}
```

### 3.7 Step 7. Activity log & domain events

```ts
// src/activity-log/activity-log.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface LogWorkspaceActionPayload {
  workspaceId: string;
  actorId: string;
  action:
    | 'WORKSPACE_CREATED'
    | 'WORKSPACE_RENAMED'
    | 'WORKSPACE_ARCHIVED'
    | 'WORKSPACE_DELETED'
    | 'MEMBER_ADDED'
    | 'MEMBER_ROLE_CHANGED'
    | 'MEMBER_REMOVED'
    | 'INVITE_SENT'
    | 'INVITE_ACCEPTED'
    | 'INVITE_REVOKED';
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
// Wrap Prisma để ghi log hoạt động cho workspace
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo 1 bản ghi log, metadata lưu JSON
  async logWorkspaceAction(payload: LogWorkspaceActionPayload) {
    await this.prisma.activityLog.create({
      data: {
        workspaceId: payload.workspaceId,
        actorId: payload.actorId,
        action: payload.action, // Enum mô tả hành động
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadata: payload.metadata ?? {},
      },
    });
  }
}
```

- Tuỳ nhu cầu, emit thêm events qua `EventEmitter2` trong mỗi phương thức (vd `this.eventEmitter.emit('workspace.member.added', {...})`).

### 3.8 Step 8. Testing playbook

#### 3.8.1 Unit test sample

```ts
// src/workspace/member/__tests__/workspace-member.service.spec.ts
import { Test } from '@nestjs/testing';
import { WorkspaceMemberService } from '../workspace-member.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { WorkspacePermissionService } from '../../services/workspace-permission.service';
import { ConfigService } from '@nestjs/config';

// Mẫu unit test cho WorkspaceMemberService
describe('WorkspaceMemberService', () => {
  let service: WorkspaceMemberService;
  let prisma: jest.Mocked<PrismaService>;

  // Setup module cho mỗi test case
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkspaceMemberService,
        WorkspacePermissionService,
        { provide: PrismaService, useValue: { workspaceMember: { count: jest.fn(), create: jest.fn() } } },
        { provide: ConfigService, useValue: { get: () => 200 } },
        { provide: 'ActivityLogService', useValue: { logWorkspaceAction: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(WorkspaceMemberService);
    prisma = moduleRef.get(PrismaService);
  });

  // Khi count trả về đúng limit thì addMember phải throw
  it('throws when member limit reached', async () => {
    prisma.workspaceMember.count.mockResolvedValue(200);
    await expect(
      service.addMember({ id: 'ws-1', archived: false } as any, { userId: 'u-1' }),
    ).rejects.toThrow('MEMBER_LIMIT_REACHED');
  });
});
```

#### 3.8.2 E2E outline

```ts
// test/workspace/workspace.e2e-spec.ts
import * as request from 'supertest';
import { TestApp } from '../app.factory';

// Scenario e2e happy path cho workspace CRUD
describe('Workspace e2e', () => {
  let app: TestApp;
  let token: string;

  // Boot app và đăng nhập user owner fixture
  beforeAll(async () => {
    app = await TestApp.create();
    token = await app.loginAs('owner@example.com');
  });

  // Chạy flow create -> rename -> archive
  it('creates -> renames -> archives workspace', async () => {
    const created = await request(app.server)
      .post('/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Phase 3' })
      .expect(201);

    await request(app.server)
      .patch(`/workspaces/${created.body.workspace.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Phase 3 - updated' })
      .expect(200);
  });
});
```

#### 3.8.3 Manual Hoppscotch script (gợi ý)

1. Owner login → POST `/workspaces` → capture `workspaceId`.
2. Owner invites member → POST `/workspaces/:id/invites` với 2 email.
3. Switch user, accept token qua `POST /workspace-invites/:token/accept` (nhớ Bearer).
4. Owner promote member → `PATCH /workspaces/:id/members/:memberId/role`.
5. Archive + delete flow.

---

## 4. Appendix

- **Folder gợi ý**
  - `src/workspace` chứa module root
  - `src/workspace/member`, `src/workspace/invite`
  - `src/workspace/decorators`, `src/workspace/guards`, `src/workspace/interceptors`, `src/workspace/validators`, `src/workspace/types`
- **Env sample**
  ```env
  MAX_WORKSPACES_PER_USER=50
  MAX_MEMBERS_PER_WORKSPACE=200
  WORKSPACE_INVITE_EXPIRY_DAYS=7
  ```
- **Scripts**
  ```bash
  npm run lint
  npm run test
  npm run test:e2e -- workspace
  ```
