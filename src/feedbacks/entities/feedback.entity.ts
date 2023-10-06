import * as mongoose from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Client } from 'src/clients/schema/client.schema';

export type feedbackDocument = mongoose.HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  client: Client | string;

  @Prop()
  fullname: string;

  @Prop()
  address: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
