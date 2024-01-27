/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Easer } from 'src/easers/schema/easer.schema';
import { AccountTypes } from 'src/shared/account-types.enum';

export type AccountDetailDocument = mongoose.HydratedDocument<AccountDetail>;

@Schema({ timestamps: true })
export class AccountDetail {
  @Prop({ required: true })
  bank: string;

  @Prop({ required: true })
  account_name: string;

  @Prop({ required: true })
  account_type: AccountTypes;

  @Prop({ required: true, length: 10 })
  account_no: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Easer' })
  easer: Easer;
}

export const AccountDetailSchema = SchemaFactory.createForClass(AccountDetail);
