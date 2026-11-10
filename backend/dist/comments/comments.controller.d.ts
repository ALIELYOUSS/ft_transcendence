import { Request } from 'express';
import { CommentsService } from './comments.service';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
    };
}
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findAll(postId: string): Promise<({
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
        content: string;
        postId: string;
    })[]>;
    create(postId: string, content: string, request: AuthenticatedRequest): Promise<{
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
        content: string;
        postId: string;
    }>;
}
export {};
