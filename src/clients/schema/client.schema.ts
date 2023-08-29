import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Easer } from 'src/easers/schema/easer.schema';
import { Role } from 'src/shared/roles.enum';

export type ClientDocument = mongoose.HydratedDocument<Client>;
@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  referralCode: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: Role.CLIENT })
  role: Role;

  @Prop()
  profile_img_url: string;

  /* @Prop(
    raw({
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      addressLineOne: { type: String, required: true },
      addressLineTwo: { type: String },
      zipCode: { type: String },
    }),
  )
  address: Record<string, any>; */

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Easer' })
  easer: Easer;

  @Prop()
  refreshToken: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
