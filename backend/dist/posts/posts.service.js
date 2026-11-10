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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPostDto) {
        const { content, imageUrl } = createPostDto;
        if (!content?.trim() && !imageUrl) {
            throw new common_1.BadRequestException('A post must contain text or an image');
        }
        return this.prisma.post.create({
            data: {
                content,
                imageUrl,
                userId,
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
    async findAll() {
        return this.prisma.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
    }
    async update(postId, userId, updatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You cannot edit this post');
        }
        const content = updatePostDto.content !== undefined
            ? updatePostDto.content
            : post.content;
        const imageUrl = updatePostDto.imageUrl !== undefined
            ? updatePostDto.imageUrl
            : post.imageUrl;
        if (!content?.trim() && !imageUrl) {
            throw new common_1.BadRequestException('A post must contain text or an image');
        }
        return this.prisma.post.update({
            where: { id: postId },
            data: {
                content: updatePostDto.content,
                imageUrl: updatePostDto.imageUrl,
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
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException('You cannot delete this post');
        }
        await this.prisma.$transaction([
            this.prisma.comment.deleteMany({
                where: { postId },
            }),
            this.prisma.like.deleteMany({
                where: { postId },
            }),
            this.prisma.hiddenPost.deleteMany({
                where: { postId },
            }),
            this.prisma.postReport.deleteMany({
                where: { postId },
            }),
            this.prisma.savedPost.deleteMany({
                where: { postId },
            }),
            this.prisma.post.delete({
                where: { id: postId },
            }),
        ]);
        return {
            message: 'Post deleted successfully',
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map