import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewNotification,
  NewNotificationSchema,
} from './schema/newNotification.schema';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { BookingService } from 'src/booking/booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewNotification.name, schema: NewNotificationSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, BookingService],
})
export class NotificationModule {}
