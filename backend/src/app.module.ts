import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UploadsModule } from './uploads/uploads.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';



@Module({
  imports: [PrismaModule, AuthModule,PostsModule, UploadsModule, CommentsModule, LikesModule],
})

export class AppModule {}
