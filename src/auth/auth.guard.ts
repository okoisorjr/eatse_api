import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException, HttpStatus
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      });
      request['user'] = payload;

      /* if(new Date(payload.iat) < new Date()){
        throw new HttpException('Token expired!', HttpStatus.FORBIDDEN);
      } */
    } catch {
      throw new UnauthorizedException('Access denied!');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
