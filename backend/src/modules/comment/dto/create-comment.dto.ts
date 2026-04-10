import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: 'string', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Parent comment ID (nếu là reply)',
    example: 'uuid-of-parent-comment',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
