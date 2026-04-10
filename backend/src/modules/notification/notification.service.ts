import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationType } from '@prisma/client';

const ACTOR_SELECT = { id: true, name: true, avatar: true } as const;

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────
  async create(data: {
    type: NotificationType;
    title: string;
    message?: string;
    userId: string;
    actorId?: string;
    referenceId?: string;
    referenceType?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data,
      include: { actor: { select: ACTOR_SELECT } },
    });

    this.eventsService.emitToUser(data.userId, 'notification:new', notification);
    return notification;
  }

  // ─── LIST (paginated) ──────────────────────────────────────────────────
  async findAll(
    userId: string,
    page: number,
    limit: number,
    filters?: { isRead?: boolean; type?: NotificationType },
  ) {
    const where: any = { userId };

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }
    if (filters?.type) {
      where.type = filters.type;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { actor: { select: ACTOR_SELECT } },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── MARK ONE AS READ ──────────────────────────────────────────────────
  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification không tồn tại');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification không tồn tại');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
      include: { actor: { select: ACTOR_SELECT } },
    });

    return updated;
  }

  // ─── MARK ALL AS READ ─────────────────────────────────────────────────
  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'Đã đánh dấu tất cả đã đọc', count: result.count };
  }

  // ─── UNREAD COUNT ─────────────────────────────────────────────────────
  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { unreadCount: count };
  }

  // ─── DELETE NOTIFICATION ──────────────────────────────────────────────
  async remove(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification không tồn tại');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification không tồn tại');
    }

    await this.prisma.notification.delete({ where: { id: notificationId } });

    return { message: 'Xóa notification thành công' };
  }
}
