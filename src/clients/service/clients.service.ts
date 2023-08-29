import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { NewClientDto } from '../clientDto/newClient.dto';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Client } from '../schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';
import { updateAssignedEaserDto } from '../clientDto/updateAssignedEaser.dto';
import { AddressDto } from 'src/clients/clientDto/address.dto';

export interface EaserData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

@Injectable()
export class ClientsService {
  salt: number = 10;

  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getAllClients(): Promise<Client[]> {
    return await this.clientModel.find().sort({ createdAt: -1 });
  }

  async getClientsBasedOnLocation(state: string, city: string) {
    const easers = await this.clientModel.find({
      $and: [{ 'address.state': state, $or: [{ 'address.city': city }] }],
    });
    return easers;
  }

  async getClientsBasedOnState(state: string) {
    const easers = await this.clientModel.find({
      $and: [{ 'address.state': state }],
    });
    return easers;
  }

  async getClientsBasedOnCity(city: string) {
    const easers = await this.clientModel.find({
      $and: [{ 'address.city': city }],
    });
    return easers;
  }

  async getOneClient(id: string) {
    const requestedClient = await this.clientModel
      .findById(id)
      .populate('easer', '', this.easerModel);

    if (!requestedClient) {
      throw new NotFoundException('Client Not Found!');
    }

    return requestedClient;
  }

  async deleteClient(id: string) {
    return await this.clientModel.findByIdAndDelete(id).exec();
  }

  async createClientAccount(clientDetails: NewClientDto): Promise<Client> {
    clientDetails.referralCode =
      'https://eatse.ng/?email=' +
      clientDetails.email +
      '&phone=' +
      clientDetails.phone;
    clientDetails.password = await bcrypt.hash(
      clientDetails.password,
      this.salt,
    );
    const clientCreated = await this.clientModel.create(clientDetails);
    return clientCreated;
  }

  // update assigned user or assign a new easer to the client
  async assignEaserToClient(
    clientId: string,
    assignedEaser: updateAssignedEaserDto,
  ) {
    const updatedClient = await this.clientModel.findByIdAndUpdate(
      clientId,
      assignedEaser,
      { new: true, upsert: true },
    );
    return updatedClient;
  }

  // save and update clients address
  async updateClientAddress(
    clientId: string,
    address: AddressDto,
  ): Promise<Client> {
    const client = await this.clientModel.findById(clientId);

    if (!client) {
      throw new NotFoundException('User not found!');
    }

    client.set('address', address).save();
    return client;
  }
}
