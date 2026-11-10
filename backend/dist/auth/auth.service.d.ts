import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { GoogleUser } from './google/google.strategy';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register({ username, email, password, interests }: CreateAuthDto): Promise<{
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
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
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
    }>;
    loginWithGoogle({ googleId, email, emailVerified, username, avatarUrl }: GoogleUser): Promise<{
        accessToken: string;
        refreshToken: string;
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
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    private issueTokens;
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
    update(id: string, { username, bio, avatarUrl, interests }: UpdateAuthDto): Promise<{
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
    changePassword(id: string, { currentPassword, newPassword }: ChangePasswordDto): Promise<void>;
    remove(id: string): Promise<void>;
}
