import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export class InviteMemberDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsEnum(['ADMIN', 'MEMBER'], { message: 'Role không hợp lệ. Chỉ chấp nhận ADMIN hoặc MEMBER' })
  @IsNotEmpty({ message: 'Role không được để trống' })
  role: 'ADMIN' | 'MEMBER';
}
