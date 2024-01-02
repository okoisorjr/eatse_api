import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type laundryItemsDocument = mongoose.HydratedDocument<LaundryItem>;

@Schema({ timestamps: true })
export class LaundryItem {
  @Prop({ required: true })
  item: string;

  @Prop({ default: 0 })
  count: number;

  @Prop({ required:true, default: 0 })
  price: number;

  @Prop({ default: 0 })
  total_price: number;
}

export const LaundryItemSchema = SchemaFactory.createForClass(LaundryItem);