// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  USER SERVICE — UNIT TEST                                                   ║
// ║  File: user.service.spec.ts                                                 ║
// ║  Người viết: Đạt (A1–A4)                                                   ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.2.2 — TestingModule + mock DI                                          ║
// ║    8.3.1 — describe/it/beforeEach                                           ║
// ║    8.4.2 — jest.fn(), jest.mock() cho bcrypt và fs                          ║
// ║    8.4.3 — { provide: PrismaService, useValue: mockPrismaService }          ║
// ║    8.5   — Service test pattern (mock DB layer)                             ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK EXTERNAL MODULES
// bcrypt — mock hash/compare giống A1
// fs.promises — mock unlink (xóa file avatar cũ) và writeFile (lưu avatar mới)
// ═══════════════════════════════════════════════════════════════════════════════

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new_hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('fs', () => ({
  promises: {
    unlink: jest.fn().mockResolvedValue(undefined),   // Xóa file thành công
    writeFile: jest.fn().mockResolvedValue(undefined), // Ghi file thành công
  },
  // stat không được dùng trực tiếp nhưng được import → mock rỗng
  stat: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK PrismaService
// UserService dùng: user.findUnique, user.update, refreshToken.updateMany, $transaction
// ═══════════════════════════════════════════════════════════════════════════════

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    updateMany: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation((promises) => Promise.all(promises)),
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('UserService', () => {
  let userService: UserService;

  // profileSelect — đây là các field mà UserService trả về khi query user
  // Dùng để tạo mock data chính xác
  const mockProfile = {
    id: 'user-001',
    email: 'test@gmail.com',
    displayName: 'TestUser',
    avatar: null,
    status: 'ACTIVE',
    bio: 'Hello world',
    emailVerified: false,
    lastLoginAt: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-03-30'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: getProfile()
  // Source: user.service.ts dòng 34-43
  // Flow: findUnique by id → not found? throw 404 → return profile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      // ARRANGE
      mockPrismaService.user.findUnique.mockResolvedValue(mockProfile);

      // ACT
      const result = await userService.getProfile('user-001');

      // ASSERT
      expect(result).toEqual(mockProfile);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        select: expect.objectContaining({ id: true, email: true, displayName: true }),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userService.getProfile('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: updateProfile()
  // Source: user.service.ts dòng 46-60
  // Flow: validate có field → update user → return updated profile
  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateProfile', () => {
    it('should update displayName and return updated profile', async () => {
      const updatedProfile = { ...mockProfile, displayName: 'NewName' };
      mockPrismaService.user.update.mockResolvedValue(updatedProfile);

      const result = await userService.updateProfile('user-001', {
        displayName: 'NewName',
      });

      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        data: { displayName: 'NewName' },
        select: expect.objectContaining({ id: true, email: true }),
      });
    });

    it('should update bio and return updated profile', async () => {
      const updatedProfile = { ...mockProfile, bio: 'New bio' };
      mockPrismaService.user.update.mockResolvedValue(updatedProfile);

      const result = await userService.updateProfile('user-001', { bio: 'New bio' });

      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        data: { bio: 'New bio' },
        select: expect.objectContaining({ id: true }),
      });
    });

    it('should throw BadRequestException if no fields provided', async () => {
      // Cả displayName và bio đều không có → lỗi
      await expect(
        userService.updateProfile('user-001', {}),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: changePassword()
  // Source: user.service.ts dòng 63-98
  // Flow: confirm match → find user → verify current pw → check not same
  //       → hash new pw → $transaction(update pw + revoke tokens)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'OldPass@123',
      newPassword: 'NewPass@456',
      confirmPassword: 'NewPass@456',
    };

    it('should change password successfully', async () => {
      // ARRANGE
      mockPrismaService.user.findUnique.mockResolvedValue({ password: 'old_hashed' });
      // compare gọi 2 lần:
      //   Lần 1: currentPassword vs stored hash → true (đúng password)
      //   Lần 2: newPassword vs stored hash → false (password mới khác password cũ)
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true)   // currentPassword đúng
        .mockResolvedValueOnce(false); // newPassword khác currentPassword
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.refreshToken.updateMany.mockResolvedValue({});

      // ACT
      const result = await userService.changePassword('user-001', changePasswordDto);

      // ASSERT
      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass@456', 10);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      // Transaction revoke tất cả refresh tokens (buộc re-login)
      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-001', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should throw BadRequestException if confirm password does not match', async () => {
      await expect(
        userService.changePassword('user-001', {
          currentPassword: 'OldPass@123',
          newPassword: 'NewPass@456',
          confirmPassword: 'WrongConfirm@789', // Không khớp
        }),
      ).rejects.toThrow(BadRequestException);

      // Không query DB nếu confirm không khớp
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.changePassword('nonexistent', changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if current password is wrong', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ password: 'old_hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password sai

      await expect(
        userService.changePassword('user-001', changePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password same as current', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ password: 'old_hashed' });
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true)  // currentPassword đúng
        .mockResolvedValueOnce(true); // newPassword giống currentPassword → lỗi

      await expect(
        userService.changePassword('user-001', changePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: uploadAvatar()
  // Source: user.service.ts dòng 101-129
  // Flow: validate file → find user → delete old avatar → write new → update DB
  // ═══════════════════════════════════════════════════════════════════════════
  describe('uploadAvatar', () => {
    // Mock Multer file object
    const mockFile = {
      originalname: 'avatar.png',
      filename: 'avatar-1234567890.png',
      buffer: Buffer.from('fake image data'),
    } as Express.Multer.File;

    it('should upload avatar successfully (no previous avatar)', async () => {
      // ARRANGE — user chưa có avatar
      mockPrismaService.user.findUnique.mockResolvedValue({ avatar: null });
      const updatedProfile = { ...mockProfile, avatar: 'new-avatar.png' };
      mockPrismaService.user.update.mockResolvedValue(updatedProfile);

      // ACT
      const result = await userService.uploadAvatar('user-001', mockFile);

      // ASSERT
      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        data: { avatar: 'avatar-1234567890.png' },
        select: expect.objectContaining({ id: true }),
      });
    });

    it('should delete old avatar before uploading new one', async () => {
      // ARRANGE — user đã có avatar cũ
      mockPrismaService.user.findUnique.mockResolvedValue({ avatar: 'old-avatar.png' });
      mockPrismaService.user.update.mockResolvedValue({ ...mockProfile, avatar: 'new.png' });
      const fsPromises = require('fs').promises;

      // ACT
      await userService.uploadAvatar('user-001', mockFile);

      // ASSERT — phải xóa file avatar cũ trước
      expect(fsPromises.unlink).toHaveBeenCalledWith(
        expect.stringContaining('old-avatar.png'),
      );
    });

    it('should throw BadRequestException if no file provided', async () => {
      await expect(
        userService.uploadAvatar('user-001', null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.uploadAvatar('nonexistent', mockFile),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
