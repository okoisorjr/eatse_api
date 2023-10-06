import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Service } from 'src/shared/services.enum';

export type roomsDocument = mongoose.HydratedDocument<RoomPrice>;

@Schema({ timestamps: true })
export class RoomPrice {
  @Prop({ required: true })
  service: Service;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  room_name: string;

  @Prop({ required: true, default: 0 })
  count: number;

  @Prop({ required: true })
  totalCost: number;
}

export const RoomSchema = SchemaFactory.createForClass(RoomPrice);
