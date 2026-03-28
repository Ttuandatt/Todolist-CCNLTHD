import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

type EventPayload = any;

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private gateway: EventsGateway) {}

  emitToWorkspace(workspaceId: string, event: string, payload: EventPayload) {
    const room = `workspace:${workspaceId}`;
    this.emitToRoom(room, event, payload);
  }

  emitToProject(projectId: string, event: string, payload: EventPayload) {
    const room = `project:${projectId}`;
    this.emitToRoom(room, event, payload);
  }

  emitToTask(taskId: string, event: string, payload: EventPayload) {
    const room = `task:${taskId}`;
    this.emitToRoom(room, event, payload);
  }

  emitToUser(userId: string, event: string, payload: EventPayload) {
    const room = `user:${userId}`;
    this.emitToRoom(room, event, payload);
  }

  emitToRoom(room: string, event: string, payload: EventPayload) {
    try {
      const server = this.gateway.server;
      if (!server) {
        this.logger.warn('Socket server not initialized yet');
        return;
      }
      server.to(room).emit(event, payload);
      this.logger.log(`Emitted ${event} to ${room}`);
    } catch (err) {
      this.logger.error('Failed to emit event', err as any);
    }
  }
}
