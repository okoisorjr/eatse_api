/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/booking.schema';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { Errand, ErrandSchema } from 'src/errands/schema/errand.schema';
import {
  Fumigation,
  FumigationSchema,
} from 'src/fumigation/schema/fumigation.schema';
import { Laundry, LaundrySchema } from 'src/laundry/entities/laundry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Errand.name, schema: ErrandSchema },
      { name: Fumigation.name, schema: FumigationSchema },
      { name: Laundry.name, schema: LaundrySchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
