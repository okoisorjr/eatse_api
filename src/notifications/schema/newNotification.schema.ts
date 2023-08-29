import { Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type NewNotificationDocument = mongoose.HydratedDocument<NewNotification>; 

@Schema({ timestamps: true })
export class NewNotification{
  
}

export const NewNotificationSchema = SchemaFactory.createForClass(NewNotification);