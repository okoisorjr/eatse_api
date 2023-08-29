import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EatseServicesService } from './eatse-services.service';
import { CreateEatseServiceDto } from './dto/create-eatse-service.dto';
import { UpdateEatseServiceDto } from './dto/update-eatse-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('eatse-services')
export class EatseServicesController {
  constructor(private readonly eatseServicesService: EatseServicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createEatseServiceDto: CreateEatseServiceDto) {
    return this.eatseServicesService.create(file.originalname, file.mimetype, file.buffer, createEatseServiceDto);
  }

  @Get()
  findAll() {
    return this.eatseServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eatseServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEatseServiceDto: UpdateEatseServiceDto) {
    return this.eatseServicesService.update(+id, updateEatseServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eatseServicesService.remove(+id);
  }
}
