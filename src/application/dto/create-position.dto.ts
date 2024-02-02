/* eslint-disable prettier/prettier */
import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  @IsEmail()
  description: string;

  @IsNotEmpty()
  renumeration: number;

  @IsNotEmpty()
  yeasrs_of_experience: number;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
