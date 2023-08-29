import * as mongoose from 'mongoose';
import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { Role } from 'src/shared/roles.enum';
import { Service } from 'src/shared/services.enum';

export type EaserDocument = mongoose.HydratedDocument<Easer>;

@Schema({ timestamps: true })
export class Easer {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  accumulatedEarning: number;

  @Prop()
  rating: number;

  @Prop()
  referralCode: string;

  @Prop({ required: true, default: Role.EASER })
  role: Role;

  /* @Prop(
    raw({
      country: { type: String },
      state: { type: String },
      city: { type: String },
      addressLineOne: { type: String },
      addressLineTwo: { type: String },
      zipCode: { type: String },
    }),
  )
  address: Record<string, any>; */

  @Prop({ required: true, default: false })
  activeUser: boolean;

  @Prop({ required: true})
  service: Service;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  /* @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }])
  assignedClients: Client[]; */
  
}

export const EaserSchema = SchemaFactory.createForClass(Easer);
