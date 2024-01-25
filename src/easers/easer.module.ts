/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EaserController } from './easer.controller';
import { EaserService } from './easer.service';
import { Easer, EaserSchema } from './schema/easer.schema';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { BookingModule } from 'src/booking/booking.module';
import { BookingService } from 'src/booking/booking.service';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { MailService } from 'src/mail/mail.service';
import { Errand, ErrandSchema } from 'src/errands/schema/errand.schema';
import { Laundry, LaundrySchema } from 'src/laundry/entities/laundry.entity';
import { ErrandService } from 'src/errands/errand.service';
import { LaundryService } from 'src/laundry/laundry.service';

@Global()
@Module({
  controllers: [EaserController],
  exports: [MongooseModule, EaserService],
  imports: [
    BookingModule,
    MongooseModule.forFeature([
      { name: Easer.name, schema: EaserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Errand.name, schema: ErrandSchema },
      { name: Laundry.name, schema: LaundrySchema },
    ]),
  ],
  providers: [
    EaserService,
    BookingService,
    MailService,
    ErrandService,
    LaundryService,
  ],
})
export class EaserModule {}
