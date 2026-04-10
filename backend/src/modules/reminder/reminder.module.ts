import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { ReminderProcessor } from './reminder.processor';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    // Đăng ký BullMQ queue 'reminder' với Redis connection từ env
    BullModule.registerQueueAsync({
      name: 'reminder',
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    NotificationModule,
  ],
  providers: [ReminderProcessor],
})
export class ReminderModule implements OnModuleInit {
  private readonly logger = new Logger(ReminderModule.name);

  constructor(@InjectQueue('reminder') private reminderQueue: Queue) {}

  /**
   * Khi module init, thêm repeatable job chạy lúc 8:00 sáng hàng ngày
   * Cron pattern: phút 0, giờ 8, mỗi ngày
   */
  async onModuleInit() {
    // Xóa tất cả repeatable jobs cũ trước khi thêm mới (tránh duplicate)
    const existingJobs = await this.reminderQueue.getRepeatableJobs();
    for (const job of existingJobs) {
      await this.reminderQueue.removeRepeatableByKey(job.key);
    }

    // Thêm job chạy cron 8:00 AM hàng ngày
    await this.reminderQueue.add(
      'due-date-check',
      {},
      {
        repeat: {
          pattern: '0 8 * * *', // 8:00 AM mỗi ngày
        },
        removeOnComplete: { count: 10 }, // Giữ 10 jobs gần nhất
        removeOnFail: { count: 20 },
      },
    );

    this.logger.log('Due date reminder cron job scheduled at 8:00 AM daily');
  }
}
