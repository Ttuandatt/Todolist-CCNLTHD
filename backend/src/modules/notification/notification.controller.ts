import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListNotificationsQueryDto } from './dto/list-notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // GET /notifications — Danh sách notification (paginated)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách notification (phân trang)' })
  @ApiResponse({ status: 200, description: 'Danh sách notification' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: ListNotificationsQueryDto,
  ) {
    return this.notificationService.findAll(
      userId,
      query.page ?? 1,
      query.limit ?? 20,
      { isRead: query.isRead, type: query.type },
    );
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  @ApiOperation({ summary: 'Đếm số notification chưa đọc' })
  @ApiResponse({ status: 200, description: 'Số lượng chưa đọc' })
  unreadCount(@CurrentUser('id') userId: string) {
    return this.notificationService.unreadCount(userId);
  }

  // PATCH /notifications/read-all — Đánh dấu tất cả đã đọc
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đánh dấu tất cả notification đã đọc' })
  @ApiResponse({ status: 200, description: 'Đã đánh dấu tất cả đã đọc' })
  markAllRead(@CurrentUser('id') userId: string) {
    return this.notificationService.markAllRead(userId);
  }

  // PATCH /notifications/:id/read — Đánh dấu 1 notification đã đọc
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đánh dấu notification đã đọc' })
  @ApiParam({ name: 'id', type: String, description: 'Notification ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Notification đã được đánh dấu đọc' })
  @ApiResponse({ status: 404, description: 'Notification không tồn tại' })
  markRead(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.markRead(userId, notificationId);
  }

  // DELETE /notifications/:id — Xóa 1 notification
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa notification' })
  @ApiParam({ name: 'id', type: String, description: 'Notification ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Notification không tồn tại' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.remove(userId, notificationId);
  }

  // POST /notifications — Tạo notification (Test / Internal)
  @Post()
  @ApiOperation({ summary: 'Tạo notification (Test)' })
  @ApiResponse({ status: 201, description: 'Notification đã được tạo' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }
}
