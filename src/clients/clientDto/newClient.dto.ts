import { IsNotEmpty, IsEmail, IsEnum } from "class-validator";
import { Role } from "src/shared/roles.enum";

export class NewClientDto{
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  referralCode: string;

  @IsEnum(Role)
  role: Role;

  easer: string;

  @IsNotEmpty()
  password: string;
}