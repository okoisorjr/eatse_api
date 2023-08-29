import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Client } from "src/clients/schema/client.schema";
import { Easer } from "src/easers/schema/easer.schema";

export type BookingDocument = mongoose.HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking{

  @Prop()
  service: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address'})
  address: string;

  @Prop(raw([{
    date: {type: String, required: true},
    isCompleted: { type: Boolean, default: false}
  }]))
  dates: Record<string, any>;

  @Prop()
  rooms: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Easer'})
  easer: Easer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client'})
  client: Client;

  @Prop()
  arrivalTime: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);