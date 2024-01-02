/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateBookingEaserDto{
    @IsNotEmpty()
    @IsMongoId()
    easer_id: string;
}