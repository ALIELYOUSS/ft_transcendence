import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { type AuthenticatedRequest } from './Guards/guards';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    register(dto: CreateAuthDto): Promise<{
        username: string;
        email: string;
        interests: {
            name: string;
        }[];
        bio: string | null;
        avatarUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login({ email, password }: LoginDto, res: Response): Promise<{
        user: {
            username: string;
            email: string;
            interests: {
                name: string;
            }[];
            bio: string | null;
            avatarUrl: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    googleLogin(): void;
    googleCallback(req: Request, res: Response): Promise<void>;
    me(req: AuthenticatedRequest): Promise<{
        username: string;
        email: string;
        interests: {
            name: string;
        }[];
        bio: string | null;
        avatarUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        username: string;
        email: string;
        interests: {
            name: string;
        }[];
        bio: string | null;
        avatarUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        username: string;
        email: string;
        interests: {
            name: string;
        }[];
        bio: string | null;
        avatarUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateAuthDto): Promise<{
        username: string;
        email: string;
        interests: {
            name: string;
        }[];
        bio: string | null;
        avatarUrl: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(id: string, dto: ChangePasswordDto): Promise<void>;
    remove(id: string): Promise<void>;
}
