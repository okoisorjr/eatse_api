import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @UseGuards(AuthGuard)
  @Get() // get all addresses
  findAll() {
    return this.addressService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':address_id') // get single address 
  findOne(@Param('address_id') address_id: string) {
    return this.addressService.findOne(address_id);
  }

  @UseGuards(AuthGuard)
  @Get(':user_id/address') // get addresses of a user
  getUserAddresses(@Param('user_id') user_id: string){
    return this.addressService.getUserAddresses(user_id);
  }

  @UseGuards(AuthGuard)
  @Patch(':address_id')
  update(@Param('address_id') address_id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(address_id, updateAddressDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':address_id')
  remove(@Param('address_id') address_id: string) {
    return this.addressService.remove(address_id);
  }
}
