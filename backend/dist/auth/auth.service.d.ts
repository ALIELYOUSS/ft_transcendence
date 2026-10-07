import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(email: string, password: string): Promise<{
        response: {
            username: string;
            email: string;
            id: string;
            bio: string | null;
            avatarUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            refreshedToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: any;
        refreshToken: any;
    }>;
    reg(createAuthDto: CreateAuthDto): Promise<{
        interests: {
            id: string;
            name: string;
        }[];
        username: string;
        email: string;
        id: string;
        bio: string | null;
        avatarUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        refreshedToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createAuthDto: CreateAuthDto): Promise<{
        interests: {
            id: string;
            name: string;
        }[];
        username: string;
        email: string;
        id: string;
        bio: string | null;
        avatarUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        refreshedToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        id: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateAuthDto: UpdateAuthDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        username: string;
        email: string;
        password: string;
        id: string;
        bio: string | null;
        avatarUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        refreshedToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        username: string;
        email: string;
        password: string;
        id: string;
        bio: string | null;
        avatarUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        refreshedToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
