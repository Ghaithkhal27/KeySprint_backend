import { Injectable } from '@nestjs/common';
import { RankTier } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypingTestService {
    constructor(private prisma: PrismaService){}


    async creatTypingTestText(data: { text: string, timeLimit: number  }) {
        return this.prisma.typingTest.create({ data });
    }


    async getTypingTestText(){
        return this.prisma.typingTest.findMany()
    }

  
    async createScore(data: { accuracy: number; WPM: number; rank: RankTier; userId: string }) {
        try {
          console.log("Received Score Data:", data);
      
          const existingScore = await this.prisma.score.findUnique({
            where: { userId: data.userId },
          });
      
          let result;
          if (existingScore) {
            result = await this.prisma.score.update({
              where: { userId: data.userId },
              data: { accuracy: data.accuracy, WPM: data.WPM, rank: data.rank },
            });
          } else {
            result = await this.prisma.score.create({
              data,
            });
          }
      
          return result;
        } catch (error) {
          console.error("Error creating/updating score:", error);
          throw new Error("Failed to create or update score");
        }
      }
      
    
    




}

 