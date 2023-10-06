import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { LoginDto } from './authDto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Easer } from 'src/easers/schema/easer.schema';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async signup_client(user) {
    const client = await this.clientModel.findOne({
      $and: [{ email: user.email }],
    });

    if (client) {
      throw new HttpException(
        'A user already exists with this details',
        HttpStatus.CONFLICT,
      );
    }

    user.referralCode =
      'https://eatse.ng/?email=' + user.email + '&phone=' + user.phone;
    user.password = await bcrypt.hash(user.password, 10);
    const new_user = await this.clientModel.create(user);
    const tokens = await this.generateTokens(new_user.id, new_user.email);
    const email_verification_token = await this.generateEmailToken(
      new_user.id,
      new_user.email,
    );
    await this.clientModel.findByIdAndUpdate(
      new_user.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );
    await this.mailService.sendUserRegistrationConfirmation(
      new_user,
      email_verification_token,
    );
    return { id: new_user.id };
  }

  async validateUser(user) {
    const client = await this.clientModel.findOne({
      $or: [{ email: user.username }, { phone: user.username }],
    });

    if (!client) {
      throw new UnauthorizedException('user not found!');
    }

    let hashed_password = await bcrypt.compare(user.password, client.password);

    if (!hashed_password) {
      throw new UnauthorizedException('email or password is incorrect!');
    }

    const tokens = await this.generateTokens(client.id, client.email);
    await this.clientModel.findByIdAndUpdate(
      client.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );

    let logged_in_user = {
      id: client.id,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      phone: client.phone,
      role: client.role,
      verified: client.verified,
      referral_code: client.referralCode,
    };

    return {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      user: logged_in_user,
    };
  }

  async easerLogin(loginDetails: LoginDto) {
    const easer = await this.easerModel.findOne({
      $or: [{ email: loginDetails.username }, { phone: loginDetails.username }],
    });

    if (!easer || easer.password != loginDetails.password) {
      throw new UnauthorizedException('easer account not found!');
    }
    const payload = { sub: easer._id, email: easer.email };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async resendEmailVerificationToken() {
    //const email_verification_token = this.generateEmailToken()
  }

  async generateTokens(id: string, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        { secret: this.configService.get('ACCESS_TOKEN_SECRET') },
      ),
      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async generateEmailToken(user_id, email) {
    const email_token = await this.jwtService.signAsync(
      { sub: user_id, email },
      {
        expiresIn: '900s',
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN_SECRET'),
      },
    );
    return email_token;
  }

  async verifyClientEmail(token: string) {
    if (token)
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('EMAIL_VERIFICATION_TOKEN_SECRET'),
        });

        if (!payload) {
          throw new UnauthorizedException('Invalid Token!');
        }

        await this.clientModel.findOneAndUpdate(
          { email: payload.email },
          { verified: true },
        );
        return { msg: 'email verified successfully!' };
      } catch {
        throw new UnauthorizedException('Token Expired!');
      }
  }

  async verifyEaserEmail(token: string){
    if (token)
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('EMAIL_VERIFICATION_TOKEN_SECRET'),
        });

        if (!payload) {
          throw new UnauthorizedException('Invalid Token!');
        }

        await this.easerModel.findOneAndUpdate(
          { email: payload.email },
          { verified: true },
        );
        return { msg: 'email verified successfully!' };
      } catch {
        throw new UnauthorizedException('Token Expired!');
      }

  }
}
