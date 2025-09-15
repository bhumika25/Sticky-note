import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Initialize Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

    app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
    
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', 
  });

  await app.listen(3001);
}
bootstrap();
