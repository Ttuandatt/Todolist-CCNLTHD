import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { TaskLabelDto } from './dto/task-label.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ==================== NESTED ROUTES: /projects/:projectId/tasks ====================

  // POST /api/v1/projects/:projectId/tasks — Tạo task mới
  @Post('projects/:projectId/tasks')
  create(
    @CurrentUser('id') userId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.create(userId, projectId, dto);
  }

  // GET /api/v1/projects/:projectId/tasks — List tasks (filter, sort, pagination)
  @Get('projects/:projectId/tasks')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: FilterTaskDto,
  ) {
    return this.taskService.findAllByProject(userId, projectId, query);
  }

  // ==================== FLAT ROUTES: /tasks/:id ====================

  // GET /api/v1/tasks/:id — Chi tiết task
  @Get('tasks/:id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.findOne(userId, id);
  }

  // PATCH /api/v1/tasks/:id — Cập nhật task
  @Patch('tasks/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(userId, id, dto);
  }

  // DELETE /api/v1/tasks/:id — Xóa task
  @Delete('tasks/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.remove(userId, id);
  }

  // PATCH /api/v1/tasks/:id/status — Chuyển status
  @Patch('tasks/:id/status')
  updateStatus(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.taskService.updateStatus(userId, id, dto);
  }

  // ==================== ASSIGNMENT ====================

  // POST /api/v1/tasks/:id/assign — Assign member vào task
  @Post('tasks/:id/assign')
  assignMember(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTaskDto,
  ) {
    return this.taskService.assignMember(userId, id, dto.userId);
  }

  // DELETE /api/v1/tasks/:id/assign/:userId — Unassign member
  @Delete('tasks/:id/assign/:userId')
  unassignMember(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.taskService.unassignMember(userId, id, targetUserId);
  }

  // ==================== LABELS ====================

  // POST /api/v1/tasks/:id/labels — Gắn label vào task
  @Post('tasks/:id/labels')
  addLabel(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TaskLabelDto,
  ) {
    return this.taskService.addLabel(userId, id, dto.labelId);
  }

  // DELETE /api/v1/tasks/:id/labels/:labelId — Gỡ label
  @Delete('tasks/:id/labels/:labelId')
  removeLabel(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('labelId', ParseUUIDPipe) labelId: string,
  ) {
    return this.taskService.removeLabel(userId, id, labelId);
  }

  // ==================== SUBTASKS ====================

  // POST /api/v1/tasks/:id/subtasks — Tạo subtask
  @Post('tasks/:id/subtasks')
  createSubtask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.taskService.createSubtask(userId, id, dto);
  }

  // GET /api/v1/tasks/:id/subtasks — List subtasks
  @Get('tasks/:id/subtasks')
  findSubtasks(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.findSubtasks(userId, id);
  }

  // PATCH /api/v1/subtasks/:id/complete — Toggle subtask complete
  @Patch('subtasks/:id/complete')
  toggleSubtask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.toggleSubtask(userId, id);
  }

  // DELETE /api/v1/subtasks/:id — Xóa subtask
  @Delete('subtasks/:id')
  removeSubtask(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.removeSubtask(userId, id);
  }
}
