import { Controller, Post, Get, Body } from '@nestjs/common';
import { StructureService } from './structure.service';
import { CreateStructureDto } from './dto/create-structure.dto';

@Controller('structures')
export class StructureController {
  constructor(private readonly structuresService: StructureService) {}


  @Post()
  createStructure(@Body() dto: CreateStructureDto) {
    return this.structuresService.createStructure(dto);
  }

  @Get()
  getHierarchy() {
    return this.structuresService.getHierarchy();
  }
}
