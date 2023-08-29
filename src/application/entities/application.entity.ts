import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';

export type ApplicationDocument = mongoose.HydratedDocument<Application>;

@Schema({ timestamps: true })
export class Application {
  @Prop()
  fullname: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  portfolioUrl: string;

  @Prop()
  linkedInProfile: string;

  @Prop()
  others: string;

  @Prop({ required: true })
  resumeURL: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client' || 'Easer',
  })
  user: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
