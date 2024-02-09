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
import { CreatePositionDto } from './dto/create-position.dto';

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

  @Get('applications/analysis')
  getApplicantAnalysis() {
    return this.applicationService.getApplicantsAnalysis();
  }

  @Post('create-position')
  async createNewPosition(@Body() createPositionDto: CreatePositionDto) {
    return await this.applicationService.createNewPosition(createPositionDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-cv')
  async uploadProfile(@UploadedFile() file: Express.Multer.File) {
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

  @Get('applications/role/:position_id')
  fetchRoleApplications(@Param('position_id') position_id: string) {
    return this.applicationService.getApplicationsPerRole(position_id);
  }

  @Get('openings')
  findAllOpenings() {
    return this.applicationService.findAllJobOpenings();
  }

  @Get('applications/applicants/:applicant_id')
  fetchSingleApplicant(@Param('applicant_id') applicant_id: string) {
    return this.applicationService.getSingleApplicant(applicant_id);
  }

  @Get('positions/all')
  findAllPositions() {
    return this.applicationService.findAllJobs();
  }

  @Get('positions/:position_id')
  getSinglePosition(@Param('position_id') position_id: string) {
    return this.applicationService.getSinglePosition(position_id);
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
