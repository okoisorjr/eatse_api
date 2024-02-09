/* eslint-disable prettier/prettier */
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Departments } from 'src/shared/departments.enum';
import { JobTypes } from 'src/shared/job-types.enum';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsEnum(Departments)
  department: Departments;

  @IsNotEmpty()
  job_description: string;

  @IsNotEmpty()
  renumeration: number;

  @IsNotEmpty()
  years_of_experience: number;

  @IsNotEmpty()
  @IsEnum(JobTypes)
  job_type: JobTypes;

  user: string;
}
