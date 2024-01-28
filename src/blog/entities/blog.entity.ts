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
<<<<<<< HEAD
  type: string;

  @Prop()
  category: string;

  @Prop()
  blogImgUrl: string;
=======
  blogImgUrl: string;

  @Prop()
  category: string;
>>>>>>> 21fe23169b52e858d8105e404aa19fbab6ba57e7

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
