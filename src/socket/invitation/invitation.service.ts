import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from '../socket.service';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(SocketService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketState: SocketService,
  ) {}

  async sendInvitation(soket: Socket, data: any, server: Server) {
    const { senderId, receiverId, senderName, groupId } = data;
    this.logger.error('Missing invitation data');
    if (!senderId || !receiverId || !senderName || !groupId) {
      return;
    }
    try {
      let game = await this.prisma.game.findFirst({
        where: {
          OR: [
            { player1Id: senderId, player2Id: receiverId },
            { player2Id: senderId, player1Id: receiverId },
          ],
        },
      });
      if (!game) {
        game = await this.prisma.game.create({
          data: {
            groupId: groupId,
            player1Id: senderId,
            player2Id: receiverId,
            status: 'WAITING',
          },
        });
        this.logger.log(`Created new game: ${game.id}`);
      }
      const receiverSocketId = this.socketState
        .getUserSocketMap()
        .get(receiverId);
      if (receiverSocketId) {
        server.to(receiverSocketId).emit('acceptInvitation', {
          senderId,
          senderName,
          groupId,
          gameId: game.id,
        });
        this.logger.log(
          `Invitation sent from ${senderId} to ${receiverId} (socket: ${receiverSocketId})`,
        );
      } else {
        this.logger.log(`User ${receiverId} is offline`);
      }
    } catch (error) {
      this.logger.error(`Error sending invitation: ${error}`);
    }
  }


  async confirmInvitation(socket: Socket, data: any, server: Server) {
    try {
      const game = await this.prisma.game.findUnique({
        where: { id: data.gameId },
      });
      if (!game) {
        this.logger.error(`Game ${data.gameId} not found`);
        return;
      }

      await this.prisma.game.update({
        where: { id: data.gameId },
        data: { status: 'IN_PROGRESS' },
      });
      this.logger.log(`Game ${data.gameId} status updated to IN_PROGRESS`);

      const sockets = [game.player1Id, game.player2Id]
        .map((userId) => this.socketState
        .getUserSocketMap().get(userId))
        .filter(Boolean);

      sockets.forEach((socketId) => {
        server.to(socketId!).emit('navigateToLevel', {
          groupId: data.groupId,
          gameId: data.gameId,
        });
        this.logger.log(`Navigating ${socketId} to game ${data.gameId}`);
      });
    } catch (error) {
      this.logger.error(`Error confirming invitation: ${error}`);
    }
  }
}
