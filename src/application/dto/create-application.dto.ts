import {
  IsEmail,
  IsMimeType,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
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

  portfolioURL: string;

  @IsNotEmpty()
  @IsUrl()
  linkedInProfile: string;

  others: string;

  @IsNotEmpty()
  file: any;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
