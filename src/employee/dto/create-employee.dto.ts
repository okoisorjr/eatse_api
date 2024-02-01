/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Departments } from 'src/shared/departments.enum';
import { Role } from 'src/shared/roles.enum';
import { Salaries } from 'src/shared/salaries.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @IsEnum(Departments)
  department: Departments;

  @IsNotEmpty()
  @IsEnum(Salaries)
  salary: Salaries;

  /* @IsNotEmpty()
  referrals: number; */

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  //file: any;
}
