import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './authDto/login.dto';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authService: AuthService){
    super();
  }

  async validate(userDetails: LoginDto): Promise<any>{
    const user = await this.authService.validateUser(userDetails);

    if(!user){
      throw new UnauthorizedException('access denied!');
    }

    return user;
  }
}
