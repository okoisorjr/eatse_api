import { Prop, Schema, SchemaFactory, raw} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Client } from "src/clients/schema/client.schema";

export type ErrandDocument = mongoose.HydratedDocument<Errand>;

@Schema({ timestamps: true })
export class Errand{

  @Prop()
  service: string;

  @Prop()
  errandType: string;

  @Prop()
  pickupShoppingAddress: string;

  @Prop()
  deliveryAddress: string;

  @Prop()
  frequency: string;

  @Prop(raw([{
    date: {type: String, required: true},
    isCompleted: { type: Boolean, default: false}
  }]))
  dates: Record<string, any>;

  @Prop()
  pickupTime: string;

  @Prop()
  costPrice: string;

  @Prop()
  paid: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client'})
  client: Client;
}

export const ErrandSchema = SchemaFactory.createForClass(Errand);