/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  /* IsString,
  IsUrl, */
} from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsMongoId()
  position: string;

  //@IsUrl()
  portfolioURL: string;

  //@IsUrl()
  linkedInProfile: string;

  //@IsUrl()
  others: string;

  @IsNotEmpty()
  file: string;
}
