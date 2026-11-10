"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
let UploadsService = class UploadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async detectFile(file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('File must be smaller than 5MB');
        }
        const extension = file.originalname
            .toLowerCase()
            .split('.')
            .pop();
        const { fileTypeFromBuffer } = await import('file-type');
        const detected = await fileTypeFromBuffer(file.buffer);
        const images = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
        };
        if (detected && images[detected.mime]) {
            if (file.mimetype !== detected.mime) {
                throw new common_1.BadRequestException('File type mismatch');
            }
            return {
                mimeType: detected.mime,
                extension: images[detected.mime],
            };
        }
        if (detected?.mime === 'application/pdf') {
            if (file.mimetype !== 'application/pdf' || extension !== 'pdf') {
                throw new common_1.BadRequestException('Invalid PDF file');
            }
            return { mimeType: 'application/pdf', extension: '.pdf' };
        }
        if (extension === 'txt' &&
            (file.mimetype === 'text/plain' ||
                file.mimetype === 'application/octet-stream')) {
            try {
                const content = new TextDecoder('utf-8', {
                    fatal: true,
                }).decode(file.buffer);
                if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content)) {
                    throw new Error('Invalid text content');
                }
            }
            catch {
                throw new common_1.BadRequestException('Invalid TXT file');
            }
            return { mimeType: 'text/plain', extension: '.txt' };
        }
        throw new common_1.BadRequestException('Unsupported file format');
    }
    async saveFile(file, ownerId, purpose, folder, isPrivate) {
        const detected = await this.detectFile(file);
        if (purpose !== 'CHAT' &&
            !detected.mimeType.startsWith('image/')) {
            throw new common_1.BadRequestException('Only images are allowed for posts and avatars');
        }
        const filename = `${(0, crypto_1.randomUUID)()}${detected.extension}`;
        const storageKey = `${folder}/${filename}`;
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', storageKey);
        await (0, promises_1.mkdir)((0, path_1.join)(process.cwd(), 'uploads', folder), {
            recursive: true,
        });
        await (0, promises_1.writeFile)(filePath, file.buffer);
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
        }
        catch (error) {
            await (0, promises_1.unlink)(filePath);
            throw error;
        }
    }
    async saveImage(file, type, ownerId) {
        if (type !== 'posts' && type !== 'avatars') {
            throw new common_1.BadRequestException('Invalid upload type');
        }
        const purpose = type === 'avatars' ? 'AVATAR' : 'POST';
        return this.saveFile(file, ownerId, purpose, type, false);
    }
    async saveChatAttachment(file, chatId, ownerId) {
        const chat = await this.prisma.groupChat.findUnique({
            where: { id: chatId },
            select: { isActive: true },
        });
        if (!chat || !chat.isActive) {
            throw new common_1.NotFoundException('Chat not found or inactive');
        }
        const participant = await this.prisma.groupChatParticipant.findUnique({
            where: {
                chatId_userId: {
                    chatId,
                    userId: ownerId,
                },
            },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('You are not a member of this chat');
        }
        return this.saveFile(file, ownerId, 'CHAT', 'private/chat', true);
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map