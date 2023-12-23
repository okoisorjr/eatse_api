import { IsNotEmpty, IsMongoId } from "class-validator";

export class ChangePasswordDto{
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}