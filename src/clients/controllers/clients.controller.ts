/* eslint-disable prettier/prettier */
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
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from '../service/clients.service';
import { NewClientDto } from '../clientDto/newClient.dto';
import { updateAssignedEaserDto } from '../clientDto/updateAssignedEaser.dto';
import { AddressDto } from 'src/clients/clientDto/address.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/shared/roles.enum';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  //@UseGuards(AuthGuard)
  //@Roles(Role.ADMIN, Role.CLIENT)
  @Get()
  getClients() {
    return this.clientService.getAllClients();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getOneClient(@Param('id') id: string) {
    return this.clientService.getOneClient(id);
  }

  @UseGuards(AuthGuard)
  @Get('state/:state/city/:city')
  getClientsBasedOnLocation(
    @Param('state') state: string,
    @Param('city') city: string,
  ) {
    return this.clientService.getClientsBasedOnLocation(state, city);
  }

  @UseGuards(AuthGuard)
  @Get('city/:city')
  getClientsBasedOnCity(@Param('city') city: string) {
    return this.clientService.getClientsBasedOnCity(city);
  }

  @UseGuards(AuthGuard)
  @Get('state/:state')
  getClientsBasedOnState(@Param('state') state: string) {
    return this.clientService.getClientsBasedOnState(state);
  }

  @Post('new-client')
  @UsePipes(new ValidationPipe())
  saveClient(@Body() body: NewClientDto) {
    return this.clientService.createClientAccount(body);
  }

  @UseGuards(AuthGuard)
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

  @Get(':client_id/assigned_easer')
  fetchClientEaser(@Param('client_id') client_id: string) {
    return this.clientService.fetchAssignedEaser(client_id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  deleteClientAccount(id: string) {
    return this.clientService.deleteClient(id);
  }
}
