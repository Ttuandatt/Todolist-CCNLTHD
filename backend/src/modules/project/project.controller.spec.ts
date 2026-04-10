import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';

// 1. CHUẨN BỊ MOCK: Tạo một object giả (mock) thay thế hoàn toàn ProjectService thật
// Tại sao? Vì trong Unit Test của Controller, ta không cần biết Service tính toán ra sao, 
// ta chỉ cần biết Controller có nhận đúng data từ request và có truyền đúng cho Service không.
const mockProjectService = {
  create: jest.fn(),
  findAllByWorkspace: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  archive: jest.fn(),
  unarchive: jest.fn(),
  pin: jest.fn(),
  unpin: jest.fn(),
};

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  // 2. SETUP: beforeEach sẽ tự động chạy trước MỖI hàm `it` (test case)
  beforeEach(async () => {
    // Tạo một NestJS Module "giả" dành riêng cho việc test
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController], // Muốn test ProjectController
      providers: [
        {
          provide: ProjectService, // Bất cứ khi nào Controller cần ProjectService...
          useValue: mockProjectService, // ...thì hãy đưa cho nó mockProjectService (hàng giả)
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);

    // Rất quan trọng: Xóa lịch sử gọi hàm của các thủ thuật mock trước khi bắt đầu test mới
    jest.clearAllMocks();
  });

  // 3. VIẾT TEST CASE: Bắt đầu test hàm create
  describe('create', () => {
    it('should delegate to projectService.create and return the result', async () => {
      // BƯỚC A: Arrange (Chuẩn bị)
      const userId = 'user-uuid-123';
      const workspaceId = 'ws-uuid-456';
      const dto: CreateProjectDto = { name: 'Dự án A' };
      
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId };
      // Ép hàm tạo giả phải trả về dữ liệu expectedResult
      mockProjectService.create.mockResolvedValue(expectedResult);

      // BƯỚC B: Act (Hành động)
      // Giả lập như user gọi api POST và hàm controller chạy
      const result = await controller.create(userId, workspaceId, dto);

      // BƯỚC C: Assert (Kiểm chứng)
      // 1. Controller phải trả về chính xác cái mà Service đã trả cho nó
      expect(result).toEqual(expectedResult);
      
      // 2. Controller phải BẮT BUỘC gọi service.create() đúng số tham số như thế
      expect(service.create).toHaveBeenCalledWith(userId, workspaceId, dto);
      
      // 3. API rút cục chỉ nên gọi hàm 1 lần thôi (chống spam)
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  // Bài tập nhỏ cho bạn: Dựa vào hàm create ở trên, bạn hãy thử viết cho findAll
  describe('findAll', () => {
    it('should delegate to projectService.findAllByWorkspace', async () => {
      const userId = 'user-1';
      const workspaceId = 'ws-1';
      const query: QueryProjectDto = {};
      
      mockProjectService.findAllByWorkspace.mockResolvedValue([]); // Trả về array rỗng

      const result = await controller.findAll(userId, workspaceId, query);

      expect(result).toEqual([]);
      expect(service.findAllByWorkspace).toHaveBeenCalledWith(userId, workspaceId, query);
    });
  });

  // (Tiếp tục copy đoạn code tương tự và đổi tên cho: findOne, update, remove, archive, unarchive, pin, unpin)
  describe('findOne', () => {
    it('should delegate to projectService.findOne and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.findOne.mockResolvedValue(expectedResult);
      const result = await controller.findOne(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(userId, id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should delegate to projectService.update and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const dto: UpdateProjectDto = { name: 'Dự án A' };
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.update.mockResolvedValue(expectedResult);
      const result = await controller.update(userId, id, dto);
      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(userId, id, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  }); 

  describe('remove', () => {
    it('should delegate to projectService.remove and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.remove.mockResolvedValue(expectedResult);
      const result = await controller.remove(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(userId, id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('archive', () => {
    it('should delegate to projectService.archive and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.archive.mockResolvedValue(expectedResult);
      const result = await controller.archive(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.archive).toHaveBeenCalledWith(userId, id);
      expect(service.archive).toHaveBeenCalledTimes(1);
    });
  });

  describe('unarchive', () => {
    it('should delegate to projectService.unarchive and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.unarchive.mockResolvedValue(expectedResult);
      const result = await controller.unarchive(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.unarchive).toHaveBeenCalledWith(userId, id);
      expect(service.unarchive).toHaveBeenCalledTimes(1);
    });
  });

  describe('pin', () => {
    it('should delegate to projectService.pin and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.pin.mockResolvedValue(expectedResult);
      const result = await controller.pin(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.pin).toHaveBeenCalledWith(userId, id);
      expect(service.pin).toHaveBeenCalledTimes(1);
    });
  });

  describe('unpin', () => {
    it('should delegate to projectService.unpin and return the result', async () => {
      const userId = 'user-1';
      const id = 'project-1';
      const expectedResult = { id: 'project-1', name: 'Dự án A', workspaceId: 'ws-1' };
      
      mockProjectService.unpin.mockResolvedValue(expectedResult);
      const result = await controller.unpin(userId, id);
      expect(result).toEqual(expectedResult);
      expect(service.unpin).toHaveBeenCalledWith(userId, id);
      expect(service.unpin).toHaveBeenCalledTimes(1);
    });
  }); 

});
