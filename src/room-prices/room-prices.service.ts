import { Injectable } from '@nestjs/common';
import { CreateRoomPriceDto } from './dto/create-room-price.dto';
import { UpdateRoomPriceDto } from './dto/update-room-price.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoomPrice } from './entities/room-price.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoomPricesService {
  constructor(
    @InjectModel(RoomPrice.name) private roomsModel: Model<RoomPrice>,
  ) {}
  async create(createRoomPriceDto: CreateRoomPriceDto) {
    const new_room = await this.roomsModel.create(createRoomPriceDto);
    return new_room;
  }

  async findAll() {
    const all_rooms = await this.roomsModel.find();
    return all_rooms;
  }

  async findOne(service: string) {
    const rooms = await this.roomsModel.find({ service: service });
    return rooms;
  }

  update(id: number, updateRoomPriceDto: UpdateRoomPriceDto) {
    return `This action updates a #${id} roomPrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomPrice`;
  }
}
