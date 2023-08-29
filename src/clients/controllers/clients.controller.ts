import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
  UseGuards
} from '@nestjs/common';
import { ClientsService } from '../service/clients.service';
import { NewClientDto } from '../clientDto/newClient.dto';
import { updateAssignedEaserDto } from '../clientDto/updateAssignedEaser.dto';
import { AddressDto } from 'src/clients/clientDto/address.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  getClients() {
    return this.clientService.getAllClients();
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getOneClient(@Param('id') id: string) {
    return this.clientService.getOneClient(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('state/:state/city/:city')
  getClientsBasedOnLocation(
    @Param('state') state: string,
    @Param('city') city: string,
  ) {
    return this.clientService.getClientsBasedOnLocation(state, city);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('city/:city')
  getClientsBasedOnCity(@Param('city') city: string) {
    return this.clientService.getClientsBasedOnCity(city);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('state/:state')
  getClientsBasedOnState(@Param('state') state: string) {
    return this.clientService.getClientsBasedOnState(state);
  }


  @Post('new-client')
  @UsePipes(new ValidationPipe())
  saveClient(@Body() body: NewClientDto) {
    return this.clientService.createClientAccount(body);
  }

  @UseGuards(AuthGuard('jwt'))
  // save and update clients address
  @Put(':clientId/save_address')
  updateClientAddress(
    @Param('clientId') clientId: string,
    @Body() addressDetails: AddressDto,
  ) {
    return this.clientService.updateClientAddress(clientId, addressDetails);
  }

  // assign or pair client to easer
  @Put(':clientId/assign_easer')
  assignEaserToClient(
    @Param('clientId') clientId: string,
    @Body() body: updateAssignedEaserDto,
  ) {
    return this.clientService.assignEaserToClient(clientId, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete()
  deleteClientAccount(id: string) {
    return this.clientService.deleteClient(id);
  }
}
