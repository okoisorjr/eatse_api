import { Module } from '@nestjs/common';
import { CombinedBookingsService } from './combined-bookings.service';
import { CombinedBookingsController } from './combined-bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
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
  controllers: [CombinedBookingsController],
  providers: [CombinedBookingsService],
})
export class CombinedBookingsModule {}
