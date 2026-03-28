import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

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
      include: { actor: { select: { id: true, name: true, avatar: true } } },
    });

    this.eventsService.emitToUser(data.userId, 'notification:new', notification);
    return notification;
  }
}
