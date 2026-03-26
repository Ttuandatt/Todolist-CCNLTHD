import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(TaskStatus, {
    message: 'Status không hợp lệ. Chấp nhận: TODO, IN_PROGRESS, REVIEW, DONE',
  })
  @IsNotEmpty({ message: 'Status không được để trống' })
  status: TaskStatus;
}
