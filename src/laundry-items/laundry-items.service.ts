import { Injectable } from '@nestjs/common';
import { CreateLaundryItemDto } from './dto/create-laundry-item.dto';
import { UpdateLaundryItemDto } from './dto/update-laundry-item.dto';
import { LaundryItem } from './entities/laundry-item.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LaundryItemsService {
  constructor(
    @InjectModel(LaundryItem.name) private laundryItemModel: Model<LaundryItem>,
  ) {}

  async create(createLaundryItemDto: CreateLaundryItemDto) {
    const new_item = await this.laundryItemModel.create(createLaundryItemDto);
    return new_item;
  }

  async findAll() {
    const laundry_items = await this.laundryItemModel.find();
    return laundry_items;
  }

  findOne(id: number) {
    return `This action returns a #${id} laundryItem`;
  }

  update(id: number, updateLaundryItemDto: UpdateLaundryItemDto) {
    return `This action updates a #${id} laundryItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} laundryItem`;
  }
}
