/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class UpdateBookingEaserDto {
  /* @IsNotEmpty()
  @IsMongoId()
  client_id: string; */

  @IsNotEmpty()
  @IsMongoId()
  easer_id: string;

  @IsNotEmpty()
  @IsMongoId()
  booking_id: string;

  /* @IsNotEmpty()
  @IsNumber()
  easersClientCount: number; */
}