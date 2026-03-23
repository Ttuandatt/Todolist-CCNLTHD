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

  private async checkWorkspaceMembership(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không phải thành viên của workspace này');
    }
    return member;
  }

  private async checkWorkspaceAdminRole(workspaceId: string, userId: string) {
    const member = await this.checkWorkspaceMembership(workspaceId, userId);
    if (member.role !== 'OWNER' && member.role !== 'ADMIN') {
      throw new ForbiddenException('Chỉ Owner hoặc Admin mới có quyền thực hiện thao tác này');
    }
    return member;
  }

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

  async create(userId: string, workspaceId: string, dto: CreateProjectDto) {
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

  async findAllByWorkspace(userId: string, workspaceId: string, query: QueryProjectDto) {
    await this.checkWorkspaceMembership(workspaceId, userId);

    return this.prisma.project.findMany({
      where: {
        workspaceId,
        ...(query.status && { status: query.status }),
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // ==================== 3. CHI TIẾT PROJECT ====================

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

    await this.checkWorkspaceMembership(project.workspaceId, userId);

    const taskCountByStatus = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: true,
    });

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

  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceMembership(project.workspaceId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  // ==================== 5. XÓA PROJECT ====================

  async remove(userId: string, projectId: string) {
    const project = await this.findProjectOrThrow(projectId);
    await this.checkWorkspaceAdminRole(project.workspaceId, userId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Xóa project thành công' };
  }

  // ==================== 6. ARCHIVE PROJECT ====================

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
