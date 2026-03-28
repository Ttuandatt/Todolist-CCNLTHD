import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { EventsService } from '../events/events.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService, private eventsService: EventsService) {}

  // ==================== HELPER: Kiểm tra membership ====================

  /**
   * Kiểm tra user có phải member của workspace chứa project không
   * Trả về member record nếu hợp lệ
   */
  private async checkProjectMembership(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, workspaceId: true },
    });
    if (!project) {
      throw new NotFoundException('Project không tồn tại');
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không phải thành viên của workspace này');
    }

    return { project, member };
  }

  /**
   * Tìm task hoặc throw NotFoundException
   */
  private async findTaskOrThrow(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { select: { id: true, workspaceId: true } } },
    });
    if (!task) {
      throw new NotFoundException('Task không tồn tại');
    }
    return task;
  }

  /**
   * Kiểm tra user có quyền thao tác với task không (phải là member workspace)
   */
  private async checkTaskAccess(taskId: string, userId: string) {
    const task = await this.findTaskOrThrow(taskId);
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: task.project.workspaceId,
          userId,
        },
      },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không có quyền truy cập task này');
    }
    return { task, member };
  }

  // ==================== 1. TẠO TASK ====================

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    await this.checkProjectMembership(projectId, userId);

    // Tính position = max(position) + 1 trong project đó
    const maxPosition = await this.prisma.task.aggregate({
      where: { projectId },
      _max: { position: true },
    });
    const nextPosition = (maxPosition._max.position ?? 0) + 1;

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        estimatedHours: dto.estimatedHours,
        position: nextPosition,
        projectId,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    this.eventsService.emitToProject(projectId, 'task:created', task);
    return task;
  }

  // ==================== 2. DANH SÁCH TASK (có filter, sort, pagination) ====================

  async findAllByProject(userId: string, projectId: string, query: FilterTaskDto) {
    await this.checkProjectMembership(projectId, userId);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    // Build WHERE conditions
    const where: any = { projectId };

    // Filter status: ?status=TODO,IN_PROGRESS
    if (query.status) {
      const statuses = query.status.split(',') as TaskStatus[];
      where.status = { in: statuses };
    }

    // Filter priority: ?priority=HIGH,URGENT
    if (query.priority) {
      const priorities = query.priority.split(',') as TaskPriority[];
      where.priority = { in: priorities };
    }

    // Filter assignee: ?assigneeId=uuid
    if (query.assigneeId) {
      where.assignments = { some: { userId: query.assigneeId } };
    }

    // Filter labels: ?labelIds=uuid1,uuid2
    if (query.labelIds) {
      const labelIds = query.labelIds.split(',');
      where.labels = { some: { labelId: { in: labelIds } } };
    }

    // Filter due date: ?dueDate=overdue|today|week|none
    if (query.dueDate) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      switch (query.dueDate) {
        case 'overdue':
          where.dueDate = { lt: todayStart };
          where.status = { not: 'DONE' };
          break;
        case 'today':
          where.dueDate = { gte: todayStart, lt: todayEnd };
          break;
        case 'week': {
          const weekEnd = new Date(todayStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          where.dueDate = { gte: todayStart, lt: weekEnd };
          break;
        }
        case 'none':
          where.dueDate = null;
          break;
      }
    }

    // Search: ?search=keyword
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    // Build ORDER BY
    const sortBy = query.sortBy || 'position';
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    // Xử lý đặc biệt cho priority sort (theo mức độ quan trọng)
    let orderBy: any;
    if (sortBy === 'priority') {
      // Prisma sort enum theo thứ tự khai báo trong schema (LOW, NORMAL, HIGH, URGENT)
      orderBy = { priority: sortOrder };
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignments: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
            },
          },
          labels: {
            include: {
              label: { select: { id: true, name: true, color: true } },
            },
          },
          _count: { select: { subtasks: true, comments: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== 3. CHI TIẾT TASK ====================

  async findOne(userId: string, taskId: string) {
    await this.checkTaskAccess(taskId, userId);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { select: { id: true, name: true, workspaceId: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        subtasks: { orderBy: { position: 'asc' } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        labels: {
          include: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
        _count: { select: { comments: true, attachments: true } },
      },
    });

    return task;
  }

  // ==================== 4. CẬP NHẬT TASK ====================

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.checkTaskAccess(taskId, userId);

    const data: any = { ...dto };

    // Chuyển đổi date strings sang Date objects
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);

    // Tự động set completedAt khi status = DONE
    if (dto.status === 'DONE') {
      data.completedAt = new Date();
    } else if (dto.status) {
      data.completedAt = null;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        labels: {
          include: {
            label: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });

    this.eventsService.emitToTask(taskId, 'task:updated', updatedTask);
    this.eventsService.emitToProject(updatedTask.projectId, 'task:updated', updatedTask);
    return updatedTask;
  }

  // ==================== 5. XÓA TASK ====================

  async remove(userId: string, taskId: string) {
    const { task } = await this.checkTaskAccess(taskId, userId);

    // Prisma cascade delete: subtasks, assignments, labels, comments, attachments
    await this.prisma.task.delete({ where: { id: taskId } });

    this.eventsService.emitToProject(task.projectId, 'task:deleted', { id: taskId });
    return { message: 'Xóa task thành công' };
  }

  // ==================== 6. CHUYỂN STATUS ====================

  async updateStatus(userId: string, taskId: string, dto: UpdateStatusDto) {
    await this.checkTaskAccess(taskId, userId);

    const data: any = { status: dto.status };

    // Tự động set completedAt
    if (dto.status === 'DONE') {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    this.eventsService.emitToTask(taskId, 'task:updated', updatedTask);
    this.eventsService.emitToProject(updatedTask.projectId, 'task:updated', updatedTask);
    return updatedTask;
  }

  // ==================== 7. ASSIGN MEMBER ====================

  async assignMember(userId: string, taskId: string, targetUserId: string) {
    const { task } = await this.checkTaskAccess(taskId, userId);

    // Kiểm tra target user có phải member workspace không
    const targetMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: task.project.workspaceId,
          userId: targetUserId,
        },
      },
    });
    if (!targetMember) {
      throw new ForbiddenException('Người được assign phải là thành viên của workspace');
    }

    // Kiểm tra đã assign chưa
    const existing = await this.prisma.taskAssignment.findUnique({
      where: { taskId_userId: { taskId, userId: targetUserId } },
    });
    if (existing) {
      throw new ConflictException('Người dùng đã được assign vào task này rồi');
    }

    const assignment = await this.prisma.taskAssignment.create({
      data: { taskId, userId: targetUserId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return { message: 'Assign thành công', assignment };
  }

  // ==================== 8. UNASSIGN MEMBER ====================

  async unassignMember(userId: string, taskId: string, targetUserId: string) {
    await this.checkTaskAccess(taskId, userId);

    const assignment = await this.prisma.taskAssignment.findUnique({
      where: { taskId_userId: { taskId, userId: targetUserId } },
    });
    if (!assignment) {
      throw new NotFoundException('Người dùng chưa được assign vào task này');
    }

    await this.prisma.taskAssignment.delete({ where: { id: assignment.id } });

    return { message: 'Unassign thành công' };
  }

  // ==================== 9. GẮN LABEL ====================

  async addLabel(userId: string, taskId: string, labelId: string) {
    const { task } = await this.checkTaskAccess(taskId, userId);

    // Kiểm tra label thuộc workspace chứa project
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
    });
    if (!label || label.workspaceId !== task.project.workspaceId) {
      throw new NotFoundException('Label không tồn tại trong workspace này');
    }

    // Kiểm tra đã gắn chưa
    const existing = await this.prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } },
    });
    if (existing) {
      throw new ConflictException('Label đã được gắn vào task này rồi');
    }

    const taskLabel = await this.prisma.taskLabel.create({
      data: { taskId, labelId },
      include: {
        label: { select: { id: true, name: true, color: true } },
      },
    });

    return { message: 'Gắn label thành công', taskLabel };
  }

  // ==================== 10. GỠ LABEL ====================

  async removeLabel(userId: string, taskId: string, labelId: string) {
    await this.checkTaskAccess(taskId, userId);

    const taskLabel = await this.prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } },
    });
    if (!taskLabel) {
      throw new NotFoundException('Label chưa được gắn vào task này');
    }

    await this.prisma.taskLabel.delete({ where: { id: taskLabel.id } });

    return { message: 'Gỡ label thành công' };
  }

  // ==================== 11. TẠO SUBTASK ====================

  async createSubtask(userId: string, taskId: string, dto: CreateSubtaskDto) {
    await this.checkTaskAccess(taskId, userId);

    // Tính position cho subtask mới
    const maxPosition = await this.prisma.subtask.aggregate({
      where: { taskId },
      _max: { position: true },
    });
    const nextPosition = (maxPosition._max.position ?? 0) + 1;

    return this.prisma.subtask.create({
      data: {
        title: dto.title,
        taskId,
        position: nextPosition,
      },
    });
  }

  // ==================== 12. TOGGLE SUBTASK COMPLETE ====================

  async toggleSubtask(userId: string, subtaskId: string) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: {
        task: {
          include: { project: { select: { workspaceId: true } } },
        },
      },
    });
    if (!subtask) {
      throw new NotFoundException('Subtask không tồn tại');
    }

    // Kiểm tra membership
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: subtask.task.project.workspaceId,
          userId,
        },
      },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không có quyền thao tác subtask này');
    }

    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted: !subtask.isCompleted },
    });
  }

  // ==================== 13. LIST SUBTASKS ====================

  async findSubtasks(userId: string, taskId: string) {
    await this.checkTaskAccess(taskId, userId);

    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { position: 'asc' },
    });
  }

  // ==================== 14. XÓA SUBTASK ====================

  async removeSubtask(userId: string, subtaskId: string) {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id: subtaskId },
      include: {
        task: {
          include: { project: { select: { workspaceId: true } } },
        },
      },
    });
    if (!subtask) {
      throw new NotFoundException('Subtask không tồn tại');
    }

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: subtask.task.project.workspaceId,
          userId,
        },
      },
    });
    if (!member) {
      throw new ForbiddenException('Bạn không có quyền xóa subtask này');
    }

    await this.prisma.subtask.delete({ where: { id: subtaskId } });

    return { message: 'Xóa subtask thành công' };
  }
}
