import { Module } from '@nestjs/common';
import { StructureController } from './structure.controller';
import { StructureService } from './structure.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [StructureController],
  providers: [StructureService],
  imports: [PrismaModule]
})
export class StructureModule {}
