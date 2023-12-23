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
import { ChangePasswordDto } from './authDto/change-password.dto';
import { ResourceCreated } from 'src/shared/resource-created';

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

  async signup_easer(user) {
    const easer = await this.easerModel.findOne({
      $and: [{ email: user.email }],
    });

    if (easer) {
      throw new HttpException(
        'A user already exists with this details',
        HttpStatus.CONFLICT,
      );
    }

    user.referralCode =
      'https://eatse.ng/?email=' + user.email + '&phone=' + user.phone;
    user.password = await bcrypt.hash(user.password, 10);
    const new_easer = await this.easerModel.create(user);
    const tokens = await this.generateTokens(new_easer.id, new_easer.email);
    const email_verification_token = await this.generateEmailToken(
      new_easer.id,
      new_easer.email,
    );
    await this.clientModel.findByIdAndUpdate(
      new_easer.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );
    await this.mailService.sendUserRegistrationConfirmation(
      new_easer,
      email_verification_token,
    );
    return { id: new_easer.id };
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

  async validateEaser(user) {
    const easer = await this.easerModel.findOne({
      $or: [{ email: user.username }, { phone: user.username }],
    });

    if (!easer) {
      throw new UnauthorizedException('user not found!');
    }

    let hashed_password = await bcrypt.compare(user.password, easer.password);

    if (!hashed_password) {
      throw new UnauthorizedException('email or password is incorrect!');
    }

    const tokens = await this.generateTokens(easer.id, easer.email);
    await this.easerModel.findByIdAndUpdate(
      easer.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );

    let logged_in_user = {
      id: easer.id,
      firstname: easer.firstname,
      lastname: easer.lastname,
      email: easer.email,
      phone: easer.phone,
      role: easer.role,
      verified: easer.verified,
      referral_code: easer.referralCode,
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
        { secret: this.configService.get('ACCESS_TOKEN_SECRET'), expiresIn: 900 },
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

  async verifyEaserEmail(token: string) {
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

  async updateClientPassword(changePasswordDto: ChangePasswordDto) {
    const client = await this.clientModel.findOne({
      _id: changePasswordDto.user,
    });

    if (!client) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    let hashed_password = await bcrypt.compare(
      changePasswordDto.oldPassword,
      client.password,
    );

    if (!hashed_password) {
      throw new HttpException(
        'Please enter the correct password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const new_hashed_password = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    const update = this.clientModel.updateOne(
      { _id: client.id },
      { password: new_hashed_password },
      { upsert: true, new: true },
    );

    return { status: 'OK', message: 'Password updated successfully!', update };
  }

  async updateEaserPassword(changePasswordDto: ChangePasswordDto) {
    const easer = await this.easerModel.findOne({
      _id: changePasswordDto.user,
    });

    if (!easer) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    let hashed_password = await bcrypt.compare(
      changePasswordDto.oldPassword,
      easer.password,
    );

    if (!hashed_password) {
      throw new HttpException(
        'Please enter the correct password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const new_hashed_password = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    const update = this.easerModel.updateOne(
      { _id: easer.id },
      { password: new_hashed_password },
      { upsert: true, new: true },
    );

    return { status: 'OK', message: 'Password updated successfully!', update };
  }

  async refreshToken(token: string) {
    const decoded = this.jwtService.decode(token);

    if(!decoded){
      throw new HttpException('refresh token is invalid!', HttpStatus.UNAUTHORIZED);
    }
    
    const client = await this.clientModel.findOne({ _id: decoded.sub});

    if(!client){
      throw new HttpException('User account not found!', HttpStatus.NOT_FOUND);
    }

    if(token !== client.refreshToken){
      throw new HttpException('Invalid refresh token!', HttpStatus.UNAUTHORIZED);
    }
    
    const tokens = this.generateTokens(client.id, client.email);
    return tokens;
  }

  async logoutUser() {}
}
