import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SendMessageDto } from './dto/send-messgae.dto.js';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service.js';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly config: ConfigService,
    ) {}

    @Get(':chatId/messages')
    getMessage(@Param('chatId') chatId: string){
        const userId = this.config.get<string>('TEST_USER_ID');
        if (!userId)
            throw new Error('TEST_USER_ID is not configured.');

        return this.chatService.getMessages(chatId, userId);
    }

    @Post(':chatId/messages')
    sendMessage(@Param('chatId') chatId: string, @Body() message: SendMessageDto){
        const userId = this.config.get<string>('TEST_USER_ID');
        if (!userId)
            throw new Error('TEST_USER_ID is not configured.');
        return this.chatService.sendMessage(message, userId, chatId);
    }

}