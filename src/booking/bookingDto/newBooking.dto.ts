/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import { IsNotEmpty, IsEmpty } from 'class-validator';
=======
import { IsNotEmpty, IsEmpty } from "class-validator";
>>>>>>> 21fe23169b52e858d8105e404aa19fbab6ba57e7

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

  @IsEmpty()
  startingDate: string;

  @IsEmpty()
  expiryDate: string;

  @IsNotEmpty()
  expired: boolean;
}
