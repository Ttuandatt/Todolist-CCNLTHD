import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: '/events', cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private jwtService: JwtService, private config: ConfigService) {}

  afterInit(server: Server) {
    this.logger.log('EventsGateway initialized');
  }

  async handleConnection(socket: Socket) {
    try {
      // Accept token from handshake auth or query or header
      const token =
        (socket.handshake.auth && socket.handshake.auth.token) ||
        socket.handshake.query?.token ||
        socket.handshake.headers['authorization']?.toString().replace(/^Bearer\s/, '');

      if (!token) {
        this.logger.warn(`Socket ${socket.id} missing token — disconnecting`);
        socket.disconnect(true);
        return;
      }

      const secret = this.config.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error('JWT_SECRET not configured — cannot verify socket auth');
        socket.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, { secret });
      // Attach user info to socket.data
      socket.data.user = payload;
      const userId = payload.sub || payload.userId || payload.id;
      if (userId) {
        const userRoom = `user:${userId}`;
        socket.join(userRoom);
        this.logger.log(`Socket ${socket.id} joined ${userRoom}`);
      }
    } catch (err) {
      this.logger.warn(`Socket ${socket.id} authentication failed: ${err.message}`);
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (room && typeof room === 'string') {
      client.join(room);
      this.logger.log(`Socket ${client.id} joined room: ${room}`);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (room && typeof room === 'string') {
      client.leave(room);
      this.logger.log(`Socket ${client.id} left room: ${room}`);
    }
  }
}
