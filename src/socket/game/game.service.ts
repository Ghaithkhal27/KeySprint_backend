import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from '../socket.service';
import { Socket,Server } from 'socket.io';

@Injectable()
export class GameService {
      private readonly logger = new Logger(SocketService.name);
    
    constructor(
        private readonly prisma:PrismaService,
        private readonly socketService:SocketService 
    ){}

  async handleGameExit(
    socket: Socket,
    data: { gameId: string; playerId: string },
    server: Server,
  ) {
    this.logger.log(`Processing gameExit: ${JSON.stringify(data)}`);
    try {
      const game = await this.prisma.game.findUnique({
        where: { id: data.gameId },
        include: { player1: true, player2: true },
      });

      if (!game) {
        this.logger.error(`Game ${data.gameId} not found`);
        return;
      }
      if (game.status === 'COMPLETED' || game.status === 'ABANDONED') {
        this.logger.log(`Game ${data.gameId} already ${game.status}`);
        return;
      }

      const players = [game.player1Id, game.player2Id];
      if (!players.includes(data.playerId)) {
        this.logger.error(`Player ${data.playerId} not part of game ${data.gameId}`);
        return;
      }

      const exitingPlayerId = data.playerId;
      const winnerId = players.find(id => id !== exitingPlayerId);

      if (!winnerId) {
        this.logger.error(`Could not determine winner for game ${data.gameId}`);
        return;
      }

      await this.prisma.game.update({
        where: { id: data.gameId },
        data: { 
          status: 'ABANDONED',
          winnerId: winnerId,
        },
      });
      this.logger.log(`Updated game ${data.gameId} to ABANDONED, winner: ${winnerId}`);

      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: winnerId },
          data: {
            totalWins: { increment: 1 },
            totalMatches: { increment: 1 },
          },
        }),
        this.prisma.user.update({
          where: { id: exitingPlayerId },
          data: {
            totalLosses: { increment: 1 },
            totalMatches: { increment: 1 },
          },
        })
      ]);
      this.logger.log(`Updated stats for winner ${winnerId} and loser ${exitingPlayerId}`);

      const winnerSocket = this.socketService.getUserSocketMap().get(winnerId);
      const loserSocket = this.socketService.getUserSocketMap().get(exitingPlayerId);

      if (winnerSocket) {
        this.logger.log(`Emitting gameOver to winner ${winnerId} at ${winnerSocket}`);
        server.to(winnerSocket).emit('gameOver', {
          gameId: data.gameId,
          winnerId: winnerId,
          loserId: exitingPlayerId,
          status: 'WON',
          reason: 'opponent_exit'
        });
      } else {
        this.logger.error(`Winner socket not found for ${winnerId}`);
      }

      if (loserSocket) {
        this.logger.log(`Emitting gameOver to loser ${exitingPlayerId} at ${loserSocket}`);
        server.to(loserSocket).emit('gameOver', {
          gameId: data.gameId,
          winnerId: winnerId,
          loserId: exitingPlayerId,
          status: 'LOST',
          reason: 'self_exit'
        });
      } else {
        this.logger.error(`Loser socket not found for ${exitingPlayerId}`);
      }

      this.logger.log(`Game ${data.gameId} abandoned. Winner: ${winnerId}, Loser (exited): ${exitingPlayerId}`);
    } catch (error) {
      this.logger.error(`Game exit error: ${error}`);
    }
  }

  ////////////////////////////////////////


  async handleProgressUpdate(socket: Socket, data: any, server: Server) {
    try {
      if (!data?.gameId || !data?.playerId || !data?.level) {
        this.logger.error('Missing required fields in progress update');
        return;
      }

      if (typeof data.level !== 'number' || data.level < 1) {
        this.logger.error('Invalid level received');
        return;
      }

      const game = await this.prisma.game.findUnique({
        where: { id: data.gameId },
        include: { player1: true, player2: true },
      });

      if (!game || game.status !== 'IN_PROGRESS') {
        this.logger.log(`Game ${data.gameId} not in progress: ${game?.status}`);
        return;
      }

      this.socketService.getUserLevelMap().set(data.playerId, data.level);

      const currentPlayer = await this.prisma.user.findUnique({
        where: { id: data.playerId },
        select: { username: true },
      });

      if (!currentPlayer) {
        this.logger.error('Player not found');
        return;
      }

      const opponentId =
        game.player1Id === data.playerId ? game.player2Id : game.player1Id;

      const progressData = {
        username: currentPlayer.username,
        level: data.level,
        playerId: data.playerId,
      };

      this.socketService.getUserInfoMap().set(data.playerId, progressData);

      const opponentSocketId = this.socketService.getUserSocketMap().get(opponentId);
      if (opponentSocketId) {
        server.to(opponentSocketId).emit('playerProgress', progressData);
        this.logger.log(`Progress update sent to ${opponentId} at ${opponentSocketId}`);
      } else {
        this.logger.log(`Opponent ${opponentId} offline`);
      }
    } catch (error) {
      this.logger.error(`Progress update error: ${error}`);
    }
  }



  ////////////////////////////////////////////////////


  async handleGameOver(
    socket: Socket,
    data: { gameId: string; playerId: string }, 
    server: Server,
  ) {
    try {
      const game = await this.prisma.game.findUnique({
        where: { id: data.gameId },
        include: { player1: true, player2: true },
      });

      if (!game || game.status === 'COMPLETED') {
        this.logger.log(`Game ${data.gameId} already completed or not found`);
        return;
      }

      const players = [game.player1Id, game.player2Id];
      if (!players.includes(data.playerId)) {
        this.logger.error(`Player ${data.playerId} not part of game ${data.gameId}`);
        return;
      }

      const winnerId = data.playerId;
      const loserId = players.find(id => id !== winnerId);

      if (!loserId) {
        this.logger.error(`Could not determine loser for game ${data.gameId}`);
        return;
      }

      await this.prisma.game.update({
        where: { id: data.gameId },
        data: { 
          status: 'COMPLETED',
          winnerId: winnerId,
        },
      });
      this.logger.log(`Updated game ${data.gameId} to COMPLETED, winner: ${winnerId}`);

      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: winnerId },
          data: {
            totalWins: { increment: 1 },
            totalMatches: { increment: 1 },
          },
        }),
        this.prisma.user.update({
          where: { id: loserId },
          data: {
            totalLosses: { increment: 1 },
            totalMatches: { increment: 1 },
          },
        })
      ]);
      this.logger.log(`Updated stats for winner ${winnerId} and loser ${loserId}`);

      const winnerSocket = this.socketService.getUserSocketMap().get(winnerId);
      const loserSocket = this.socketService.getUserSocketMap().get(loserId);

      if (winnerSocket) {
        this.logger.log(`Emitting gameOver to winner ${winnerId} at ${winnerSocket}`);
        server.to(winnerSocket).emit('gameOver', {
          gameId: data.gameId,
          winnerId: winnerId,
          loserId: loserId,
          status: 'WON'
        });
      } else {
        this.logger.error(`Winner socket not found for ${winnerId}`);
      }

      if (loserSocket) {
        this.logger.log(`Emitting gameOver to loser ${loserId} at ${loserSocket}`);
        server.to(loserSocket).emit('gameOver', {
          gameId: data.gameId,
          winnerId: winnerId,
          loserId: loserId,
          status: 'LOST'
        });
      } else {
        this.logger.error(`Loser socket not found for ${loserId}`);
      }

      this.logger.log(`Game ${data.gameId} completed. Winner: ${winnerId}, Loser: ${loserId}`);
    } catch (error) {
      this.logger.error(`Game over error: ${error}`);
    }
  }
}
