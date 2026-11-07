import { Injectable, BadRequestException, ForbiddenException, NotFoundException,} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  private async detectFile(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File must be smaller than 5MB');
    }

    const extension = file.originalname
      .toLowerCase()
      .split('.')
      .pop();

    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(file.buffer);

    const images: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };

    if (detected && images[detected.mime]) {
      if (file.mimetype !== detected.mime) {
        throw new BadRequestException('File type mismatch');
      }

      return {
        mimeType: detected.mime,
        extension: images[detected.mime],
      };
    }

    if (detected?.mime === 'application/pdf') {
      if (file.mimetype !== 'application/pdf' || extension !== 'pdf') {
        throw new BadRequestException('Invalid PDF file');
      }

      return { mimeType: 'application/pdf', extension: '.pdf' };
    }

    if (
      extension === 'txt' &&
      (file.mimetype === 'text/plain' ||
        file.mimetype === 'application/octet-stream')
    ) {
      try {
        const content = new TextDecoder('utf-8', {
          fatal: true,
        }).decode(file.buffer);

        if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content)) {
          throw new Error('Invalid text content');
        }
      } catch {
        throw new BadRequestException('Invalid TXT file');
      }

      return { mimeType: 'text/plain', extension: '.txt' };
    }

    throw new BadRequestException('Unsupported file format');
  }

  private async saveFile(
    file: Express.Multer.File,
    ownerId: string,
    purpose: 'AVATAR' | 'POST' | 'CHAT',
    folder: string,
    isPrivate: boolean,
  ) {
    const detected = await this.detectFile(file);

    if (
      purpose !== 'CHAT' &&
      !detected.mimeType.startsWith('image/')
    ) {
      throw new BadRequestException(
        'Only images are allowed for posts and avatars',
      );
    }
    const filename = `${randomUUID()}${detected.extension}`;
    const storageKey = `${folder}/${filename}`;
    const filePath = join(process.cwd(), 'uploads', storageKey);

    await mkdir(join(process.cwd(), 'uploads', folder), {
      recursive: true,
    });

    await writeFile(filePath, file.buffer);

    try {
      const savedFile = await this.prisma.uploadedFile.create({
        data: {
          ownerId,
          originalName: file.originalname,
          storageKey,
          mimeType: detected.mimeType,
          size: file.size,
          purpose,
        },
      });

      return {
        message: 'File uploaded successfully',
        fileId: savedFile.id,
        originalName: savedFile.originalName,
        mimeType: savedFile.mimeType,
        size: savedFile.size,
        ...(!isPrivate && {
          fileUrl: `/uploads/${storageKey}`,
        }),
      };
    } catch (error) {
      await unlink(filePath);
      throw error;
    }
  }

  async saveImage(file: Express.Multer.File, type: string, ownerId: string) {
    if (type !== 'posts' && type !== 'avatars') {
      throw new BadRequestException('Invalid upload type');
    }

    const purpose = type === 'avatars' ? 'AVATAR' : 'POST';

    return this.saveFile(file, ownerId, purpose, type, false);
  }

  async saveChatAttachment(
    file: Express.Multer.File,
    chatId: string,
    ownerId: string,
  ) {
    const chat = await this.prisma.groupChat.findUnique({
      where: { id: chatId },
      select: { isActive: true },
    });

    if (!chat || !chat.isActive) {
      throw new NotFoundException('Chat not found or inactive');
    }

    const participant =
      await this.prisma.groupChatParticipant.findUnique({
        where: {
          chatId_userId: {
            chatId,
            userId: ownerId,
          },
        },
      });

    if (!participant) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return this.saveFile(
      file,
      ownerId,
      'CHAT',
      'private/chat',
      true,
    );
  }
}

