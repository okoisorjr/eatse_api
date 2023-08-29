import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateAddressDto {
  country: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  zip_code: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
