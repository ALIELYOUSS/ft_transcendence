import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import googleConfig from './google-oauth.config';
import { GoogleStrategy } from './google.strategy';
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
})
export class AuthModule {}
