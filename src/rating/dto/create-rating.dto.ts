import { IsNotEmpty } from "class-validator";

export class CreateRatingDto {
  easerId: string;
  clientId: string;
  bookingId: string;

  @IsNotEmpty()
  rating: number;
}
