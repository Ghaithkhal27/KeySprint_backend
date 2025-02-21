import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { SocketModule } from './socket/socket.module';
import { TypingTestService } from './typing-test/typing-test.service';
import { TypingTestController } from './typing-test/typing-test.controller';
import { TypingTestModule } from './typing-test/typing-test.module';


@Module({
  controllers: [AppController, TypingTestController],
  providers: [AppService, TypingTestService],
  imports: [PrismaModule, AuthModule, GameModule, UserModule, SocketModule, TypingTestModule],
})
export class AppModule {}
