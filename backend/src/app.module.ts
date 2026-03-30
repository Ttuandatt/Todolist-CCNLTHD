import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// ConfigModule — load biến môi trường từ .env vào process.env
// Không có ConfigModule → process.env.JWT_SECRET = undefined → JwtStrategy crash

import { APP_GUARD } from '@nestjs/core';
// APP_GUARD — special token để đăng ký Guard GLOBAL qua module system
// Khác với app.useGlobalGuards(): dùng APP_GUARD cho phép Guard dùng DI (inject Reflector)

import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './shared/mail/mail.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { EventsModule } from './modules/events/events.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      // envFilePath: load theo thứ tự ưu tiên — .env.local ghi đè .env
      // .env.local chứa secrets riêng (API keys), đã nằm trong .gitignore
    }),
    AuthModule,
    MailModule,
    PrismaModule,
    UserModule,
    WorkspaceModule,
    ProjectModule,
    TaskModule,
    EventsModule,
    CommentModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Cách đăng ký Global Guard qua DI:
    //   provide: APP_GUARD = bảo NestJS "đây là guard global"
    //   useClass: JwtAuthGuard = dùng class JwtAuthGuard
    //
    // Tại sao không dùng app.useGlobalGuards() trong main.ts?
    // → Vì JwtAuthGuard cần inject Reflector (để đọc @Public() metadata)
    // → app.useGlobalGuards() không hỗ trợ DI, chỉ APP_GUARD mới hỗ trợ
  ],
})
export class AppModule {}
