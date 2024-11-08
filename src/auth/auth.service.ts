/* eslint-disable prettier/prettier */
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
//import { ResourceCreated } from 'src/shared/resource-created';
import { PasswordResetToken } from './PasswordResetToken.schema';
import { Service } from 'src/shared/services.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectModel(PasswordResetToken.name)
    private resetTokenModel: Model<PasswordResetToken>,
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
    user.easerTag = 'EAS' + this.generateEaserTag();
    user.service = Service.HOUSEKEEPING;
    user.password = await bcrypt.hash(user.password, 10);
    const new_easer = await this.easerModel.create(user);
    const tokens = await this.generateTokens(new_easer.id, new_easer.email);
    const email_verification_token = await this.generateEmailToken(
      new_easer.id,
      new_easer.email,
    );
    /* await this.easerModel.findByIdAndUpdate(
      new_easer.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    ); */
    await this.mailService.sendUserRegistrationConfirmation(
      new_easer,
      email_verification_token,
    );
    return { id: new_easer.id };
  }

  async getClientAccount(data: string) {
    const user_account = await this.clientModel.find({ phone: data }).select('firstname lastname email phone profile_pic');

    if (!user_account) {
      throw new HttpException(
        'No account with the provided phone or email was found!',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log(user_account);
    return user_account;
  }

  async validateUser(user) {
    const client = await this.clientModel.findOne({
      $or: [{ email: user.username }, { phone: user.username }],
    });

    if (!client) {
      throw new UnauthorizedException('user not found!');
    }

    const hashed_password = await bcrypt.compare(
      user.password,
      client.password,
    );

    if (!hashed_password) {
      throw new UnauthorizedException('email or password is incorrect!');
    }

    const tokens = await this.generateTokens(client.id, client.email);
    await this.clientModel.findByIdAndUpdate(
      client.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );

    const logged_in_user = {
      id: client.id,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      phone: client.phone,
      role: client.role,
      verified: client.verified,
      referral_code: client.referralCode,
      profile_pic: client.profile_pic,
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

    const hashed_password = await bcrypt.compare(user.password, easer.password);

    if (!hashed_password) {
      throw new UnauthorizedException('email or password is incorrect!');
    }

    const tokens = await this.generateTokens(easer.id, easer.email);
    await this.easerModel.findByIdAndUpdate(
      easer.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );

    const logged_in_user = {
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

  async generateEaserTag() {
    const id = [];
    for (let i = 0; i < 5; i++) {
      const val = Math.floor(Math.random() * (10 - 1)) + 1;
      id.push(val);
    }
    console.log(id.join(''));
    return id.join('');
  }

  async generateTokens(id: string, email: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: '900s',
        },
      ),
      this.jwtService.signAsync(
        { sub: id, email },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return await { access_token, refresh_token };
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

  async generatePasswordResetToken(user_id, email) {
    const password_reset_token = await this.jwtService.signAsync(
      { sub: user_id, email },
      {
        expiresIn: '60s',
        secret: this.configService.get('PASSWORD_RESET_TOKEN_SECRET'),
      },
    );

    return password_reset_token;
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

  async sendPasswordResetLink(body: any) {
    let user;
    let password_reset_token;
    let reset_token;

    // checking DB to find user
    try {
      // check user provided email if it exist in clients or easers collection
      user = await this.clientModel.findOne({ email: body.email });
      if (user) {
      } else {
        user = await this.easerModel.findOne({ email: body.email });
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'working on this internal error with our servers, please try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return error; //return error
    }

    // Function generates password reset token, saves generated token to DB and mails user reset token
    if (user) {
      // check if user already had a reset password token
      reset_token = await this.resetTokenModel.findOne({ user_id: user.id });

      // generate a new password reset token for user
      password_reset_token = await this.generatePasswordResetToken(
        user.id,
        user.email,
      );

      if (reset_token) {
        this.resetTokenModel.findByIdAndUpdate(
          reset_token.id,
          { token: password_reset_token },
          { upsert: true, new: true },
        );
      } else {
        // save new token to DB with associated user if user does not have an existing reset token
        const new_reset_token = new this.resetTokenModel();
        new_reset_token.user = user._id;
        new_reset_token.token = password_reset_token;

        new_reset_token.save();
      }

      // send mail to user email with password reset token
      await this.mailService.sendUserPasswordResetLink(
        user,
        password_reset_token,
      );
    }

    // response message sent to user on password reset token request, regardless whether or not the email exists
    return {
      msg: 'A password reset link has been sent to your email!',
      //token: password_reset_token,
    };
  }

  async passwordReset(body: any) {
    const reset_token = await this.resetTokenModel.findOne({ user: body.id });

    if (!reset_token) {
      throw new HttpException(
        'password reset token either expired or invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      if (body.token === reset_token.token) {
        await this.jwtService.verify(body.token, {
          secret: this.configService.get('PASSWORD_RESET_TOKEN_SECRET'),
        });

        const hashed_password = await bcrypt.hash(body.newPassword, 10);
        const updated_password = await this.clientModel.findByIdAndUpdate(
          body.id,
          { password: hashed_password },
          { upsert: true, new: true },
        );

        return {
          status: 200,
          msg: 'congratulations!..your password has been updated successfully.',
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'password reset token expired!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async updateClientPassword(changePasswordDto: ChangePasswordDto) {
    const client = await this.clientModel.findOne({
      _id: changePasswordDto.user,
    });

    if (!client) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    const hashed_password = await bcrypt.compare(
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

    const hashed_password = await bcrypt.compare(
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

    if (!decoded) {
      throw new HttpException(
        'refresh token is invalid!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const client = await this.clientModel.findOne({ _id: decoded.sub });

    if (!client) {
      throw new HttpException('User account not found!', HttpStatus.NOT_FOUND);
    }

    if (token !== client.refreshToken) {
      throw new HttpException(
        'Invalid refresh token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.generateTokens(client.id, client.email);

    const updated_refresh_token = await this.clientModel.findByIdAndUpdate(
      client.id,
      { refreshToken: tokens.refresh_token },
      { upsert: true, new: true },
    );
    return tokens;
  }

  async refreshEaserToken() {}

  async logoutUser(token: string) {
    const decoded = this.jwtService.decode(token);

    if (!decoded) {
      throw new HttpException('invalid user token!', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.clientModel.findOneAndUpdate(
        { _id: decoded.sub },
        { refresh_token: null },
        { upsert: true, new: true },
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'User cannot be found temporarily!',
        HttpStatus.NOT_FOUND,
      );
    }

    return { msg: 'logged out successfully!', status: HttpStatus.OK };
  }
}
