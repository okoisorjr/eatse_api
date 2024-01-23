import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';

export type PasswordResetTokenDocument =
  mongoose.HydratedDocument<PasswordResetToken>;

@Schema({ timestamps: true })
export class PasswordResetToken {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Client' })
  user: Client;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: Date, default: Date.now, expires: 300   })
  createdAt: Date;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);
