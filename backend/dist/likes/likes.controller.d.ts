import type { Request } from 'express';
import { LikesService } from './likes.service';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
    };
}
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    findAll(postId: string, request: AuthenticatedRequest): Promise<{
        count: number;
        isLiked: boolean;
    }>;
    create(postId: string, request: AuthenticatedRequest): Promise<{
        user: {
            username: string;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        postId: string;
    }>;
    remove(postId: string, request: AuthenticatedRequest): Promise<{
        message: string;
        isLiked: boolean;
        count: number;
    }>;
}
export {};
