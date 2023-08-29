import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EaserController } from './easer.controller';
import { EaserService } from './easer.service';
import { Easer, EaserSchema } from './schema/easer.schema';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { BookingModule } from 'src/booking/booking.module';
import { BookingService } from 'src/booking/booking.service';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [EaserController],
  exports: [MongooseModule, EaserService],
  imports: [
    BookingModule,
    MongooseModule.forFeature([
      { name: Easer.name, schema: EaserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  providers: [EaserService, BookingService, MailService],
})
export class EaserModule {}
