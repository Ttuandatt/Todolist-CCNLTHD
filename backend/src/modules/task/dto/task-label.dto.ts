import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class TaskLabelDto {
  @IsString()
  @IsNotEmpty({ message: 'labelId không được để trống' })
  @IsUUID('4', { message: 'labelId phải là UUID hợp lệ' })
  labelId: string;
}
