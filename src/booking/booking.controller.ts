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
import { UpdateBookingEaserDto } from './bookingDto/UpdateBookingEaser.dto';
import { UpdateBookingDto } from './bookingDto/UpdateBooking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post('new-booking') // creates a new booking
  saveBooking(@Body() body: NewBookingDto) {
    console.log(body);
    return this.bookingService.saveNewBooking(body);
  }

  @Put('assign_easer')
  assignBookingEaser(@Body() data: UpdateBookingEaserDto) {
    return this.bookingService.assignEaserToBooking(data);
  }

  //@UseGuards(AuthGuard)
  @Get() // retrieves all the bookings from the database
  retrieveBookings(@Query() query: number) {
    if (query) {
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

  @Get('client/:client_id/bookings')
  async getClientBookings(@Param('client_id') client_id: string) {
    return await this.bookingService.getAllClientsBooking(client_id);
  }

  @Put(':booking_id/cancel')
  cancelBooking(
    @Param('booking_id') booking_id: string,
    @Body() update: UpdateBookingDto,
  ) {
    return this.bookingService.cancelOrder(booking_id, update);
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

  @UseGuards(AuthGuard)
  @Get(':bookingId') // retrieves a single booking from the database
  retrieveSingleBooking(@Param('bookingId') bookingId: string) {
    return this.bookingService.getSingleBooking(bookingId);
  }
}
