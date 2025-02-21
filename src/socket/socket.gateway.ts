import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SocketService } from './socket.service';
import { InvitationService } from './invitation/invitation.service';
import { GameService } from './game/game.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
@Injectable()
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private readonly socketService: SocketService,
    private readonly invitationService:InvitationService,
    private readonly gameService:GameService

  ) {}

  handleConnection(socket: Socket) {
    this.logger.log(`New connection: ${socket.id}`);
    this.socketService.emitOnlineUsers(this.server);
  }

  @SubscribeMessage('register')
  handleRegister(socket: Socket, userId: string) {
    this.socketService.registerUser(socket, userId, this.server);
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(socket: Socket) {
    this.socketService.sendOnlineUsers(socket);
  }

  @SubscribeMessage("sendInvitation")
  async handleSendInvitation(socket: Socket, data: any) {
    this.logger.log(`Received sendInvitation: ${JSON.stringify(data)}`);
    await this.invitationService.sendInvitation(socket, data, this.server)
  }

  @SubscribeMessage("confirmInvitation")
  async handleConfirmInvitation(socket: Socket, data: any) {
    this.logger.log(`Received confirmInvitation: ${JSON.stringify(data)}`);
    await this.invitationService.confirmInvitation(socket, data, this.server);
  }

  @SubscribeMessage("gameExit")
  async handleGameExit(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { gameId: string; playerId: string }
  ) {
    this.logger.log(`Received gameExit: ${JSON.stringify(data)}`);
    await this.gameService.handleGameExit(socket, data, this.server);
  }

  @SubscribeMessage("progressUpdate")
  async handleProgressUpdate(socket: Socket, data: any) {
    this.logger.log(`Received progressUpdate: ${JSON.stringify(data)}`);
    await this.gameService.handleProgressUpdate(socket, data, this.server);
  }

  @SubscribeMessage("gameOver")
  async handleGameOver(socket: Socket, data: any) {
    this.logger.log(`Received gameOver: ${JSON.stringify(data)}`);
    await this.gameService.handleGameOver(socket, data, this.server);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Disconnected: ${socket.id}`);
    this.socketService.handleDisconnect(socket, this.server);
  }

  onModuleDestroy() {
    this.socketService.clearUsers();
  }
}