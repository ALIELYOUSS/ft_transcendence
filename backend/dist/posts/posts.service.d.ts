import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createPostDto: CreatePostDto): Promise<{
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
        content: string | null;
        imageUrl: string | null;
    }>;
    findAll(): Promise<({
        user: {
            username: string;
            avatarUrl: string | null;
            id: string;
        };
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string | null;
        imageUrl: string | null;
    })[]>;
    update(postId: string, userId: string, updatePostDto: UpdatePostDto): Promise<{
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
        content: string | null;
        imageUrl: string | null;
    }>;
    remove(postId: string, userId: string): Promise<{
        message: string;
    }>;
}
