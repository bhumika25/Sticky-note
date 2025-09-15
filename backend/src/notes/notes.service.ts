import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) { }

  async getNotesForStructure(structureId: number) {
    const descendants = await this.prisma.closureTable.findMany({
      where: { ancestorId: structureId },
      select: { descendantId: true },
    });

    const allStructureIds = [structureId, ...descendants.map(d => d.descendantId)];

    return this.prisma.note.findMany({
      where: { structureId: { in: allStructureIds } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNoteWithAttachments(
    data: {
      structureId: string;
      content: string;
      type?: string;
      tags?: string;
      title: string;
    },
    files: { attachments?: Express.Multer.File[]; attachments_audio?: Express.Multer.File[] },
  ) {
    const attachments = (files.attachments || []).map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      type: 'file',
    }));

    const audioAttachments = (files.attachments_audio || []).map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      type: 'audio',
    }));

    const allAttachments = [...attachments, ...audioAttachments];


    return this.prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'text',
        structureId: Number(data.structureId),
        tags: data.tags ? JSON.parse(data.tags) : [],
        attachments: allAttachments,
      },
    });
  }

}
