import {
    BadRequestException, // Lỗi 404 - Bad Request do người dùng gửi yêu cầu không hợp lệ
    Injectable, // Decorator để đánh dấu lớp này là một service có thể được tiêm vào các thành phần khác
    NotFoundException, // Lỗi 404 - Not Found khi không tìm thấy tài nguyên
} from '@nestjs/common';

import * as bcrypt from 'bcrypt'; // Thư viện để mã hóa mật khẩu
import { promises as fs } from 'fs'; // Thư viện để làm việc với hệ thống file
import { join } from 'path'; // Thư viện để làm việc với đường dẫn file
import { PrismaService } from '../prisma/prisma.service'; // Service để tương tác với cơ sở dữ liệu thông qua Prisma
import { UpdateProfileDto } from './dto/update-profile.dto'; // DTO để cập nhật thông tin hồ sơ người dùng
import { ChangePasswordDto } from './dto/change-password.dto'; // DTO để thay đổi mật khẩu người dùng


@Injectable() // Đánh dấu lớp này là một service có thể được tiêm vào các thành phần khác
export class UserService {
    constructor(private prisma: PrismaService) { } // Inject PrismaService để tương tác với cơ sở dữ liệu

    // ─── Chọn các trường cho hồ sơ người dùng ─────────────────────────────────────────
    private readonly profileSelect = { // Cấu hình để chọn các trường cần thiết khi truy vấn thông tin người dùng
        id: true,
        email: true,
        name: true,
        displayName: true,
        avatar: true,
        status: true,
        bio: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
    } as const; // Sử dụng 'as const' để đảm bảo rằng kiểu của profileSelect là một đối tượng có các trường cụ thể và không thể thay đổi

    // ─── Lấy thông tin hồ sơ người dùng ─────────────────────────────────────────
    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({ // Tìm người dùng theo ID
            where: { id: userId },
            select: this.profileSelect, // Chỉ chọn các trường đã định nghĩa trong profileSelect
        });
        if (!user) { // Nếu không tìm thấy người dùng
            throw new NotFoundException('User not found'); // Trả về lỗi 404 - Not Found
        }
        return user;
    }

    // ─── Cập nhật thông tin hồ sơ người dùng ─────────────────────────────────────────
    async updateProfile(userId: string, dto: UpdateProfileDto) {
        if (!dto.displayName && !dto.bio) { // Nếu không có trường nào được cung cấp để cập nhật
            throw new BadRequestException('At least one field (displayName or bio) must be provided for update'); // Trả về lỗi 400 - Bad Request
        }

        const updated = await this.prisma.user.update({ // Cập nhật thông tin người dùng
            where: { id: userId },
            data: {
                ...(dto.displayName ? { displayName: dto.displayName } : {}), // Cập nhật displayName nếu được cung cấp
                ...(dto.bio ? { bio: dto.bio } : {}), // Cập nhật bio nếu được cung cấp
            },
            select: this.profileSelect, // Chỉ chọn các trường đã định nghĩa trong profileSelect
        });
        return updated;
    }

    // ─── Thay đổi mật khẩu người dùng ─────────────────────────────────────────
    async changePassword(userId: string, dto: ChangePasswordDto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException('New password and confirm password do not match'); // Trả về lỗi 400 - Bad Request
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }, // Chỉ chọn mật khẩu của người dùng
        });
        if (!user) {
            throw new NotFoundException('User not found'); // Trả về lỗi 404 - Not Found
        }

        const matches = await bcrypt.compare(dto.currentPassword, user.password); // So sánh mật khẩu mới với mật khẩu đã mã hóa
        if (!matches) {
            throw new BadRequestException('Invalid current password'); // Trả về lỗi 400 - Bad Request
        }

        const isSame = await bcrypt.compare(dto.newPassword, user.password); // So sánh mật khẩu mới với mật khẩu đã mã hóa
        if (isSame) {
            throw new BadRequestException('New password cannot be the same as current password'); // Trả về lỗi 400 - Bad Request
        }

        const hashed = await bcrypt.hash(dto.newPassword, 10); // Mã hóa mật khẩu mới
        await this.prisma.$transaction([ // Sử dụng transaction để đảm bảo tính toàn vẹn của dữ liệu
            this.prisma.user.update({ // Cập nhật mật khẩu của người dùng
                where: { id: userId }, // Tìm người dùng theo ID
                data: { password: hashed }, // Cập nhật mật khẩu
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId, revokedAt: null }, // Chỉ cập nhật các refresh token chưa bị thu hồi
                data: { revokedAt: new Date() }, // Đặt thời gian thu hồi bằng thời gian hiện tại
            }),
        ]); // Kết thúc transaction
        return { message: 'Password changed successfully' }; // Trả về thông báo thành công
    }

    // ─── Upload avatar người dùng ─────────────────────────────────────────
    async uploadAvatar(userId: string, file: Express.Multer.File) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Xóa avatar cũ nếu có
        if (user.avatar) {
            const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
            await fs.unlink(oldPath).catch(() => {}); // Bỏ qua lỗi nếu file không tồn tại
        }

        // Cập nhật avatar mới trong database
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: file.filename },
            select: this.profileSelect,
        });
        return updated;
    }
}