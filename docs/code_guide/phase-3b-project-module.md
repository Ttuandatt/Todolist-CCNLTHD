# Code Guide — Phase 3b: Project Module 📁

> Ngày tạo: 2026-03-21
>
> Workspace đã xong — ta có "ngôi nhà chung" rồi. Giờ cần tạo ra **các phòng bên trong** — đó chính là Project. Mỗi Project gom nhóm các Task liên quan lại, giống kiểu "board" trong Trello hoặc "project" trong Notion.

---

## Tổng quan — Ta sẽ làm gì?

Project là **container trung gian** giữa Workspace và Task:

```
Workspace (ngôi nhà) → Project (các phòng) → Task (công việc trong phòng)
```

| Chức năng | API | Quyền |
|:---|:---|:---|
| Tạo project | `POST /workspaces/:wsId/projects` | Mọi member |
| Danh sách projects | `GET /workspaces/:wsId/projects` | Mọi member |
| Chi tiết project | `GET /projects/:id` | Mọi member trong workspace |
| Cập nhật project | `PATCH /projects/:id` | Mọi member |
| Xóa project | `DELETE /projects/:id` | Owner, Admin |
| Archive project | `POST /projects/:id/archive` | Owner, Admin |
| Unarchive project | `POST /projects/:id/unarchive` | Owner, Admin |
| Pin project | `POST /projects/:id/pin` | Mọi member |
| Unpin project | `POST /projects/:id/unpin` | Mọi member |

**Tổng: 9 endpoints**

### Điều kiện tiên quyết
- Phase 3a (Workspace Module) đã chạy ổn, nghiệm thu xong
- Docker PostgreSQL đang chạy, migration đã apply
- Prisma schema model `Project` đã có sẵn (không cần migration mới)

### Prisma Schema (đã có sẵn)

```prisma
model Project {
  id          String        @id @default(uuid())
  name        String
  description String?
  workspaceId String
  createdById String
  status      ProjectStatus @default(ACTIVE)
  isPinned    Boolean       @default(false)
  color       String        @default("#3B82F6")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdBy User      @relation(fields: [createdById], references: [id])
  tasks     Task[]

  @@index([workspaceId])
  @@index([createdById])
  @@map("projects")
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
}
```

**Lưu ý:** Schema KHÔNG thay đổi, KHÔNG cần migration mới. Model `Project` đã nằm trong migration ban đầu.

---

## Bước 1: Tạo DTOs — Kiểm soát dữ liệu đầu vào 📋

### Tại sao?

Người dùng gửi gì lên cũng được — ta phải chặn. DTO (Data Transfer Object) + class-validator đảm bảo chỉ những dữ liệu hợp lệ mới lọt vào Service.

### Nghiệp vụ cần validate:
- `name`: bắt buộc, chuỗi, tối đa 100 ký tự
- `description`: tùy chọn, chuỗi
- `color`: tùy chọn, hex color (mặc định `#3B82F6`)
- `status` filter: chỉ chấp nhận `ACTIVE` hoặc `ARCHIVED`

### Code

📁 **File:** `src/modules/project/dto/create-project.dto.ts`

```typescript
import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên project không được để trống' })
  @MaxLength(100, { message: 'Tên project không được vượt quá 100 ký tự' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Màu phải đúng định dạng hex (VD: #3B82F6)' })
  color?: string;
}
```

📁 **File:** `src/modules/project/dto/update-project.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
```

> `PartialType` biến tất cả field thành optional — khi update chỉ cần gửi field muốn sửa.

📁 **File:** `src/modules/project/dto/query-project.dto.ts`

```typescript
import { IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class QueryProjectDto {
  @IsEnum(ProjectStatus, { message: 'Status không hợp lệ. Chấp nhận: ACTIVE, ARCHIVED' })
  @IsOptional()
  status?: ProjectStatus;
}
```

---

## Bước 2: Tạo ProjectService — Logic nghiệp vụ chính 🧠

### Nghiệp vụ cần xử lý

| Method | Logic |
|:---|:---|
| `create` | Kiểm tra user là member workspace → tạo project |
| `findAllByWorkspace` | Kiểm tra membership → lấy danh sách (filter status) |
| `findOne` | Kiểm tra membership → lấy chi tiết + đếm task theo status |
| `update` | Kiểm tra membership → cập nhật (mọi member được sửa) |
| `remove` | Kiểm tra quyền OWNER/ADMIN → xóa (cascade tasks) |
| `archive` | Kiểm tra quyền → đổi status thành ARCHIVED |
| `unarchive` | Kiểm tra quyền → đổi status thành ACTIVE |
| `pin` | Kiểm tra membership → ghim project (isPinned = true) |
| `unpin` | Kiểm tra membership → bỏ ghim project (isPinned = false) |

### Pattern chung: Kiểm tra membership trước mọi thao tác

Mọi endpoint Project đều cần kiểm tra **"user có thuộc workspace chứa project này không?"**. Ta tạo 2 helper methods:

```typescript
// Kiểm tra user có phải member workspace không
private async checkWorkspaceMembership(workspaceId: string, userId: string) { ... }

// Kiểm tra user có quyền OWNER/ADMIN không
private async checkWorkspaceAdminRole(workspaceId: string, userId: string) { ... }
```

### Code

📁 **File:** `src/modules/project/project.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // ==================== HELPER: Kiểm tra membership ====================

  /**
   * Kiểm tra user có phải member của workspace không.
   * Trả về record membership nếu có, throw ForbiddenException nếu không.
   */
  private async checkWorkspaceMembership(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không phải thành viên của workspace này');
    }
    return member;
  }

  /**
   * Kiểm tra user có quyền OWNER hoặc ADMIN trong workspace không.
   * Dùng cho các thao tác cần quyền cao: update, delete, archive.
   */
  private async checkWorkspaceAdminRole(workspaceId: string, userId: string) {
    const member = await this.checkWorkspaceMembership(workspaceId, userId);
    if (member.role !== 'OWNER' && member.role !== 'ADMIN') {
      throw new ForbiddenException('Chỉ Owner hoặc Admin mới có quyền thực hiện thao tác này');
    }
    return member;
  }

  /**
   * Tìm project theo ID, kèm kiểm tra tồn tại.
   * Dùng nội bộ cho update/delete/archive.
   */
  private async findProjectOrThrow(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project không tồn tại');
    }
    return project;
  }

  // ==================== 1. TẠO PROJECT ====================

  /**
   * Tạo project mới trong workspace.
   * Mọi member đều có thể tạo project (không yêu cầu OWNER/ADMIN).
   */
  async create(userId: string, workspaceId: string, dto: CreateProjectDto) {
    // Kiểm tra user là member workspace
    await this.checkWorkspaceMembership(workspaceId, userId);

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        color: dto.color,
        workspaceId,
        createdById: userId,
      },
    });
  }

  // ==================== 2. DANH SÁCH PROJECT ====================

  /**
   * Lấy danh sách projects trong workspace.
   * Hỗ trợ filter theo status (ACTIVE/ARCHIVED).
   */
  async findAllByWorkspace(userId: string, workspaceId: string, query: QueryProjectDto) {
    // Kiểm tra membership
    await this.checkWorkspaceMembership(workspaceId, userId);

    return this.prisma.project.findMany({
      where: {
        workspaceId,
        ...(query.status && { status: query.status }),
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } }, // Đếm tổng số task
      },
      orderBy: [
        { isPinned: 'desc' },  // Project được ghim lên đầu
        { createdAt: 'desc' }, // Mới nhất trước
      ],
    });
  }

  // ==================== 3. CHI TIẾT PROJECT ====================

  /**
   * Lấy chi tiết 1 project, kèm thống kê task theo status.
   * Dùng cho trang Kanban board.
   */
  async findOne(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!project) {
      throw new NotFoundException('Project không tồn tại');
    }

    // Kiểm tra user là member workspace chứa project
    await this.checkWorkspaceMembership(project.workspaceId, userId);

    // Đếm task theo từng status
    const taskCountByStatus = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: true,
    });

    // Chuyển mảng groupBy thành object { TODO: 5, IN_PROGRESS: 3, ... }
    const taskStats = {
      TODO: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      DONE: 0,
    };
    taskCountByStatus.forEach((item) => {
      taskStats[item.status] = item._count;
    });

    return {
      ...project,
      taskCountByStatus: taskStats,
    };
  }

  // ==================== 4. CẬP NHẬT PROJECT ====================

  /**
   * Cập nhật thông tin project.
   * Mọi member trong workspace đều có thể sửa (giống Trello/Todoist).
   */
  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceMembership(project.workspaceId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  // ==================== 5. XÓA PROJECT ====================

  /**
   * Xóa project và tất cả tasks bên trong (cascade delete).
   * Yêu cầu quyền OWNER hoặc ADMIN.
   */
  async remove(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceAdminRole(project.workspaceId, userId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Xóa project thành công' };
  }

  // ==================== 6. ARCHIVE PROJECT ====================

  /**
   * Lưu trữ project (đánh dấu ARCHIVED, không xóa dữ liệu).
   * Project đã archive sẽ bị ẩn khỏi danh sách mặc định.
   */
  async archive(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceAdminRole(project.workspaceId, userId);

    if (project.status === 'ARCHIVED') {
      throw new ForbiddenException('Project này đã được archive rồi');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: 'ARCHIVED' },
    });
  }

  // ==================== 7. UNARCHIVE PROJECT ====================

  /**
   * Khôi phục project từ trạng thái lưu trữ về ACTIVE.
   */
  async unarchive(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceAdminRole(project.workspaceId, userId);

    if (project.status === 'ACTIVE') {
      throw new ForbiddenException('Project này đang active, không cần unarchive');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: 'ACTIVE' },
    });
  }

  // ==================== 8. PIN PROJECT ====================

  /**
   * Ghim project lên đầu danh sách.
   * Mọi member đều có thể ghim (tương tự Trello star).
   */
  async pin(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceMembership(project.workspaceId, userId);

    if (project.isPinned) {
      throw new ForbiddenException('Project này đã được ghim rồi');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { isPinned: true },
    });
  }

  // ==================== 9. UNPIN PROJECT ====================

  /**
   * Bỏ ghim project.
   */
  async unpin(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceMembership(project.workspaceId, userId);

    if (!project.isPinned) {
      throw new ForbiddenException('Project này chưa được ghim');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { isPinned: false },
    });
  }
}
```

---

## Bước 3: Tạo ProjectController — Tiếp nhận request 🎯

### Thiết kế URL

Có 2 dạng URL khác nhau theo ngữ cảnh:

| Dạng | URL | Khi nào dùng |
|:---|:---|:---|
| Nested | `/workspaces/:wsId/projects` | Tạo + Liệt kê (cần biết thuộc workspace nào) |
| Flat | `/projects/:id` | Chi tiết, Sửa, Xóa, Archive (đã biết project rồi) |

### Code

📁 **File:** `src/modules/project/project.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ---- Nested routes: /workspaces/:wsId/projects ----

  @Post('workspaces/:wsId/projects')
  create(
    @CurrentUser('id') userId: string,
    @Param('wsId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.create(userId, workspaceId, dto);
  }

  @Get('workspaces/:wsId/projects')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('wsId', ParseUUIDPipe) workspaceId: string,
    @Query() query: QueryProjectDto,
  ) {
    return this.projectService.findAllByWorkspace(userId, workspaceId, query);
  }

  // ---- Flat routes: /projects/:id ----

  @Get('projects/:id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.findOne(userId, id);
  }

  @Patch('projects/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(userId, id, dto);
  }

  @Delete('projects/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.remove(userId, id);
  }

  @Post('projects/:id/archive')
  archive(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.archive(userId, id);
  }

  @Post('projects/:id/unarchive')
  unarchive(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.unarchive(userId, id);
  }

  @Post('projects/:id/pin')
  pin(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.pin(userId, id);
  }

  @Post('projects/:id/unpin')
  unpin(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.unpin(userId, id);
  }
}
```

> **Lưu ý:** Controller không dùng `@Controller('projects')` mà dùng `@Controller()` (rỗng) vì có 2 prefix khác nhau (`workspaces/...` và `projects/...`).

---

## Bước 4: Tạo ProjectModule và đăng ký vào AppModule 🔌

📁 **File:** `src/modules/project/project.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService], // Export để TaskModule có thể dùng sau này
})
export class ProjectModule {}
```

📁 **File cần sửa:** `src/app.module.ts`

```typescript
// Thêm import
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    WorkspaceModule,
    ProjectModule,  // ← Thêm dòng này
  ],
  // ... providers giữ nguyên
})
export class AppModule {}
```

---

## Bước 5: Test toàn bộ luồng qua Hoppscotch 🧪

### Kịch bản test

```
Chuẩn bị:
1. Đăng nhập → lấy token
2. Tạo workspace (nếu chưa có) → lấy workspaceId

Test CRUD:
3. POST /workspaces/:wsId/projects → Tạo project "Sprint 1"
4. POST /workspaces/:wsId/projects → Tạo project "Sprint 2"
5. GET /workspaces/:wsId/projects → Thấy 2 projects
6. GET /projects/:id → Chi tiết project + taskCountByStatus (tất cả = 0)
7. PATCH /projects/:id → Đổi tên thành "Sprint 1 - Updated"
8. GET /workspaces/:wsId/projects?status=ACTIVE → Filter chỉ active

Test Pin/Unpin:
9. POST /projects/:id/pin → Ghim project
10. GET /workspaces/:wsId/projects → Project đã ghim nằm đầu danh sách
11. POST /projects/:id/unpin → Bỏ ghim

Test Archive:
12. POST /projects/:id/archive → Archive project
13. GET /workspaces/:wsId/projects?status=ARCHIVED → Thấy project vừa archive
14. POST /projects/:id/unarchive → Khôi phục

Test Phân quyền:
15. Đăng nhập user khác (MEMBER, không phải OWNER/ADMIN)
16. PATCH /projects/:id → 200 OK (Member được sửa)
17. DELETE /projects/:id → 403 Forbidden (Chỉ Owner/Admin)
18. POST /projects/:id/archive → 403 Forbidden (Chỉ Owner/Admin)
19. POST /projects/:id/pin → 200 OK (Member được ghim)

Test Delete:
20. Đăng nhập lại OWNER
21. DELETE /projects/:id → Xóa thành công

Test Validation:
22. POST /workspaces/:wsId/projects với body rỗng → 400 Bad Request
23. POST /workspaces/:wsId/projects với color "red" → 400 (phải là hex)
24. GET /projects/abc → 400 (ParseUUIDPipe)
```

---

## Tóm tắt files cần tạo

```
backend/src/modules/project/
├── project.module.ts          — Module declaration + export
├── project.controller.ts      — 9 endpoints (2 nested + 7 flat)
├── project.service.ts         — Logic nghiệp vụ + permission check
└── dto/
    ├── create-project.dto.ts  — Validate tạo mới
    ├── update-project.dto.ts  — Validate cập nhật (PartialType)
    └── query-project.dto.ts   — Validate query params (status filter)
```

**File sửa:** `src/app.module.ts` — thêm `ProjectModule` vào imports.

**Không cần:** Migration mới, thay đổi schema, package mới.
