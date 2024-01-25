/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { Client } from 'src/clients/schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';
import { RoomPrice } from 'src/room-prices/entities/room-price.entity';

export type BookingDocument = mongoose.HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  buildingType: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: Address;

  @Prop({ required: true })
  days: number[];

  @Prop(
    raw([
      {
        date: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ]),
  )
  dates: Record<string, any>;

  @Prop()
  rooms: number;

  @Prop()
  house_setting: RoomPrice[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Easer' })
  easer: Easer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;

  @Prop()
  arrivalTime: string;

  @Prop()
  cost: number;

  @Prop()
  active: boolean;

  @Prop()
  message: string;

  @Prop({
    required: true,
    default: new Date().setMonth(new Date().getMonth() + 1),
  })
  expiryDate: Date;

  @Prop({ required: true, default: new Date() })
  startingDate: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
