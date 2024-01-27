/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type blogDocument = mongoose.HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop()
  category: string;

  @Prop()
  blogImgUrl: string;

  @Prop()
  content: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
  })
  author: Employee;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
