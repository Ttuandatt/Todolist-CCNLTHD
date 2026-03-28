/**
 * PrismaService - Database Connection Service
 *
 * Service này đóng vai trò là cầu nối giữa NestJS và PostgreSQL database.
 * Sử dụng Prisma 7 với pg driver adapter.
 */
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    // Tạo connection pool với pg
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Tạo Prisma adapter từ pool
    const adapter = new PrismaPg(pool);

    // Khởi tạo PrismaClient với adapter
    super({ adapter });

    this.pool = pool;
  }

  /**
   * onModuleInit - Kết nối database khi module khởi tạo
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  /**
   * onModuleDestroy - Đóng kết nối khi app shutdown
   */
  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('🔌 Database disconnected');
  }
}

/*
❓ Câu hỏi 1: Tại sao phải extends PrismaClient?
==> Khi PrismaService extends PrismaClient, service kế thừa tất cả methods của PrismaClient:

// Có extends → dùng trực tiếp this.user, this.task
class PrismaService extends PrismaClient {
  async getUsers() {
    return this.user.findMany();  // ✅ this chính là PrismaClient
  }
}

// KHÔNG extends → phải tạo instance riêng
class PrismaService {
  private client = new PrismaClient();  // Tạo riêng
  
  async getUsers() {
    return this.client.user.findMany();  // Phải qua this.client
  }
}
Lợi ích của extends:
Code ngắn gọn hơn
Một instance duy nhất
Inject được cả PrismaClient lẫn PrismaService

❓ Câu hỏi 2: Tại sao không gọi $connect() trong constructor?
==> Constructor không nên có async code vì:
// ❌ BAD: Async trong constructor
class PrismaService {
  constructor() {
    await this.$connect();  // LỖI: await không dùng được ở đây!
  }
}

// ✅ GOOD: Async trong lifecycle hook
class PrismaService implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();  // OK: method async bình thường
  }
}
Lý do khác:
Error handling tốt hơn: NestJS có thể catch lỗi và không start app nếu DB lỗi
Thứ tự đúng: NestJS đảm bảo tất cả modules được load trước khi gọi onModuleInit
Graceful shutdown: Có onModuleDestroy để đóng kết nối đúng cách


❓ Câu hỏi 3: Nếu không có exports, điều gì xảy ra?
// Module KHÔNG export
@Module({
  providers: [PrismaService],
  // exports: [PrismaService]  ← Thiếu dòng này!
})
export class PrismaModule {}

// Kết quả:
// AuthModule không thể inject PrismaService
// → AuthModule không thể dùng database
// → App sẽ crash khi khởi động


❓ Câu hỏi 4: Có thể dùng PrismaService ở nhiều module không?
==> CÓ! Vì có @Global()

// PrismaModule.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]  // Phải export!
})
export class PrismaModule {}

// AuthModule có thể dùng trực tiếp
@Module({
  imports: [PrismaModule],  // Không cần import lại PrismaModule!
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

// UsersModule cũng vậy
@Module({
  imports: [PrismaModule],  // Vẫn dùng được!
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

Nếu KHÔNG có @Global():
Phải import PrismaModule vào TỪNG module muốn dùng
Code sẽ rất lặp lại
Khó quản lý


❓ Câu hỏi 5: Có thể dùng PrismaService ở nhiều module không?
==> CÓ! Vì có @Global()

// PrismaModule.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]  // Phải export!
})
export class PrismaModule {}

// AuthModule có thể dùng trực tiếp
@Module({
  imports: [PrismaModule],  // Không cần import lại PrismaModule!
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

// UsersModule cũng vậy
@Module({
  imports: [PrismaModule],  // Vẫn dùng được!
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

Nếu KHÔNG có @Global():
Phải import PrismaModule vào TỪNG module muốn dùng
Code sẽ rất lặp lại
Khó quản lý


❓ Câu hỏi 6: Có thể dùng PrismaService ở nhiều module không?
==> CÓ! Vì có @Global()

// PrismaModule.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]  // Phải export!
})
export class PrismaModule {}

// AuthModule có thể dùng trực tiếp
@Module({
  imports: [PrismaModule],  // Không cần import lại PrismaModule!
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

// UsersModule cũng vậy
@Module({
  imports: [PrismaModule],  // Vẫn dùng được!
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

Nếu KHÔNG có @Global():
Phải import PrismaModule vào TỪNG module muốn dùng
Code sẽ rất lặp lại
Khó quản lý
*/
