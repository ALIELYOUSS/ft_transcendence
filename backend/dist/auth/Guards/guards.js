"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerOrAdminGuard = exports.AdminGuard = exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const Jwt = require('jsonwebtoken');
let JwtGuard = class JwtGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const [scheme, token] = authorization?.split(' ') ?? [];
        if (scheme !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Bearer access token is required');
        }
        try {
            const payload = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (!payload.sub) {
                throw new common_1.UnauthorizedException('Invalid access token');
            }
            request.user = { sub: payload.sub };
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)()
], JwtGuard);
let AdminGuard = class AdminGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('Authenticated user is required');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (user?.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Administrator access is required');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminGuard);
let OwnerOrAdminGuard = class OwnerOrAdminGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.sub;
        const targetUserId = request.params.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Authenticated user is required');
        }
        if (userId === targetUserId) {
            return true;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (user?.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('You can only access your own account');
        }
        return true;
    }
};
exports.OwnerOrAdminGuard = OwnerOrAdminGuard;
exports.OwnerOrAdminGuard = OwnerOrAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnerOrAdminGuard);
//# sourceMappingURL=guards.js.map