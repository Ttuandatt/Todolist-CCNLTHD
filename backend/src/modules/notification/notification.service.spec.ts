import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationType } from '@prisma/client';

const mockPrismaService = {
  notification: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
};

const mockEventsService = {
  emitToUser: jest.fn(),
};

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: typeof mockPrismaService;
  let eventsService: typeof mockEventsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
    eventsService = module.get(EventsService) as typeof mockEventsService;
  });

  // ─── Helper functions ─────────────────────────────────────────────
  const mockNotification = (overrides = {}) => {
    const notif = {
      id: 'notif-1',
      type: NotificationType.COMMENT_ADDED,
      title: 'New comment',
      message: 'Test message',
      userId: 'user-1',
      actorId: 'actor-1',
      referenceId: 'ref-1',
      referenceType: 'Comment',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      actor: { id: 'actor-1', name: 'Actor', avatar: null },
      ...overrides,
    };
    return notif;
  };

  // ─── create ────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create notification and emit event to user', async () => {
      const notifData = {
        type: NotificationType.COMMENT_ADDED,
        title: 'New comment on task',
        message: 'Comment text',
        userId: 'user-1',
        actorId: 'actor-1',
        referenceId: 'comment-1',
        referenceType: 'Comment',
      };
      const created = mockNotification(notifData);
      mockPrismaService.notification.create.mockResolvedValue(created);

      const result = await service.create(notifData);

      expect(result.id).toBe('notif-1');
      expect(result.type).toBe(NotificationType.COMMENT_ADDED);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: notifData,
        include: { actor: { select: { id: true, name: true, avatar: true } } },
      });
      // Verify event emission
      expect(mockEventsService.emitToUser).toHaveBeenCalledWith(
        'user-1',
        'notification:new',
        created,
      );
    });

    it('should emit to correct userId with event name notification:new', async () => {
      const notifData = {
        type: NotificationType.TASK_ASSIGNED,
        title: 'Task assigned',
        userId: 'user-2',
        actorId: 'actor-1',
      };
      mockPrismaService.notification.create.mockResolvedValue(
        mockNotification(notifData),
      );

      await service.create(notifData);

      expect(mockEventsService.emitToUser).toHaveBeenCalledWith(
        'user-2',
        'notification:new',
        expect.objectContaining(notifData),
      );
    });

    it('should handle optional fields (message, actorId, referenceId)', async () => {
      const notifData = {
        type: NotificationType.WORKSPACE_INVITED,
        title: 'You are invited',
        userId: 'user-1',
        // message, actorId, referenceId are optional
      };
      mockPrismaService.notification.create.mockResolvedValue(
        mockNotification(notifData),
      );

      const result = await service.create(notifData);

      expect(result).toBeDefined();
      expect(mockPrismaService.notification.create).toHaveBeenCalled();
    });
  });

  // ─── findAll (paginated with filters) ──────────────────────────────
  describe('findAll', () => {
    it('should return paginated notifications', async () => {
      const notif = mockNotification();
      mockPrismaService.notification.findMany.mockResolvedValue([notif]);
      mockPrismaService.notification.count.mockResolvedValue(1);

      const result = await service.findAll('user-1', 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should apply correct pagination', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count.mockResolvedValue(50);

      await service.findAll('user-1', 2, 10);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (2-1)*10
          take: 10,
        }),
      );
    });

    it('should filter by isRead=true', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count.mockResolvedValue(0);

      await service.findAll('user-1', 1, 20, { isRead: true });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', isRead: true }),
        }),
      );
    });

    it('should filter by specific notification type', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count.mockResolvedValue(0);

      await service.findAll('user-1', 1, 20, {
        type: NotificationType.COMMENT_ADDED,
      });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
            type: NotificationType.COMMENT_ADDED,
          }),
        }),
      );
    });

    it('should return empty array when no notifications exist', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.findAll('user-1', 1, 20);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  // ─── markRead (mark single notification as read) ────────────────
  describe('markRead', () => {
    it('should mark notification as read', async () => {
      const notif = mockNotification({ isRead: false });
      mockPrismaService.notification.findUnique.mockResolvedValueOnce(notif);
      const updated = mockNotification({ ...notif, isRead: true });
      mockPrismaService.notification.update.mockResolvedValue(updated);

      const result = await service.markRead('user-1', 'notif-1');

      expect(result.isRead).toBe(true);
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { isRead: true },
        include: { actor: { select: { id: true, name: true, avatar: true } } },
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(
        service.markRead('user-1', 'bad-notif-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not own notification', async () => {
      const notif = mockNotification({ userId: 'user-2' });
      mockPrismaService.notification.findUnique.mockResolvedValue(notif);

      await expect(
        service.markRead('user-1', 'notif-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── markAllRead (mark all unread as read) ────────────────────────
  describe('markAllRead', () => {
    it('should mark all unread notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({
        count: 5,
      });

      const result = await service.markAllRead('user-1');

      expect(result.message).toBe('Đã đánh dấu tất cả đã đọc');
      expect(result.count).toBe(5);
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        data: { isRead: true },
      });
    });

    it('should return count=0 when no unread notifications', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.markAllRead('user-1');

      expect(result.count).toBe(0);
    });
  });

  // ─── unreadCount ───────────────────────────────────────────────────
  describe('unreadCount', () => {
    it('should return number of unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(7);

      const result = await service.unreadCount('user-1');

      expect(result.unreadCount).toBe(7);
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
    });

    it('should return 0 when all notifications are read', async () => {
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.unreadCount('user-1');

      expect(result.unreadCount).toBe(0);
    });
  });

  // ─── remove (delete notification) ──────────────────────────────────
  describe('remove', () => {
    it('should delete notification successfully', async () => {
      const notif = mockNotification({ userId: 'user-1' });
      mockPrismaService.notification.findUnique.mockResolvedValueOnce(notif);
      mockPrismaService.notification.delete.mockResolvedValue(notif);

      const result = await service.remove('user-1', 'notif-1');

      expect(result.message).toBe('Xóa notification thành công');
      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('user-1', 'bad-notif-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user does not own notification', async () => {
      const notif = mockNotification({ userId: 'user-2' });
      mockPrismaService.notification.findUnique.mockResolvedValue(notif);

      await expect(
        service.remove('user-1', 'notif-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});