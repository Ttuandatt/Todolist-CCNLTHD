import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';

/** Các trường select cho author — dùng chung toàn service */
const AUTHOR_SELECT = { id: true, name: true, avatar: true } as const;

/** Số replies inline tối đa khi list comments */
const MAX_INLINE_REPLIES = 3;

/** Regex phát hiện @mention — hỗ trợ username chứa chữ, số, dấu chấm, gạch ngang */
const MENTION_REGEX = /@([\w.\-]+)/g;

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private notificationService: NotificationService,
  ) {}

  // ─── LIST (paginated top-level comments + limited replies) ──────────────
  async findAll(taskId: string, page: number, limit: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task không tồn tại');

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { taskId, parentId: null },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          author: { select: AUTHOR_SELECT },
          replies: {
            orderBy: { createdAt: 'desc' },
            take: MAX_INLINE_REPLIES,
            include: {
              author: { select: AUTHOR_SELECT },
            },
          },
          _count: { select: { replies: true } },
        },
      }),
      this.prisma.comment.count({ where: { taskId, parentId: null } }),
    ]);

    // Đảo ngược replies lại (desc → asc) để UI hiển thị đúng thứ tự
    // nhưng take: 3 từ desc sẽ lấy 3 replies mới nhất
    const formattedData = data.map((comment) => ({
      ...comment,
      repliesCount: comment._count.replies,
      replies: [...comment.replies].reverse(),
      _count: undefined,
    }));

    return { data: formattedData, total, page, limit };
  }

  // ─── GET ONE ────────────────────────────────────────────────────────────
  async findOne(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: { select: AUTHOR_SELECT },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: AUTHOR_SELECT } },
        },
        _count: { select: { replies: true } },
      },
    });

    if (!comment) throw new NotFoundException('Comment không tồn tại');

    return {
      ...comment,
      repliesCount: comment._count.replies,
      _count: undefined,
    };
  }

  // ─── CREATE (top-level hoặc reply nếu có parentId) ─────────────────────
  async create(
    userId: string,
    taskId: string,
    content: string,
    parentId?: string,
  ) {
    // Nếu có parentId → delegate sang logic reply
    if (parentId) {
      return this.reply(userId, taskId, parentId, content);
    }

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task không tồn tại');

    const comment = await this.prisma.comment.create({
      data: { content, taskId, authorId: userId },
      include: { author: { select: AUTHOR_SELECT } },
    });

    this.eventsService.emitToTask(taskId, 'comment:created', comment);

    // Notify task assignees + creator (exclude author)
    const assignments = await this.prisma.taskAssignment.findMany({
      where: { taskId },
      select: { userId: true },
    });
    const recipients = new Set<string>(assignments.map((a) => a.userId));
    if (task.createdById) recipients.add(task.createdById);
    recipients.delete(userId);

    const notifPromises: Promise<any>[] = [];
    for (const to of recipients) {
      notifPromises.push(
        this.notificationService.create({
          type: NotificationType.COMMENT_ADDED,
          title: `New comment on task "${task.title}"`,
          message: content,
          userId: to,
          actorId: userId,
          referenceId: comment.id,
          referenceType: 'Comment',
        }),
      );
    }
    await Promise.all(notifPromises);

    // Mention detection
    await this.extractAndNotifyMentions(content, taskId, userId, comment.id);

    return comment;
  }

  // ─── REPLY (nested) ──────────────────────────────────────────────────────
  async reply(
    userId: string,
    taskId: string,
    parentId: string,
    content: string,
  ) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment)
      throw new NotFoundException('Comment cha không tồn tại');

    const reply = await this.prisma.comment.create({
      data: { content, taskId, authorId: userId, parentId },
      include: { author: { select: AUTHOR_SELECT } },
    });

    this.eventsService.emitToTask(taskId, 'comment:replied', reply);

    // Notify parent comment author (if different)
    if (parentComment.authorId && parentComment.authorId !== userId) {
      await this.notificationService.create({
        type: NotificationType.COMMENT_REPLY,
        title: `Reply to your comment`,
        message: content,
        userId: parentComment.authorId,
        actorId: userId,
        referenceId: reply.id,
        referenceType: 'Comment',
      });
    }

    // Mention detection
    await this.extractAndNotifyMentions(content, taskId, userId, reply.id);

    return reply;
  }

  // ─── UPDATE (author only) ────────────────────────────────────────────────
  async update(userId: string, commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comment không tồn tại');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Chỉ tác giả mới có thể sửa comment');

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content, isEdited: true },
      include: { author: { select: AUTHOR_SELECT } },
    });

    this.eventsService.emitToTask(comment.taskId, 'comment:updated', updated);

    // Detect new mentions in updated content
    await this.extractAndNotifyMentions(
      content,
      comment.taskId,
      userId,
      commentId,
    );

    return updated;
  }

  // ─── DELETE (author OR workspace Admin/Owner) ────────────────────────────
  async remove(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            project: { select: { workspaceId: true } },
          },
        },
      },
    });
    if (!comment) throw new NotFoundException('Comment không tồn tại');

    const workspaceId = comment.task.project.workspaceId;

    // Check permission: author OR Admin/Owner
    if (comment.authorId !== userId) {
      const membership = await this.prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
        select: { role: true },
      });

      const isAdminOrOwner =
        membership?.role === 'ADMIN' || membership?.role === 'OWNER';

      if (!isAdminOrOwner) {
        throw new ForbiddenException(
          'Bạn không có quyền xóa comment này',
        );
      }
    }

    await this.prisma.comment.delete({ where: { id: commentId } });

    this.eventsService.emitToTask(comment.taskId, 'comment:deleted', {
      commentId,
    });

    return { message: 'Xóa comment thành công' };
  }

  // ─── PRIVATE: mention detection ──────────────────────────────────────────
  private async extractAndNotifyMentions(
    content: string,
    taskId: string,
    authorId: string,
    commentId: string,
  ) {
    const matches = [...content.matchAll(MENTION_REGEX)];
    if (!matches.length) return;

    const usernames = [...new Set(matches.map((m) => m[1]))];

    // Lookup users by name or displayName matching mentioned usernames
    const mentionedUsers = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { in: usernames } },
          { displayName: { in: usernames } },
        ],
        NOT: { id: authorId },
      },
      select: { id: true },
    });

    const notifPromises = mentionedUsers.map((u) =>
      this.notificationService.create({
        type: NotificationType.MENTIONED,
        title: 'Bạn được nhắc đến trong một comment',
        message: content,
        userId: u.id,
        actorId: authorId,
        referenceId: commentId,
        referenceType: 'Comment',
      }),
    );

    await Promise.all(notifPromises);
  }
}
