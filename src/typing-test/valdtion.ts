import {  IsEnum, IsInt, IsNotEmpty } from "class-validator";
import {RankTier} from '@prisma/client';

export class TypingTest {
  @IsNotEmpty()
  text!: string;
  @IsInt() 
  @IsNotEmpty()
  timeLimit!: number;

}
export class Score {
  @IsInt() 
  accuracy!:number
 @IsInt() 
 WPM !:number 
 @IsEnum(RankTier)           
 rank !:string
@IsNotEmpty() 
userId!: string

}