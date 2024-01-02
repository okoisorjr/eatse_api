import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ShoppingMallDocument = mongoose.HydratedDocument<ShoppingMall>;

@Schema({ timestamps: true })
export class ShoppingMall {
  @Prop({ required: true })
  mall_name: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  street_address: string;

  @Prop()
  zip_code: string;
}

export const ShoppingMallSchema = SchemaFactory.createForClass(ShoppingMall);
