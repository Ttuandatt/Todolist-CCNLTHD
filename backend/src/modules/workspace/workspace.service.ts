import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService, private eventsService: EventsService) {}

  // 1. Tạo Workspace mới (Tự động thêm user làm OWNER)
  async create(userId: string, dto: CreateWorkspaceDto) {
    // Dùng transaction để đảm bảo tạo Workspace và Member cùng lúc
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name,
          description: dto.description,
          ownerId: userId, // Set người tạo là owner
        },
      });

      // Tạo record WorkspaceMember với role OWNER
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: userId,
          role: 'OWNER',
        },
      });

      return workspace;
    });
  }

  // 2. Lấy danh sách Workspace của user (chỉ lấy những cái có tham gia)
  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: userId }, // Join qua bảng trung gian
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } }, // Kèm thông tin owner
      },
    });
  }

  // 3. Xóa workspace (Phải là owner mới được xóa)
  async remove(userId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) throw new NotFoundException('Workspace không tồn tại');
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Chỉ Owner mới có quyền xóa workspace này');
    }

    // Prisma tự động cascade delete (xóa members, projects) vì schema đã set onDelete: Cascade
    await this.prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return { message: 'Xóa workspace thành công' };
  }

  // 4. Lấy chi tiết 1 Workspace
  async findOne(userId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        owner: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    if (!workspace) throw new NotFoundException('Workspace không tồn tại');

    // Kiểm tra xem user có phải là thành viên không
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Bạn không có quyền truy cập workspace này');
    }

    return workspace;
  }

  // 5. Cập nhật Workspace
  async update(userId: string, workspaceId: string, dto: UpdateWorkspaceDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) throw new NotFoundException('Workspace không tồn tại');

    // Chỉ Owner hoặc Admin mới được sửa
    const member = workspace.members.find((m) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Owner hoặc Admin mới được sửa workspace');
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: dto,
    });
  }

  // 6. Tạo Link/Token mời thành viên
  async createInvite(userId: string, workspaceId: string, dto: InviteMemberDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) throw new NotFoundException('Workspace không tồn tại');

    const inviter = workspace.members.find((m) => m.userId === userId);
    if (!inviter || (inviter.role !== 'OWNER' && inviter.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Owner hoặc Admin mới được tạo lời mời');
    }

    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await this.prisma.workspaceInvite.create({
      data: {
        workspaceId,
        email: dto.email,
        role: dto.role,
        token,
        invitedByMemberId: inviter.id,
        expiresAt,
      },
    });

    console.log(`[INVITE] Token for ${dto.email} (Role: ${dto.role}): ${token}`);

    return {
      message: 'Đã tạo lời mời thành công',
      inviteToken: token,
      expiresAt,
    };
  }

  // 7. Chấp nhận lời mời (Bằng Token)
  async acceptInvite(userId: string, token: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: { token },
      include: { workspace: true },
    });

    if (!invite) throw new NotFoundException('Token mời không tồn tại hoặc không hợp lệ');
    if (invite.status !== 'PENDING') throw new ForbiddenException('Lời mời này đã được sử dụng hoặc bị hủy');
    if (invite.expiresAt < new Date()) {
      await this.prisma.workspaceInvite.update({ where: { id: invite.id }, data: { status: 'EXPIRED' }});
      throw new ForbiddenException('Lời mời đã hết hạn');
    }

    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (currentUser?.email !== invite.email) {
      throw new ForbiddenException('Email của bạn không khớp với email được mời');
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId: invite.workspaceId, userId: userId },
      },
    });

    if (existingMember) throw new ForbiddenException('Bạn đã là thành viên của workspace này rồi');

    await this.prisma.$transaction([
      this.prisma.workspaceMember.create({
        data: {
          workspaceId: invite.workspaceId,
          userId: userId,
          role: invite.role,
        },
      }),
      this.prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      }),
    ]);

    this.eventsService.emitToWorkspace(invite.workspaceId, 'member:joined', {
      userId,
      workspaceId: invite.workspaceId,
      role: invite.role,
    });

    return { message: 'Đã tham gia workspace thành công', workspaceId: invite.workspaceId };
  }

  // 8. Lấy danh sách thành viên
  async getMembers(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } }
    });
    if (!member) throw new ForbiddenException('Bạn không phải thành viên workspace này');

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { joinedAt: 'asc' }
    });
  }

  // 9. Đổi quyền thành viên (Dùng ChangeRoleDto)
  async changeMemberRole(userId: string, workspaceId: string, targetUserId: string, dto: any) {
    const requester = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } }
    });
    
    if (!requester || requester.role !== 'OWNER') {
      throw new ForbiddenException('Chỉ Owner mới có quyền đổi Role của thành viên khác');
    }

    if (userId === targetUserId) {
      throw new ForbiddenException('Không thể tự đổi quyền của chính mình');
    }

    const targetMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } }
    });

    if (!targetMember) throw new NotFoundException('Thành viên không tồn tại trong workspace');

    return this.prisma.workspaceMember.update({
      where: { id: targetMember.id },
      data: { role: dto.role }
    });
  }

  // 10. Đuổi thành viên
  async removeMember(userId: string, workspaceId: string, targetUserId: string) {
    const requester = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } }
    });
    
    if (!requester || (requester.role !== 'OWNER' && requester.role !== 'ADMIN')) {
      throw new ForbiddenException('Bạn không có quyền đuổi thành viên');
    }

    const targetMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } }
    });

    if (!targetMember) throw new NotFoundException('Thành viên không tồn tại trong workspace');

    if (targetMember.role === 'OWNER') {
      throw new ForbiddenException('Không thể đuổi Owner ra khỏi nhóm');
    }

    if (requester.role === 'ADMIN' && targetMember.role === 'ADMIN') {
      throw new ForbiddenException('Admin không thể đuổi một Admin khác');
    }

    await this.prisma.workspaceMember.delete({ where: { id: targetMember.id } });
    return { message: 'Đã xóa thành viên khỏi workspace' };
  }

  // 11. Tự rời nhóm
  async leaveWorkspace(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } }
    });

    if (!member) throw new NotFoundException('Bạn không nằm trong workspace này');
    if (member.role === 'OWNER') {
      throw new ForbiddenException('Owner không thể tự rời nhóm, hãy xóa nhóm hoặc nhường quyền trước');
    }

    await this.prisma.workspaceMember.delete({ where: { id: member.id } });
    return { message: 'Bạn đã rời khỏi workspace' };
  }
}
