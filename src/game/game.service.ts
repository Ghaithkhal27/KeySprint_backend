import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Difficulty, Language } from '@prisma/client'; 

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    async creatgroup(data: { name: string; description: string }) {
        return this.prisma.group.create({ data });
    }

    async creatlevel(data: {
        text: string;
        difficulty: Difficulty; 
        language: Language; 
        timeLimit: number;
        groupId: string;
    }) {
        return this.prisma.level.create({
            data,
            include: {
                group: true,
            },
        });
    }


    async getAllGroups(){
        return this.prisma.group.findMany()
    }

    async getLevelsByGroup(groupId:string){
        return this.prisma.level.findMany({
            where:{groupId},
            include:{group:true}
        })
    }
}
