import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Booking } from 'src/booking/schema/booking.schema';
import { Client } from 'src/clients/schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';

export type RatingDocument = mongoose.HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Easer' })
  easerId: Easer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  clientId: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' })
  bookingId: Booking;

  @Prop()
  rating: number;

  @Prop()
  raterId: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
