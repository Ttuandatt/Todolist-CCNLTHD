import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// 1. TẠO MOCK CHO DATABASE (PRISMA):
// Vì Service kết nối trực tiếp với DB, ta cần chặn nó lại và làm giả bằng thư viện jest.fn()
const mockPrismaService = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workspaceMember: {
    findUnique: jest.fn(),
  },
  task: {
    groupBy: jest.fn(),
  }
};

describe('ProjectService', () => {
  let service: ProjectService;
  let prisma: any; // Khai báo biến để dễ dàng điều khiển quả db giả ở dưới

  // 2. SETUP MÔI TRƯỜNG:
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService, // Đưa Service THẬT vào để bắt đầu mổ xẻ
        {
          provide: PrismaService, // Gặp PrismaService...
          useValue: mockPrismaService, // ...tráo bằng hàng giả
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
    
    // Xóa sạch trạng thái gọi từ các test trước
    jest.clearAllMocks();
  });

  // =========================================================================
  // 3.BẮT ĐẦU TEST CÁC TRƯỜNG HỢP THEO DANH SÁCH 18 TEST CASES KẾ HOẠCH
  // =========================================================================

  describe('create (Hàm tạo Project)', () => {
    it('Case 1: Tạo project thành công', async () => {
      // Arrange (Chuẩn bị)
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const dto = { name: 'Dự án siêu cấp', color: '#FFF' };

      // Khúc này cực kị xảo: Service gọi `checkWorkspaceMembership`
      // Nên ta phải ép Prisma giả vờ tìm thấy member
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
        id: 'member-1', role: 'MEMBER' 
      });

      // Ép quả báo cáo tạo Project thành công
      const expectedProject = { id: 'proj-1', name: 'Dự án siêu cấp', workspaceId, createdById: userId };
      mockPrismaService.project.create.mockResolvedValue(expectedProject);

      // Act (Hành động gọi hàm)
      const result = await service.create(userId, workspaceId, dto as any);

      // Assert (Kiểm định)
      expect(result).toEqual(expectedProject);
      // Đảm bảo prisma đã được gọi để kiểm tra quyền
      expect(mockPrismaService.workspaceMember.findUnique).toHaveBeenCalled();
      // Đảm bảo prisma đã được gọi để insert
      expect(mockPrismaService.project.create).toHaveBeenCalled();
    });

    it('Case 2: User không phải thành viên Workspace -> Báo lỗi Forbidden (403)', async () => {
      // Arrange
      const userId = 'user-hacker';
      const workspaceId = 'ws-1';
      const dto = { name: 'Dự án lén lút', color: '#000' };

      // KỊCH BẢN TỆ: User không nằm trong workspace (DB trả về null)
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      // Act & Assert (Với lỗi văng ra, ta phải dùng lệnh `rejects.toThrow`)
      await expect(
        service.create(userId, workspaceId, dto as any)
      ).rejects.toThrow(ForbiddenException);
      
      // Chắc chắn project KHÔNG được phép tạo
      expect(mockPrismaService.project.create).not.toHaveBeenCalled();
    });
  });

  describe('archive (Lưu trữ Project)', () => {
    it('Case 12: Lưu trữ thành công (Đổi status -> ARCHIVED)', async () => {
      // Arrange
      const userId = 'user-owner';
      const projectId = 'proj-1';

      // 1. Phải tìm thấy cái Project (ACTIVE) trước (Kịch bản tốt)
      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', status: 'ACTIVE'
      });
      
      // 2. Phải là OWNER hoặc ADMIN
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
        role: 'OWNER'
      });

      // 3. Ép Cập nhật thành ARCHIVED thì thành công
      mockPrismaService.project.update.mockResolvedValue({
        id: projectId, status: 'ARCHIVED'
      });

      // Act
      const result = await service.archive(userId, projectId);

      // Assert
      expect(result.status).toBe('ARCHIVED');
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
         where: { id: projectId },
         data: { status: 'ARCHIVED' }
      });
    });

    it('Case 13: KHÔNG PHẢI Owner/Admin thì không được phép -> Báo lỗi Forbidden', async () => {
      // Arrange
      const userId = 'user-staff';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', status: 'ACTIVE'
      });
      // Nhân viên bình thường
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({
        role: 'MEMBER' 
      });

      // Act & Assert
      await expect(
        service.archive(userId, projectId)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // =========================================================================
  // PHẦN BỔ SUNG: 14 TEST CASES CHO CÁC HÀM CÒN LẠI
  // =========================================================================

  describe('findAllByWorkspace (Lấy danh sách Project)', () => {
    it('Case 3: Lấy danh sách project thành công', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const query = {};

      // checkWorkspaceMembership -> tìm thấy member
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      const expectedProjects = [
        { id: 'proj-1', name: 'Dự án A', workspaceId },
        { id: 'proj-2', name: 'Dự án B', workspaceId },
      ];
      mockPrismaService.project.findMany.mockResolvedValue(expectedProjects);

      const result = await service.findAllByWorkspace(userId, workspaceId, query as any);

      expect(result).toEqual(expectedProjects);
      expect(mockPrismaService.workspaceMember.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ workspaceId }),
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        }),
      );
    });

    it('Case 4: User không phải thành viên -> Báo lỗi Forbidden', async () => {
      const userId = 'user-hacker';
      const workspaceId = 'ws-1';

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(
        service.findAllByWorkspace(userId, workspaceId, {} as any),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrismaService.project.findMany).not.toHaveBeenCalled();
    });
  });

  describe('findOne (Lấy chi tiết Project)', () => {
    it('Case 5: Lấy chi tiết project thành công (kèm taskCountByStatus)', async () => {
      const userId = 'user-1';
      const projectId = 'proj-1';

      // findUnique -> tìm thấy project
      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, name: 'Dự án A', workspaceId: 'ws-1',
      });

      // checkWorkspaceMembership -> tìm thấy member
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      // task.groupBy -> trả về thống kê
      mockPrismaService.task.groupBy.mockResolvedValue([
        { status: 'TODO', _count: 3 },
        { status: 'DONE', _count: 5 },
      ]);

      const result = await service.findOne(userId, projectId);

      expect(result.id).toBe(projectId);
      expect(result.taskCountByStatus).toEqual({
        TODO: 3, IN_PROGRESS: 0, REVIEW: 0, DONE: 5,
      });
    });

    it('Case 6: Project không tồn tại -> Báo lỗi NotFound', async () => {
      const userId = 'user-1';
      const projectId = 'proj-ghost';

      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, projectId)).rejects.toThrow(NotFoundException);
    });

    it('Case 7: User không phải thành viên workspace -> Báo lỗi Forbidden', async () => {
      const userId = 'user-hacker';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1',
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, projectId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update (Cập nhật Project)', () => {
    it('Case 8: Cập nhật project thành công', async () => {
      const userId = 'user-1';
      const projectId = 'proj-1';
      const dto = { name: 'Tên mới' };

      // findProjectOrThrow -> tìm thấy project
      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1',
      });

      // checkWorkspaceMembership -> tìm thấy member
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      const expectedResult = { id: projectId, name: 'Tên mới' };
      mockPrismaService.project.update.mockResolvedValue(expectedResult);

      const result = await service.update(userId, projectId, dto as any);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: dto,
      });
    });

    it('Case 9: Project không tồn tại -> Báo lỗi NotFound', async () => {
      const userId = 'user-1';
      const projectId = 'proj-ghost';

      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(
        service.update(userId, projectId, { name: 'abc' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove (Xóa Project)', () => {
    it('Case 10: Xóa project thành công (Owner/Admin)', async () => {
      const userId = 'user-owner';
      const projectId = 'proj-1';

      // findProjectOrThrow -> tìm thấy
      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1',
      });

      // checkWorkspaceAdminRole -> OWNER
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ role: 'OWNER' });

      mockPrismaService.project.delete.mockResolvedValue({});

      const result = await service.remove(userId, projectId);

      expect(result.message).toBe('Xóa project thành công');
      expect(mockPrismaService.project.delete).toHaveBeenCalledWith({ where: { id: projectId } });
    });

    it('Case 11: KHÔNG PHẢI Owner/Admin -> Báo lỗi Forbidden', async () => {
      const userId = 'user-staff';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1',
      });

      // Chỉ là MEMBER bình thường
      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ role: 'MEMBER' });

      await expect(service.remove(userId, projectId)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.project.delete).not.toHaveBeenCalled();
    });
  });

  // Case 12-13 của archive đã có ở trên

  describe('unarchive (Khôi phục Project)', () => {
    it('Case 14: Khôi phục project thành công (Đổi status -> ACTIVE)', async () => {
      const userId = 'user-owner';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', status: 'ARCHIVED',
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ role: 'OWNER' });

      mockPrismaService.project.update.mockResolvedValue({
        id: projectId, status: 'ACTIVE',
      });

      const result = await service.unarchive(userId, projectId);

      expect(result.status).toBe('ACTIVE');
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: { status: 'ACTIVE' },
      });
    });

    it('Case 15: Project đã ACTIVE rồi thì không cần unarchive -> Báo lỗi Forbidden', async () => {
      const userId = 'user-owner';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', status: 'ACTIVE',
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ role: 'OWNER' });

      await expect(service.unarchive(userId, projectId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('pin (Ghim Project)', () => {
    it('Case 16: Ghim project thành công', async () => {
      const userId = 'user-1';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', isPinned: false,
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      mockPrismaService.project.update.mockResolvedValue({
        id: projectId, isPinned: true,
      });

      const result = await service.pin(userId, projectId);

      expect(result.isPinned).toBe(true);
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: { isPinned: true },
      });
    });

    it('Case 17: Project đã ghim rồi -> Báo lỗi Forbidden', async () => {
      const userId = 'user-1';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', isPinned: true,
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      await expect(service.pin(userId, projectId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('unpin (Bỏ ghim Project)', () => {
    it('Case 18: Bỏ ghim project thành công', async () => {
      const userId = 'user-1';
      const projectId = 'proj-1';

      mockPrismaService.project.findUnique.mockResolvedValue({
        id: projectId, workspaceId: 'ws-1', isPinned: true,
      });

      mockPrismaService.workspaceMember.findUnique.mockResolvedValue({ id: 'member-1', role: 'MEMBER' });

      mockPrismaService.project.update.mockResolvedValue({
        id: projectId, isPinned: false,
      });

      const result = await service.unpin(userId, projectId);

      expect(result.isPinned).toBe(false);
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: { isPinned: false },
      });
    });
  });

});
