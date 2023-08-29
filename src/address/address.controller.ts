import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get() // get all addresses
  findAll() {
    return this.addressService.findAll();
  }


  @Get(':address_id') // get single address 
  findOne(@Param('address_id') address_id: string) {
    return this.addressService.findOne(address_id);
  }

  @Get(':user_id/users') // get addresses of a user
  getUserAddresses(@Param('user_id') user_id: string){
    return this.addressService.getUserAddresses(user_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
