/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsMobilePhone, IsEnum, IsEmpty } from 'class-validator';
import { Service } from 'src/shared/services.enum';

export class NewEaserDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsEmpty()
  easerTag: string;

  referralCode: string;

  /* @IsEnum(Service)
  service: Service */

  @IsNotEmpty()
  password: string;

  activeUser: string;
}
