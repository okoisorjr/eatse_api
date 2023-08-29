import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientModule } from 'src/clients/client.module';
import { JwtModule } from '@nestjs/jwt';
import { jwt_secret } from './secret';
import { ClientsService } from 'src/clients/service/clients.service';
import { EaserService } from 'src/easers/easer.service';
import { LocalStrategy } from './local.strategy';
import { BookingModule } from 'src/booking/booking.module';
import { BookingService } from 'src/booking/booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';
import { Booking, BookingSchema } from 'src/booking/schema/booking.schema';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { MailService } from 'src/mail/mail.service';

@Module({
  providers: [AuthService, ClientsService, EaserService, LocalStrategy, JwtStrategy, BookingService, SessionSerializer, MailService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    PassportModule.register({session: true}),
    ClientModule,
    BookingModule,
    MongooseModule.forFeature([
      { name: Easer.name, schema: EaserSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwt_secret.secret,
      signOptions: { expiresIn: '900s' },
    }),
  ],
})
export class AuthModule {}
