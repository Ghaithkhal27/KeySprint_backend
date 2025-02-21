import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class login {
  @IsEmail()
  email?: string; 
  @MinLength(6)
  password?: string;
}

export class register{
  @IsNotEmpty()
  username?:string
  @IsEmail()
  email?:string 
  @MinLength(6)
  password?:string
}


