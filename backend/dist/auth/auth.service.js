"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const safe_user_1 = require("./safe-user");
const tokens_1 = require("./tokens");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register({ username, email, password, interests }) {
        if (await this.prisma.user.findUnique({ where: { email }, select: { id: true } })) {
            throw new common_1.ConflictException('Email is already registered');
        }
        if (await this.prisma.user.findUnique({ where: { username }, select: { id: true } })) {
            throw new common_1.ConflictException('Username is already taken');
        }
        return this.prisma.user
            .create({
            data: {
                username,
                email,
                password: await bcrypt.hash(password, 10),
                interests: (0, safe_user_1.interestsInput)(interests),
            },
            select: safe_user_1.SAFE_USER_SELECT,
        })
            .catch(safe_user_1.rethrowPrismaError);
    }
    async login(email, password) {
        const found = await this.prisma.user.findUnique({
            where: { email },
            select: { ...safe_user_1.SAFE_USER_SELECT, password: true },
        });
        if (!found?.password || !(await bcrypt.compare(password, found.password))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { password: _, ...user } = found;
        return { user, ...(await this.issueTokens(user.id)) };
    }
    async loginWithGoogle({ googleId, email, emailVerified, username, avatarUrl }) {
        const linked = await this.prisma.user.findUnique({
            where: { googleId },
            select: { id: true, avatarUrl: true },
        });
        if (!linked && (!email || !emailVerified)) {
            throw new common_1.ForbiddenException('Your Google email address is not verified');
        }
        const existing = linked ??
            (await this.prisma.user.findUnique({ where: { email }, select: { id: true, avatarUrl: true } }));
        const user = existing
            ? await this.prisma.user.update({
                where: { id: existing.id },
                data: { googleId, avatarUrl: existing.avatarUrl ?? avatarUrl },
                select: safe_user_1.SAFE_USER_SELECT,
            })
            : await this.prisma.user
                .create({
                data: {
                    googleId,
                    email: email,
                    avatarUrl,
                    username: `${username || email.split('@')[0]}-${googleId.slice(-6)}`,
                },
                select: safe_user_1.SAFE_USER_SELECT,
            })
                .catch(safe_user_1.rethrowPrismaError);
        return { user, ...(await this.issueTokens(user.id)) };
    }
    async refresh(refreshToken) {
        const userId = (0, tokens_1.verifyRefreshToken)(refreshToken);
        const stored = userId
            ? await this.prisma.user.findUnique({ where: { id: userId }, select: { refreshedToken: true } })
            : null;
        if (!userId || !stored?.refreshedToken || !(0, tokens_1.refreshTokenMatches)(refreshToken, stored.refreshedToken)) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return this.issueTokens(userId);
    }
    async logout(refreshToken) {
        const userId = (0, tokens_1.verifyRefreshToken)(refreshToken);
        if (userId) {
            await this.prisma.user.updateMany({ where: { id: userId }, data: { refreshedToken: null } });
        }
    }
    async issueTokens(userId) {
        const accessToken = (0, tokens_1.signAccessToken)(userId);
        const refreshToken = (0, tokens_1.signRefreshToken)(userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshedToken: (0, tokens_1.hashRefreshToken)(refreshToken) },
        });
        return { accessToken, refreshToken };
    }
    findAll() {
        return this.prisma.user.findMany({ select: safe_user_1.SAFE_USER_SELECT });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: safe_user_1.SAFE_USER_SELECT });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    update(id, { username, bio, avatarUrl, interests }) {
        return this.prisma.user
            .update({
            where: { id },
            data: {
                username,
                bio,
                avatarUrl,
                ...(interests && { interests: { set: [], ...(0, safe_user_1.interestsInput)(interests) } }),
            },
            select: safe_user_1.SAFE_USER_SELECT,
        })
            .catch(safe_user_1.rethrowPrismaError);
    }
    async changePassword(id, { currentPassword, newPassword }) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: { password: true } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.password && !(currentPassword && (await bcrypt.compare(currentPassword, user.password)))) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        await this.prisma.user.update({
            where: { id },
            data: { password: await bcrypt.hash(newPassword, 10), refreshedToken: null },
        });
    }
    async remove(id) {
        await this.prisma.user.delete({ where: { id }, select: { id: true } }).catch(safe_user_1.rethrowPrismaError);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map