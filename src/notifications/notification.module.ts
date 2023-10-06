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
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { Errand, ErrandSchema } from 'src/errands/schema/errand.schema';
import { Laundry, LaundrySchema } from 'src/laundry/entities/laundry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewNotification.name, schema: NewNotificationSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Errand.name, schema: ErrandSchema },
      { name: Laundry.name, schema: LaundrySchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, BookingService],
})
export class NotificationModule {}
