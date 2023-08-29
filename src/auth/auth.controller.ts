import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { LoginDto } from './authDto/login.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { serialize } from 'cookie';
import { LocalAuthGuard } from './local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('client')
  async signInClient(
    @Body() body: LoginDto,
    @Req() userDetails: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(body);
    console.log(userDetails.body);
    const { accessToken, user } = await this.authService.validateUser(
      userDetails.body,
    );
    response.cookie('value', accessToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    /* response.appendHeader('Authorization', `Bearer ${accessToken}`);
    response.setHeader(
      'Set-Cookie',
      serialize('access_token', accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'localhost'
      }),
    ); */
    //response.setHeader('Set-Cookie', accessToken);
    //response.status(200).cookie('jwt', accessToken);
    return user;
  }

  //@UseGuards(LocalAuthGuard)
  @Post('easer')
  signInEaser(@Body() body: LoginDto) {}
}
