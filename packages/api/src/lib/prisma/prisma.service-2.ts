import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient as PrismaClient2 } from '@prisma/client';

@Injectable()
export class PrismaService2 extends PrismaClient2 implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
