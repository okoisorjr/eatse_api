/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class NewBookingDto {
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  frequency: string;

  @IsNotEmpty()
  buildingType: string;

  @IsNotEmpty()
  cost: number;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  dates: any[];

  @IsNotEmpty()
  rooms: number;

  //@IsNotEmpty()
  easer: string;

  @IsNotEmpty()
  client: string;

  @IsNotEmpty()
  arrivalTime: string;

  @IsNotEmpty()
  startingDate: string;

  @IsNotEmpty()
  expiryDate: string;

  @IsNotEmpty()
  expired: boolean;
}
