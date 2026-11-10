import { Injectable, BadRequestException,NotFoundException,ForbiddenException,} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const { content, imageUrl } = createPostDto;

    if (!content?.trim() && !imageUrl) {
      throw new BadRequestException(
        'A post must contain text or an image',
      );
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
  async update(
  postId: string,
  userId: string,
  updatePostDto: UpdatePostDto,
) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  if (post.userId !== userId) {
    throw new ForbiddenException('You cannot edit this post');
  }

  const content =
    updatePostDto.content !== undefined
      ? updatePostDto.content
      : post.content;

  const imageUrl =
    updatePostDto.imageUrl !== undefined
      ? updatePostDto.imageUrl
      : post.imageUrl;

  if (!content?.trim() && !imageUrl) {
    throw new BadRequestException(
      'A post must contain text or an image',
    );
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
async remove(postId: string, userId: string) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundException('Post not found');
  }

  if (post.userId !== userId) {
    throw new ForbiddenException(
      'You cannot delete this post',
    );
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

}