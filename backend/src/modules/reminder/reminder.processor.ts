import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';
import { Job } from 'bullmq';

@Processor('reminder')
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'due-date-check') {
      await this.handleDueDateCheck();
    }
  }

  /**
   * Query tasks due tomorrow + có assignees → tạo notification TASK_DUE_SOON
   */
  private async handleDueDateCheck() {
    this.logger.log('Running due date reminder check...');

    // Tính khoảng thời gian "ngày mai"
    const now = new Date();
    const tomorrowStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const tomorrowEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2,
    );

    // Query tasks due tomorrow, chưa DONE, có assignees
    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: tomorrowStart,
          lt: tomorrowEnd,
        },
        status: { not: 'DONE' },
        assignments: { some: {} }, // Phải có ít nhất 1 assignee
      },
      include: {
        assignments: {
          select: { userId: true },
        },
        project: {
          select: { name: true },
        },
      },
    });

    this.logger.log(`Found ${tasks.length} tasks due tomorrow`);

    const notifPromises: Promise<any>[] = [];

    for (const task of tasks) {
      for (const assignment of task.assignments) {
        notifPromises.push(
          this.notificationService.create({
            type: NotificationType.TASK_DUE_SOON,
            title: `Task "${task.title}" sắp đến hạn`,
            message: `Task trong project "${task.project.name}" sẽ đến hạn vào ngày mai.`,
            userId: assignment.userId,
            referenceId: task.id,
            referenceType: 'Task',
          }),
        );
      }
    }

    await Promise.all(notifPromises);
    this.logger.log(
      `Sent ${notifPromises.length} due date reminder notifications`,
    );
  }
}
