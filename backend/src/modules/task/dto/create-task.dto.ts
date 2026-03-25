import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề task không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề task không được vượt quá 255 ký tự' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority, {
    message: 'Priority không hợp lệ. Chấp nhận: LOW, NORMAL, HIGH, URGENT',
  })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  @IsOptional()
  startDate?: string;

  @IsDateString({}, { message: 'Ngày hết hạn không hợp lệ' })
  @IsOptional()
  dueDate?: string;

  @IsNumber({}, { message: 'Giờ ước tính phải là số' })
  @Min(0, { message: 'Giờ ước tính phải >= 0' })
  @IsOptional()
  estimatedHours?: number;
}
