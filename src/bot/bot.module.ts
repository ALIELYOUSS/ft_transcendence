import { Module } from '@nestjs/common';
import { BotController } from './bot.controller.js';
import { BotService } from './bot.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LocationModule } from './location/location.module.js';
import { UserContextService } from './prompts/user-context.js';

@Module({
  imports: [PrismaModule, LocationModule],
  controllers: [BotController],
  providers: [BotService, UserContextService],
})
export class BotModule {}

