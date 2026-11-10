import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [PrismaModule, SlotsModule],
})
export class AppModule {}
