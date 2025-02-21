import { Controller, Post, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { game, level } from './validation.game';

@Controller('game')
export class GameController {
    constructor(private gameserver: GameService) {}

    @Post('group')
    async creatgroup(@Body() gameDto: game) {
        if (!gameDto.name || !gameDto.description) {
            throw new BadRequestException('Name and description are required');
        }
        return this.gameserver.creatgroup(gameDto);
    }

    @Post('level')
    async creatlevel(@Body() levelDot: level) {
        if (!levelDot.text || !levelDot.difficulty || !levelDot.language || !levelDot.timeLimit || !levelDot.groupId) {
            throw new BadRequestException('All fields are required');
        }

        return this.gameserver.creatlevel(levelDot);
    }

    @Get('group')
    async getgroup(){
   return this.gameserver.getAllGroups()
    }
    @Get('level/:id')
    async getLevelsByGroup(@Param('id') id: string) {
        return this.gameserver.getLevelsByGroup(id);
    }
    
}
