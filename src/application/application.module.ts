/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Client, ClientSchema } from 'src/clients/schema/client.schema';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';
import { ClientsService } from 'src/clients/service/clients.service';
import { EaserService } from 'src/easers/easer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './entities/application.entity';
import { ClientModule } from 'src/clients/client.module';
import { EaserModule } from 'src/easers/easer.module';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { BookingModule } from 'src/booking/booking.module';
import { MailService } from 'src/mail/mail.service';
import { Position, PositionSchema } from './entities/position.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Easer.name, schema: EaserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
    ClientModule,
    EaserModule,
    BookingModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ClientsService, EaserService, MailService],
})
export class ApplicationModule {}
