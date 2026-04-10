// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  TASK SERVICE — UNIT TEST                                                   ║
// ║  File: task.service.spec.ts                                                 ║
// ║  Người viết: Phú (Phase 4)                                                 ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.1.3 — Testing Pyramid (unit test = nền tảng)                           ║
// ║    8.2.2 — TestingModule + mock DI (tạo module test với dependency giả)     ║
// ║    8.3.1 — describe/it/beforeEach (cấu trúc test)                          ║
// ║    8.4.2 — jest.fn(), mockResolvedValue (hàm mock)                          ║
// ║    8.4.3 — { provide: X, useValue: mockX } (mock DI trong NestJS)          ║
// ║    8.5   — Service test pattern (mock DB layer, test business logic)        ║
// ║    8.7   — Code coverage (npm run test:cov)                                 ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 1: IMPORTS
// Chương 8.2.2 — Cần import Test, TestingModule từ @nestjs/testing
// để tạo môi trường test cho NestJS module
// ═══════════════════════════════════════════════════════════════════════════════

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,       // 404 — task/project/subtask không tồn tại
  ForbiddenException,      // 403 — user không phải member workspace
  ConflictException,       // 409 — assign trùng, label đã gắn
} from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EventsService } from '../events/events.service';

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 2: MOCK CÁC DEPENDENCY
// Chương 8.4.3 — Mock DI: tạo object có cùng method signature với service thật
// nhưng tất cả method đều là jest.fn() → ta kiểm soát hoàn toàn behavior
//
// QUAN TRỌNG: Chỉ mock những method mà TaskService THỰC SỰ GỌI
// Cách xác định: đọc task.service.ts, tìm this.prisma.xxx
// ═══════════════════════════════════════════════════════════════════════════════

// Mock PrismaService — giả lập tất cả Prisma model + method mà TaskService dùng
const mockPrismaService = {
  project: {
    findUnique: jest.fn(),   // checkProjectMembership() — tìm project theo ID
  },
  workspaceMember: {
    findUnique: jest.fn(),   // checkProjectMembership(), checkTaskAccess() — kiểm tra membership
  },
  task: {
    findUnique: jest.fn(),   // findTaskOrThrow(), findOne() — tìm task theo ID
    findMany: jest.fn(),     // findAllByProject() — danh sách tasks
    create: jest.fn(),       // create() — tạo task mới
    update: jest.fn(),       // update(), updateStatus() — cập nhật task
    delete: jest.fn(),       // remove() — xóa task
    count: jest.fn(),        // findAllByProject() — đếm tổng tasks để phân trang
    aggregate: jest.fn(),    // create() — tính max(position)
  },
  taskAssignment: {
    findUnique: jest.fn(),   // assignMember(), unassignMember() — kiểm tra assignment
    create: jest.fn(),       // assignMember() — tạo assignment
    delete: jest.fn(),       // unassignMember() — xóa assignment
  },
  label: {
    findUnique: jest.fn(),   // addLabel() — tìm label theo ID
  },
  taskLabel: {
    findUnique: jest.fn(),   // addLabel(), removeLabel() — kiểm tra label đã gắn chưa
    create: jest.fn(),       // addLabel() — gắn label
    delete: jest.fn(),       // removeLabel() — gỡ label
  },
  subtask: {
    findUnique: jest.fn(),   // toggleSubtask(), removeSubtask() — tìm subtask
    findMany: jest.fn(),     // findSubtasks() — danh sách subtasks
    create: jest.fn(),       // createSubtask() — tạo subtask
    update: jest.fn(),       // toggleSubtask() — toggle complete
    delete: jest.fn(),       // removeSubtask() — xóa subtask
    aggregate: jest.fn(),    // createSubtask() — tính max(position)
  },
};

// Mock EventsService — giả lập gửi event WebSocket
const mockEventsService = {
  emitToProject: jest.fn(),  // emit event tới tất cả users đang xem project
  emitToTask: jest.fn(),     // emit event tới users đang xem chi tiết task
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 3: DỮ LIỆU GIẢ LẬP (Mock Data)
// Dùng chung cho nhiều test case — tái sử dụng để giảm duplicate code
// ═══════════════════════════════════════════════════════════════════════════════

// User hiện tại (người gọi API)
const MOCK_USER_ID = 'user-001';

// Project thuộc workspace
const MOCK_PROJECT = {
  id: 'project-001',
  workspaceId: 'workspace-001',
};

// Workspace member record (user là thành viên hợp lệ)
const MOCK_MEMBER = {
  id: 'member-001',
  workspaceId: 'workspace-001',
  userId: MOCK_USER_ID,
  role: 'MEMBER',
};

// Task mẫu
const MOCK_TASK = {
  id: 'task-001',
  title: 'Thiết kế UI Login',
  description: 'Lên figma màn hình Login',
  status: 'TODO',
  priority: 'HIGH',
  position: 1,
  projectId: 'project-001',
  createdById: MOCK_USER_ID,
  project: { id: 'project-001', workspaceId: 'workspace-001' },
};

// Subtask mẫu
const MOCK_SUBTASK = {
  id: 'subtask-001',
  title: 'Vẽ wireframe',
  isCompleted: false,
  position: 1,
  taskId: 'task-001',
  task: {
    project: { workspaceId: 'workspace-001' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 4: HELPER — Setup mặc định cho membership check
// Giúp giảm duplicate code: hầu hết method đều cần check membership trước
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mock cho checkProjectMembership() thành công
 * Gọi trước mỗi test cần tạo task hoặc list tasks
 */
function mockProjectMembershipSuccess() {
  mockPrismaService.project.findUnique.mockResolvedValue(MOCK_PROJECT);
  mockPrismaService.workspaceMember.findUnique.mockResolvedValue(MOCK_MEMBER);
}

/**
 * Mock cho checkTaskAccess() thành công
 * Gọi trước mỗi test cần thao tác với task cụ thể (update, delete, assign, ...)
 */
function mockTaskAccessSuccess() {
  mockPrismaService.task.findUnique.mockResolvedValue(MOCK_TASK);
  mockPrismaService.workspaceMember.findUnique.mockResolvedValue(MOCK_MEMBER);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 5: TEST SUITE CHÍNH
// Chương 8.3.1 — describe() nhóm các test liên quan
//               beforeEach() chạy trước MỖI test → đảm bảo test độc lập
// ═══════════════════════════════════════════════════════════════════════════════

describe('TaskService', () => {
  let taskService: TaskService;

  // ─────────────────────────────────────────────────────────────────────────────
  // beforeEach — chạy trước MỖI it() block
  // Chương 8.2.2 — Tạo TestingModule với mock dependency injection
  // Chương 8.4.3 — Pattern: { provide: RealService, useValue: mockService }
  // ─────────────────────────────────────────────────────────────────────────────
  beforeEach(async () => {
    // jest.clearAllMocks() — reset tất cả mock về trạng thái ban đầu
    // Đảm bảo test A không ảnh hưởng test B (test isolation)
    jest.clearAllMocks();

    // Tạo NestJS testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // Service thật — đây là thứ ta đang test
        TaskService,
        // Dependencies giả — thay thế service thật bằng mock object
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 1: create()
  // Source: task.service.ts dòng 80-109
  // Flow: checkProjectMembership → tính position → tạo task → emit event
  // ═══════════════════════════════════════════════════════════════════════════
  describe('create() — Tạo task mới', () => {
    const createDto = {
      title: 'Thiết kế UI Login',
      description: 'Lên figma',
      priority: 'HIGH' as any,
      estimatedHours: 5.5,
      dueDate: '2026-03-30T10:00:00Z',
    };

    // ─── Test 1.1: Tạo task thành công ────────────────────────────────────
    it('nên tạo task thành công và trả về task object', async () => {
      // ARRANGE — mock membership check + aggregate + create
      mockProjectMembershipSuccess();
      mockPrismaService.task.aggregate.mockResolvedValue({ _max: { position: 3 } });
      const createdTask = { id: 'task-new', ...createDto, position: 4, projectId: 'project-001' };
      mockPrismaService.task.create.mockResolvedValue(createdTask);

      // ACT
      const result = await taskService.create(MOCK_USER_ID, 'project-001', createDto);

      // ASSERT
      // 1. Task được trả về đúng
      expect(result).toEqual(createdTask);
      // 2. Position được tính = max + 1 = 3 + 1 = 4
      expect(mockPrismaService.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Thiết kế UI Login',
            position: 4,
            projectId: 'project-001',
            createdById: MOCK_USER_ID,
          }),
        }),
      );
      // 3. Event WebSocket được emit
      expect(mockEventsService.emitToProject).toHaveBeenCalledWith(
        'project-001', 'task:created', createdTask,
      );
    });

    // ─── Test 1.2: Project không tồn tại → NotFoundException ──────────────
    it('nên báo lỗi 404 nếu project không tồn tại', async () => {
      // ARRANGE — project.findUnique trả null
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        taskService.create(MOCK_USER_ID, 'project-not-exist', createDto),
      ).rejects.toThrow(NotFoundException);
      // Không tạo task khi project không tồn tại
      expect(mockPrismaService.task.create).not.toHaveBeenCalled();
    });

    // ─── Test 1.3: User không phải member → ForbiddenException ────────────
    it('nên báo lỗi 403 nếu user không phải member workspace', async () => {
      // ARRANGE — project tồn tại, nhưng user không có trong workspace
      mockPrismaService.project.findUnique.mockResolvedValue(MOCK_PROJECT);
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        taskService.create(MOCK_USER_ID, 'project-001', createDto),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.task.create).not.toHaveBeenCalled();
    });

    // ─── Test 1.4: Position = 1 khi project chưa có task nào ──────────────
    it('nên set position = 1 khi project chưa có task nào', async () => {
      // ARRANGE — aggregate trả max = null (chưa có task)
      mockProjectMembershipSuccess();
      mockPrismaService.task.aggregate.mockResolvedValue({ _max: { position: null } });
      mockPrismaService.task.create.mockResolvedValue({ id: 'task-first', position: 1 });

      // ACT
      await taskService.create(MOCK_USER_ID, 'project-001', createDto);

      // ASSERT — position phải = (null ?? 0) + 1 = 1
      expect(mockPrismaService.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ position: 1 }),
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 2: findAllByProject()
  // Source: task.service.ts dòng 113-224
  // Flow: checkMembership → build WHERE → build ORDER BY → findMany + count
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findAllByProject() — Danh sách task có filter/sort/pagination', () => {
    const mockTasks = [
      { id: 'task-001', title: 'Task 1', status: 'TODO' },
      { id: 'task-002', title: 'Task 2', status: 'IN_PROGRESS' },
    ];

    // ─── Test 2.1: Lấy danh sách thành công (không filter) ────────────────
    it('nên trả danh sách tasks kèm meta phân trang', async () => {
      // ARRANGE
      mockProjectMembershipSuccess();
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(2);

      // ACT — query rỗng = không filter, mặc định page=1, limit=20
      const result = await taskService.findAllByProject(MOCK_USER_ID, 'project-001', {});

      // ASSERT
      expect(result.data).toEqual(mockTasks);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    // ─── Test 2.2: Filter theo status ─────────────────────────────────────
    it('nên xây dựng WHERE đúng khi filter theo status', async () => {
      // ARRANGE
      mockProjectMembershipSuccess();
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      // ACT — filter status=TODO,IN_PROGRESS
      await taskService.findAllByProject(MOCK_USER_ID, 'project-001', {
        status: 'TODO,IN_PROGRESS',
      });

      // ASSERT — kiểm tra WHERE có status filter đúng
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            projectId: 'project-001',
            status: { in: ['TODO', 'IN_PROGRESS'] },
          }),
        }),
      );
    });

    // ─── Test 2.3: Filter theo search keyword ─────────────────────────────
    it('nên xây dựng WHERE đúng khi search theo title', async () => {
      // ARRANGE
      mockProjectMembershipSuccess();
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(0);

      // ACT
      await taskService.findAllByProject(MOCK_USER_ID, 'project-001', {
        search: 'Login',
      });

      // ASSERT — WHERE có contains filter
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: 'Login', mode: 'insensitive' },
          }),
        }),
      );
    });

    // ─── Test 2.4: Phân trang đúng ───────────────────────────────────────
    it('nên tính skip đúng dựa trên page và limit', async () => {
      // ARRANGE
      mockProjectMembershipSuccess();
      mockPrismaService.task.findMany.mockResolvedValue([]);
      mockPrismaService.task.count.mockResolvedValue(50);

      // ACT — page 3, mỗi trang 10 task → skip = (3-1)*10 = 20
      await taskService.findAllByProject(MOCK_USER_ID, 'project-001', {
        page: 3,
        limit: 10,
      });

      // ASSERT
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 3: findOne()
  // Source: task.service.ts dòng 228-252
  // Flow: checkTaskAccess → findUnique (với includes đầy đủ)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findOne() — Chi tiết task', () => {
    // ─── Test 3.1: Lấy chi tiết thành công ────────────────────────────────
    it('nên trả về task với đầy đủ subtasks, assignees, labels', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      const detailedTask = {
        ...MOCK_TASK,
        subtasks: [],
        assignments: [],
        labels: [],
        _count: { comments: 0, attachments: 0 },
      };
      // findUnique được gọi 2 lần: 1 lần trong checkTaskAccess, 1 lần trong findOne
      mockPrismaService.task.findUnique
        .mockResolvedValueOnce(MOCK_TASK)       // checkTaskAccess
        .mockResolvedValueOnce(detailedTask);   // findOne query

      // ACT
      const result = await taskService.findOne(MOCK_USER_ID, 'task-001');

      // ASSERT
      expect(result).toEqual(detailedTask);
    });

    // ─── Test 3.2: Task không tồn tại → NotFoundException ─────────────────
    it('nên báo lỗi 404 nếu task không tồn tại', async () => {
      // ARRANGE — task.findUnique trả null
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(
        taskService.findOne(MOCK_USER_ID, 'task-not-exist'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 4: update()
  // Source: task.service.ts dòng 256-293
  // Flow: checkTaskAccess → chuyển date → set completedAt → update → emit
  // ═══════════════════════════════════════════════════════════════════════════
  describe('update() — Cập nhật task', () => {
    // ─── Test 4.1: Cập nhật thành công ────────────────────────────────────
    it('nên cập nhật task và trả về task đã update', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      const updatedTask = { ...MOCK_TASK, title: 'Title đã sửa', projectId: 'project-001' };
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      // ACT
      const result = await taskService.update(MOCK_USER_ID, 'task-001', {
        title: 'Title đã sửa',
      });

      // ASSERT
      expect(result).toEqual(updatedTask);
      expect(mockEventsService.emitToTask).toHaveBeenCalledWith(
        'task-001', 'task:updated', updatedTask,
      );
    });

    // ─── Test 4.2: Set completedAt khi status = DONE ──────────────────────
    it('nên tự động set completedAt khi chuyển sang DONE', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.task.update.mockResolvedValue({ ...MOCK_TASK, status: 'DONE', projectId: 'project-001' });

      // ACT
      await taskService.update(MOCK_USER_ID, 'task-001', { status: 'DONE' as any });

      // ASSERT — data truyền vào update() phải có completedAt
      expect(mockPrismaService.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DONE',
            completedAt: expect.any(Date),
          }),
        }),
      );
    });

    // ─── Test 4.3: Xóa completedAt khi chuyển khỏi DONE ──────────────────
    it('nên xóa completedAt khi chuyển từ DONE sang status khác', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.task.update.mockResolvedValue({ ...MOCK_TASK, status: 'IN_PROGRESS', projectId: 'project-001' });

      // ACT
      await taskService.update(MOCK_USER_ID, 'task-001', { status: 'IN_PROGRESS' as any });

      // ASSERT — completedAt phải = null
      expect(mockPrismaService.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            completedAt: null,
          }),
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 5: remove()
  // Source: task.service.ts dòng 297-305
  // Flow: checkTaskAccess → delete (cascade) → emit event
  // ═══════════════════════════════════════════════════════════════════════════
  describe('remove() — Xóa task', () => {
    // ─── Test 5.1: Xóa thành công ────────────────────────────────────────
    it('nên xóa task và trả về thông báo thành công', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.task.delete.mockResolvedValue(MOCK_TASK);

      // ACT
      const result = await taskService.remove(MOCK_USER_ID, 'task-001');

      // ASSERT
      expect(result).toEqual({ message: 'Xóa task thành công' });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: 'task-001' } });
      expect(mockEventsService.emitToProject).toHaveBeenCalledWith(
        'project-001', 'task:deleted', { id: 'task-001' },
      );
    });

    // ─── Test 5.2: Task không tồn tại → NotFoundException ─────────────────
    it('nên báo lỗi 404 nếu task không tồn tại', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(
        taskService.remove(MOCK_USER_ID, 'task-not-exist'),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.task.delete).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 6: updateStatus()
  // Source: task.service.ts dòng 309-332
  // Flow: checkTaskAccess → set completedAt → update → emit
  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateStatus() — Chuyển trạng thái task', () => {
    // ─── Test 6.1: Chuyển status thành công ───────────────────────────────
    it('nên cập nhật status và emit event', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      const updatedTask = { ...MOCK_TASK, status: 'IN_PROGRESS', projectId: 'project-001' };
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      // ACT
      const result = await taskService.updateStatus(MOCK_USER_ID, 'task-001', {
        status: 'IN_PROGRESS' as any,
      });

      // ASSERT
      expect(result.status).toBe('IN_PROGRESS');
      expect(mockEventsService.emitToTask).toHaveBeenCalled();
      expect(mockEventsService.emitToProject).toHaveBeenCalled();
    });

    // ─── Test 6.2: Chuyển sang DONE → tự set completedAt ──────────────────
    it('nên set completedAt = now khi chuyển sang DONE', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.task.update.mockResolvedValue({ ...MOCK_TASK, status: 'DONE', projectId: 'project-001' });

      // ACT
      await taskService.updateStatus(MOCK_USER_ID, 'task-001', { status: 'DONE' as any });

      // ASSERT
      expect(mockPrismaService.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DONE',
            completedAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 7: assignMember()
  // Source: task.service.ts dòng 336-368
  // Flow: checkTaskAccess → check target member → check duplicate → create
  // ═══════════════════════════════════════════════════════════════════════════
  describe('assignMember() — Giao task cho thành viên', () => {
    // ─── Test 7.1: Assign thành công ──────────────────────────────────────
    it('nên assign thành viên vào task thành công', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      // Target user là member workspace
      mockPrismaService.workspaceMember.findUnique
        .mockResolvedValueOnce(MOCK_MEMBER)         // checkTaskAccess
        .mockResolvedValueOnce({ id: 'member-002', userId: 'user-002' }); // check target
      // Chưa assign
      mockPrismaService.taskAssignment.findUnique.mockResolvedValue(null);
      const assignment = { id: 'assign-001', taskId: 'task-001', userId: 'user-002', user: { id: 'user-002', name: 'Vy' } };
      mockPrismaService.taskAssignment.create.mockResolvedValue(assignment);

      // ACT
      const result = await taskService.assignMember(MOCK_USER_ID, 'task-001', 'user-002');

      // ASSERT
      expect(result.message).toBe('Assign thành công');
      expect(result.assignment).toEqual(assignment);
    });

    // ─── Test 7.2: Target user không phải member → ForbiddenException ─────
    it('nên báo lỗi 403 nếu người được assign không phải member workspace', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      // Lần 2 gọi workspaceMember.findUnique trả null (target không phải member)
      mockPrismaService.workspaceMember.findUnique
        .mockResolvedValueOnce(MOCK_MEMBER)   // checkTaskAccess — current user OK
        .mockResolvedValueOnce(null);          // target user không phải member

      // ACT & ASSERT
      await expect(
        taskService.assignMember(MOCK_USER_ID, 'task-001', 'user-outsider'),
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.taskAssignment.create).not.toHaveBeenCalled();
    });

    // ─── Test 7.3: Đã assign rồi → ConflictException ─────────────────────
    it('nên báo lỗi 409 nếu user đã được assign vào task rồi', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.workspaceMember.findUnique
        .mockResolvedValueOnce(MOCK_MEMBER)
        .mockResolvedValueOnce({ id: 'member-002', userId: 'user-002' });
      // Đã có assignment
      mockPrismaService.taskAssignment.findUnique.mockResolvedValue({ id: 'existing' });

      // ACT & ASSERT
      await expect(
        taskService.assignMember(MOCK_USER_ID, 'task-001', 'user-002'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 8: unassignMember()
  // Source: task.service.ts dòng 372-385
  // Flow: checkTaskAccess → find assignment → delete
  // ═══════════════════════════════════════════════════════════════════════════
  describe('unassignMember() — Hủy giao task', () => {
    // ─── Test 8.1: Unassign thành công ────────────────────────────────────
    it('nên hủy assignment thành công', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.taskAssignment.findUnique.mockResolvedValue({ id: 'assign-001' });
      mockPrismaService.taskAssignment.delete.mockResolvedValue({});

      // ACT
      const result = await taskService.unassignMember(MOCK_USER_ID, 'task-001', 'user-002');

      // ASSERT
      expect(result).toEqual({ message: 'Unassign thành công' });
      expect(mockPrismaService.taskAssignment.delete).toHaveBeenCalledWith({
        where: { id: 'assign-001' },
      });
    });

    // ─── Test 8.2: Chưa assign → NotFoundException ────────────────────────
    it('nên báo lỗi 404 nếu user chưa được assign', async () => {
      mockTaskAccessSuccess();
      mockPrismaService.taskAssignment.findUnique.mockResolvedValue(null);

      await expect(
        taskService.unassignMember(MOCK_USER_ID, 'task-001', 'user-002'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 9: addLabel()
  // Source: task.service.ts dòng 389-416
  // Flow: checkTaskAccess → find label → check workspace match → check dup → create
  // ═══════════════════════════════════════════════════════════════════════════
  describe('addLabel() — Gắn label vào task', () => {
    // ─── Test 9.1: Gắn thành công ────────────────────────────────────────
    it('nên gắn label vào task thành công', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      // Label thuộc cùng workspace
      mockPrismaService.label.findUnique.mockResolvedValue({
        id: 'label-001', name: 'Bug', color: '#EF4444', workspaceId: 'workspace-001',
      });
      mockPrismaService.taskLabel.findUnique.mockResolvedValue(null); // chưa gắn
      const taskLabel = { id: 'tl-001', taskId: 'task-001', labelId: 'label-001', label: { id: 'label-001', name: 'Bug', color: '#EF4444' } };
      mockPrismaService.taskLabel.create.mockResolvedValue(taskLabel);

      // ACT
      const result = await taskService.addLabel(MOCK_USER_ID, 'task-001', 'label-001');

      // ASSERT
      expect(result.message).toBe('Gắn label thành công');
    });

    // ─── Test 9.2: Label không thuộc workspace → NotFoundException ────────
    it('nên báo lỗi 404 nếu label không thuộc workspace', async () => {
      mockTaskAccessSuccess();
      // Label thuộc workspace khác
      mockPrismaService.label.findUnique.mockResolvedValue({
        id: 'label-002', workspaceId: 'workspace-OTHER',
      });

      await expect(
        taskService.addLabel(MOCK_USER_ID, 'task-001', 'label-002'),
      ).rejects.toThrow(NotFoundException);
    });

    // ─── Test 9.3: Label đã gắn rồi → ConflictException ──────────────────
    it('nên báo lỗi 409 nếu label đã gắn vào task rồi', async () => {
      mockTaskAccessSuccess();
      mockPrismaService.label.findUnique.mockResolvedValue({
        id: 'label-001', workspaceId: 'workspace-001',
      });
      mockPrismaService.taskLabel.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        taskService.addLabel(MOCK_USER_ID, 'task-001', 'label-001'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 10: removeLabel()
  // Source: task.service.ts dòng 420-433
  // ═══════════════════════════════════════════════════════════════════════════
  describe('removeLabel() — Gỡ label', () => {
    it('nên gỡ label thành công', async () => {
      mockTaskAccessSuccess();
      mockPrismaService.taskLabel.findUnique.mockResolvedValue({ id: 'tl-001' });
      mockPrismaService.taskLabel.delete.mockResolvedValue({});

      const result = await taskService.removeLabel(MOCK_USER_ID, 'task-001', 'label-001');
      expect(result).toEqual({ message: 'Gỡ label thành công' });
    });

    it('nên báo lỗi 404 nếu label chưa gắn', async () => {
      mockTaskAccessSuccess();
      mockPrismaService.taskLabel.findUnique.mockResolvedValue(null);

      await expect(
        taskService.removeLabel(MOCK_USER_ID, 'task-001', 'label-001'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 11: createSubtask()
  // Source: task.service.ts dòng 437-454
  // Flow: checkTaskAccess → tính position → tạo subtask
  // ═══════════════════════════════════════════════════════════════════════════
  describe('createSubtask() — Tạo subtask', () => {
    it('nên tạo subtask với position tự động tăng', async () => {
      // ARRANGE
      mockTaskAccessSuccess();
      mockPrismaService.subtask.aggregate.mockResolvedValue({ _max: { position: 2 } });
      const newSubtask = { id: 'subtask-new', title: 'Vẽ wireframe', position: 3, taskId: 'task-001' };
      mockPrismaService.subtask.create.mockResolvedValue(newSubtask);

      // ACT
      const result = await taskService.createSubtask(MOCK_USER_ID, 'task-001', {
        title: 'Vẽ wireframe',
      });

      // ASSERT
      expect(result).toEqual(newSubtask);
      expect(mockPrismaService.subtask.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Vẽ wireframe',
            taskId: 'task-001',
            position: 3,
          }),
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 12: toggleSubtask()
  // Source: task.service.ts dòng 458-488
  // Flow: find subtask → check membership → toggle isCompleted
  // ═══════════════════════════════════════════════════════════════════════════
  describe('toggleSubtask() — Toggle hoàn thành subtask', () => {
    it('nên đổi isCompleted từ false → true', async () => {
      // ARRANGE
      mockPrismaService.subtask.findUnique.mockResolvedValue(MOCK_SUBTASK); // isCompleted = false
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(MOCK_MEMBER);
      mockPrismaService.subtask.update.mockResolvedValue({ ...MOCK_SUBTASK, isCompleted: true });

      // ACT
      const result = await taskService.toggleSubtask(MOCK_USER_ID, 'subtask-001');

      // ASSERT — update với !false = true
      expect(mockPrismaService.subtask.update).toHaveBeenCalledWith({
        where: { id: 'subtask-001' },
        data: { isCompleted: true },
      });
      expect(result.isCompleted).toBe(true);
    });

    it('nên đổi isCompleted từ true → false', async () => {
      // ARRANGE — subtask đang completed
      mockPrismaService.subtask.findUnique.mockResolvedValue({ ...MOCK_SUBTASK, isCompleted: true });
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(MOCK_MEMBER);
      mockPrismaService.subtask.update.mockResolvedValue({ ...MOCK_SUBTASK, isCompleted: false });

      // ACT
      const result = await taskService.toggleSubtask(MOCK_USER_ID, 'subtask-001');

      // ASSERT
      expect(mockPrismaService.subtask.update).toHaveBeenCalledWith({
        where: { id: 'subtask-001' },
        data: { isCompleted: false },
      });
    });

    it('nên báo lỗi 404 nếu subtask không tồn tại', async () => {
      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      await expect(
        taskService.toggleSubtask(MOCK_USER_ID, 'subtask-not-exist'),
      ).rejects.toThrow(NotFoundException);
    });

    it('nên báo lỗi 403 nếu user không phải member', async () => {
      mockPrismaService.subtask.findUnique.mockResolvedValue(MOCK_SUBTASK);
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(
        taskService.toggleSubtask(MOCK_USER_ID, 'subtask-001'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 13: findSubtasks()
  // Source: task.service.ts dòng 492-498
  // ═══════════════════════════════════════════════════════════════════════════
  describe('findSubtasks() — Danh sách subtask', () => {
    it('nên trả danh sách subtasks sắp xếp theo position', async () => {
      mockTaskAccessSuccess();
      const subtasks = [
        { id: 'st-1', title: 'A', position: 1 },
        { id: 'st-2', title: 'B', position: 2 },
      ];
      mockPrismaService.subtask.findMany.mockResolvedValue(subtasks);

      const result = await taskService.findSubtasks(MOCK_USER_ID, 'task-001');

      expect(result).toEqual(subtasks);
      expect(mockPrismaService.subtask.findMany).toHaveBeenCalledWith({
        where: { taskId: 'task-001' },
        orderBy: { position: 'asc' },
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP 14: removeSubtask()
  // Source: task.service.ts dòng 503-531
  // ═══════════════════════════════════════════════════════════════════════════
  describe('removeSubtask() — Xóa subtask', () => {
    it('nên xóa subtask thành công', async () => {
      // ARRANGE
      mockPrismaService.subtask.findUnique.mockResolvedValue(MOCK_SUBTASK);
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(MOCK_MEMBER);
      mockPrismaService.subtask.delete.mockResolvedValue({});

      // ACT
      const result = await taskService.removeSubtask(MOCK_USER_ID, 'subtask-001');

      // ASSERT
      expect(result).toEqual({ message: 'Xóa subtask thành công' });
      expect(mockPrismaService.subtask.delete).toHaveBeenCalledWith({
        where: { id: 'subtask-001' },
      });
    });

    it('nên báo lỗi 404 nếu subtask không tồn tại', async () => {
      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      await expect(
        taskService.removeSubtask(MOCK_USER_ID, 'subtask-not-exist'),
      ).rejects.toThrow(NotFoundException);
    });

    it('nên báo lỗi 403 nếu user không phải member', async () => {
      mockPrismaService.subtask.findUnique.mockResolvedValue(MOCK_SUBTASK);
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(
        taskService.removeSubtask(MOCK_USER_ID, 'subtask-001'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
