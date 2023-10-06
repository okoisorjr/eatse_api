import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Easer } from './schema/easer.schema';
import { NewEaserDto } from './easerDto/newEaser.dto';
import { BookingService } from 'src/booking/booking.service';
import { AddressDto } from 'src/clients/clientDto/address.dto';
import { Client } from 'src/clients/schema/client.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EaserService {
  constructor(
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    private readonly bookingService: BookingService,
    private readonly mailService: MailService
  ) {}

  /* generateEaserId() {
    let id = [];
    for (let i = 0; i < 8; i++) {
      let val = Math.floor(Math.random() * (10 - 1)) + 1;
      id.push(val);
    }
    console.log(id.join(''));
    return id.join('');
  } */

  async getAllEasers(): Promise<Easer[]> {
    return await this.easerModel.find().exec();
  }

  async getEaserBookings(id: string) {
    const easer_bookings = await this.bookingService.getAllEaserBookings(id);
    return easer_bookings;
  }

  async getOneEaser(id: string): Promise<Easer> {
    const easer = await this.easerModel.findById({ _id: id });
    console.log(easer);

    if (!easer) {
      throw new NotFoundException('Easer Not Found!');
    }

    return easer;
  }

  async createEaserAccount(easerDetails: NewEaserDto): Promise<Easer> {
    //easerDetails.easerId = 'EAS' + this.generateEaserId();
    easerDetails.referralCode =
      'https://eatse.ng/?email=' +
      easerDetails.email +
      '&phone=' +
      easerDetails.phone;
    const newEaser = await this.easerModel.create(easerDetails);
    //await this.mailService.sendUserRegistrationConfirmation(newEaser, email_verification_token);
    
    return newEaser;
  }

  async retrieveEasersBasedOnLocation(state: string, city: string) {
    const easers = await this.easerModel.find({
      $and: [{ 'address.state': state, $or: [{ 'address.city': city }] }],
    });
    return easers;
  }

  async retrieveEasersBasedOnState(state: string) {
    const easers = await this.easerModel.find({
      $and: [{ 'address.state': state }],
    });
    return easers;
  }

  async retrieveEasersBasedOnCity(city: string) {
    const easers = await this.easerModel.find({
      $and: [{ 'address.city': city }],
    });
    return easers;
  }

  async updateEaserAddress(
    easerId: string,
    address: AddressDto,
  ): Promise<Easer> {
    const easer = await this.easerModel.findById(easerId);

    if (!easer) {
      throw new NotFoundException('User not found!');
    }

    easer.set('address', address).save();

    return easer;
  }

  // fetch all clients paired with easer
  async retrieveClientsAssignedToEaser(easer_id: string): Promise<Client[]> {
    const clients = await this.clientModel.find({
      $and: [{ easer: easer_id}]
    });

    return clients;
  }

  /* async assignClientToEaser(easerId: string, clientId: string): Promise<Easer> {
    let id = new mongoose.Types.ObjectId(clientId);
    console.log(id);
    const client_exists = await this.easerModel.find({
      assignedClients: id,
    });
    if (client_exists) {
      console.log('client has already been paired');
    } else {
      const easer = await this.easerModel.findByIdAndUpdate(
        { _id: easerId },
        { $push: { assignedClients: clientId } },
        { new: true, upsert: true },
      );
      return easer;
    }
  } */
}
