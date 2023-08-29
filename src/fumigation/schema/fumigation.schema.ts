import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Fumigation{
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  buildingType: string;

  @Prop(raw([{
    date: {type: String, required: true},
    isCompleted: { type: Boolean, default: false}
  }]))
  dates: Record<string, any>;

  @Prop()
  costPrice: string;

}

export const FumigationSchema = SchemaFactory.createForClass(Fumigation);