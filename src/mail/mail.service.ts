import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NewClientDto } from 'src/clients/clientDto/newClient.dto';
import { NewEaserDto } from 'src/easers/easerDto/newEaser.dto';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { Easer } from 'src/easers/schema/easer.schema';
import { Employee } from 'src/employee/entities/employee.entity';
import { Client } from 'src/clients/schema/client.schema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserRegistrationConfirmation(
    new_user: Client | Easer | Employee,
    email_verification_token: string,
  ) {
    const url = `http://localhost:4203/auth/verify-account?token=${email_verification_token}`;

    try {
      await this.mailerService.sendMail({
        to: new_user.email,
        subject: `Welcome to Eatse! Confirm your Email`,
        template: './confirmation-mail',
        context: {
          name: new_user.firstname,
          url,
        },
      });
    } catch (error) {
      throw new HttpException(
        'The operation failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendEmailVerificationCompletionMail() {}

  async sendSuccessfulLoginAttemptMail() {}

  async sendUserPasswordResetLink(  
    user: any,
    password_reset_token: string,
  ) {
    const url = `http://localhost:8000/auth/new-password?user=${user.id}&token=${password_reset_token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Reset you password!`,
        template: './password-reset-mail',
        context: {
          name: user.firstname,
          url,
        },
      });
    } catch (error) {
      throw new HttpException(
        'The operation failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
