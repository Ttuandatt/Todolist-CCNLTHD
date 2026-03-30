// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  AUTH SERVICE — UNIT TEST                                                   ║
// ║  File: auth.service.spec.ts                                                 ║
// ║  Người viết: Đạt (A1–A4)                                                   ║
// ║  Kiến thức Chương 8 áp dụng:                                                ║
// ║    8.1.3 — Testing Pyramid (unit test = nền tảng)                           ║
// ║    8.2.2 — TestingModule + mock DI (tạo module test với dependency giả)     ║
// ║    8.3.1 — describe/it/beforeEach (cấu trúc test)                          ║
// ║    8.4.2 — jest.fn(), mockResolvedValue (hàm mock)                          ║
// ║    8.4.3 — { provide: X, useValue: mockX } (mock DI trong NestJS)          ║
// ║    8.5   — Service test pattern (mock DB layer, test business logic)        ║
// ║    8.7   — Code coverage (npm run test:cov)                                 ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 1: IMPORTS
// Chương 8.2.2 — Cần import Test, TestingModule từ @nestjs/testing
// để tạo môi trường test cho NestJS module
// ═══════════════════════════════════════════════════════════════════════════════

// Test & TestingModule: công cụ tạo module NestJS giả lập cho test
import { Test, TestingModule } from '@nestjs/testing';

// Các Exception class — dùng để kiểm tra service throw đúng loại lỗi
import {
  ConflictException,       // 409 — email đã tồn tại (register)
  UnauthorizedException,   // 401 — sai password, token không hợp lệ
  NotFoundException,       // 404 — không tìm thấy user (forgotPassword)
  BadRequestException,     // 400 — token reset không hợp lệ/hết hạn
} from '@nestjs/common';

// Service cần test + các dependency của nó
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 2: MOCK CÁC MODULE BÊN NGOÀI
// Chương 8.4.2 — jest.mock() để thay thế toàn bộ module bằng phiên bản giả
// bcrypt và crypto là thư viện bên ngoài, ta mock để:
//   - Không phụ thuộc vào thuật toán hash thật (chậm, không deterministic)
//   - Kiểm soát được giá trị trả về trong test
// ═══════════════════════════════════════════════════════════════════════════════

// Mock bcrypt — thay thế hàm hash() và compare() bằng jest.fn()
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),   // hash() luôn trả về 'hashed_password' — ta biết chính xác giá trị để assert
  compare: jest.fn().mockResolvedValue(true),   // compare() mặc định trả về true — test login thành công. Trong test "sai password", ta sẽ override lại thành false
}));

// Mock crypto — thay thế randomBytes() để tạo token reset cố định
jest.mock('crypto', () => ({
  // randomBytes().toString('hex') luôn trả về 'mock_reset_token'
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mock_reset_token'),
  }),
}));

// Import bcrypt SAU khi mock — để lấy bản đã mock, không phải bản gốc
import * as bcrypt from 'bcrypt';

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 3: TẠO MOCK CHO CÁC DEPENDENCY (Service giả)
// Chương 8.4.3 — Mock DI: tạo object có cùng method signature với service thật
// nhưng tất cả method đều là jest.fn() → ta kiểm soát hoàn toàn behavior
//
// QUAN TRỌNG: Chỉ mock những method mà AuthService THỰC SỰ GỌI
// Cách xác định: đọc auth.service.ts, tìm this.prisma.xxx, this.jwtService.xxx,...
// ═══════════════════════════════════════════════════════════════════════════════

// Mock PrismaService — giả lập tất cả Prisma model + method mà AuthService dùng
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),   // this.prisma.user.findUnique() — tìm user theo email (register, login, forgotPassword)
    create: jest.fn(),   // this.prisma.user.create()     — tạo user mới (register)
    update: jest.fn(),   // this.prisma.user.update()     — cập nhật lastLoginAt (login), password (resetPassword)
  },

  refreshToken: {
    findUnique: jest.fn(),   // this.prisma.refreshToken.findUnique() — tìm token (refreshToken)
    create: jest.fn(),   // this.prisma.refreshToken.create()     — lưu token mới (generateTokens)
    update: jest.fn(),   // this.prisma.refreshToken.update()     — revoke token cũ (refreshToken)
    updateMany: jest.fn(),   // this.prisma.refreshToken.updateMany() — revoke tất cả tokens (logout)

  },

  invalidatedToken: { 
    create: jest.fn(),  // this.prisma.invalidatedToken.create() — blacklist access token khi logout
  },

  passwordReset: {
    create: jest.fn(),   // this.prisma.passwordReset.create()     — tạo token reset (forgotPassword)
    findUnique: jest.fn(),   // this.prisma.passwordReset.findUnique() — tìm token (resetPassword)
    update: jest.fn(),   // this.prisma.passwordReset.update()     — đánh dấu đã dùng (resetPassword)
  },

  // Mock: nhận array promises, resolve tất cả
  $transaction: jest.fn().mockImplementation((promises) => Promise.all(promises)),   // this.prisma.$transaction() — chạy nhiều query trong 1 transaction (resetPassword)
};

// Mock JwtService — giả lập tạo và verify JWT token
const mockJwtService = {
  signAsync: jest.fn(),   // signAsync()  — tạo token (generateTokens gọi 2 lần: access + refresh)
  verifyAsync: jest.fn(),   // verifyAsync() — xác thực refresh token signature (refreshToken method)
  decode: jest.fn(),   // decode()      — giải mã token để lấy exp (logout method)
};

// Mock MailService — giả lập gửi email
const mockMailService = {
  // sendPasswordResetEmail() — gửi email reset password (forgotPassword)
  // LƯU Ý: method đúng là sendPasswordResetEmail, KHÔNG PHẢI sendVerificationEmail
  sendPasswordResetEmail: jest.fn(),
};

// Mock ConfigService — giả lập đọc biến môi trường
const mockConfigService = {
  // get() — trả về giá trị config dựa trên key
  // Dùng implementation thay vì mockReturnValue để hỗ trợ nhiều key khác nhau
  get: jest.fn((key: string) => {
    const config = {
      JWT_SECRET: 'test_jwt_secret',
      JWT_EXPIRES_IN: '15m',
      JWT_REFRESH_SECRET: 'test_refresh_secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      FRONTEND_URL: 'http://localhost:3000',
    };
    return config[key];
  }),
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 4: TEST SUITE CHÍNH
// Chương 8.3.1 — describe() nhóm các test liên quan
//               beforeEach() chạy trước MỖI test → đảm bảo test độc lập
// ═══════════════════════════════════════════════════════════════════════════════

describe('AuthService', () => {
  // Khai báo biến dùng chung cho tất cả test trong suite này
  let authService: AuthService;

  // ─────────────────────────────────────────────────────────────────────────────
  // beforeEach — chạy trước MỖI it() block
  // Chương 8.2.2 — Tạo TestingModule với mock dependency injection
  // Chương 8.4.3 — Pattern: { provide: RealService, useValue: mockService }
  //   → NestJS inject mockService mỗi khi AuthService yêu cầu RealService
  // ─────────────────────────────────────────────────────────────────────────────
  beforeEach(async () => {
    // jest.clearAllMocks() — reset tất cả mock về trạng thái ban đầu
    // Đảm bảo test A không ảnh hưởng test B (test isolation)
    jest.clearAllMocks();

    // Re-setup default mock cho bcrypt.compare (vì clearAllMocks đã xóa)
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Re-setup default mock cho JwtService.signAsync
    // generateTokens() gọi signAsync 2 lần → trả mock_access_token và mock_refresh_token
    mockJwtService.signAsync
      .mockResolvedValueOnce('mock_access_token')
      .mockResolvedValueOnce('mock_refresh_token');

    // Tạo NestJS testing module
    // Chương 8.2.2: Test.createTestingModule() tạo module giả lập
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // Service thật — đây là thứ ta đang test
        AuthService,
        // Dependencies giả — thay thế service thật bằng mock object
        // Pattern: { provide: Token, useValue: mockObject }
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
        // LƯU Ý: KHÔNG có NotificationService vì AuthService KHÔNG inject nó
        // (Kiểm tra constructor của auth.service.ts để xác nhận)
      ],
    }).compile();

    // Lấy instance của AuthService từ module test
    // Instance này đã được inject mock dependencies
    authService = module.get<AuthService>(AuthService);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: register()
  // Source: auth.service.ts dòng 36-78
  // Flow: kiểm tra email → hash password → tạo user → generateTokens → trả kết quả
  // ═══════════════════════════════════════════════════════════════════════════
  describe('register', () => {
    // DTO test data — đúng fields của RegisterDto: email, password, fullname, displayName
    const registerDto = {
      email: 'test@gmail.com',
      password: 'Test@123456',
      fullname: 'Nguyen Van Test',
      displayName: 'TestUser',
    };

    // ─── Test 1: Đăng ký thành công ──────────────────────────────────────────
    it('should register a new user successfully', async () => {
      // ARRANGE — Thiết lập mock behavior
      // findUnique trả null → email chưa tồn tại → cho phép đăng ký
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      // create trả về user object — giả lập DB đã tạo user thành công
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-001',
        email: 'test@gmail.com',
        name: 'Nguyen Van Test',
        displayName: 'TestUser',
        avatar: null,
        status: 'ACTIVE',
        password: 'hashed_password',
      });
      // refreshToken.create — generateTokens sẽ lưu refresh token vào DB
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      // ACT — Gọi method cần test
      const result = await authService.register(registerDto);

      // ASSERT — Kiểm tra kết quả + hành vi
      // 1. Kết quả trả về phải có user info + tokens
      expect(result).toEqual({
        user: {
          id: 'user-001',
          email: 'test@gmail.com',
          name: 'Nguyen Van Test',
          avatar: null,
          status: 'ACTIVE',
        },
        tokens: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiresIn: 900,
        },
      });
      // 2. Đã kiểm tra email tồn tại chưa
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@gmail.com' },
      });
      // 3. Đã hash password với bcrypt (salt rounds = 10)
      expect(bcrypt.hash).toHaveBeenCalledWith('Test@123456', 10);
      // 4. Đã tạo user với đúng data (fullname → name, displayName giữ nguyên)
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@gmail.com',
          password: 'hashed_password', // password đã hash, không phải plaintext
          name: 'Nguyen Van Test',     // dto.fullname → name trong DB
          displayName: 'TestUser',
        },
      });
      // 5. Đã tạo tokens (signAsync gọi 2 lần)
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    // ─── Test 2: Email đã tồn tại → ConflictException (409) ─────────────────
    it('should throw ConflictException if email already exists', async () => {
      // ARRANGE — findUnique trả về user → email đã tồn tại
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'test@gmail.com',
      });

      // ACT & ASSERT — Phải throw ConflictException, KHÔNG PHẢI BadRequestException
      // (Xem auth.service.ts dòng 48: throw new ConflictException)
      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      // Không được tạo user khi email đã tồn tại
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: login()
  // Source: auth.service.ts dòng 83-124
  // Flow: tìm user → so sánh password → cập nhật lastLoginAt → generateTokens
  // ═══════════════════════════════════════════════════════════════════════════
  describe('login', () => {
    const loginDto = { email: 'test@gmail.com', password: 'Test@123456' };

    // Mock user object — dùng chung cho các test login
    const mockUser = {
      id: 'user-001',
      email: 'test@gmail.com',
      name: 'Nguyen Van Test',
      avatar: null,
      status: 'ACTIVE',
      password: 'hashed_password',
    };

    // ─── Test 1: Login thành công ────────────────────────────────────────────
    it('should login successfully with correct credentials', async () => {
      // ARRANGE
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      // bcrypt.compare đã mock trả true (default ở beforeEach)
      mockPrismaService.user.update.mockResolvedValue({}); // lastLoginAt
      mockPrismaService.refreshToken.create.mockResolvedValue({});

      // ACT
      const result = await authService.login(loginDto);

      // ASSERT
      expect(result).toEqual({
        user: {
          id: 'user-001',
          email: 'test@gmail.com',
          name: 'Nguyen Van Test',
          avatar: null,
          status: 'ACTIVE',
        },
        tokens: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiresIn: 900,
        },
      });
      // Đã so sánh password
      expect(bcrypt.compare).toHaveBeenCalledWith('Test@123456', 'hashed_password');
      // Đã cập nhật lastLoginAt
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        data: { lastLoginAt: expect.any(Date) }, // expect.any(Date) — chấp nhận bất kỳ Date object nào
      });
    });

    // ─── Test 2: Email không tồn tại → UnauthorizedException ─────────────────
    it('should throw UnauthorizedException if user not found', async () => {
      // ARRANGE — findUnique trả null → user không tồn tại
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      // Không so sánh password nếu user không tồn tại
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    // ─── Test 3: Sai password → UnauthorizedException ────────────────────────
    it('should throw UnauthorizedException if password is wrong', async () => {
      // ARRANGE
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      // Override bcrypt.compare → trả false (password sai)
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // ACT & ASSERT
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      // Không cập nhật lastLoginAt khi password sai
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: refreshToken()
  // Source: auth.service.ts dòng 129-166
  // Flow: tìm token trong DB → verify JWT → revoke token cũ → generateTokens mới
  // ═══════════════════════════════════════════════════════════════════════════
  describe('refreshToken', () => {
    const refreshDto = { refreshToken: 'valid_refresh_token' };

    // Mock stored token — token hợp lệ trong DB
    const mockStoredToken = {
      id: 'token-001',
      token: 'valid_refresh_token',
      userId: 'user-001',
      revokedAt: null,                              // chưa bị revoke
      expiresAt: new Date(Date.now() + 86400000),   // hết hạn sau 1 ngày (còn hợp lệ)
    };

    // ─── Test 1: Refresh thành công ──────────────────────────────────────────
    it('should return new tokens when refresh token is valid', async () => {
      // ARRANGE
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-001' });
      mockPrismaService.refreshToken.update.mockResolvedValue({}); // revoke old
      mockPrismaService.refreshToken.create.mockResolvedValue({}); // save new

      // ACT
      const result = await authService.refreshToken(refreshDto);

      // ASSERT
      expect(result).toEqual({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresIn: 900,
      });
      // Token cũ đã bị revoke
      expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-001' },
        data: { revokedAt: expect.any(Date) },
      });
    });

    // ─── Test 2: Token không tồn tại → UnauthorizedException ─────────────────
    it('should throw UnauthorizedException if token not found', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    // ─── Test 3: Token đã hết hạn → UnauthorizedException ───────────────────
    it('should throw UnauthorizedException if token is expired', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockStoredToken,
        expiresAt: new Date(Date.now() - 86400000), // hết hạn 1 ngày trước
      });

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    // ─── Test 4: Token đã bị revoke → UnauthorizedException ─────────────────
    it('should throw UnauthorizedException if token is revoked', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockStoredToken,
        revokedAt: new Date(), // đã bị revoke
      });

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: logout()
  // Source: auth.service.ts dòng 171-201
  // Flow: revoke tất cả refresh tokens → blacklist access token → trả message
  // ═══════════════════════════════════════════════════════════════════════════
  describe('logout', () => {
    // ─── Test 1: Logout thành công ───────────────────────────────────────────
    it('should revoke all tokens and return success message', async () => {
      // ARRANGE
      mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 2 });
      // decode() trả về payload có exp (Unix timestamp, đơn vị giây)
      mockJwtService.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 900 });
      mockPrismaService.invalidatedToken.create.mockResolvedValue({});

      // ACT
      const result = await authService.logout('user-001', 'some_access_token');

      // ASSERT
      expect(result).toEqual({ message: 'Logout successfully' });
      // Đã revoke tất cả refresh tokens của user
      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-001', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
      // Đã blacklist access token
      expect(mockPrismaService.invalidatedToken.create).toHaveBeenCalledWith({
        data: {
          token: 'some_access_token',
          expiresAt: expect.any(Date),
          reason: 'LOGOUT',
        },
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: forgotPassword()
  // Source: auth.service.ts dòng 206-234
  // Flow: tìm user → tạo reset token (crypto) → lưu DB → gửi email
  // ═══════════════════════════════════════════════════════════════════════════
  describe('forgotPassword', () => {
    const forgotDto = { email: 'test@gmail.com' };

    // ─── Test 1: Gửi email reset thành công ──────────────────────────────────
    it('should create reset token and send email', async () => {
      // ARRANGE
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-001',
        email: 'test@gmail.com',
        name: 'Nguyen Van Test',
      });
      mockPrismaService.passwordReset.create.mockResolvedValue({});
      mockMailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      // ACT
      const result = await authService.forgotPassword(forgotDto);

      // ASSERT
      expect(result).toEqual({ message: 'Reset password email sent' });
      // Đã tạo reset token trong DB
      expect(mockPrismaService.passwordReset.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-001',
          token: 'mock_reset_token', // từ crypto.randomBytes mock
          expiresAt: expect.any(Date),
        },
      });
      // Đã gửi email với đúng tham số
      // sendPasswordResetEmail(email, name, resetLink)
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@gmail.com',
        'Nguyen Van Test',
        expect.stringContaining('mock_reset_token'), // link chứa token
      );
    });

    // ─── Test 2: User không tồn tại → NotFoundException ──────────────────────
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.forgotPassword(forgotDto)).rejects.toThrow(
        NotFoundException,
      );
      // Không tạo token nếu user không tồn tại
      expect(mockPrismaService.passwordReset.create).not.toHaveBeenCalled();
      // Không gửi email
      expect(mockMailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST GROUP: resetPassword()
  // Source: auth.service.ts dòng 239-275
  // Flow: tìm token → validate (tồn tại? hết hạn? đã dùng?)
  //       → hash password mới → $transaction(update password + mark used)
  // ═══════════════════════════════════════════════════════════════════════════
  describe('resetPassword', () => {
    const resetDto = { token: 'valid_reset_token', newPassword: 'NewPass@123' };

    // Mock password reset record hợp lệ
    const mockPasswordReset = {
      id: 'reset-001',
      userId: 'user-001',
      token: 'valid_reset_token',
      usedAt: null,                                // chưa sử dụng
      expiresAt: new Date(Date.now() + 900000),    // còn 15 phút
    };

    // ─── Test 1: Reset password thành công ───────────────────────────────────
    it('should reset password successfully', async () => {
      // ARRANGE
      mockPrismaService.passwordReset.findUnique.mockResolvedValue(mockPasswordReset);
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.passwordReset.update.mockResolvedValue({});

      // ACT
      const result = await authService.resetPassword(resetDto);

      // ASSERT
      expect(result).toEqual({ message: 'Password reset successfully' });
      // Đã hash password mới
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass@123', 10);
      // Đã dùng $transaction để đảm bảo atomic
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      // Trong transaction: cập nhật password
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-001' },
        data: { password: 'hashed_password' },
      });
      // Trong transaction: đánh dấu token đã dùng
      expect(mockPrismaService.passwordReset.update).toHaveBeenCalledWith({
        where: { id: 'reset-001' },
        data: { usedAt: expect.any(Date) },
      });
    });

    // ─── Test 2: Token không tồn tại → BadRequestException ───────────────────
    it('should throw BadRequestException if token not found', async () => {
      mockPrismaService.passwordReset.findUnique.mockResolvedValue(null);

      await expect(authService.resetPassword(resetDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    // ─── Test 3: Token đã hết hạn → BadRequestException ─────────────────────
    it('should throw BadRequestException if token is expired', async () => {
      mockPrismaService.passwordReset.findUnique.mockResolvedValue({
        ...mockPasswordReset,
        expiresAt: new Date(Date.now() - 900000), // hết hạn 15 phút trước
      });

      await expect(authService.resetPassword(resetDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    // ─── Test 4: Token đã được sử dụng → BadRequestException ────────────────
    it('should throw BadRequestException if token already used', async () => {
      mockPrismaService.passwordReset.findUnique.mockResolvedValue({
        ...mockPasswordReset,
        usedAt: new Date(), // đã dùng rồi
      });

      await expect(authService.resetPassword(resetDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
