import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomPricesService } from './room-prices.service';
import { CreateRoomPriceDto } from './dto/create-room-price.dto';
import { UpdateRoomPriceDto } from './dto/update-room-price.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('room-prices')
export class RoomPricesController {
  constructor(private readonly roomPricesService: RoomPricesService) {}

  @Post()
  create(@Body() createRoomPriceDto: CreateRoomPriceDto) {
    return this.roomPricesService.create(createRoomPriceDto);
  }

  @Get()
  findAll() {
    return this.roomPricesService.findAll();
  }

  @Get(':service')
  findOne(@Param('service') service: string) {
    return this.roomPricesService.findOne(service);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomPriceDto: UpdateRoomPriceDto,
  ) {
    return this.roomPricesService.update(+id, updateRoomPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomPricesService.remove(+id);
  }
}
