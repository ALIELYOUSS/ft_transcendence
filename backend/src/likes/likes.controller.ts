
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
  ) {}

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.likesService.findAll(postId);
  }

  @Post()
  create(@Param('postId') postId: string) {
    return this.likesService.create(postId);
  }

  @Delete()
  remove(@Param('postId') postId: string) {
    return this.likesService.remove(postId);
  }
}
