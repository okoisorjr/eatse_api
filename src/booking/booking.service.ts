/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import mongoose, { Model, Types } from 'mongoose';
import { Booking } from './schema/booking.schema';
import { NewBookingDto } from './bookingDto/newBooking.dto';
import { Client } from 'src/clients/schema/client.schema';
import { Errand } from 'src/errands/schema/errand.schema';
import { Laundry } from 'src/laundry/entities/laundry.entity';
import { Service } from 'src/shared/services.enum';
import { UpdateBookingEaserDto } from './bookingDto/UpdateBookingEaser.dto';
import { CancellationStages } from 'src/shared/cancellation-stages.enum';
import { UpdateBookingDto } from './bookingDto/UpdateBooking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Errand.name) private errandsModel: Model<Errand>,
    @InjectModel(Booking.name) private easerModel: Model<Booking>,
    @InjectModel(Laundry.name) private laundryModel: Model<Laundry>, //@InjectModel(Notification.name) private notificationModel: Model<Notification>
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
    const dates = [];

    if (
      booking.buildingType !== 'commercial' &&
      booking.rooms < 2 &&
      booking.service !== Service.FUMIGATION
    ) {
      throw new HttpException(
        'This is not a commercial property, please specify the number of rooms',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (booking.dates.length < 0) {
      throw new HttpException(
        'Please you have to select the days you would like us to send an Easer to you',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (booking.frequency === 'one-time' && booking.dates.length > 1) {
      throw new HttpException(
        'A one time booking cannot have more than one schedule date',
        HttpStatus.BAD_REQUEST,
      );
    }

    booking.dates.forEach((date) => {
      const data = {
        date: date,
        isCompleted: false,
      };
      dates.push(data);
    });

    booking.dates = dates;

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
  async getAllBookings(query?: any): Promise<Booking[]> {
    try {
      const bookings = await this.bookingModel
        .find()
        .populate({
          path: 'client',
          select: 'id firstname lastname phone email referralCode',
        })
        .populate({
          path: 'address',
          select: 'id country state city street zip_code',
        })
        .populate({
          path: 'easer',
          select: 'id firstname lastname phone email referralCode rating',
        })
        .populate({
          path: 'address',
          select: 'id country state city zip_code street',
        })
        .limit(query ? query.limit : 0)
        .sort({ createdAt: -1 });
      console.log(bookings);
      return bookings;
    } catch (error) {
      console.log(error);
      return error;
    }
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

  async assignEaserToBooking(data: UpdateBookingEaserDto) {
    try {
      const assigned_booking = await this.bookingModel.findByIdAndUpdate(
        data.booking_id,
        { easer: data.easer_id, active: true },
        {
          upsert: true,
          new: true,
        },
      );
      //console.log(assigned_booking);

      return assigned_booking._id;
    } catch (error) {
      console.log(error);
    }
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

  async getAllClientsBooking(client_id: string): Promise<Booking[]> {
    const client = await this.clientModel.findById(client_id);

    if (!client) {
      throw new HttpException(
        'Oops...resource not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    //console.log('client_id selected: ' , client_id);
    const client_bookings = await this.bookingModel
      .find()
      .populate('easer')
      .populate('client')
      .populate('address')
      .exec();
    return client_bookings;
  }

  async getAllClientsActiveBooking(client_id: string): Promise<Booking[]> {
    const client = await this.clientModel.findById(client_id);

    if (!client) {
      throw new HttpException(
        'Oops...resource not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    //console.log('client_id selected: ' , client_id);
    const client_bookings = await this.bookingModel
      .find({
        client: client.id,
        expired: false,
        cancellation:
          CancellationStages.NOT_INITIATED || CancellationStages.PENDING,
        active: true,
      })
      .populate('easer')
      .populate('client')
      .populate('address')
      .exec();
    return client_bookings;
  }

  async cancelOrder(booking_id: string, update: UpdateBookingDto) {
    console.log(booking_id);
    console.log(update);
    try {
      const booking = await this.bookingModel.findByIdAndUpdate(
        booking_id,
        { active: update.active, cancellation: update.cancellation },
        { upsert: true, new: true },
      );
      return booking;
    } catch (error) {
      throw new HttpException(
        'Oops...resource not found!',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
