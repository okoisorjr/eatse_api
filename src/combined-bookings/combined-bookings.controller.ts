import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CombinedBookingsService } from './combined-bookings.service';
import { CreateCombinedBookingDto } from './dto/create-combined-booking.dto';
import { UpdateCombinedBookingDto } from './dto/update-combined-booking.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('combined-bookings')
export class CombinedBookingsController {
  constructor(private readonly combinedBookingsService: CombinedBookingsService) {}

  // find all bookings belonging to a client regardless of the service type
  @UseGuards(AuthGuard)
  @Get(':client_id')
  findOne(@Param('client_id') client_id: string) {
    return this.combinedBookingsService.findOne(client_id);
  }

  @UseGuards(AuthGuard)
  @Get('active/:client_id')
  findActiveBookings(@Param('client_id') client_id: string) {
    return this.combinedBookingsService.findActiveCombinedBookings(client_id);
  }
}
