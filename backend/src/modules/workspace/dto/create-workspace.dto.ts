import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên workspace không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
