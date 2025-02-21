import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvitationService } from './invitation/invitation.service';
import { GameService } from './game/game.service';

@Module({
  providers: [SocketService, SocketGateway, PrismaService, InvitationService, GameService],
})
export class SocketModule {}
