import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private notificationService: NotificationService,
  ) {}

  async create(userId: string, taskId: string, content: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) throw new NotFoundException('Task không tồn tại');

    const comment = await this.prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: userId,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    this.eventsService.emitToTask(taskId, 'comment:created', comment);

    // Create notifications for task assignees and task creator (exclude author)
    const assignments = await this.prisma.taskAssignment.findMany({ where: { taskId }, select: { userId: true } });
    const recipients = new Set<string>(assignments.map(a => a.userId));
    if (task.createdById) recipients.add(task.createdById);
    recipients.delete(userId);

    const notifPromises: Promise<any>[] = [];
    for (const to of recipients) {
      notifPromises.push(
        this.notificationService.create({
          type: NotificationType.COMMENT_ADDED,
          title: `New comment on task ${task.title}`,
          message: content,
          userId: to,
          actorId: userId,
          referenceId: comment.id,
          referenceType: 'Comment',
        }),
      );
    }
    await Promise.all(notifPromises);

    return comment;
  }

  async reply(userId: string, taskId: string, parentId: string, content: string) {
    const parentComment = await this.prisma.comment.findUnique({ where: { id: parentId } });
    if (!parentComment) throw new NotFoundException('Comment cha không tồn tại');

    const reply = await this.prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: userId,
        parentId,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    this.eventsService.emitToTask(taskId, 'comment:replied', reply);

    // Notify parent comment author (if different)
    if (parentComment.authorId && parentComment.authorId !== userId) {
      await this.notificationService.create({
        type: NotificationType.COMMENT_REPLY,
        title: `Reply to your comment on task ${taskId}`,
        message: content,
        userId: parentComment.authorId,
        actorId: userId,
        referenceId: reply.id,
        referenceType: 'Comment',
      });
    }

    return reply;
  }
}
