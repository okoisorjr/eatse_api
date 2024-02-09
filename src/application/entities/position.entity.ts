/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Departments } from 'src/shared/departments.enum';
import { PositionsStatus } from 'src/shared/positions-status.enum';

export type PositionDocument = mongoose.HydratedDocument<Position>;

@Schema({ timestamps: true })
export class Position {
  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  department: Departments;

  @Prop({ required: true })
  job_description: string;

  @Prop({ required: true })
  job_type: string;

  @Prop({ required: true })
  renumeration: string;

  @Prop()
  years_of_experience: string;

  @Prop({ required: true, default: PositionsStatus.OPENED })
  status: PositionsStatus | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  })
  user: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
