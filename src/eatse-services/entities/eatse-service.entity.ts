import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

export type ServiceDocument = mongoose.HydratedDocument<EatseService>;

@Schema({ timestamps: true })
export class EatseService {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  position: number;

  @Prop({ required: true })
  photoURL: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  })
  employee: Employee;
}

export const ServicesSchema = SchemaFactory.createForClass(EatseService);
