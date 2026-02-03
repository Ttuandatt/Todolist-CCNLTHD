import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()   // Module này available toàn app, không cần import ở mỗi module
@Module({
    providers: [PrismaService], // Đăng ký PrismaService vào IoC Container
    exports: [PrismaService]    // Cho phép module khác inject PrismaService
})
export class PrismaModule { }
