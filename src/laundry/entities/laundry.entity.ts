import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { Client } from 'src/clients/schema/client.schema';

export type laundryDocument = mongoose.HydratedDocument<Laundry>;

@Schema({ timestamps: true })
export class Laundry {
  @Prop()
  service: string;

  @Prop()
  frequency: number;

  @Prop()
  totalItems: number;

  @Prop()
  categories: string[];

  @Prop()
  delivery: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  pickupAddress: Address;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  deliveryAddress: Address;

  @Prop()
  pickup: boolean;

  @Prop()
  delivery_time: string;

  @Prop({ required: true, default: new Date().setMonth(new Date().getMonth() + 1)})
  expiryDate: Date;

  @Prop({ required: true, default: new Date() })
  startingDate: Date;

  @Prop()
  client: Client;
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);
