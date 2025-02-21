import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocketService {
  private userSocketMap = new Map<string, string>();
  private userLevelMap = new Map<string, number>();
  private userInfoMap = new Map<string, { username: string; level: number }>();
  private readonly logger = new Logger(SocketService.name);

  constructor(private readonly prisma: PrismaService) {}

  getUserSocketMap(): Map<string, string> {
    return this.userSocketMap;
  }
  getUserLevelMap(): Map<string, number> {
    return this.userLevelMap;
  }
  getUserInfoMap(): Map<string, { username: string; level: number }> {
    return this.userInfoMap;
  }

  emitOnlineUsers(server: Server) {
    const onlineUserIds = Array.from(this.userSocketMap.keys());
    this.logger.log(`Emitting onlineUsers: ${onlineUserIds}`);
    server.emit('onlineUsers', onlineUserIds);
  }

  registerUser(socket: Socket, userId: string, server: Server) {
    if (!userId) return;
    this.userSocketMap.set(userId, socket.id);
    this.logger.log(`User ${userId} registered with socket ${socket.id}`);
    this.emitOnlineUsers(server);
  }

  sendOnlineUsers(socket: Socket) {
    const onlineUsers = Array.from(this.userSocketMap.keys());
    this.logger.log(`Sending onlineUsers to ${socket.id}: ${onlineUsers}`);
    socket.emit('onlineUsers', onlineUsers);
  }

  handleDisconnect(socket: Socket, server: Server) {
    const userId = [...this.userSocketMap.entries()].find(
      ([_, id]) => id === socket.id,
    )?.[0];
    if (userId) {
      this.userSocketMap.delete(userId);
      this.userLevelMap.delete(userId);
      this.userInfoMap.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
      this.emitOnlineUsers(server);
    }
  }

  clearUsers() {
    this.userSocketMap.clear();
    this.logger.log('Cleared userSocketMap');
  }
}
