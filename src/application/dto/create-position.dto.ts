/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { JobTypes } from 'src/shared/job-types.enum';

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
  //@IsEnum()
  job_type: JobTypes;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
