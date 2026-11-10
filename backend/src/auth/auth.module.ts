import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import googleConfig from './google/google.config';
import { GoogleStrategy } from './google/google.strategy';
import { AdminGuard, JwtGuard, OwnerOrAdminGuard } from './Guards/guards';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtGuard, AdminGuard, OwnerOrAdminGuard],
  exports: [JwtGuard],
})
export class AuthModule {}
