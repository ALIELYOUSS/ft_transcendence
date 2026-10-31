import { Injectable , NotFoundException, ForbiddenException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-messgae.dto.js';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async openchat(slotId : string){
      const slot = await this.prisma.slot.findUnique({
      where: { id: slotId },
      select: {
        participants: {
          select: {
            userId: true,
          },
        },
        },
        })
        if (!slot)
            throw new NotFoundException('Slot not found');
        const existingChat = await this.prisma.groupChat.findUnique({
            where: {
            slotId: slotId,
            },
        });
        if (existingChat)
            return existingChat;
        const newChat = await this.prisma.groupChat.create({
        data: {
            slotId: slotId,
            participants: {
            create: slot.participants.map((participant) => ({
                userId: participant.userId,
            })),
            },
        },
        });
        return newChat;
    }

    async addParticipant(slotId: string, userId: string) {
        const slot = await this.prisma.slot.findUnique({
            where: { id: slotId },
            include: { participants: true },
        });

        if (!slot)
            throw new NotFoundException('Slot not found');

        const isSlotParticipant = slot.participants.some(
            (participant) => participant.userId === userId,
        );

        if (!isSlotParticipant)
            throw new ForbiddenException(
                'User is not a participant of this slot',
            );

        const chat = await this.prisma.groupChat.findUnique({
            where: { slotId },
        });

        if (!chat)
            throw new NotFoundException('Chat not found for this slot');

        const existingParticipant = await this.prisma.groupChatParticipant.findUnique({
            where: {
                chatId_userId: {
                    chatId: chat.id,
                    userId,
                },
            },
        });

        if (existingParticipant)
            return existingParticipant;

        return await this.prisma.groupChatParticipant.create({
            data: {
                chatId: chat.id,
                userId,
            },
        });
    }

    async removeParticipant(slotId: string, userId: string) {
        const chat = await this.prisma.groupChat.findUnique({
            where: { slotId },
        });

        if (!chat)
            throw new NotFoundException('Chat not found for this slot');

        const existingParticipant = await this.prisma.groupChatParticipant.findUnique({
            where: {
                chatId_userId: {
                    chatId: chat.id,
                    userId,
                },
            },
        });

        if (!existingParticipant)
            throw new NotFoundException('Participant not found in this chat');

        return await this.prisma.groupChatParticipant.delete({
            where: {
                chatId_userId: {
                    chatId: chat.id,
                    userId,
                },
            },
        });
    }

    async SendMessage(sendMessage: SendMessageDto, userId: string){

        const chat = await this.prisma.groupChat.findUnique({
            where: { id: sendMessage.chatId },
        });

        if (!chat)
            throw new NotFoundException('Chat not found');
        if (!chat.isActive)
            throw new ForbiddenException('chat is closed');
        const isparticipant = await this.prisma.groupChatParticipant.findUnique({
            where: {
                chatId_userId: {
                    chatId: chat.id,
                    userId,
                },
            },
        })
        if (!isparticipant)
            throw new ForbiddenException('User is not a participant of this chat');
        const newmessage = await this.prisma.message.create({
                data: {
                    chatId: chat.id,
                    senderId: userId,
                    content: sendMessage.content,
                },
            })
        return newmessage;
    }

    async getMessages(chatId: string, userId: string){
        const chat = await this.prisma.groupChat.findUnique({
            where: { id: chatId },
        });

        if (!chat)
            throw new NotFoundException('Chat not found');

        const existingParticipant = await this.prisma.groupChatParticipant.findUnique({
            where: {
                chatId_userId: {
                    chatId: chat.id,
                    userId,
                },
            },
        });

        if (!existingParticipant)
            throw new NotFoundException('Participant not found in this chat');

        const messages = await this.prisma.message.findMany({
            where: { chatId: chat.id,},
            orderBy: { createdAt: 'asc',},
            });
        return messages;
    }

    async closechat(slotId: string){
        const chat = await this.prisma.groupChat.findUnique({
            where: { slotId },})
        if (!chat)
            throw new NotFoundException('Slot not found');
        const newchat = await this.prisma.groupChat.update({
            where: { id: chat.id },
            data: {isActive: false},
        })
        return newchat;
    }
}
