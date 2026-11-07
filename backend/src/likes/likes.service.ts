
import {Injectable, NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async findAll(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

  async create(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

  async remove(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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
}

