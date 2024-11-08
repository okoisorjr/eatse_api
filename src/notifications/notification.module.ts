import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schema/notification.schema';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { BookingService } from 'src/booking/booking.service';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { Errand, ErrandSchema } from 'src/errands/schema/errand.schema';
import { Laundry, LaundrySchema } from 'src/laundry/entities/laundry.entity';
import { Employee, EmployeeSchema } from 'src/employee/entities/employee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Errand.name, schema: ErrandSchema },
      { name: Laundry.name, schema: LaundrySchema },
      { name: Employee.name, schema: EmployeeSchema }
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, BookingService],
})
export class NotificationModule {}
