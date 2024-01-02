import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLaundryDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  frequency: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  totalItems: number;

  @IsNotEmpty()
  dates: any[];

  @IsNotEmpty()
  @IsMongoId()
  address: string;

  @IsString()
  @IsNotEmpty()
  pickupTime: string;

  @IsMongoId()
  @IsNotEmpty()
  client: string;
}
