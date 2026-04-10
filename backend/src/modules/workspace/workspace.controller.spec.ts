import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

// 1. CHUẨN BỊ MOCK: Tạo object giả thay thế hoàn toàn WorkspaceService thật
// Controller chỉ là lớp "trung chuyển", ta chỉ kiểm tra nó gọi đúng Service method với đúng params
const mockWorkspaceService = {
  create: jest.fn(),
  findAllForUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createInvite: jest.fn(),
  acceptInvite: jest.fn(),
  getMembers: jest.fn(),
  changeMemberRole: jest.fn(),
  removeMember: jest.fn(),
  leaveWorkspace: jest.fn(),
};

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let service: WorkspaceService;

  // 2. SETUP: Tạo NestJS Module giả trước mỗi test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,      // Khi Controller cần WorkspaceService...
          useValue: mockWorkspaceService, // ...thì đưa cho nó hàng giả
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    service = module.get<WorkspaceService>(WorkspaceService);

    // Xóa lịch sử gọi hàm trước khi bắt đầu test mới
    jest.clearAllMocks();
  });

  // ===========================
  // 3. BẮT ĐẦU VIẾT TEST CASES
  // ===========================

  describe('create', () => {
    it('should delegate to workspaceService.create and return the result', async () => {
      const userId = 'user-1';
      const dto: CreateWorkspaceDto = { name: 'Workspace mới' };
      const expectedResult = { id: 'ws-1', name: 'Workspace mới', ownerId: userId };

      mockWorkspaceService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(userId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(userId, dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should delegate to workspaceService.findAllForUser and return the result', async () => {
      const userId = 'user-1';
      const expectedResult = [
        { id: 'ws-1', name: 'Workspace A' },
        { id: 'ws-2', name: 'Workspace B' },
      ];

      mockWorkspaceService.findAllForUser.mockResolvedValue(expectedResult);

      const result = await controller.findAll(userId);

      expect(result).toEqual(expectedResult);
      expect(service.findAllForUser).toHaveBeenCalledWith(userId);
      expect(service.findAllForUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should delegate to workspaceService.findOne and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const expectedResult = { id: 'ws-1', name: 'Workspace A', ownerId: userId };

      mockWorkspaceService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId, workspaceId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(userId, workspaceId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should delegate to workspaceService.update and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const dto: UpdateWorkspaceDto = { name: 'Đổi tên Workspace' };
      const expectedResult = { id: 'ws-1', name: 'Đổi tên Workspace' };

      mockWorkspaceService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(userId, workspaceId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(userId, workspaceId, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delegate to workspaceService.remove and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const expectedResult = { message: 'Xóa workspace thành công' };

      mockWorkspaceService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId, workspaceId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(userId, workspaceId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('createInvite', () => {
    it('should delegate to workspaceService.createInvite and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const dto = { email: 'friend@example.com', role: 'MEMBER' } as InviteMemberDto;
      const expectedResult = { message: 'Đã tạo lời mời thành công', inviteToken: 'abc123' };

      mockWorkspaceService.createInvite.mockResolvedValue(expectedResult);

      const result = await controller.createInvite(userId, workspaceId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.createInvite).toHaveBeenCalledWith(userId, workspaceId, dto);
      expect(service.createInvite).toHaveBeenCalledTimes(1);
    });
  });

  describe('acceptInvite', () => {
    it('should delegate to workspaceService.acceptInvite and return the result', async () => {
      const userId = 'user-1';
      const token = 'invite-token-xyz';
      const expectedResult = { message: 'Đã tham gia workspace thành công', workspaceId: 'ws-1' };

      mockWorkspaceService.acceptInvite.mockResolvedValue(expectedResult);

      const result = await controller.acceptInvite(userId, token);

      expect(result).toEqual(expectedResult);
      expect(service.acceptInvite).toHaveBeenCalledWith(userId, token);
      expect(service.acceptInvite).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMembers', () => {
    it('should delegate to workspaceService.getMembers and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const expectedResult = [
        { userId: 'user-1', role: 'OWNER' },
        { userId: 'user-2', role: 'MEMBER' },
      ];

      mockWorkspaceService.getMembers.mockResolvedValue(expectedResult);

      const result = await controller.getMembers(userId, workspaceId);

      expect(result).toEqual(expectedResult);
      expect(service.getMembers).toHaveBeenCalledWith(userId, workspaceId);
      expect(service.getMembers).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeMemberRole', () => {
    it('should delegate to workspaceService.changeMemberRole and return the result', async () => {
      const userId = 'user-owner';
      const workspaceId = 'ws-1';
      const memberId = 'user-target';
      const dto = { role: 'ADMIN' } as ChangeRoleDto;
      const expectedResult = { id: 'member-1', role: 'ADMIN' };

      mockWorkspaceService.changeMemberRole.mockResolvedValue(expectedResult);

      const result = await controller.changeMemberRole(userId, workspaceId, memberId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.changeMemberRole).toHaveBeenCalledWith(userId, workspaceId, memberId, dto);
      expect(service.changeMemberRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeMember', () => {
    it('should delegate to workspaceService.removeMember and return the result', async () => {
      const userId = 'user-owner';
      const workspaceId = 'ws-1';
      const memberId = 'user-target';
      const expectedResult = { message: 'Đã xóa thành viên khỏi workspace' };

      mockWorkspaceService.removeMember.mockResolvedValue(expectedResult);

      const result = await controller.removeMember(userId, workspaceId, memberId);

      expect(result).toEqual(expectedResult);
      expect(service.removeMember).toHaveBeenCalledWith(userId, workspaceId, memberId);
      expect(service.removeMember).toHaveBeenCalledTimes(1);
    });
  });

  describe('leaveWorkspace', () => {
    it('should delegate to workspaceService.leaveWorkspace and return the result', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const expectedResult = { message: 'Bạn đã rời khỏi workspace' };

      mockWorkspaceService.leaveWorkspace.mockResolvedValue(expectedResult);

      const result = await controller.leaveWorkspace(userId, workspaceId);

      expect(result).toEqual(expectedResult);
      expect(service.leaveWorkspace).toHaveBeenCalledWith(userId, workspaceId);
      expect(service.leaveWorkspace).toHaveBeenCalledTimes(1);
    });
  });
});
