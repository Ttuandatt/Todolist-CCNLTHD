import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AttachmentService {
  constructor(private prisma: PrismaService) {}

  // ─── UPLOAD ─────────────────────────────────────────────────────────────
  async upload(
    userId: string,
    taskId: string,
    file: Express.Multer.File,
  ) {
    // Kiểm tra task tồn tại + user có quyền
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { select: { workspaceId: true } } },
    });
    if (!task) throw new NotFoundException('Task không tồn tại');

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

    const attachment = await this.prisma.attachment.create({
      data: {
        fileName: file.originalname,
        fileUrl: `/uploads/attachments/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        taskId,
        uploadedById: userId,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, avatar: true } },
      },
    });

    return attachment;
  }

  // ─── LIST ───────────────────────────────────────────────────────────────
  async findAll(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { select: { workspaceId: true } } },
    });
    if (!task) throw new NotFoundException('Task không tồn tại');

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

    return this.prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  // ─── DELETE ─────────────────────────────────────────────────────────────
  async remove(userId: string, attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: {
          include: { project: { select: { workspaceId: true } } },
        },
      },
    });
    if (!attachment) throw new NotFoundException('Attachment không tồn tại');

    // Chỉ uploader hoặc Admin/Owner mới được xóa
    if (attachment.uploadedById !== userId) {
      const membership = await this.prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: attachment.task.project.workspaceId,
            userId,
          },
        },
        select: { role: true },
      });

      const isAdminOrOwner =
        membership?.role === 'ADMIN' || membership?.role === 'OWNER';

      if (!isAdminOrOwner) {
        throw new ForbiddenException('Bạn không có quyền xóa attachment này');
      }
    }

    // Xóa file vật lý
    try {
      const filePath = join(process.cwd(), attachment.fileUrl);
      await unlink(filePath);
    } catch {
      // File không tồn tại trên disk — vẫn xóa record
    }

    await this.prisma.attachment.delete({ where: { id: attachmentId } });

    return { message: 'Xóa attachment thành công' };
  }
}
