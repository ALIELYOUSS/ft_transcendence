import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export type AuthenticatedRequest = Request & {
    user?: {
        sub: string;
    };
};
export declare class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class AdminGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class OwnerOrAdminGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
