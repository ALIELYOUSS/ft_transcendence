import { Request } from 'express';
import { UploadsService } from './uploads.service';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
    };
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImage(file: Express.Multer.File, type: string, request: AuthenticatedRequest): Promise<{
        fileUrl?: string | undefined;
        message: string;
        fileId: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
    uploadChatAttachment(file: Express.Multer.File, chatId: string, request: AuthenticatedRequest): Promise<{
        fileUrl?: string | undefined;
        message: string;
        fileId: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
}
export {};
