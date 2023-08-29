import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AddressDocument = mongoose.HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  street: string;

  @Prop()
  zip_code: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Client' || 'Easer'})
  user: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
