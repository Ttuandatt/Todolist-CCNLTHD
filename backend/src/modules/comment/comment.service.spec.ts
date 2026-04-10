import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationService } from '../notification/notification.service';

const mockPrismaService = {
  task: {
    findUnique: jest.fn(),
  },
  comment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  taskAssignment: {
    findMany: jest.fn(),
  },
  workspaceMember: {
    findUnique: jest.fn(),
  },
};

const mockEventsService = {
  emitToTask: jest.fn(),
};

const mockNotificationService = {
  create: jest.fn(),
};

describe('CommentService', () => {
  let service: CommentService;
  let prisma: typeof mockPrismaService;
  let eventsService: typeof mockEventsService;
  let notificationService: typeof mockNotificationService;

  beforeEach(async () => {
    // Reset tất cả mock trước mỗi test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
    eventsService = module.get(EventsService) as typeof mockEventsService;
    notificationService = module.get(
      NotificationService,
    ) as typeof mockNotificationService;
  });

  // ─── Helper functions ──────────────────────────────────────────────
  const mockTaskSuccess = (taskOverrides = {}) => {
    const task = {
      id: 'task-1',
      title: 'Test task',
      createdById: 'creator-1',
      ...taskOverrides,
    };
    mockPrismaService.task.findUnique.mockResolvedValue(task);
    return task;
  };

  const mockCommentSuccess = (overrides = {}) => {
    const comment = {
      id: 'comment-1',
      content: 'Test comment',
      taskId: 'task-1',
      authorId: 'user-1',
      parentId: null,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 'user-1', name: 'Test User', avatar: 'avatar.jpg' },
      replies: [],
      _count: { replies: 0 },
      // Include full task with project for remove() method
      task: {
        id: 'task-1',
        title: 'Test task',
        createdById: 'creator-1',
        project: { workspaceId: 'ws-1' },
      },
      ...overrides,
    };
    return comment;
  };

  // ─── findAll (paginated top-level comments) ──────────────────────────
  describe('findAll', () => {
    it('should return paginated comments with replies', async () => {
      mockTaskSuccess();
      const comment = mockCommentSuccess();
      mockPrismaService.comment.findMany.mockResolvedValue([
        {
          ...comment,
          replies: [],
          _count: { replies: 0 },
        },
      ]);
      mockPrismaService.comment.count.mockResolvedValue(1);

      const result = await service.findAll('task-1', 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task-1' },
      });
      expect(mockPrismaService.comment.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findAll('bad-task-id', 1, 20)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should apply correct pagination (skip/take)', async () => {
      mockTaskSuccess();
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      await service.findAll('task-1', 2, 10);

      // Page 2, Limit 10 → skip = (2-1)*10 = 10
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should return empty array when no comments exist', async () => {
      mockTaskSuccess();
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.comment.count.mockResolvedValue(0);

      const result = await service.findAll('task-1', 1, 20);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  // ─── findOne (get single comment with all replies) ──────────────────
  describe('findOne', () => {
    it('should return comment with replies', async () => {
      const comment = mockCommentSuccess({
        replies: [
          {
            id: 'reply-1',
            content: 'Reply',
            authorId: 'user-2',
            author: { id: 'user-2', name: 'Replier', avatar: null },
          },
        ],
        _count: { replies: 1 },
      });
      mockPrismaService.comment.findUnique.mockResolvedValue(comment);

      const result = await service.findOne('comment-1');

      expect(result.id).toBe('comment-1');
      expect(result.repliesCount).toBe(1);
      expect(result.replies).toHaveLength(1);
      expect(result._count).toBeUndefined();
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-comment-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── create (top-level comment) ────────────────────────────────────
  describe('create', () => {
    it('should create top-level comment successfully', async () => {
      mockTaskSuccess();
      mockPrismaService.taskAssignment.findMany.mockResolvedValue([]);
      const comment = mockCommentSuccess({ content: 'New comment' });
      mockPrismaService.comment.create.mockResolvedValue(comment);

      const result = await service.create('user-1', 'task-1', 'New comment');

      expect(result.id).toBe('comment-1');
      expect(result.content).toBe('New comment');
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: 'New comment',
            taskId: 'task-1',
            authorId: 'user-1',
          }),
        }),
      );
      expect(mockEventsService.emitToTask).toHaveBeenCalledWith(
        'task-1',
        'comment:created',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException when task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(
        service.create('user-1', 'bad-task-id', 'content'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should notify task assignees', async () => {
      mockTaskSuccess();
      mockPrismaService.taskAssignment.findMany.mockResolvedValue([
        { userId: 'user-2' },
        { userId: 'user-3' },
      ]);
      mockPrismaService.comment.create.mockResolvedValue(mockCommentSuccess());
      mockNotificationService.create.mockResolvedValue({});

      await service.create('user-1', 'task-1', 'New comment');

      // Should notify assignees (2 users) + creator (if different)
      expect(mockNotificationService.create).toHaveBeenCalled();
    });

    it('should delegate to reply when parentId provided', async () => {
      // Setup for the reply delegation
      const parentComment = mockCommentSuccess({
        id: 'parent-1',
        authorId: 'user-2',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(
        parentComment,
      );
      mockPrismaService.comment.create.mockResolvedValue(
        mockCommentSuccess({ id: 'reply-1', parentId: 'parent-1' }),
      );

      const replySpy = jest.spyOn(service, 'reply');
      await service.create(
        'user-1',
        'task-1',
        'Reply content',
        'parent-comment-id',
      );

      expect(replySpy).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        'parent-comment-id',
        'Reply content',
      );
      replySpy.mockRestore();
    });
  });

  // ─── reply (nested comment) ────────────────────────────────────────
  describe('reply', () => {
    it('should create reply successfully', async () => {
      const parentComment = mockCommentSuccess({
        authorId: 'user-2',
        id: 'parent-1',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(
        parentComment,
      );
      const reply = mockCommentSuccess({
        id: 'reply-1',
        parentId: 'parent-1',
        authorId: 'user-1',
      });
      mockPrismaService.comment.create.mockResolvedValue(reply);

      const result = await service.reply(
        'user-1',
        'task-1',
        'parent-1',
        'Reply content',
      );

      expect(result.id).toBe('reply-1');
      expect(result.parentId).toBe('parent-1');
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: 'Reply content',
            taskId: 'task-1',
            authorId: 'user-1',
            parentId: 'parent-1',
          }),
        }),
      );
      expect(mockEventsService.emitToTask).toHaveBeenCalledWith(
        'task-1',
        'comment:replied',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException when parent comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.reply('user-1', 'task-1', 'bad-parent-id', 'content'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should notify parent comment author', async () => {
      const parentComment = mockCommentSuccess({
        authorId: 'user-2',
        id: 'parent-1',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(
        parentComment,
      );
      mockPrismaService.comment.create.mockResolvedValue(
        mockCommentSuccess({ id: 'reply-1', parentId: 'parent-1' }),
      );
      mockNotificationService.create.mockResolvedValue({});

      await service.reply('user-1', 'task-1', 'parent-1', 'Reply text');

      // Parent author (user-2) should be notified (different from replier user-1)
      expect(mockNotificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-2',
          actorId: 'user-1',
        }),
      );
    });

    it('should NOT notify parent author if they are the replier', async () => {
      const parentComment = mockCommentSuccess({
        authorId: 'user-1', // Same as replier
        id: 'parent-1',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(
        parentComment,
      );
      mockPrismaService.comment.create.mockResolvedValue(
        mockCommentSuccess({ id: 'reply-1', parentId: 'parent-1' }),
      );

      await service.reply('user-1', 'task-1', 'parent-1', 'Reply text');

      // Should not notify because parent author === replier
      expect(mockNotificationService.create).not.toHaveBeenCalled();
    });
  });

  // ─── update (author only) ──────────────────────────────────────────
  describe('update', () => {
    it('should update comment successfully when user is author', async () => {
      const comment = mockCommentSuccess({ authorId: 'user-1' });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(comment);
      mockPrismaService.comment.update.mockResolvedValue({
        ...comment,
        content: 'Updated content',
        isEdited: true,
      });

      const result = await service.update('user-1', 'comment-1', 'Updated');

      expect(result.content).toBe('Updated content');
      expect(result.isEdited).toBe(true);
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: 'Updated',
            isEdited: true,
          }),
        }),
      );
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const comment = mockCommentSuccess({ authorId: 'user-2' });
      mockPrismaService.comment.findUnique.mockResolvedValue(comment);

      await expect(
        service.update('user-1', 'comment-1', 'Updated'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.update('user-1', 'bad-comment-id', 'Updated'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove (author or admin) ──────────────────────────────────────
  describe('remove', () => {
    it('should delete comment successfully when user is author', async () => {
      const comment = mockCommentSuccess({
        authorId: 'user-1',
        taskId: 'task-1',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(comment);
      mockPrismaService.comment.delete.mockResolvedValue(comment);

      const result = await service.remove('user-1', 'comment-1');

      expect(result.message).toBe('Xóa comment thành công');
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
      });
      expect(mockEventsService.emitToTask).toHaveBeenCalledWith(
        'task-1',
        'comment:deleted',
        expect.any(Object),
      );
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const comment = mockCommentSuccess({
        authorId: 'user-2',
        taskId: 'task-1',
      });
      mockPrismaService.comment.findUnique.mockResolvedValueOnce(comment);
      // Mock findUnique for workspaceMember check (should not find = not admin)
      mockPrismaService.workspaceMember = {
        findUnique: jest.fn().mockResolvedValue(null),
      };

      await expect(service.remove('user-1', 'comment-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.remove('user-1', 'bad-comment-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});