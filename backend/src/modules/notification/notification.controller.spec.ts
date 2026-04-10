import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationType } from '@prisma/client';

const mockNotificationService = {
  findAll: jest.fn(),
  unreadCount: jest.fn(),
  markAllRead: jest.fn(),
  markRead: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
};

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: typeof mockNotificationService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get(
      NotificationService,
    ) as typeof mockNotificationService;
  });

  // ─── findAll endpoint ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should call notificationService.findAll with correct params', async () => {
      const expected = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
      mockNotificationService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll('user-1', {
        page: 1,
        limit: 20,
      });

      expect(result).toEqual(expected);
      expect(mockNotificationService.findAll).toHaveBeenCalledWith(
        'user-1',
        1,
        20,
        { isRead: undefined, type: undefined },
      );
    });

    it('should use default page and limit when not provided', async () => {
      mockNotificationService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });

      await controller.findAll('user-1', {});

      expect(mockNotificationService.findAll).toHaveBeenCalledWith(
        'user-1',
        1,
        20,
        expect.any(Object),
      );
    });

    it('should pass filter options when provided', async () => {
      mockNotificationService.findAll.mockResolvedValue({
        data: [],
        total: 0,
      });

      await controller.findAll('user-1', {
        page: 1,
        limit: 10,
        isRead: true,
        type: NotificationType.COMMENT_ADDED,
      });

      expect(mockNotificationService.findAll).toHaveBeenCalledWith(
        'user-1',
        1,
        10,
        { isRead: true, type: NotificationType.COMMENT_ADDED },
      );
    });
  });

  // ─── unreadCount endpoint ──────────────────────────────────────────
  describe('unreadCount', () => {
    it('should call notificationService.unreadCount with userId', async () => {
      const expected = { unreadCount: 5 };
      mockNotificationService.unreadCount.mockResolvedValue(expected);

      const result = await controller.unreadCount('user-1');

      expect(result).toEqual(expected);
      expect(mockNotificationService.unreadCount).toHaveBeenCalledWith(
        'user-1',
      );
      expect(mockNotificationService.unreadCount).toHaveBeenCalledTimes(1);
    });

    it('should return 0 when no unread notifications', async () => {
      mockNotificationService.unreadCount.mockResolvedValue({
        unreadCount: 0,
      });

      const result = await controller.unreadCount('user-1');

      expect(result.unreadCount).toBe(0);
    });
  });

  // ─── markAllRead endpoint ─────────────────────────────────────────
  describe('markAllRead', () => {
    it('should call notificationService.markAllRead with userId', async () => {
      const expected = {
        message: 'Đã đánh dấu tất cả đã đọc',
        count: 3,
      };
      mockNotificationService.markAllRead.mockResolvedValue(expected);

      const result = await controller.markAllRead('user-1');

      expect(result).toEqual(expected);
      expect(mockNotificationService.markAllRead).toHaveBeenCalledWith(
        'user-1',
      );
      expect(mockNotificationService.markAllRead).toHaveBeenCalledTimes(1);
    });

    it('should return count=0 when no unread notifications', async () => {
      mockNotificationService.markAllRead.mockResolvedValue({
        message: 'Đã đánh dấu tất cả đã đọc',
        count: 0,
      });

      const result = await controller.markAllRead('user-1');

      expect(result.count).toBe(0);
    });
  });

  // ─── markRead endpoint ────────────────────────────────────────────
  describe('markRead', () => {
    it('should call notificationService.markRead with userId and notificationId', async () => {
      const expected = {
        id: 'notif-1',
        isRead: true,
        title: 'Test',
      };
      mockNotificationService.markRead.mockResolvedValue(expected);

      const result = await controller.markRead('user-1', 'notif-1');

      expect(result).toEqual(expected);
      expect(mockNotificationService.markRead).toHaveBeenCalledWith(
        'user-1',
        'notif-1',
      );
      expect(mockNotificationService.markRead).toHaveBeenCalledTimes(1);
    });
  });

  // ─── remove endpoint ───────────────────────────────────────────────
  describe('remove', () => {
    it('should call notificationService.remove with userId and notificationId', async () => {
      const expected = { message: 'Xóa notification thành công' };
      mockNotificationService.remove.mockResolvedValue(expected);

      const result = await controller.remove('user-1', 'notif-1');

      expect(result).toEqual(expected);
      expect(mockNotificationService.remove).toHaveBeenCalledWith(
        'user-1',
        'notif-1',
      );
      expect(mockNotificationService.remove).toHaveBeenCalledTimes(1);
    });
  });
});