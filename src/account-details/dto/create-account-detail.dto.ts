import { IS_LENGTH, IsMongoId, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Easer } from "src/easers/schema/easer.schema";

export class CreateAccountDetailDto {
  @IsNotEmpty()
  bank: string;

  @IsNotEmpty()
  account_name: string;

  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(10)
  account_no: string;

  @IsNotEmpty()
  account_type: string;

  @IsNotEmpty()
  @IsMongoId()
  easer: Easer;
}
