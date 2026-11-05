import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    
    constructor() {
        const adp = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        super({ adapter: adp });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
