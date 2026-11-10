import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
    };
}
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, request: AuthenticatedRequest): Promise<{
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
    update(id: string, updatePostDto: UpdatePostDto, request: AuthenticatedRequest): Promise<{
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
    remove(id: string, request: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
