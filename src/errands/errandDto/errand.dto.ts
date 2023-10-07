import { IsArray, IsNotEmpty } from "class-validator";

export class ErrandDto{
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  errandType: string;

  @IsNotEmpty()
  pickupShoppingAddress: string;

  @IsNotEmpty()
  deliveryAddress: string;

  @IsNotEmpty()
  frequency: string;

  @IsArray()
  dates: Array<{}>;

  @IsNotEmpty()
  pickupTime: string;

  @IsNotEmpty()
  costPrice: string;

  @IsNotEmpty()
  paid: boolean;
}