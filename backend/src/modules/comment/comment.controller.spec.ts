import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

const mockCommentService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  reply: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CommentController', () => {
  let controller: CommentController;
  let service: typeof mockCommentService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get(CommentService) as typeof mockCommentService;
  });

  // ─── findAll endpoint ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should call commentService.findAll with correct params', async () => {
      const expected = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      };
      mockCommentService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll('task-1', {
        page: 1,
        limit: 20,
      });

      expect(result).toEqual(expected);
      expect(mockCommentService.findAll).toHaveBeenCalledWith(
        'task-1',
        1,
        20,
      );
      expect(mockCommentService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should use default page and limit when not provided', async () => {
      mockCommentService.findAll.mockResolvedValue({ data: [], total: 0 });

      await controller.findAll('task-1', {});

      expect(mockCommentService.findAll).toHaveBeenCalledWith(
        'task-1',
        1, // default page
        20, // default limit
      );
    });
  });

  // ─── findOne endpoint ─────────────────────────────────────────────
  describe('findOne', () => {
    it('should call commentService.findOne with commentId', async () => {
      const expected = {
        id: 'comment-1',
        content: 'Test comment',
        author: { id: 'user-1', name: 'User', avatar: null },
        replies: [],
        repliesCount: 0,
      };
      mockCommentService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('comment-1');

      expect(result).toEqual(expected);
      expect(mockCommentService.findOne).toHaveBeenCalledWith('comment-1');
      expect(mockCommentService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  // ─── create endpoint (top-level) ────────────────────────────────
  describe('create', () => {
    it('should call commentService.create with correct params (top-level)', async () => {
      const expected = { id: 'comment-1', content: 'New comment' };
      mockCommentService.create.mockResolvedValue(expected);

      const result = await controller.create('user-1', 'task-1', {
        content: 'New comment',
      });

      expect(result).toEqual(expected);
      expect(mockCommentService.create).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        'New comment',
        undefined, // no parentId
      );
    });

    it('should pass parentId when provided (reply)', async () => {
      mockCommentService.create.mockResolvedValue({});

      await controller.create('user-1', 'task-1', {
        content: 'Reply',
        parentId: 'parent-1',
      });

      expect(mockCommentService.create).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        'Reply',
        'parent-1',
      );
    });
  });

  // ─── reply endpoint (backward compat) ───────────────────────────
  describe('reply', () => {
    it('should call commentService.reply with correct params', async () => {
      const expected = { id: 'reply-1', parentId: 'parent-1' };
      mockCommentService.reply.mockResolvedValue(expected);

      const result = await controller.reply('user-1', 'task-1', 'parent-1', {
        content: 'Reply text',
      });

      expect(result).toEqual(expected);
      expect(mockCommentService.reply).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        'parent-1',
        'Reply text',
      );
      expect(mockCommentService.reply).toHaveBeenCalledTimes(1);
    });
  });

  // ─── update endpoint ───────────────────────────────────────────────
  describe('update', () => {
    it('should call commentService.update with userId, commentId, and content', async () => {
      const expected = { id: 'comment-1', content: 'Updated', isEdited: true };
      mockCommentService.update.mockResolvedValue(expected);

      const result = await controller.update('user-1', 'comment-1', {
        content: 'Updated',
      });

      expect(result).toEqual(expected);
      expect(mockCommentService.update).toHaveBeenCalledWith(
        'user-1',
        'comment-1',
        'Updated',
      );
      expect(mockCommentService.update).toHaveBeenCalledTimes(1);
    });
  });

  // ─── remove endpoint ───────────────────────────────────────────────
  describe('remove', () => {
    it('should call commentService.remove with userId and commentId', async () => {
      const expected = { id: 'comment-1', content: 'Deleted' };
      mockCommentService.remove.mockResolvedValue(expected);

      const result = await controller.remove('user-1', 'comment-1');

      expect(result).toEqual(expected);
      expect(mockCommentService.remove).toHaveBeenCalledWith(
        'user-1',
        'comment-1',
      );
      expect(mockCommentService.remove).toHaveBeenCalledTimes(1);
    });
  });
});