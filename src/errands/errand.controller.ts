import { Controller, Get, Body, Param, Post } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { ErrandDto } from './errandDto/errand.dto';

@Controller('errands')
export class ErrandController {
  constructor(private errandService: ErrandService) {}

  @Get()
  getAllErrands() {
    return this.errandService.fetchAllErrands();
  }

  @Post()
  saveErrand(@Body() body: ErrandDto) {
    return this.errandService.saveNewErrand(body);
  }
}
