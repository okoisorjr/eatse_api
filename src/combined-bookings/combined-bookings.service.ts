import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCombinedBookingDto } from './dto/create-combined-booking.dto';
import { UpdateCombinedBookingDto } from './dto/update-combined-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from 'src/booking/schema/booking.schema';
import { Client } from 'src/clients/schema/client.schema';
import { Errand } from 'src/errands/schema/errand.schema';
import { Laundry } from 'src/laundry/entities/laundry.entity';
import { Model } from 'mongoose';

@Injectable()
export class CombinedBookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Errand.name) private errandsModel: Model<Errand>,
    @InjectModel(Laundry.name) private laundryModel: Model<Laundry>,
  ) {}

  async findOne(client_id: string) {
    const client = await this.clientModel.findById(client_id);

    if (!client) {
      throw new HttpException(`User account could not be found!`, HttpStatus.NOT_FOUND);
    }

    // find all clients cleaning services booked
    const regular_bookings = await this.bookingModel
      .find({ client: client })
      .populate({
        path: 'address',
        select: '_id country state city street zip_code',
      });

    // find all clients errand services booked
    const errand_bookings = await this.errandsModel
      .find({ client: client })
      .populate({
        path: 'pickupAddress',
        select: '_id country state city street zip_code',
      })
      .populate({
        path: 'deliveryAddress',
        select: '_id country state city street zip_code',
      });

    // find all clients laundry services booked
    const laundry_bookings = await this.laundryModel
      .find({ client: client })
      .populate({
        path: 'pickupAddress',
        select: '_id country state city street zip_code',
      })
      .populate({
        path: 'deliveryAddress',
        select: '_id country state city street zip_code',
      });

    const current_user_bookings = [
      ...regular_bookings,
      ...errand_bookings,
      ...laundry_bookings,
    ];
    return current_user_bookings;
  }
}
