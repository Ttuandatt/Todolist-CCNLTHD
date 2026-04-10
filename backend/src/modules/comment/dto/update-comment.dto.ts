import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ type: 'string', description: 'Nội dung mới của comment' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
