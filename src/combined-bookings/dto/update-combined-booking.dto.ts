import { PartialType } from '@nestjs/mapped-types';
import { CreateCombinedBookingDto } from './create-combined-booking.dto';

export class UpdateCombinedBookingDto extends PartialType(CreateCombinedBookingDto) {}
