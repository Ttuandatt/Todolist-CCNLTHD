import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên project không được để trống' })
  @MaxLength(100, { message: 'Tên project không được vượt quá 100 ký tự' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Màu phải đúng định dạng hex (VD: #3B82F6)' })
  color?: string;
}
