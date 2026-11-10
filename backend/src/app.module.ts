import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [PrismaModule, AuthModule, PostsModule, UploadsModule, CommentsModule, LikesModule],
})
export class AppModule {}
