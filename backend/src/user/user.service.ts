import {
    BadRequestException, // Lỗi 404 - Bad Request do người dùng gửi yêu cầu không hợp lệ
    Injectable, // Decorator để đánh dấu lớp này là một service có thể được tiêm vào các thành phần khác
    NotFoundException, // Lỗi 404 - Not Found khi không tìm thấy tài nguyên
} from '@nestjs/common';

import * as bcrypt from 'bcrypt'; // Thư viện để mã hóa mật khẩu
import {promises as fs, stat} from 'fs'; // Thư viện để làm việc với hệ thống file
import {join} from 'path'; // Thư viện để làm việc với đường dẫn file
import {PrismaService} from '../prisma/prisma.service'; // Service để tương tác với cơ sở dữ liệu thông qua Prisma
import {UpdateProfileDto} from './dto/update-profile.dto'; // DTO để cập nhật thông tin hồ sơ người dùng
import {ChangePasswordDto} from './dto/change-password.dto'; // DTO để thay đổi mật khẩu người dùng
import { last } from 'rxjs';

@Injectable() // Đánh dấu lớp này là một service có thể được tiêm vào các thành phần khác
export class UserService {
    constructor(private prisma: PrismaService) {} // Inject PrismaService để tương tác với cơ sở dữ liệu

    // ─── Chọn các trường cho hồ sơ người dùng ─────────────────────────────────────────
    private readonly profileSelect = { // Cấu hình để chọn các trường cần thiết khi truy vấn thông tin người dùng
        id: true,
        email: true,
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
            where: { id: userId},
            select: this.profileSelect, // Chỉ chọn các trường đã định nghĩa trong profileSelect
        });
        if (!user) { // Nếu không tìm thấy người dùng
            throw new NotFoundException('User not found'); // Trả về lỗi 404 - Not Found
        }
        return user;
    }

    // ─── Cập nhật thông tin hồ sơ người dùng ─────────────────────────────────────────
    async updateProfile(userId: string, dto: UpdateProfileDto) {
        if(!dto.displayName && !dto.bio) { // Nếu không có trường nào được cung cấp để cập nhật
            throw new BadRequestException('At least one field (displayName or bio) must be provided for update'); // Trả về lỗi 400 - Bad Request
        }

        const updated = await this.prisma.user.update({ // Cập nhật thông tin người dùng
            where: {id: userId},
            data:{
                ...(dto.displayName ? {displayName: dto.displayName} : {}), // Cập nhật displayName nếu được cung cấp
                ...(dto.bio ? {bio: dto.bio} : {}), // Cập nhật bio nếu được cung cấp
            },
            select: this.profileSelect, // Chỉ chọn các trường đã định nghĩa trong profileSelect
        });
        return updated;
    }
}