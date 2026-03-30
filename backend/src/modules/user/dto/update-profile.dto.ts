import { IsOptional, IsString, MaxLength } from 'class-validator'; // DTO for updating user profile information

export class UpdateProfileDto {
  @IsOptional() // Tên hiển thị có thể không bắt buộc
  @IsString() // Phải là chuỗi
  @MaxLength(50, { message: 'Display name must be at most 50 characters long' }) // Giới hạn độ dài tối đa là 50 ký tự
  displayName?: string; // Tên hiển thị của người dùng. Dấu hỏi (?) cho biết đây là trường tùy chọn

  @IsOptional() // Mô tả bản thân có thể không bắt buộc
  @IsString() // Phải là chuỗi
  @MaxLength(160, { message: 'Bio must be at most 160 characters long' }) // Giới hạn độ dài tối đa là 160 ký tự
  bio?: string; // Mô tả bản thân của người dùng. Dấu hỏi (?) cho biết đây là trường tùy chọn

  @IsString() // Tên phải là chuỗi
  @MaxLength(50, { message: 'Name must be at most 50 characters long' }) // Giới hạn độ dài tối đa là 50 ký tự
  name: string; // Tên của người dùng. Đây là trường bắt buộc
}
