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
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async loginWithGoogle(googleUser) {
        if (!googleUser.email) {
            throw new common_1.ConflictException('Google account does not have an email');
        }
        let user = await this.prisma.user.findUnique({
            where: { googleId: googleUser.googleId },
        });
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
            });
        }
        if (user) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId: googleUser.googleId,
                },
            });
        }
        else {
            const username = `${googleUser.username || googleUser.email.split('@')[0]}-${googleUser.googleId.slice(-6)}`;
            user = await this.prisma.user.create({
                data: {
                    username,
                    email: googleUser.email,
                    googleId: googleUser.googleId,
                    password: await bcrypt.hash((0, crypto_1.randomBytes)(32).toString('hex'), 10),
                    intrests: {
                        connectOrCreate: [],
                    },
                },
            });
        }
        const tokens = await this.createTokens(user.id, user.email);
        const { password: _, refreshedToken: __, ...response } = user;
        return { response, ...tokens };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.ConflictException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.ConflictException('Invalid email or password');
        }
        const { accessToken, refreshToken } = await this.createTokens(user.id, user.email);
        const { password: _, ...response } = user;
        return { response, accessToken, refreshToken };
    }
    async createTokens(userId, email) {
        const jwtPayload = { sub: userId, email };
        const Jwt = require('jsonwebtoken');
        const accessToken = Jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = Jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshedToken: await bcrypt.hash(refreshToken, 10) },
        });
        return { accessToken, refreshToken };
    }
    async reg(createAuthDto) {
        const { email, password, username, interests } = createAuthDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                username,
                email,
                password: hashPass,
                interests: {
                    connectOrCreate: interests.map((interestName) => ({
                        where: {
                            name: interestName,
                        },
                        create: {
                            name: interestName,
                        },
                    })),
                },
            },
            include: {
                interests: true,
            },
        });
        console.log("New user created:", newUser);
        const { password: _, ...response } = newUser;
        return response;
    }
    create(createAuthDto) {
        return this.reg(createAuthDto);
    }
    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
            },
        });
    }
    findOne(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
            },
        });
    }
    update(id, updateAuthDto) {
        const { interests: _interests, ...data } = updateAuthDto;
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    remove(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map