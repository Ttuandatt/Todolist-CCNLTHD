# 📘 Phần 5: Real-time với WebSocket

> **Thời gian học:** 3-4 ngày  
> **Độ khó:** ⭐⭐⭐⭐ Khó  
> **Yêu cầu:** NestJS Core, JavaScript async

---

## 1. WebSocket Fundamentals

### 1.1 HTTP vs WebSocket

| Aspect | HTTP | WebSocket |
|--------|------|-----------|
| Connection | Request-Response | Persistent |
| Direction | Client → Server | Bidirectional |
| Overhead | Headers mỗi request | Minimal sau handshake |
| Use case | REST APIs | Real-time apps |

### 1.2 WebSocket Handshake

```
Client                                Server
   │                                     │
   │──── HTTP Upgrade Request ──────────►│
   │     Connection: Upgrade             │
   │     Upgrade: websocket              │
   │                                     │
   │◄─── HTTP 101 Switching Protocols ───│
   │                                     │
   │◄════════ WebSocket Open ═══════════►│
   │         Full-duplex channel         │
   │◄════════════════════════════════════►│
```

---

## 2. Socket.io với NestJS

### 2.1 Cài đặt

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 2.2 Gateway cơ bản

```typescript
// events/events.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return { event: 'pong', data: { message: 'pong', received: data } };
  }
}
```

### 2.3 Gateway Module

```typescript
// events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}

// app.module.ts
@Module({
  imports: [EventsModule],
})
export class AppModule {}
```

---

## 3. Room-based Communication

### 3.1 Join/Leave Rooms

```typescript
@WebSocketGateway()
export class WorkspaceGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinWorkspace')
  handleJoinWorkspace(
    @MessageBody() data: { workspaceId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `workspace:${data.workspaceId}`;
    client.join(roomName);
    
    // Notify others in room
    client.to(roomName).emit('userJoined', {
      userId: client.data.user?.id,
      workspaceId: data.workspaceId,
    });

    return { event: 'joinedWorkspace', data: { workspaceId: data.workspaceId } };
  }

  @SubscribeMessage('leaveWorkspace')
  handleLeaveWorkspace(
    @MessageBody() data: { workspaceId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `workspace:${data.workspaceId}`;
    client.leave(roomName);

    client.to(roomName).emit('userLeft', {
      userId: client.data.user?.id,
      workspaceId: data.workspaceId,
    });
  }
}
```

### 3.2 Broadcasting to Rooms

```typescript
@Injectable()
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  // Broadcast task created to workspace
  emitTaskCreated(workspaceId: number, task: Task) {
    this.server.to(`workspace:${workspaceId}`).emit('taskCreated', task);
  }

  // Broadcast task updated
  emitTaskUpdated(workspaceId: number, task: Task) {
    this.server.to(`workspace:${workspaceId}`).emit('taskUpdated', task);
  }

  // Broadcast task deleted
  emitTaskDeleted(workspaceId: number, taskId: number) {
    this.server.to(`workspace:${workspaceId}`).emit('taskDeleted', { taskId });
  }

  // Emit to specific user
  emitToUser(userId: number, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
```

### 3.3 Integration với Service

```typescript
// tasks/tasks.service.ts
@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private tasksGateway: TasksGateway,
  ) {}

  async create(userId: number, projectId: number, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: { ...dto, projectId, createdById: userId },
      include: { project: true, createdBy: true },
    });

    // Emit real-time event
    this.tasksGateway.emitTaskCreated(task.project.workspaceId, task);

    return task;
  }

  async update(taskId: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: dto,
      include: { project: true },
    });

    this.tasksGateway.emitTaskUpdated(task.project.workspaceId, task);

    return task;
  }
}
```

---

## 4. WebSocket Authentication

### 4.1 Auth Middleware

```typescript
// events/ws-auth.middleware.ts
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

export type SocketWithAuth = Socket & {
  data: {
    user: { id: number; email: string };
  };
};

export const wsAuthMiddleware = (jwtService: JwtService) => {
  return (socket: SocketWithAuth, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token || 
                    socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = jwtService.verify(token);
      socket.data.user = { id: payload.sub, email: payload.email };
      
      // Join user's personal room
      socket.join(`user:${payload.sub}`);
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  };
};
```

### 4.2 Apply Middleware

```typescript
@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    server.use(wsAuthMiddleware(this.jwtService));
  }
}
```

### 4.3 WsGuard

```typescript
// common/guards/ws-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const user = client.data?.user;

    if (!user) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}

// Usage
@UseGuards(WsAuthGuard)
@SubscribeMessage('createTask')
handleCreateTask(@ConnectedSocket() client: SocketWithAuth, @MessageBody() data: any) {
  const userId = client.data.user.id;
  // ...
}
```

---

## 5. Event Patterns

### 5.1 Task Events

```typescript
// Định nghĩa event types
enum TaskEvent {
  CREATED = 'task:created',
  UPDATED = 'task:updated',
  DELETED = 'task:deleted',
  MOVED = 'task:moved',
  ASSIGNED = 'task:assigned',
  COMMENTED = 'task:commented',
}

interface TaskEventPayload {
  workspaceId: number;
  projectId: number;
  task: Partial<Task>;
  actor: { id: number; name: string };
}

// Gateway
@SubscribeMessage('task:update')
async handleTaskUpdate(
  @ConnectedSocket() client: SocketWithAuth,
  @MessageBody() data: { taskId: number; updates: UpdateTaskDto },
) {
  const task = await this.tasksService.update(data.taskId, data.updates);
  
  // Broadcast to room excluding sender
  client.to(`workspace:${task.project.workspaceId}`).emit(TaskEvent.UPDATED, {
    task,
    actor: client.data.user,
  });

  return { success: true, task };
}
```

### 5.2 Presence (Online Status)

```typescript
@WebSocketGateway()
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, Set<string>>(); // userId -> socketIds

  handleConnection(client: SocketWithAuth) {
    const userId = client.data.user?.id;
    if (!userId) return;

    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId).add(client.id);

    // Broadcast online status
    this.broadcastPresence(userId, true);
  }

  handleDisconnect(client: SocketWithAuth) {
    const userId = client.data.user?.id;
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);
        this.broadcastPresence(userId, false);
      }
    }
  }

  private broadcastPresence(userId: number, isOnline: boolean) {
    this.server.emit('presence:update', { userId, isOnline });
  }

  getOnlineUsers(): number[] {
    return Array.from(this.onlineUsers.keys());
  }

  isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }
}
```

### 5.3 Typing Indicator

```typescript
@SubscribeMessage('typing:start')
handleTypingStart(
  @ConnectedSocket() client: SocketWithAuth,
  @MessageBody() data: { taskId: number },
) {
  client.to(`task:${data.taskId}`).emit('typing:started', {
    userId: client.data.user.id,
    taskId: data.taskId,
  });
}

@SubscribeMessage('typing:stop')
handleTypingStop(
  @ConnectedSocket() client: SocketWithAuth,
  @MessageBody() data: { taskId: number },
) {
  client.to(`task:${data.taskId}`).emit('typing:stopped', {
    userId: client.data.user.id,
    taskId: data.taskId,
  });
}
```

---

## 6. Frontend Integration (React)

### 6.1 Socket Context

```typescript
// contexts/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
```

### 6.2 Custom Hooks

```typescript
// hooks/useWorkspaceSocket.ts
export function useWorkspaceSocket(workspaceId: number) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !workspaceId) return;

    // Join workspace room
    socket.emit('joinWorkspace', { workspaceId });

    // Listen for task events
    const handleTaskCreated = (task: Task) => {
      queryClient.setQueryData(['tasks', workspaceId], (old: Task[] = []) => {
        return [...old, task];
      });
    };

    const handleTaskUpdated = (task: Task) => {
      queryClient.setQueryData(['tasks', workspaceId], (old: Task[] = []) => {
        return old.map(t => t.id === task.id ? task : t);
      });
    };

    const handleTaskDeleted = ({ taskId }: { taskId: number }) => {
      queryClient.setQueryData(['tasks', workspaceId], (old: Task[] = []) => {
        return old.filter(t => t.id !== taskId);
      });
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    return () => {
      socket.emit('leaveWorkspace', { workspaceId });
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
    };
  }, [socket, workspaceId, queryClient]);
}
```

---

## 7. Error Handling

### 7.1 WsException Filter

```typescript
// common/filters/ws-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();

    client.emit('exception', {
      status: 'error',
      message: typeof error === 'string' ? error : error['message'],
    });
  }
}

// Apply globally
@UseFilters(new WsExceptionFilter())
@WebSocketGateway()
export class EventsGateway {}
```

---

## 📚 Tài liệu tham khảo

- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.io Documentation](https://socket.io/docs)
- [WebSocket MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
