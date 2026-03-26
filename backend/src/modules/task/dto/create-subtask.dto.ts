import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề subtask không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề subtask không được vượt quá 255 ký tự' })
  title: string;
}
