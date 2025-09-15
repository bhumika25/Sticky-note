// src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.registerShutdownHook(app);
  }

  private async registerShutdownHook(app: INestApplication) {
    app.getHttpAdapter().getInstance().once('shutdown', async () => {
      console.log('Prisma client is disconnecting...');
      await this.$disconnect();
    });
  }
}
