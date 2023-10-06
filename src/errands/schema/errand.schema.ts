import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { Client } from 'src/clients/schema/client.schema';

export type ErrandDocument = mongoose.HydratedDocument<Errand>;

@Schema({ timestamps: true })
export class Errand {
  @Prop()
  service: string;

  @Prop()
  errandType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  pickupAddress: Address;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  deliveryAddress: Address;

  @Prop()
  frequency: string;

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
  pickupTime: string;

  @Prop()
  costPrice: string;

  @Prop({ required: true, default: new Date().setMonth(new Date().getMonth() + 1)})
  expiryDate: Date;

  @Prop({ required: true, default: new Date() })
  startingDate: Date;

  @Prop()
  paid: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;
}

export const ErrandSchema = SchemaFactory.createForClass(Errand);
