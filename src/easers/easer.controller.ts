/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { EaserService } from './easer.service';
import { NewEaserDto } from './easerDto/newEaser.dto';
import { BookingService } from 'src/booking/booking.service';
import { AddressDto } from 'src/clients/clientDto/address.dto';

@Controller('easers')
export class EaserController {
  constructor(
    private easerService: EaserService,
    private bookingService: BookingService,
  ) {}

  @Get()
  async getAllEasers() {
    return await this.easerService.getAllEasers();
  }

  @Get('clients/:id/list')
  async getEaserClients(@Param('id') easer_id: string) {
    return await this.easerService.retrieveClientsAssignedToEaser(easer_id);
  }

  @Get(':id/bookings')
  async getEaserBookings(@Param('id') id: string) {
    return await this.bookingService.getAllEaserBookings(id);
  }

  @Get(':easerId/bookings/:bookingId/booking')
  getEaserSingleBooking(
    @Param('easerId') easerId: string,
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.getSingleBookingForEaser(easerId, bookingId);
  }

  @Get(':id/bookings/today')
  getEaserPresentDayBookings(@Param('id') id: string) {
    return this.bookingService.getEaserPresentDayBookings(id);
  }

  @Get(':id')
  getSingleEaser(@Param('id') id: string) {
    return this.easerService.getOneEaser(id);
  }

  @Get('state/:state/city/:city')
  getEasersBasedOnLocation(
    @Param('state') state: string,
    @Param('city') city: string,
  ) {
    return this.easerService.retrieveEasersBasedOnLocation(state, city);
  }

  @Get('city/:city')
  getEasersBasedOnCity(@Param('city') city: string) {
    return this.easerService.retrieveEasersBasedOnCity(city);
  }

  @Get('state/:state')
  getEasersBasedOnState(@Param('state') state: string) {
    return this.easerService.retrieveEasersBasedOnState(state);
  }

  @Post('new-easer')
  createEaserAccount(@Body() body: NewEaserDto) {
    return this.easerService.createEaserAccount(body);
  }

  @Put(':easerId/save_address')
  updateEaserAddress(
    @Param('easerId') easerId: string,
    @Body() addressDetails: AddressDto,
  ) {
    return this.easerService.updateEaserAddress(easerId, addressDetails);
  }

  /* @Put(':easerId/client/:clientId/assign_client')
  assignClientToEaser(
    @Param('easerId') easerId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.easerService.assignClientToEaser(easerId, clientId);
  } */
}
