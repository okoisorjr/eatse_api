import { Injectable } from '@nestjs/common';
import { CreateLaundryDto } from './dto/create-laundry.dto';
import { UpdateLaundryDto } from './dto/update-laundry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Laundry } from './entities/laundry.entity';
import { Model } from 'mongoose';

@Injectable()
export class LaundryService {
  constructor(@InjectModel(Laundry.name) private laundryModel: Model<Laundry>){}

  async create(createLaundryDto: CreateLaundryDto) {
    let dates = [];

    createLaundryDto.dates.forEach((date) => {
      let data = {
        date: date,
        isCompleted: false,
      };
      dates.push(data);
    });

    createLaundryDto.dates = dates;

    const new_laundry_booking = await this.laundryModel.create(createLaundryDto)
    return new_laundry_booking;
  }

  findAll() {
    return `This action returns all laundry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laundry`;
  }

  update(id: number, updateLaundryDto: UpdateLaundryDto) {
    return `This action updates a #${id} laundry`;
  }

  remove(id: number) {
    return `This action removes a #${id} laundry`;
  }
}
