import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'; // Import MulterModule để xử lý file upload

import { avatarMulterConfig } from 'src/shared/common/config/multer.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MulterModule.register(avatarMulterConfig)], // MulterModule.register(): đăng ký Multer với config vào DI container của module này.
  // Nhờ đây, FileInterceptor trong UserController mới biết dùng config nào.
  // Nếu không có dòng này → FileInterceptor không có config → có thể báo lỗi hoặc dùng config mặc định (không an toàn).
  controllers: [UserController], // UserController được inject vào module này
  providers: [UserService], // UserService được inject vào module này
  exports: [UserService], // UserService được export ra module khác có thể inject vào
})
export class UserModule {} // Export module này
