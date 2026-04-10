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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // GET /tasks/:taskId/comments?page=1&limit=20
  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Lấy danh sách comment của task (có phân trang)' })
  @ApiParam({ name: 'taskId', type: String, description: 'Task ID (UUID)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách comment với pagination' })
  @ApiResponse({ status: 404, description: 'Task không tồn tại' })
  findAll(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Query() query: ListCommentsQueryDto,
  ) {
    return this.commentService.findAll(
      taskId,
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  // GET /comments/:id
  @Get('comments/:id')
  @ApiOperation({ summary: 'Lấy chi tiết một comment' })
  @ApiParam({ name: 'id', type: String, description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Chi tiết comment' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  findOne(@Param('id', ParseUUIDPipe) commentId: string) {
    return this.commentService.findOne(commentId);
  }

  // POST /tasks/:taskId/comments  (hỗ trợ cả top-level và reply qua parentId)
  @Post('tasks/:taskId/comments')
  @ApiOperation({
    summary: 'Tạo comment cho task (hoặc reply nếu có parentId)',
  })
  @ApiParam({ name: 'taskId', type: String, description: 'Task ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Comment đã được tạo' })
  @ApiResponse({ status: 404, description: 'Task hoặc parent comment không tồn tại' })
  create(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(
      userId,
      taskId,
      dto.content,
      dto.parentId,
    );
  }

  // POST /tasks/:taskId/comments/:parentId/reply  (backward compat)
  @Post('tasks/:taskId/comments/:parentId/reply')
  @ApiOperation({ summary: 'Reply comment trong task (endpoint cũ)' })
  @ApiParam({ name: 'taskId', type: String, description: 'Task ID (UUID)' })
  @ApiParam({ name: 'parentId', type: String, description: 'Parent comment ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Reply đã được tạo' })
  @ApiResponse({ status: 404, description: 'Parent comment không tồn tại' })
  reply(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('parentId', ParseUUIDPipe) parentId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.reply(userId, taskId, parentId, dto.content);
  }

  // PATCH /comments/:id  (chỉ author)
  @Patch('comments/:id')
  @ApiOperation({ summary: 'Sửa comment (chỉ tác giả)' })
  @ApiParam({ name: 'id', type: String, description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Comment đã được cập nhật (isEdited=true)' })
  @ApiResponse({ status: 403, description: 'Chỉ tác giả mới có thể sửa' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, commentId, dto.content);
  }

  // DELETE /comments/:id  (author hoặc Admin/Owner)
  @Delete('comments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa comment (tác giả hoặc Admin/Owner)' })
  @ApiParam({ name: 'id', type: String, description: 'Comment ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Xóa comment thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentService.remove(userId, commentId);
  }
}
