import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type blogDocument = mongoose.HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

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
