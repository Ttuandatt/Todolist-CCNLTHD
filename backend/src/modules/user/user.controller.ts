import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarMulterConfig } from 'src/shared/common/config/multer.config';
import { Max } from 'class-validator';

@Controller('users') // Kết hợp với prefix /api/v1 trong main.ts → URL đầy đủ: /api/v1/users/...
@UseGuards(JwtAuthGuard) // Sử dụng guard để bảo vệ các endpoint, đặt guard ở cấp controller để bảo vệ các endpoint trong controller
export class UserController {
  constructor(private readonly userService: UserService) {} // NestJS inject UserService vào đây. 'readonly' → không thể reassign (tức là không thể thay đổi) sau khi inject.

  // ─── Lấy thông tin hồ sơ người dùng ─────────────────────────────────────────
  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  // ─── Cập nhật thông tin hồ sơ người dùng ─────────────────────────────────────────
  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  // ─── Thay đổi mật khẩu người dùng ─────────────────────────────────────────
  @Patch('me/change-password')
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  // ─── Upload avatar ─────────────────────────────────────────
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig)) // Sử dụng FileInterceptor để xử lý file upload
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5MB
          }),
          // FileTypeValidator bị bỏ vì NestJS v11 không match regex với mimetype đúng cách.
          // multerConfig.fileFilter đã validate mimetype (image/jpeg, image/png, image/gif) trước khi lưu file.
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(userId, file);
  }
}
