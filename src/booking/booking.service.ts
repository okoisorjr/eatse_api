import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Booking } from './schema/booking.schema';
import { NewBookingDto } from './bookingDto/newBooking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>, //@InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async sendNotificationToEaser() {
    //const easer =
    //const notice = await this.notificationModel.create();
    //return notice;
  }

  getTodaysDate() {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todays_date = today.toDateString();

    return todays_date;
  }

  // create a new booking
  async saveNewBooking(booking: NewBookingDto) {
    const new_booking = await this.bookingModel.create(booking);
    return new_booking;
  }

  // retrieve all the bookings that has been assigned to an easer for the present day
  async getEaserPresentDayBookings(easerId: string): Promise<Booking[]> {
    const easerBookings = await this.bookingModel.find({
      $and: [
        { easer: easerId },
        {
          dates: {
            $elemMatch: {
              date: { $eq: this.getTodaysDate() },
              isCompleted: { $eq: false },
            },
          },
        },
      ],
    });
    return easerBookings;
  }

  // retrieve all the bookings assigned to a particular easer
  async getAllEaserBookings(easerId: string): Promise<Booking[]> {
    const easerBookings = await this.bookingModel.find({
      $and: [{ easer: easerId }],
    });
    return easerBookings;
  }

  // retrieve all bookings in the database
  async getAllBookings(): Promise<Booking[]> {
    const bookings = await this.bookingModel.find();
    return bookings;
  }

  // retrieve all bookings scheduled for the present day which has not been cleaned
  async getAllBookingsForToday() {
    const bookings = await this.bookingModel
      .find({
        $and: [
          {
            dates: {
              $elemMatch: {
                date: { $eq: this.getTodaysDate() },
                isCompleted: { $eq: false },
              },
            },
          },
        ],
      })
      .populate('easer', 'id')
      .exec();

    return bookings;
  }

  async getAllBookingsCleanedForToday() {
    const bookings = await this.bookingModel
      .find({
        $and: [
          {
            dates: {
              $elemMatch: {
                date: { $eq: this.getTodaysDate() },
                isCompleted: { $eq: true },
              },
            },
          },
        ],
      })
      .populate('easer', 'id')
      .exec();

    return bookings;
  }

  // retrieve a single booking from the database
  async getSingleBooking(bookingId): Promise<Booking> {
    return await this.bookingModel.findById(bookingId);
  }

  //retrieve single booking assigned to a particular easer
  async getSingleBookingForEaser(easerId, bookingId) {
    const booking = await this.bookingModel.find({
      $and: [{ easer: easerId }, { _id: bookingId }],
    });
    return booking;
  }

  // update todays booking isCompleted status from false to true, when easer arrives at clients house and clicks arrived
  async updateBookingDateCompletedStatus(bookingId: string, dateId: string) {
    const update = await this.bookingModel.updateOne(
      {
        _id: bookingId,
        'dates._id': dateId,
      },
      { $set: { 'dates.$[element].isCompleted': true } },
      { arrayFilters: [{ 'element._id': dateId }] },
    );
    return update;
  }
}
