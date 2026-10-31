
import { IsNotEmpty, IsString, IsUUID, MaxLength, } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}