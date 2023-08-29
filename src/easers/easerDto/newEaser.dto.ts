import { IsNotEmpty, IsEmail, IsMobilePhone, IsEnum } from 'class-validator';
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

  @IsNotEmpty()
  accumulatedEarning: number;

  @IsNotEmpty()
  rating: number;

  referralCode: string;

  @IsEnum(Service)
  service: Service

  @IsNotEmpty()
  password: string;

  activeUser: string;
}
