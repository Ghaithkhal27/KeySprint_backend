import { BadRequestException, Body, Controller, Get, Post, Put } from '@nestjs/common';
import { TypingTestService } from './typing-test.service';
import { Score, TypingTest } from './valdtion';
import { RankTier } from '@prisma/client';


@Controller('typing')
export class TypingTestController {

    constructor(private typingTestService:TypingTestService){}

        @Post('test')
        async creatTypingTest(@Body()typingTest:TypingTest ) {
      
            return this.typingTestService.creatTypingTestText(typingTest);
        }
        @Get('test')
        async getTypingTest( ) {
      
            return this.typingTestService.getTypingTestText();
        }
        @Put('score')
        async createScore(@Body() score: { accuracy: number; WPM: number; rank: string; userId: string }) {
            // Convert rank string to RankTier enum
            const rankEnumValue = RankTier[score.rank as keyof typeof RankTier];
        
            if (!rankEnumValue) {
                throw new BadRequestException(`Invalid rank value: ${score.rank}`);
            }
        
            return this.typingTestService.createScore({ 
                ...score, 
                rank: rankEnumValue 
            });
        }

}
