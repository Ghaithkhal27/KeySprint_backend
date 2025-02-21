import { Difficulty, Language } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class game {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  description!: string;
}

export class level {
  @IsNotEmpty()
  text!: string;

  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @IsEnum(Language)
  language!: Language;

  @IsInt() 
  @IsNotEmpty()
  timeLimit!: number;

  @IsNotEmpty()
  groupId!: string; 
}
