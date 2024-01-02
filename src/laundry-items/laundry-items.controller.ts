import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LaundryItemsService } from './laundry-items.service';
import { CreateLaundryItemDto } from './dto/create-laundry-item.dto';
import { UpdateLaundryItemDto } from './dto/update-laundry-item.dto';

@Controller('laundry-items')
export class LaundryItemsController {
  constructor(private readonly laundryItemsService: LaundryItemsService) {}

  @Post()
  create(@Body() createLaundryItemDto: CreateLaundryItemDto) {
    return this.laundryItemsService.create(createLaundryItemDto);
  }

  @Get()
  findAll() {
    return this.laundryItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laundryItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaundryItemDto: UpdateLaundryItemDto) {
    return this.laundryItemsService.update(+id, updateLaundryItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laundryItemsService.remove(+id);
  }
}
