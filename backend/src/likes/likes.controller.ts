import { Controller,Get, Post, Delete, Param, UseGuards, Req, } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { LikesService } from './likes.service';
import { JwtGuard } from '../auth/Guards/guards';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('posts/:postId/likes')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
  ) {}

  @Get()
  findAll(
    @Param('postId') postId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.likesService.findAll(
      postId,
      request.user.sub,
    );
  }

  @Post()
  create(
    @Param('postId') postId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.likesService.create(
      postId,
      request.user.sub,
    );
  }

  @Delete()
  remove(
    @Param('postId') postId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.likesService.remove(
      postId,
      request.user.sub,
    );
  }
}
