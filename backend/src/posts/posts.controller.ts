import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(
      '8b61ff73-976b-47c6-b0e0-6737f2e28850',
      createPostDto,
    );
  }

  @Get()
    findAll() {
        return this.postsService.findAll();
    }
 
  @Patch(':id')
    update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    ) {
    return this.postsService.update(
        id,
        '8b61ff73-976b-47c6-b0e0-6737f2e28850',
        updatePostDto,
    );
}
@Delete(':id')
remove(@Param('id') id: string) {
  return this.postsService.remove(
    id,
    '8b61ff73-976b-47c6-b0e0-6737f2e28850',
  );
}
}