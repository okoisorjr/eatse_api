import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NewNotification } from './schema/newNotification.schema';
import { Model } from 'mongoose';
import { NewNotificationDto } from './notificationDto/newNotification.dto';
import { Booking } from 'src/booking/schema/booking.schema';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NewNotification.name)
    private newNotificationModel: Model<NewNotification>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private bookingService: BookingService,
  ) {}

  @Cron(' * * * * * * ')
  async sendNotificationToEaser() {
    var easers = [];
    const todays_bookings = await this.bookingService.getAllBookingsForToday();
    for (let i = 0; i < todays_bookings.length; i++) {
      easers.push(todays_bookings[i].easer);
      //console.log(todays_bookings[i].easer._id);
    }
    return easers;
  }

  async createNewNotification(newNotification: NewNotificationDto) {
    const new_Notice = await this.newNotificationModel.create(newNotification);
    return new_Notice;
  }
}
