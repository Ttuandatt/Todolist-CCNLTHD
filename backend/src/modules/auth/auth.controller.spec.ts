// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  AUTH CONTROLLER — UNIT TEST                                                ║
// ║  File: auth.controller.spec.ts                                              ║
// ║  Người viết: Đạt (A1–A4)                                                   ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.2.2 — TestingModule + mock DI                                          ║
// ║    8.3.1 — describe/it/beforeEach                                           ║
// ║    8.4.2 — jest.fn(), mockResolvedValue                                     ║
// ║    8.4.3 — { provide: AuthService, useValue: mockAuthService }              ║
// ║    8.6.1 — Controller test pattern (mock service, verify delegation)        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 1: IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 2: MOCK AuthService
// Chương 8.6.1 — Controller test: mock SERVICE layer, kiểm tra controller
//   chỉ đóng vai trò "cầu nối" giữa HTTP request và service.
//   Controller KHÔNG chứa business logic → test chỉ cần verify delegation.
//
// So sánh với Service test (A1):
//   - Service test: mock DB layer (PrismaService) → test business logic
//   - Controller test: mock Service layer (AuthService) → test delegation + HTTP concerns
// ═══════════════════════════════════════════════════════════════════════════════

const mockAuthService = {
  register: jest.fn(),        // POST /auth/register
  login: jest.fn(),           // POST /auth/login
  refreshToken: jest.fn(),    // POST /auth/refresh
  logout: jest.fn(),          // POST /auth/logout
  forgotPassword: jest.fn(),  // POST /auth/forgot-password
  resetPassword: jest.fn(),   // POST /auth/reset-password
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 3: TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('AuthController', () => {
  let controller: AuthController;

  // ─── beforeEach: tạo module test mới trước mỗi test case ─────────────────
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],   // Đăng ký controller thật
      providers: [
        // Thay AuthService thật bằng mock
        // Khi controller gọi this.authService.xxx() → gọi vào mockAuthService.xxx()
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: register()
  // Controller nhận @Body() dto → gọi authService.register(dto) → trả kết quả
  // ═══════════════════════════════════════════════════════════════════════════
  describe('register', () => {
    it('should call authService.register and return result', async () => {
      // ARRANGE
      const dto = {
        email: 'test@gmail.com',
        password: 'Test@123456',
        fullname: 'Nguyen Van Test',
        displayName: 'TestUser',
      };
      const expectedResult = {
        user: { id: 'user-001', email: 'test@gmail.com', name: 'Nguyen Van Test' },
        tokens: { accessToken: 'at', refreshToken: 'rt', expiresIn: 900 },
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.register(dto as any);

      // ASSERT
      // 1. Controller trả về đúng kết quả từ service
      expect(result).toEqual(expectedResult);
      // 2. Service được gọi đúng 1 lần với đúng DTO
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: login()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('login', () => {
    it('should call authService.login and return result', async () => {
      // ARRANGE
      const dto = { email: 'test@gmail.com', password: 'Test@123456' };
      const expectedResult = {
        user: { id: 'user-001', email: 'test@gmail.com' },
        tokens: { accessToken: 'at', refreshToken: 'rt', expiresIn: 900 },
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.login(dto as any);

      // ASSERT
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: refreshToken()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('refreshToken', () => {
    it('should call authService.refreshToken and return result', async () => {
      // ARRANGE
      const dto = { refreshToken: 'valid_refresh_token' };
      const expectedResult = { accessToken: 'new_at', refreshToken: 'new_rt', expiresIn: 900 };
      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.refreshToken(dto as any);

      // ASSERT
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: logout()
  // Đây là method DUY NHẤT có logic trong controller:
  //   - Nhận @CurrentUser('id') userId và @Headers('authorization') auth
  //   - Strip "Bearer " prefix khỏi auth header để lấy raw token
  //   - Gọi authService.logout(userId, accessToken)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('logout', () => {
    // ─── Test 1: Logout với Bearer token đầy đủ ─────────────────────────────
    it('should strip Bearer prefix and call authService.logout', async () => {
      // ARRANGE
      const userId = 'user-001';
      const authHeader = 'Bearer eyJhbGciOiJIUzI1NiJ9.test.signature';
      mockAuthService.logout.mockResolvedValue({ message: 'Logout successfully' });

      // ACT — gọi controller.logout trực tiếp, truyền tham số như NestJS sẽ làm
      const result = await controller.logout(userId, authHeader);

      // ASSERT
      expect(result).toEqual({ message: 'Logout successfully' });
      // Controller phải strip "Bearer " và truyền raw token cho service
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        'user-001',
        'eyJhbGciOiJIUzI1NiJ9.test.signature', // Không còn "Bearer " prefix
      );
    });

    // ─── Test 2: Logout khi không có Authorization header ────────────────────
    it('should handle undefined authorization header', async () => {
      // ARRANGE — auth header là undefined (trường hợp edge case)
      mockAuthService.logout.mockResolvedValue({ message: 'Logout successfully' });

      // ACT
      const result = await controller.logout('user-001', undefined as any);

      // ASSERT
      expect(result).toEqual({ message: 'Logout successfully' });
      // auth?.replace('Bearer ', '') → undefined khi auth là undefined
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-001', undefined);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: forgotPassword()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('forgotPassword', () => {
    it('should call authService.forgotPassword and return result', async () => {
      // ARRANGE
      const dto = { email: 'test@gmail.com' };
      const expectedResult = { message: 'Reset password email sent' };
      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.forgotPassword(dto as any);

      // ASSERT
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledTimes(1);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST: resetPassword()
  // ═══════════════════════════════════════════════════════════════════════════
  describe('resetPassword', () => {
    it('should call authService.resetPassword and return result', async () => {
      // ARRANGE
      const dto = { token: 'valid_token', newPassword: 'NewPass@123' };
      const expectedResult = { message: 'Password reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(expectedResult);

      // ACT
      const result = await controller.resetPassword(dto as any);

      // ASSERT
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.resetPassword).toHaveBeenCalledTimes(1);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
    });
  });
});
