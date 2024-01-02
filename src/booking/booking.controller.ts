/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NewBookingDto } from './bookingDto/newBooking.dto';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post('new-booking') // creates a new booking
  saveBooking(@Body() body: NewBookingDto) {
    console.log(body);
    return this.bookingService.saveNewBooking(body);
  }

  @UseGuards(AuthGuard)
  @Put(':bookingId/date/:dateId/update_status') // update the isCompleted status of todays cleaning if any
  updateBookingDateStatus(
    @Param('bookingId') bookingId: string,
    @Param('dateId') dateId: string,
  ) {
    return this.bookingService.updateBookingDateCompletedStatus(
      bookingId,
      dateId,
    );
  }

  @Put(':booking_id/easer/:easer_id/assign')
  assignBookingEaser(@Param() booking_id: string, @Param() easer_id: string) {
    return this.bookingService.assignEaserToBooking(booking_id, easer_id);
  }

  //@UseGuards(AuthGuard)
  @Get() // retrieves all the bookings from the database
  retrieveBookings(@Query() query: number) {
    if (query) {
      console.log('limit:', query);
      return this.bookingService.getAllBookings(query);
    } else {
      return this.bookingService.getAllBookings();
    }
  }

  @UseGuards(AuthGuard)
  @Get('today') // retrieves all bookings for the day
  retrieveAllBookingsForToday() {
    return this.bookingService.getAllBookingsForToday();
  }

  @UseGuards(AuthGuard)
  @Get('today_cleaned') // retrieves all bookings that has been completed for the day
  retrieveAllBookingsCleanedForToday() {
    return this.bookingService.getAllBookingsCleanedForToday();
  }

  @UseGuards(AuthGuard)
  @Get(':bookingId') // retrieves a single booking from the database
  retrieveSingleBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.getSingleBooking(bookingId);
  }
}
