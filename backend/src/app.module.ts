import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { registerAs } from './auth';

@Module({
  imports: [AuthModule, PrismaModule],
})

export class AppModule {}
