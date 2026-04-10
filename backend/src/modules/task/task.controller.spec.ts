// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  TASK CONTROLLER — UNIT TEST                                                ║
// ║  File: task.controller.spec.ts                                              ║
// ║  Người viết: Phú (Phase 4)                                                 ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.2.2 — TestingModule + mock DI                                          ║
// ║    8.3.1 — describe/it/beforeEach                                           ║
// ║    8.4.2 — jest.fn(), mockResolvedValue                                     ║
// ║    8.4.3 — { provide: TaskService, useValue: mockTaskService }              ║
// ║    8.6.1 — Controller test pattern (mock service, verify delegation)        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 1: IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 2: MOCK TaskService
// Chương 8.6.1 — Controller test: mock SERVICE layer, kiểm tra controller
//   chỉ đóng vai trò "cầu nối" giữa HTTP request và service.
//   Controller KHÔNG chứa business logic → test chỉ cần verify delegation.
//
// So sánh với Service test:
//   - Service test: mock DB layer (PrismaService) → test business logic
//   - Controller test: mock Service layer (TaskService) → test delegation
// ═══════════════════════════════════════════════════════════════════════════════

const mockTaskService = {
  create: jest.fn(),             // POST /projects/:projectId/tasks
  findAllByProject: jest.fn(),   // GET  /projects/:projectId/tasks
  findOne: jest.fn(),            // GET  /tasks/:id
  update: jest.fn(),             // PATCH /tasks/:id
  remove: jest.fn(),             // DELETE /tasks/:id
  updateStatus: jest.fn(),       // PATCH /tasks/:id/status
  assignMember: jest.fn(),       // POST /tasks/:id/assign
  unassignMember: jest.fn(),     // DELETE /tasks/:id/assign/:userId
  addLabel: jest.fn(),           // POST /tasks/:id/labels
  removeLabel: jest.fn(),        // DELETE /tasks/:id/labels/:labelId
  createSubtask: jest.fn(),      // POST /tasks/:id/subtasks
  findSubtasks: jest.fn(),       // GET  /tasks/:id/subtasks
  toggleSubtask: jest.fn(),      // PATCH /subtasks/:id/complete
  removeSubtask: jest.fn(),      // DELETE /subtasks/:id
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 3: TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('TaskController', () => {
  let controller: TaskController;

  // ─── beforeEach: tạo module test mới trước mỗi test case ─────────────────
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: create()
  // Controller nhận @CurrentUser('id'), @Param('projectId'), @Body() dto
  // → gọi taskService.create(userId, projectId, dto)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('create()', () => {
    it('nên gọi taskService.create với đúng tham số và trả kết quả', async () => {
      // ARRANGE
      const dto = { title: 'Task mới', priority: 'HIGH' };
      const expectedResult = { id: 'task-001', ...dto };
      mockTaskService.create.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.create('user-001', 'project-001', dto as any);

      // ASSERT
      expect(result).toEqual(expectedResult);
      expect(mockTaskService.create).toHaveBeenCalledTimes(1);
      expect(mockTaskService.create).toHaveBeenCalledWith('user-001', 'project-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: findAll()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findAll()', () => {
    it('nên gọi taskService.findAllByProject và trả kết quả', async () => {
      const query = { status: 'TODO', page: 1, limit: 10 };
      const expectedResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockTaskService.findAllByProject.mockResolvedValue(expectedResult);

      const result = await controller.findAll('user-001', 'project-001', query as any);

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.findAllByProject).toHaveBeenCalledWith('user-001', 'project-001', query);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: findOne()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findOne()', () => {
    it('nên gọi taskService.findOne và trả kết quả', async () => {
      const expectedResult = { id: 'task-001', title: 'Task' };
      mockTaskService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('user-001', 'task-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.findOne).toHaveBeenCalledWith('user-001', 'task-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: update()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('update()', () => {
    it('nên gọi taskService.update và trả kết quả', async () => {
      const dto = { title: 'Title mới' };
      const expectedResult = { id: 'task-001', title: 'Title mới' };
      mockTaskService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('user-001', 'task-001', dto as any);

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.update).toHaveBeenCalledWith('user-001', 'task-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: remove()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('remove()', () => {
    it('nên gọi taskService.remove và trả kết quả', async () => {
      const expectedResult = { message: 'Xóa task thành công' };
      mockTaskService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('user-001', 'task-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.remove).toHaveBeenCalledWith('user-001', 'task-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: updateStatus()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateStatus()', () => {
    it('nên gọi taskService.updateStatus và trả kết quả', async () => {
      const dto = { status: 'IN_PROGRESS' };
      const expectedResult = { id: 'task-001', status: 'IN_PROGRESS' };
      mockTaskService.updateStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus('user-001', 'task-001', dto as any);

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.updateStatus).toHaveBeenCalledWith('user-001', 'task-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: assignMember()
  // Controller nhận @Body() dto → extract dto.userId → gọi service
  // ═══════════════════════════════════════════════════════════════════════════
  describe('assignMember()', () => {
    it('nên extract userId từ DTO và gọi taskService.assignMember', async () => {
      const dto = { userId: 'user-002' };
      const expectedResult = { message: 'Assign thành công', assignment: {} };
      mockTaskService.assignMember.mockResolvedValue(expectedResult);

      const result = await controller.assignMember('user-001', 'task-001', dto as any);

      expect(result).toEqual(expectedResult);
      // Controller truyền dto.userId (không phải nguyên dto)
      expect(mockTaskService.assignMember).toHaveBeenCalledWith('user-001', 'task-001', 'user-002');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: unassignMember()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('unassignMember()', () => {
    it('nên gọi taskService.unassignMember với đúng tham số', async () => {
      const expectedResult = { message: 'Unassign thành công' };
      mockTaskService.unassignMember.mockResolvedValue(expectedResult);

      const result = await controller.unassignMember('user-001', 'task-001', 'user-002');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.unassignMember).toHaveBeenCalledWith('user-001', 'task-001', 'user-002');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: addLabel()
  // Controller nhận @Body() dto → extract dto.labelId → gọi service
  // ═══════════════════════════════════════════════════════════════════════════
  describe('addLabel()', () => {
    it('nên extract labelId từ DTO và gọi taskService.addLabel', async () => {
      const dto = { labelId: 'label-001' };
      const expectedResult = { message: 'Gắn label thành công', taskLabel: {} };
      mockTaskService.addLabel.mockResolvedValue(expectedResult);

      const result = await controller.addLabel('user-001', 'task-001', dto as any);

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.addLabel).toHaveBeenCalledWith('user-001', 'task-001', 'label-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: removeLabel()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('removeLabel()', () => {
    it('nên gọi taskService.removeLabel với đúng tham số', async () => {
      const expectedResult = { message: 'Gỡ label thành công' };
      mockTaskService.removeLabel.mockResolvedValue(expectedResult);

      const result = await controller.removeLabel('user-001', 'task-001', 'label-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.removeLabel).toHaveBeenCalledWith('user-001', 'task-001', 'label-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: createSubtask()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('createSubtask()', () => {
    it('nên gọi taskService.createSubtask và trả kết quả', async () => {
      const dto = { title: 'Vẽ wireframe' };
      const expectedResult = { id: 'subtask-001', title: 'Vẽ wireframe', position: 1 };
      mockTaskService.createSubtask.mockResolvedValue(expectedResult);

      const result = await controller.createSubtask('user-001', 'task-001', dto as any);

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.createSubtask).toHaveBeenCalledWith('user-001', 'task-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: findSubtasks()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findSubtasks()', () => {
    it('nên gọi taskService.findSubtasks và trả kết quả', async () => {
      const expectedResult = [{ id: 'st-1', title: 'Sub 1' }];
      mockTaskService.findSubtasks.mockResolvedValue(expectedResult);

      const result = await controller.findSubtasks('user-001', 'task-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.findSubtasks).toHaveBeenCalledWith('user-001', 'task-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: toggleSubtask()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('toggleSubtask()', () => {
    it('nên gọi taskService.toggleSubtask và trả kết quả', async () => {
      const expectedResult = { id: 'subtask-001', isCompleted: true };
      mockTaskService.toggleSubtask.mockResolvedValue(expectedResult);

      const result = await controller.toggleSubtask('user-001', 'subtask-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.toggleSubtask).toHaveBeenCalledWith('user-001', 'subtask-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: removeSubtask()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('removeSubtask()', () => {
    it('nên gọi taskService.removeSubtask và trả kết quả', async () => {
      const expectedResult = { message: 'Xóa subtask thành công' };
      mockTaskService.removeSubtask.mockResolvedValue(expectedResult);

      const result = await controller.removeSubtask('user-001', 'subtask-001');

      expect(result).toEqual(expectedResult);
      expect(mockTaskService.removeSubtask).toHaveBeenCalledWith('user-001', 'subtask-001');
    });
  });
});
