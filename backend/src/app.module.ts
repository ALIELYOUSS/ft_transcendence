import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { UploadsModule } from './uploads/uploads.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';


// import { registerAs } from './auth';

@Module({
  imports: [AuthModule, PrismaModule,PostsModule, UploadsModule, CommentsModule,LikesModule,],
})

export class AppModule {}
