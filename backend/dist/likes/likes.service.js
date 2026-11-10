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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikesService = class LikesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(postId, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const count = await this.prisma.like.count({
            where: { postId },
        });
        const userLike = await this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
        return {
            count,
            isLiked: !!userLike,
        };
    }
    async create(postId, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.prisma.like.upsert({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
            update: {},
            create: {
                userId,
                postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    async remove(postId, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.prisma.like.deleteMany({
            where: {
                userId,
                postId,
            },
        });
        const count = await this.prisma.like.count({
            where: { postId },
        });
        return {
            message: 'Like removed successfully',
            isLiked: false,
            count,
        };
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map