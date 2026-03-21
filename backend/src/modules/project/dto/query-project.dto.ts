import { IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class QueryProjectDto {
  @IsEnum(ProjectStatus, { message: 'Status không hợp lệ. Chấp nhận: ACTIVE, ARCHIVED' })
  @IsOptional()
  status?: ProjectStatus;
}
