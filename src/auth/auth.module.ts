import { Module, Global } from '@nestjs/common';
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
import { RefreshTokenStrategy } from './refresh-token.strategy';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from './PasswordResetToken.schema';

@Global()
@Module({
  providers: [
    AuthService,
    ClientsService,
    EaserService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    BookingService,
    SessionSerializer,
    MailService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    PassportModule.register({ session: true }),
    ClientModule,
    BookingModule,
    MongooseModule.forFeature([
      { name: Easer.name, schema: EaserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class AuthModule {}
