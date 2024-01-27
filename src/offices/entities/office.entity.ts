/* eslint-disable prettier/prettier */
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Client } from "src/clients/schema/client.schema";

@Schema({ timestamps: true })
export class Office {
    @Prop({})
    email: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
    client: Client;
}
