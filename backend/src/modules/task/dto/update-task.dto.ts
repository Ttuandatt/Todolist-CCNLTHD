import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatus, {
    message: 'Status không hợp lệ. Chấp nhận: TODO, IN_PROGRESS, REVIEW, DONE',
  })
  @IsOptional()
  status?: TaskStatus;

  @IsNumber({}, { message: 'Giờ thực tế phải là số' })
  @Min(0, { message: 'Giờ thực tế phải >= 0' })
  @IsOptional()
  actualHours?: number;
}
