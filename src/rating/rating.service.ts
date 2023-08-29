import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './schema/rating.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Easer } from 'src/easers/schema/easer.schema';
import { Client } from 'src/clients/schema/client.schema';
import { Booking } from 'src/booking/schema/booking.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    let rating = await this.ratingModel.create(createRatingDto);
    return rating;
  }

  async findAll() {
    let ratings = await this.ratingModel.find();
    return ratings;
  }

  async findOne(id: string) {
    let rating = await this.ratingModel
      .findById(id)
      .populate('easerId', '', this.easerModel)
      .populate('clientId', '', this.clientModel)
      .populate('bookingId', '', this.bookingModel)
      .exec();
    return rating;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
