import { IsArray, IsEmail, IsNotEmpty, IsString, ArrayMinSize, isNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ArrayMinSize(8)
  password: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];
}
