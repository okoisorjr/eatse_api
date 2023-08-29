import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating, RatingSchema } from './schema/rating.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Easer.name, schema: EaserSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
