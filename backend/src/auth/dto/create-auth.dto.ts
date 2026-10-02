import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ArrayMinSize,
} from 'class-validator';


export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];
}