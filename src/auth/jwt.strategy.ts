import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  validate(req: Request, payload: any) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, accessToken };
  }

  /* async validate(payload: any): Promise<any>{
    console.log(payload);
    return {userId: payload.sub, user: payload.user}
  } */
}
/* @Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: jwt_secret.secret,
    });
  }
  

  /* private static extractJWT(req: Request): string | null {
    if (req.cookies && req.cookies.access_token.length > 0) {
      console.log(req.cookies);
      return req.cookies.access_token;
    }
    return null;
  } 

  async validate(payload: any): Promise<any>{
    return {userId: payload.sub, user: payload.user}
  }
}*/
