import { Controller, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Tạo comment cho task' })
  create(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(userId, taskId, dto.content);
  }

  @Post('tasks/:taskId/comments/:parentId/reply')
  @ApiOperation({ summary: 'Reply comment trong task' })
  reply(
    @CurrentUser('id') userId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('parentId', ParseUUIDPipe) parentId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.reply(userId, taskId, parentId, dto.content);
  }
}
