/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Departments } from 'src/shared/departments.enum';
import { Role } from 'src/shared/roles.enum';

export type EmployeeDocument = mongoose.HydratedDocument<Employee>;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: true })
  department: Departments;

  @Prop({ required: true, default: false })
  active: boolean;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true, default: 0 })
  bonus: number;

  @Prop({ required: true })
  referral_link: string;

  @Prop({ required: true, default: 0 })
  referrals: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  profile_pic: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
