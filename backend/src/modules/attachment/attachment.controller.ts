import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';
import { attachmentMulterConfig } from '../../shared/common/config/attachment-multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Attachment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  // POST /tasks/:taskId/attachments
  @Post('tasks/:taskId/attachments')
  @UseInterceptors(FileInterceptor('file', attachmentMulterConfig))
  @ApiOperation({ summary: 'Upload file đính kèm cho task (max 10MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'taskId', type: String, description: 'Task ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'File đính kèm (max 10MB)' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Upload thành công' })
  @ApiResponse({ status: 400, description: 'Không có file hoặc file quá lớn' })
  @ApiResponse({ status: 404, description: 'Task không tồn tại' })
  upload(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File là bắt buộc');
    }
    return this.attachmentService.upload(userId, taskId, file);
  }

  // GET /tasks/:taskId/attachments
  @Get('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Lấy danh sách file đính kèm của task' })
  @ApiParam({ name: 'taskId', type: String, description: 'Task ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Danh sách attachment' })
  @ApiResponse({ status: 404, description: 'Task không tồn tại' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.attachmentService.findAll(userId, taskId);
  }

  // DELETE /attachments/:id
  @Delete('attachments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa attachment (uploader hoặc Admin/Owner)' })
  @ApiParam({ name: 'id', type: String, description: 'Attachment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  @ApiResponse({ status: 404, description: 'Attachment không tồn tại' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) attachmentId: string,
  ) {
    return this.attachmentService.remove(userId, attachmentId);
  }
}
