import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StructureModule } from './structure/structure.module';
import { NotesService } from './notes/notes.service';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from 'prisma/prisma.module';



@Module({
  imports: [StructureModule, NotesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, NotesService],
})
export class AppModule {}
