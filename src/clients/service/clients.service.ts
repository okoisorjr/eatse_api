/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { NewClientDto } from '../clientDto/newClient.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from '../schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';
import { updateAssignedEaserDto } from '../clientDto/updateAssignedEaser.dto';
import { AddressDto } from 'src/clients/clientDto/address.dto';
import { MailService } from 'src/mail/mail.service';
import { S3Client } from '@aws-sdk/client-s3';
import uploadFile from 'src/helpers/upload-profile-pic';
import { ConfigService } from '@nestjs/config';

export interface EaserData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

@Injectable()
export class ClientsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  salt = 10;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    private readonly mailService: MailService,
  ) {}

  AWS_S3_BUCKET = 'clients-profile';

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
      .populate('easer', '', this.easerModel)
      .populate('addresses');

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

  // Get easer assigned to a client
  async fetchAssignedEaser(client_id: string) {
    const client = await this.clientModel
      .find({ _id: client_id })
      .select('easer -_id')
      .populate({
        path: 'easer',
        select: '_id firstname lastname phone',
      })
      .exec();

    if (!client) {
      throw new NotFoundException();
    }

    return client;
  }

  async uploadProfile(
    client_id: string,
    filename: string,
    filetype: string,
    file: Buffer,
  ) {
    const client = await this.clientModel.findById(client_id);

    if (!client) {
      throw new HttpException(
        'Oops...resource not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    client.profile_pic = await uploadFile(
      //client_id,
      filename,
      filetype,
      file,
      //this.s3Client,
      this.AWS_S3_BUCKET,
    );

    /* const key = filename + Date.now();
    let fileURL: PutObjectCommandOutput;
    try {
      fileURL = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.AWS_S3_BUCKET,
          Key: key,
          Body: file,
          ACL: 'public-read',
          ContentType: filetype,
        }),
      );
    } catch (err) {
      console.log(err);
      return err;
    }

    if (fileURL.$metadata.httpStatusCode !== 200) {
      throw new HttpException(
        'FILE WAS NOT SAVED TO BUCKET!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    client.profile_pic = `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`; */
    await client.save();

    /* await this.clientModel.findByIdAndUpdate(
      client_id,
      {
        profile_pic: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
      },
      { upsert: true, new: true },
    ); */

    return {
      id: client.profile_pic,
    };
  }
}
