import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: 'string', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string; 

}
