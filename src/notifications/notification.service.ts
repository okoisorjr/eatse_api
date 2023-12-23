import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import { Model } from 'mongoose';
import { NewNotificationDto } from './notificationDto/newNotification.dto';
import { Booking } from 'src/booking/schema/booking.schema';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private newNotificationModel: Model<Notification>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private bookingService: BookingService,
  ) {}

  /* @Cron(' * * * * * * ')
  async sendNotificationToEaser() {
    var easers = [];
    const todays_bookings = await this.bookingService.getAllBookingsForToday();
    for (let i = 0; i < todays_bookings.length; i++) {
      easers.push(todays_bookings[i].easer);
      //console.log(todays_bookings[i].easer._id);
    }
    return easers;
  } */

  async createNewNotification(
    newNotification: NewNotificationDto,
  ): Promise<Notification> {
    let new_Notice: Notification;
    try {
      new_Notice = await this.newNotificationModel.create(newNotification);
      return new_Notice;
    } catch (error) {
      throw new HttpException(error, HttpStatus.REQUEST_TIMEOUT);
    }
  }

  async retrieveAllNotifications(): Promise<Notification[]> {
    const notifications = await this.newNotificationModel.find();

    if (!notifications) {
      throw new NotFoundException('No record found!');
    }

    return notifications;
  }

  async fetchRoleBasedNotifications(role: string): Promise<Notification[]> {
    const notifications = await this.newNotificationModel.find({
      target: role,
    }).select('title notice createdAt');

    if (!notifications) {
      throw new NotFoundException('No record found!');
    }

    return notifications;
  }
}
