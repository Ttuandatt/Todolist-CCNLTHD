// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  USER CONTROLLER — UNIT TEST                                                ║
// ║  File: user.controller.spec.ts                                              ║
// ║  Người viết: Đạt (A1–A4)                                                   ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.2.2 — TestingModule + mock DI                                          ║
// ║    8.4.3 — { provide: UserService, useValue: mockUserService }              ║
// ║    8.6.1 — Controller test pattern (mock service, verify delegation)        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK UserService — tương tự A2 (mock AuthService), chỉ mock 4 method
// ═══════════════════════════════════════════════════════════════════════════════

const mockUserService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
  uploadAvatar: jest.fn(),
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('UserController', () => {
  let controller: UserController;

  const mockProfile = {
    id: 'user-001',
    email: 'test@gmail.com',
    displayName: 'TestUser',
    avatar: null,
    status: 'ACTIVE',
    bio: 'Hello',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: getProfile()
  // Controller: nhận userId từ @CurrentUser('id') → gọi userService.getProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProfile', () => {
    it('should call userService.getProfile and return result', async () => {
      mockUserService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile('user-001');

      expect(result).toEqual(mockProfile);
      expect(mockUserService.getProfile).toHaveBeenCalledTimes(1);
      expect(mockUserService.getProfile).toHaveBeenCalledWith('user-001');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: updateProfile()
  // Controller: nhận userId + @Body() dto → gọi userService.updateProfile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateProfile', () => {
    it('should call userService.updateProfile and return result', async () => {
      const dto = { displayName: 'NewName', bio: 'New bio' };
      const updatedProfile = { ...mockProfile, ...dto };
      mockUserService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile('user-001', dto);

      expect(result).toEqual(updatedProfile);
      expect(mockUserService.updateProfile).toHaveBeenCalledTimes(1);
      expect(mockUserService.updateProfile).toHaveBeenCalledWith('user-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: changePassword()
  // Controller: nhận userId + @Body() dto → gọi userService.changePassword
  // ═══════════════════════════════════════════════════════════════════════════
  describe('changePassword', () => {
    it('should call userService.changePassword and return result', async () => {
      const dto = {
        currentPassword: 'OldPass@123',
        newPassword: 'NewPass@456',
        confirmPassword: 'NewPass@456',
      };
      mockUserService.changePassword.mockResolvedValue({
        message: 'Password changed successfully',
      });

      const result = await controller.changePassword('user-001', dto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockUserService.changePassword).toHaveBeenCalledTimes(1);
      expect(mockUserService.changePassword).toHaveBeenCalledWith('user-001', dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: uploadAvatar()
  // Controller: nhận userId + @UploadedFile() file → gọi userService.uploadAvatar
  // LƯU Ý: ParseFilePipe + MaxFileSizeValidator chạy ở tầng NestJS framework
  //   → không test ở unit test level. Chỉ test delegation.
  // ═══════════════════════════════════════════════════════════════════════════
  describe('uploadAvatar', () => {
    it('should call userService.uploadAvatar and return result', async () => {
      const mockFile = {
        originalname: 'avatar.png',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;
      const updatedProfile = { ...mockProfile, avatar: 'new-avatar.png' };
      mockUserService.uploadAvatar.mockResolvedValue(updatedProfile);

      const result = await controller.uploadAvatar('user-001', mockFile);

      expect(result).toEqual(updatedProfile);
      expect(mockUserService.uploadAvatar).toHaveBeenCalledTimes(1);
      expect(mockUserService.uploadAvatar).toHaveBeenCalledWith('user-001', mockFile);
    });
  });
});
