import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BotModule } from './bot/bot.module.js';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
    BotModule, 
    ConfigModule.forRoot({ isGlobal: true }), 
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
