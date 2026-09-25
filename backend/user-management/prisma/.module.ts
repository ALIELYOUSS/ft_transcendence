import { Module } from '@nestjs/common';
import { prismaService } from './.service';

@Module({
    exports: [prismaService],
    providers: [prismaService],
})
export class PrismaModule {}
