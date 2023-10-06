import { Module } from '@nestjs/common';
import { RoomPricesService } from './room-prices.service';
import { RoomPricesController } from './room-prices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomPrice, RoomSchema } from './entities/room-price.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoomPrice.name, schema: RoomSchema }]),
  ],
  controllers: [RoomPricesController],
  providers: [RoomPricesService],
})
export class RoomPricesModule {}
