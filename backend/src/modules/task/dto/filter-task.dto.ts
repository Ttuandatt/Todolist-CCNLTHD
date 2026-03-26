import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class FilterTaskDto {
  // Filter theo status: ?status=TODO,IN_PROGRESS
  @IsOptional()
  @IsString()
  status?: string;

  // Filter theo priority: ?priority=HIGH,URGENT
  @IsOptional()
  @IsString()
  priority?: string;

  // Filter theo assignee: ?assigneeId=uuid
  @IsOptional()
  @IsString()
  assigneeId?: string;

  // Filter theo labels: ?labelIds=uuid1,uuid2
  @IsOptional()
  @IsString()
  labelIds?: string;

  // Filter theo due date: ?dueDate=overdue|today|week|none
  @IsOptional()
  @IsString()
  dueDate?: string;

  // Search theo title: ?search=keyword
  @IsOptional()
  @IsString()
  search?: string;

  // Sort: ?sortBy=createdAt|dueDate|priority|position
  @IsOptional()
  @IsString()
  sortBy?: string;

  // Sort order: ?sortOrder=asc|desc
  @IsOptional()
  @IsString()
  sortOrder?: string;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
