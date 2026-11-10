import { PrismaService } from '../prisma/prisma.service';
export declare class UploadsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private detectFile;
    private saveFile;
    saveImage(file: Express.Multer.File, type: string, ownerId: string): Promise<{
        fileUrl?: string | undefined;
        message: string;
        fileId: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
    saveChatAttachment(file: Express.Multer.File, chatId: string, ownerId: string): Promise<{
        fileUrl?: string | undefined;
        message: string;
        fileId: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
}
