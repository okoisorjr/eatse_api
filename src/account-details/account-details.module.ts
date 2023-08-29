import { Module } from '@nestjs/common';
import { AccountDetailsService } from './account-details.service';
import { AccountDetailsController } from './account-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountDetail,
  AccountDetailSchema,
} from './entities/account-detail.entity';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountDetail.name, schema: AccountDetailSchema },
      { name: Easer.name, schema: EaserSchema },
    ]),
  ],
  controllers: [AccountDetailsController],
  providers: [AccountDetailsService],
})
export class AccountDetailsModule {}
