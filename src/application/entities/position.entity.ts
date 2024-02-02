/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PositionDocument = mongoose.HydratedDocument<Position>;

@Schema({ timestamps: true })
export class Position {
  @Prop()
  position: string;

  @Prop()
  description: string;

  @Prop()
  renumeration: string;

  @Prop()
  years_of_experience: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  })
  user: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
