import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
     constructor(private userService:UserService ) {}
     @Get('users')
     async getAllUsers(){
         return this.userService.getAllUsers()
     }
     @Get('profile/:id')
     async getProfile (@Param('id') id: string){
        return this.userService.getProfile(id)
     }
}
