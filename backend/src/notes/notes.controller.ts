import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  Res
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { NotesService } from './notes.service';
import { Express, Response } from 'express';
import { createReadStream, existsSync } from 'fs';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'attachments', maxCount: 10 },
        { name: 'attachments_audio', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createNote(
    @Body() body: any,
    @UploadedFiles()
    files: {
      attachments?: Express.Multer.File[];
      attachments_audio?: Express.Multer.File[];
    },
  ) {
    return this.notesService.createNoteWithAttachments(body, files);
  }

  // ✅ File download endpoint
  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = resolve(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );

    createReadStream(filePath).pipe(res);
  }
}
