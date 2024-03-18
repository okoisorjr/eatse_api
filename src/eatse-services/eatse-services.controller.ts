import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
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
  findAll(@Query() query: any) {
    if(query){
      console.log(query.category);
      return this.eatseServicesService.findAll(query.category);
    } else {
      return this.eatseServicesService.findAll();
    }
    
  }

  @Get(':service_name')
  findOne(@Param('service_name') name: string) {
    return this.eatseServicesService.findOne(name);
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
