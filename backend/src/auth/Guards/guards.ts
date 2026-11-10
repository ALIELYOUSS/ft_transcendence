import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { verifyAccessToken } from '../tokens';

export type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
  };
};

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer access token is required');
    }

    const userId = verifyAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid access token');
    }

    request.user = { sub: userId };
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Administrator access is required');
    }

    return true;
  }
}

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.sub;
    const targetUserId = request.params.id;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user is required');
    }

    if (userId === targetUserId) {
      return true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('You can only access your own account');
    }

    return true;
  }
}
