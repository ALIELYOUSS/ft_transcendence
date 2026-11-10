import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(postId: string, content: string, userId: string): Promise<{
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
