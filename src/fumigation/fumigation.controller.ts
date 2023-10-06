import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { FumigationService } from './fumigation.service';
import { FumigationDto } from './fumigationDto/fumigation.dto';

@Controller('fumigation')
export class FumigationController {
  constructor(private readonly fumigationService: FumigationService) {}

  @Post()
  createFumigation(@Body() booking: FumigationDto) {
    return this.fumigationService.bookFumigation(booking);
  }

  @Get()
  listAllFumigations(){
    return this.fumigationService.listAllFumigationBookings();
  }

  @Get(':client_id')
  listFumigations(@Param('client_id') id: string){
    return this.fumigationService.listClientFumigationBookings(id);
  }
}
