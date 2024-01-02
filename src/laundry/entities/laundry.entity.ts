import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { Client } from 'src/clients/schema/client.schema';
import { LaundryItem } from 'src/laundry-items/entities/laundry-item.entity';

export type laundryDocument = mongoose.HydratedDocument<Laundry>;

@Schema({ timestamps: true })
export class Laundry {
  @Prop()
  service: string;

  @Prop()
  frequency: string;

  @Prop({ required: true })
  cost: number;

  @Prop()
  totalItems: number;

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
  items: LaundryItem[];

  @Prop({ default: true })
  delivery: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: Address;

  @Prop({ default: false })
  pickup: boolean;

  @Prop({ required: true })
  pickupTime: string;

  @Prop({ required: true, default: new Date().setMonth(new Date().getMonth() + 1)})
  expiryDate: Date;

  @Prop({ required: true, default: new Date() })
  startingDate: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);
