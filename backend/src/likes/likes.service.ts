
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  private readonly userId =
    '8b61ff73-976b-47c6-b0e0-6737f2e28850';

  async findAll(postId: string) {
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
          userId: this.userId,
          postId,
        },
      },
    });

    return {
      count,
      isLiked: !!userLike,
    };
  }

  async create(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.like.upsert({
      where: {
        userId_postId: {
          userId: this.userId,
          postId,
        },
      },
      update: {},
      create: {
        userId: this.userId,
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

  async remove(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const result = await this.prisma.like.deleteMany({
      where: {
        userId: this.userId,
        postId,
      },
    });

    return {
      message: 'Like removed successfully',
      isLiked: false,
      count: await this.prisma.like.count({
        where: { postId },
      }),
    };
  }
}
