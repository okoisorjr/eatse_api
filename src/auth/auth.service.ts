import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { LoginDto } from './authDto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Easer } from 'src/easers/schema/easer.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user) {
    console.log(user)
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

    let logged_in_user = {
      id: client.id,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      phone: client.phone,
      //easer: client.easer,
      referral_code: client.referralCode,
    };
    const payload = { sub: client._id, password: client.password };

    return {
      accessToken: await this.jwtService.signAsync(payload),
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
}
