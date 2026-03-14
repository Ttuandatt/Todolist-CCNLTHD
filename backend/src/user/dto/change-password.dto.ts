import {
    IsNotEmpty,
    IsString,
    Matches,
    MinLength
} from 'class-validator'; // DTO for changing user password

export class ChangePasswordDto{
    @IsString() // Phải là chuỗi
    @IsNotEmpty({message: 'Current password is required'}) // Không được để trống
    currentPassword: string; // Mật khẩu hiện tại của người dùng. Đây là trường bắt buộc

    @IsString() // Phải là chuỗi
    @MinLength(8, {message: 'New password must be at least 8 characters long'}) // Mật khẩu mới phải có ít nhất 8 ký tự
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {message: 'New password must contain at least one uppercase letter, one number, and one special character'}) // Mật khẩu mới phải chứa ít nhất một chữ hoa, một số và một ký tự đặc biệt
    newPassword: string; // Mật khẩu mới của người dùng. Đây là trường bắt buộc

    @IsString() // Phải là chuỗi
    @IsNotEmpty({message: 'Confirm password is required'}) // Không được để trống
    confirmPassword: string; // Xác nhận mật khẩu mới của người dùng. Đây là trường bắt buộc
}