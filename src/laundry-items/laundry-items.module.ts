import { Module } from '@nestjs/common';
import { LaundryItemsService } from './laundry-items.service';
import { LaundryItemsController } from './laundry-items.controller';
import { LaundryItem, LaundryItemSchema } from './entities/laundry-item.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LaundryItem.name, schema: LaundryItemSchema },
    ]),
  ],
  controllers: [LaundryItemsController],
  exports: [LaundryItemsService],
  providers: [LaundryItemsService],
})
export class LaundryItemsModule {}
