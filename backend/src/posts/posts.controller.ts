import {Controller,Post,Get,Patch,Delete,Param,Body,UseGuards,Req,} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from '../auth/Guards/guards';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.create(
      request.user.sub,
      createPostDto,
    );
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.update(
      id,
      request.user.sub,
      updatePostDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.remove(
      id,
      request.user.sub,
    );
  }
}
