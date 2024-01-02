import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLaundryItemDto {
  @IsString()
  item: string;

  @IsNumber()
  count: number;

  @IsNumber()
  price: number;

  @IsNumber()
  totalPrice: number;
}
