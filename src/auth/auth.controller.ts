import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  Param,
} from '@nestjs/common';
import { LoginDto } from './authDto/login.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { NewClientDto } from 'src/clients/clientDto/newClient.dto';
import { ResourceCreated } from 'src/shared/resource-created';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('client-registration')
  async client_signup(@Body() body: NewClientDto) {
    return this.authService.signup_client(body);
  }

  @Post('client')
  async signInClient(
    @Body() body: LoginDto,
    //@Req() userDetails: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    let user = await this.authService.validateUser(body);
    /* return ( */
    response.appendHeader('Authorization', `Bearer ${user.access_token}`),
      response.send(user);
    //);
    /* const { accessToken, user } = await this.authService.validateUser(
      userDetails.body,
    ); */
    /* response.cookie('value', accessToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }); */
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
  }

  @Post('verify-client-email/:token')
  async verifyClientEmail(
    @Param('token') token: string,
    @Body() body: ResourceCreated,
  ) {
    return this.authService.verifyClientEmail(token);
  }

  @Post('verify-easer-email/:token')
  async verifyEaserEmail(
    @Param('token') token: string,
    @Body() body: ResourceCreated,
  ) {
    return this.authService.verifyEaserEmail(token);
  }

  @Post('register-client')
  async easer_signup() {}

  @Post('easer')
  signInEaser(@Body() body: LoginDto) {}

  @UseGuards(AuthGuard)
  @Get('resend-email-token')
  async resendEmailVerificationToken() {
    return this.authService.resendEmailVerificationToken();
  }

  @UseGuards(AuthGuard)
  @Post('signout-client')
  async logoutClient() {}

  @UseGuards(AuthGuard)
  @Post('signout-easer')
  async logoutEaser() {}
}
