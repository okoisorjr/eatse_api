import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { NewBookingDto } from './bookingDto/newBooking.dto';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post('new-booking') // creates a new booking
  saveBooking(@Body() body: NewBookingDto) {
    return this.bookingService.saveNewBooking(body);
  }

  @Put(':bookingId/date/:dateId/update_status') // update the isCompleted status of todays cleaning if any
  updateBookingDateStatus(@Param('bookingId') bookingId: string, @Param('dateId') dateId: string) {
    return this.bookingService.updateBookingDateCompletedStatus(bookingId, dateId);
  }

  @UseGuards(AuthenticatedGuard)
  @Get() // retrieves all the bookings from the database
  retrieveBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get('today') // retrieves all bookings for the day
  retrieveAllBookingsForToday() {
    return this.bookingService.getAllBookingsForToday();
  }

  @Get('today_cleaned') // retrieves all bookings that has been completed for the day
  retrieveAllBookingsCleanedForToday() {
    return this.bookingService.getAllBookingsCleanedForToday();
  }

  @Get(':bookingId') // retrieves a single booking from the database
  retrieveSingleBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.getSingleBooking(bookingId);
  }
}
