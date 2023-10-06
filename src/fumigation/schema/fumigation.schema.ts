import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from 'src/address/entities/address.entity';
import { Client } from 'src/clients/schema/client.schema';

@Schema({ timestamps: true })
export class Fumigation {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  buildingType: string;

  @Prop(
    raw([
      {
        date: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ]),
  )
  dates: Record<string, any>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  })
  address: Address;

  @Prop()
  instruction: string;

  @Prop()
  costPrice: string;

  @Prop({
    required: true,
    default: new Date().setMonth(new Date().getMonth() + 1),
  })
  expiryDate: Date;

  @Prop()
  paid: boolean;

  @Prop({ required: true, default: new Date() })
  startingDate: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client;
}

export const FumigationSchema = SchemaFactory.createForClass(Fumigation);
