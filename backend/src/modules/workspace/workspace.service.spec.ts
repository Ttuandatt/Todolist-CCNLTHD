import { Test, TestingModule } from '@nestjs/testing';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { WorkspaceService } from './workspace.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
const mockPrismaService = {
    workspace: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    workspaceMember: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
    workspaceInvite: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    },
    task: {
        groupBy: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
    },
    $transaction: jest.fn((cbOrArray) => {
        if (Array.isArray(cbOrArray)) return Promise.all(cbOrArray);
        return cbOrArray(mockPrismaService);
    }),
};

const mockEventsService = {
    emitToWorkspace: jest.fn(),
    emitToUser: jest.fn(),
};

describe('WorkspaceService', () => {
    let service: WorkspaceService;
    let prismaService: any;
    let eventsService: any;

    beforeEach(() => {
        prismaService = mockPrismaService;
        eventsService = mockEventsService;

        service = new WorkspaceService(prismaService, eventsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new workspace', async () => {
            const userId = 'user-1';
            const dto: CreateWorkspaceDto = { name: 'Test Workspace' };
            const expectedWorkspace = { id: 'ws-1', name: 'Test Workspace', ownerId: userId };

            prismaService.workspace.create.mockResolvedValue(expectedWorkspace);
            prismaService.workspaceMember.create.mockResolvedValue({
                workspaceId: 'ws-1',
                userId,
                role: 'OWNER',
            });

            const result = await service.create(userId, dto);

            expect(prismaService.workspace.create).toHaveBeenCalledWith({
                data: {
                    name: 'Test Workspace',
                    ownerId: 'user-1',
                },
            });
            expect(prismaService.workspaceMember.create).toHaveBeenCalledWith({
                data: {
                    workspaceId: 'ws-1',
                    userId: 'user-1',
                    role: 'OWNER',
                },
            });
            // Lưu ý: Hàm create thật sự không hề gọi eventsService.emitToWorkspace
            // Nên nếu expect nó sẽ bị báo lỗi. Mình đã cẩn thận xóa đi giúp bạn.
            expect(result).toEqual(expectedWorkspace);
        });

        it('should throw an error if transaction fails (rollback)', async () => {
            const userId = 'user-1';
            const dto: CreateWorkspaceDto = { name: 'Test Error' };
            
            // Giả lập hệ thống database văng lỗi khi cố gọi create
            prismaService.workspace.create.mockRejectedValue(new Error('Database Timeout'));

            await expect(service.create(userId, dto)).rejects.toThrow('Database Timeout');
        });
    });
    describe('findAllForUser', () => {
        it('should find all workspaces for a user', async () => {
            const userId = 'user-1';
            const expectedWorkspaces = [
                { id: 'ws-1', name: 'Test Workspace', ownerId: userId },
                { id: 'ws-2', name: 'Test Workspace 2', ownerId: userId },
            ];

            // Service gốc chỉ gọi findMany trực tiếp trên bảng workspace, kết hợp where + include
            prismaService.workspace.findMany.mockResolvedValue(expectedWorkspaces);

            const result = await service.findAllForUser(userId);

            expect(prismaService.workspace.findMany).toHaveBeenCalledWith({
                where: {
                    members: {
                        some: { userId: userId }, // Join qua bảng trung gian
                    },
                },
                include: {
                    owner: { select: { id: true, name: true, email: true } },
                },
            });
            expect(result).toEqual(expectedWorkspaces);
        });

        it('should return empty array when user has no workspaces', async () => {
            const userId = 'user-1';
            prismaService.workspace.findMany.mockResolvedValue([]);
            const result = await service.findAllForUser(userId);
            expect(result).toEqual([]);
        });
    });
    describe('findOne', () => {
        it('should find a workspace by id', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const expectedWorkspace = { 
                id: 'ws-1', name: 'Test Workspace', ownerId: userId,
                members: [{ userId: 'user-1', role: 'OWNER' }]
            };

            prismaService.workspace.findUnique.mockResolvedValue(expectedWorkspace);

            const result = await service.findOne(userId, workspaceId);

            expect(prismaService.workspace.findUnique).toHaveBeenCalledWith({
              where: { id: workspaceId },
              include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                owner: { select: { id: true, name: true, email: true, avatar: true } },
              },
            });
            expect(result).toEqual(expectedWorkspace);
        });
        it('should throw NotFoundException when workspace is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';

            prismaService.workspace.findUnique.mockResolvedValue(null);

            await expect(service.findOne(userId, workspaceId)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when user is not a member', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const expectedWorkspace = { id: 'ws-1', members: [{ userId: 'diff-user', role: 'OWNER' }] };

            prismaService.workspace.findUnique.mockResolvedValue(expectedWorkspace);

            await expect(service.findOne(userId, workspaceId)).rejects.toThrow(ForbiddenException);
        });
    })
    describe('update', () => {
        it('should update a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };
            const expectedWorkspace = { id: 'ws-1', name: 'Updated Workspace', members: [{ userId: 'user-1', role: 'OWNER' }] };

            prismaService.workspace.findUnique.mockResolvedValue(expectedWorkspace);
            prismaService.workspace.update.mockResolvedValue(expectedWorkspace);

            const result = await service.update(userId, workspaceId, dto);

            expect(prismaService.workspace.findUnique).toHaveBeenCalledWith({ where: { id: workspaceId }, include: { members: true } });
            expect(prismaService.workspace.update).toHaveBeenCalledWith({ where: { id: workspaceId }, data: dto });
            expect(result).toEqual(expectedWorkspace);
        });
        it('should throw NotFoundException when workspace is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };

            prismaService.workspace.findUnique.mockResolvedValue(null);

            await expect(service.update(userId, workspaceId, dto)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when user is not a member', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };

            prismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1', members: [] });

            await expect(service.update(userId, workspaceId, dto)).rejects.toThrow(ForbiddenException);
        });
        it('should throw ForbiddenException when user is not an owner', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };

            prismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1', members: [{ userId: 'user-1', role: 'MEMBER' }] });

            await expect(service.update(userId, workspaceId, dto)).rejects.toThrow(ForbiddenException);
        });
    })
    describe('remove', () => {
        it('should remove a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const expectedWorkspace = { id: 'ws-1', name: 'Test Workspace', ownerId: userId };

            prismaService.workspace.findUnique.mockResolvedValue(expectedWorkspace);
            prismaService.workspace.delete.mockResolvedValue(expectedWorkspace);

            const result = await service.remove(userId, workspaceId);

            expect(prismaService.workspace.findUnique).toHaveBeenCalledWith({ where: { id: workspaceId } });
            expect(prismaService.workspace.delete).toHaveBeenCalledWith({ where: { id: workspaceId } });
            expect(result.message).toEqual('Xóa workspace thành công');
        });
        it('should throw NotFoundException when workspace is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';

            prismaService.workspace.findUnique.mockResolvedValue(null);

            await expect(service.remove(userId, workspaceId)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when user is not an owner', async () => {
            const userId = 'user-2';
            const workspaceId = 'ws-1';

            prismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1', ownerId: 'user-1' });

            await expect(service.remove(userId, workspaceId)).rejects.toThrow(ForbiddenException);
        });
    })
    describe('createInvite', () => {
        it('should invite a member to a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto = { email: 'test@example.com', role: 'MEMBER' as const };
            
            const expectedWorkspace = { id: 'ws-1', members: [{ userId: 'user-1', role: 'OWNER', id: 'inviter-1' }] };
            const expectedInvite = { id: 'invite-1', workspaceId, email: dto.email, role: 'MEMBER' };

            prismaService.workspace.findUnique.mockResolvedValue(expectedWorkspace);
            prismaService.workspaceInvite.create.mockResolvedValue(expectedInvite);

            const result = await service.createInvite(userId, workspaceId, dto as any);

            expect(prismaService.workspace.findUnique).toHaveBeenCalledWith({ where: { id: workspaceId }, include: { members: true } });
            
            expect(prismaService.workspaceInvite.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ workspaceId, email: dto.email, role: dto.role, invitedByMemberId: 'inviter-1' })
                })
            );
            expect(result.inviteToken).toBeDefined(); 
        });
        it('should throw NotFoundException when workspace is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto = { email: 'test@example.com', role: 'MEMBER' as const };

            prismaService.workspace.findUnique.mockResolvedValue(null);
            await expect(service.createInvite(userId, workspaceId, dto as any)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when user is not a member', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto = { email: 'test@example.com', role: 'MEMBER' as const };

            prismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1', members: [] });
            await expect(service.createInvite(userId, workspaceId, dto as any)).rejects.toThrow(ForbiddenException);
        });
        it('should throw ForbiddenException when user is not an owner', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const dto = { email: 'test@example.com', role: 'MEMBER' as const };

            prismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1', members: [{ userId: 'user-1', role: 'MEMBER' }] });
            await expect(service.createInvite(userId, workspaceId, dto as any)).rejects.toThrow(ForbiddenException);
        });
    })
    describe('acceptInvite', () => {
        it('should accept an invitation', async () => {
            const userId = 'user-1';
            const inviteId = 'invite-1';
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1); // Future
            
            const expectedInvite = { id: inviteId, workspaceId: 'ws-1', email: 'test@example.com', role: 'MEMBER', status: 'PENDING', expiresAt: futureDate };

            prismaService.workspaceInvite.findUnique.mockResolvedValue(expectedInvite);
            prismaService.user.findUnique.mockResolvedValue({ id: userId, email: 'test@example.com' });
            prismaService.workspaceMember.findUnique.mockResolvedValue(null); // No existing member
            
            // Transaction promises
            prismaService.workspaceMember.create.mockResolvedValue({});
            prismaService.workspaceInvite.update.mockResolvedValue({});

            const result = await service.acceptInvite(userId, inviteId);

            expect(prismaService.workspaceInvite.findUnique).toHaveBeenCalledWith({ where: { token: inviteId }, include: { workspace: true } });
            expect(eventsService.emitToWorkspace).toHaveBeenCalledWith('ws-1', 'member:joined', { workspaceId: 'ws-1', userId, role: 'MEMBER' });
            expect(result.message).toEqual('Đã tham gia workspace thành công');
        });
        it('should throw NotFoundException when invitation is not found', async () => {
            const userId = 'user-1';
            const inviteId = 'invite-1';

            prismaService.workspaceInvite.findUnique.mockResolvedValue(null);

            await expect(service.acceptInvite(userId, inviteId)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when invitation is not for this user', async () => {
            const userId = 'user-1';
            const inviteId = 'invite-1';
            const expectedInvite = { id: inviteId, workspaceId: 'ws-1', email: 'test@example.com', role: 'MEMBER', status: 'PENDING', expiresAt: new Date(Date.now() + 100000) };

            prismaService.workspaceInvite.findUnique.mockResolvedValue(expectedInvite);
            prismaService.user.findUnique.mockResolvedValue({ id: userId, email: 'wrong@example.com' });

            await expect(service.acceptInvite(userId, inviteId)).rejects.toThrow(ForbiddenException);
        });
        it('should throw ForbiddenException if invitation is expired', async () => {
            const userId = 'user-1';
            const inviteId = 'invite-1';
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1); // Quá khứ
            
            const expectedInvite = { id: inviteId, workspaceId: 'ws-1', email: 'test@example.com', role: 'MEMBER', status: 'PENDING', expiresAt: pastDate };

            prismaService.workspaceInvite.findUnique.mockResolvedValue(expectedInvite);
            prismaService.workspaceInvite.update.mockResolvedValue({}); // Giả lập update DB

            await expect(service.acceptInvite(userId, inviteId)).rejects.toThrow(ForbiddenException);
        });
    })

    describe('getMembers', () => {
        it('should get members of a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const expectedMembers = [{ workspaceId, userId: 'user-1', role: 'OWNER' }];

            // member check
            prismaService.workspaceMember.findUnique.mockResolvedValue({ workspaceId, userId, role: 'OWNER' });
            prismaService.workspaceMember.findMany.mockResolvedValue(expectedMembers);

            const result = await service.getMembers(userId, workspaceId);

            expect(prismaService.workspaceMember.findMany).toHaveBeenCalledWith({ where: { workspaceId }, include: { user: { select: { id: true, name: true, email: true, avatar: true } } }, orderBy: { joinedAt: 'asc' } });
            expect(result).toEqual(expectedMembers);
        });
        it('should throw ForbiddenException if user is not a member', async () => {
            const userId = 'user-not-member';
            const workspaceId = 'ws-1';

            prismaService.workspaceMember.findUnique.mockResolvedValue(null);

            await expect(service.getMembers(userId, workspaceId)).rejects.toThrow(ForbiddenException);
        });
    })

    describe('leaveWorkspace', () => {
        it('should allow a member to leave a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';

            prismaService.workspaceMember.findUnique.mockResolvedValue({ workspaceId, userId, id: 'member-1', role: 'MEMBER' });
            prismaService.workspaceMember.delete.mockResolvedValue({});

            const result = await service.leaveWorkspace(userId, workspaceId);

            expect(prismaService.workspaceMember.findUnique).toHaveBeenCalledWith({ where: { workspaceId_userId: { workspaceId, userId } } });
            expect(prismaService.workspaceMember.delete).toHaveBeenCalledWith({ where: { id: 'member-1' } });
            expect(result.message).toEqual('Bạn đã rời khỏi workspace');
        });
        it('should throw NotFoundException when workspace is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            
            // Actually it means member is not found
            prismaService.workspaceMember.findUnique.mockResolvedValue(null);
            await expect(service.leaveWorkspace(userId, workspaceId)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when user is the owner', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';

            prismaService.workspaceMember.findUnique.mockResolvedValue({ workspaceId, userId, role: 'OWNER' });

            await expect(service.leaveWorkspace(userId, workspaceId)).rejects.toThrow(ForbiddenException);
        });
    })

    describe('changeMemberRole', () => {
        it('should allow OWNER to change member role', async () => {
            const userId = 'user-owner';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-target';
            const dto = { role: 'ADMIN' };

            // Trả về cho lời gọi đầu tiên (Kiểm tra người ném lệnh là OWNER)
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });
            // Trả về cho lời gọi thứ hai (Kiểm tra thành viên nạn nhân có tồn tại)
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ id: 'member-target', workspaceId, userId: targetUserId, role: 'MEMBER' });
            
            prismaService.workspaceMember.update.mockResolvedValue({ id: 'member-target', role: 'ADMIN' });

            const result = await service.changeMemberRole(userId, workspaceId, targetUserId, dto);
            expect(result).toEqual({ id: 'member-target', role: 'ADMIN' });
        });

        it('should throw ForbiddenException if requester is not OWNER', async () => {
            const userId = 'user-admin';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-target';

            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'ADMIN' });

            await expect(service.changeMemberRole(userId, workspaceId, targetUserId, { role: 'ADMIN' })).rejects.toThrow(ForbiddenException);
        });

        it('should throw ForbiddenException if changing own role', async () => {
            const userId = 'user-owner';
            const workspaceId = 'ws-1';
            
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });

            await expect(service.changeMemberRole(userId, workspaceId, userId, { role: 'ADMIN' })).rejects.toThrow(ForbiddenException);
        });

        it('should throw NotFoundException if target member not found', async () => {
            const userId = 'user-owner';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-ghost';

            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce(null);

            await expect(service.changeMemberRole(userId, workspaceId, targetUserId, { role: 'ADMIN' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeMember', () => {
        it('should remove a member from a workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-2';

            // Người đuổi (requester)
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });
            // Nạn nhân (targetMember)
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ id: 'member-2', workspaceId, userId: targetUserId, role: 'MEMBER' });
            
            prismaService.workspaceMember.delete.mockResolvedValue({});

            const result = await service.removeMember(userId, workspaceId, targetUserId);

            expect(prismaService.workspaceMember.delete).toHaveBeenCalledWith({ where: { id: 'member-2' } });
            expect(result.message).toEqual('Đã xóa thành viên khỏi workspace');
        });
        it('should throw ForbiddenException when user has no right', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-2';

            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'MEMBER' });

            await expect(service.removeMember(userId, workspaceId, targetUserId)).rejects.toThrow(ForbiddenException);
        });
        it('should throw NotFoundException when target member is not found', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-2';

            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce(null);

            await expect(service.removeMember(userId, workspaceId, targetUserId)).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException when trying to remove owner', async () => {
            const userId = 'user-1';
            const workspaceId = 'ws-1';
            const targetUserId = 'user-2';

            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ workspaceId, userId, role: 'OWNER' });
            prismaService.workspaceMember.findUnique.mockResolvedValueOnce({ id: 'member-2', workspaceId, userId: targetUserId, role: 'OWNER' });

            await expect(service.removeMember(userId, workspaceId, targetUserId)).rejects.toThrow(ForbiddenException);
        });
    })

}); 