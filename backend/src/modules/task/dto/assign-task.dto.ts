import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'userId không được để trống' })
  @IsUUID('4', { message: 'userId phải là UUID hợp lệ' })
  userId: string;
}
