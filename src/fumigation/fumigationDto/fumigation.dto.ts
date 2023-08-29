import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class FumigationDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  buildingType: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  dates: Array<{}>;

  @IsNotEmpty()
  customMessage: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
