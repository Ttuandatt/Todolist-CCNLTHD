import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ type: 'string', description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', description: 'Notification message', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ type: 'string', description: 'Target user id' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
