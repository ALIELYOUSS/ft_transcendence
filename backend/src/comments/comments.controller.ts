
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Amazing photo!',
        },
      },
      required: ['content'],
    },
  })
  create(
    @Param('postId') postId: string,
    @Body('content') content: string,
  ) {
    if (!content || !content.trim()) {
      throw new BadRequestException(
        'Comment content is required',
      );
    }

    return this.commentsService.create(postId, content);
  }
}

