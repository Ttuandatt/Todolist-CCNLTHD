import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @IsEnum(['ADMIN', 'MEMBER'], { message: 'Role không hợp lệ. Chỉ chấp nhận ADMIN hoặc MEMBER' })
  @IsNotEmpty({ message: 'Role không được để trống' })
  role: 'ADMIN' | 'MEMBER';
}
