import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TypingTestController } from './typing-test.controller';
import { TypingTestService } from './typing-test.service';

@Module({
  providers: [TypingTestService,PrismaService],
  controllers: [TypingTestController],
  exports: [PrismaService],
})
export class TypingTestModule {}
