import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingMallsService } from './shopping-malls.service';
import { CreateShoppingMallDto } from './dto/create-shopping-mall.dto';
import { UpdateShoppingMallDto } from './dto/update-shopping-mall.dto';

@Controller('shopping-malls')
export class ShoppingMallsController {
  constructor(private readonly shoppingMallsService: ShoppingMallsService) {}

  @Post()
  create(@Body() createShoppingMallDto: CreateShoppingMallDto) {
    return this.shoppingMallsService.create(createShoppingMallDto);
  }

  @Get()
  findAll() {
    return this.shoppingMallsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingMallsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingMallDto: UpdateShoppingMallDto) {
    return this.shoppingMallsService.update(+id, updateShoppingMallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingMallsService.remove(+id);
  }
}
