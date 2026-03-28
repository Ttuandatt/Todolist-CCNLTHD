import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventsModule } from '../events/events.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, EventsModule, NotificationModule],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
