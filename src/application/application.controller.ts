/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('apply')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  /* @UseInterceptors(FileInterceptor('file')) */
  async create(
    /* @UploadedFile() file: Express.Multer.File, */
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return await this.applicationService.create(createApplicationDto);
  }

  @Post('create-position')
  async createNewPosition() {
    return await this.applicationService.createNewPosition();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-cv')
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.applicationService.uploadCV(
      file.originalname,
      file.mimetype,
      file.buffer,
    );
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
