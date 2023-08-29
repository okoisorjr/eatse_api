import { ExtractJwt, Strategy } from "passport-jwt";
import { jwt_secret } from "./secret";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Injectable } from "@nestjs/common";

/* export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret.secret
    })
  }

  async validate(payload: any): Promise<any>{
    return {userId: payload.sub, user: payload.user}
  }
} */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret.secret,
    });
  }
  

  private static extractJWT(req: Request): string | null {
    if (req.cookies && req.cookies.access_token.length > 0) {
      console.log(req.cookies);
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(payload: any): Promise<any>{
    return {userId: payload.sub, user: payload.user}
  }
}