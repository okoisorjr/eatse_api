import { IsNotEmpty } from "class-validator";

export class NewBookingDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  dates: string[];

  @IsNotEmpty()
  rooms: number;

  @IsNotEmpty()
  easer: string;

  @IsNotEmpty()
  client: string;

  @IsNotEmpty()
  arrivalTime: string;
}