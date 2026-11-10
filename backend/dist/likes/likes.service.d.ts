import { PrismaService } from '../prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(postId: string, userId: string): Promise<{
        count: number;
        isLiked: boolean;
    }>;
    create(postId: string, userId: string): Promise<{
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
    remove(postId: string, userId: string): Promise<{
        message: string;
        isLiked: boolean;
        count: number;
    }>;
}
