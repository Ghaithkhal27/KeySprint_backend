import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { login, register } from './Validation';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: login) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.authService.validateUser(
      loginDto.password,
      loginDto.email,
    );

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: register) {
    if (!registerDto.email || !registerDto.password || !registerDto.username) {
      throw new BadRequestException(
        'Email, password, and username are required',
      );
    }
    const { email, password, username } = registerDto;
    return this.authService.register({ email, password, username });
  }
}
