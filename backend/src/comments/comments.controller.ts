
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { JwtGuard } from '../auth/Guards/guards';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

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
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
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
    @Req() request: AuthenticatedRequest,
  ) {
    if (!content || !content.trim()) {
      throw new BadRequestException(
        'Comment content is required',
      );
    }

    return this.commentsService.create(
      postId,
      content,
      request.user.sub,
    );
  }
}


