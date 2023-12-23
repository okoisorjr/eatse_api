import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Employee } from "src/employee/entities/employee.entity";
import { Role } from '../../shared/roles.enum';

export type NotificationDocument = mongoose.HydratedDocument<Notification>; 

@Schema({ timestamps: true })
export class Notification{
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  notice: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee' })
  postedBy: Employee;

  @Prop({ required: true })
  target: Role;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);