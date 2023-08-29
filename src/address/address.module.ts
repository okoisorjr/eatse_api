import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchema },
      { name: Easer.name, schema: EaserSchema },
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
