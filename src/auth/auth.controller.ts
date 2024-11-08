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
import { NewEaserDto } from 'src/easers/easerDto/newEaser.dto';
import { ChangePasswordDto } from './authDto/change-password.dto';
import { RefreshTokenGuard } from './refresh-token.guard';

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

  @Post('get-account/:data')
  async getAccount(@Param('data') data: string) {
    console.log('phone no => ', data);
    return await this.authService.getClientAccount(data);
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

  @Post('easer-registration')
  async easer_signup(@Body() body: NewEaserDto) {
    this.authService.signup_easer(body);
  }

  @Post('easer')
  async signInEaser(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    let easer = await this.authService.validateUser(body);
    response.appendHeader('Authorization', `Bearer ${easer.access_token}`),
      response.send(easer);
  }

  @Post('password-reset-link')
  async sendPasswordResetLink(@Body() body: any) {
    return await this.authService.sendPasswordResetLink(body);
  }

  @UseGuards()
  @Post('reset-password')
  async resetPassword(
    @Body() body: any,
  ) {
    return await this.authService.passwordReset(body);
  }

  @UseGuards(AuthGuard)
  @Get('resend-email-token')
  async resendEmailVerificationToken() {
    return this.authService.resendEmailVerificationToken();
  }

  @UseGuards(AuthGuard)
  @Get('signout-client/:token')
  async logoutClient(@Param('token') token: string) {
    return this.authService.logoutUser(token);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async updateClientPassword(@Body() body: ChangePasswordDto) {
    return this.authService.updateClientPassword(body);
  }

  //@UseGuards(RefreshTokenGuard)
  @Get('refresh-token/:token')
  async refreshToken(@Param('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(AuthGuard)
  @Get('signout-easer/:token')
  async logoutEaser(@Param('token') token: string)  {
    return this.authService.logoutUser(token);
  }
}
