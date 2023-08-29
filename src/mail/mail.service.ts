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

  async sendUserRegistrationConfirmation(new_user: Client | Easer | Employee) {
    const url = `https://eatse.ng/verify-account`;

    try {
      await this.mailerService.sendMail({
        to: new_user.email,
        subject: `Welcome to Eatse! Confirm your Email`,
        template: './confirmation-mail',
        context: {
          name: new_user.firstname + new_user.lastname,
          url,
        },
      });
    } catch (error) {
      throw new HttpException('The operation failed!', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
