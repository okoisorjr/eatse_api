/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Easer } from './schema/easer.schema';
import { NewEaserDto } from './easerDto/newEaser.dto';
import { BookingService } from 'src/booking/booking.service';
import { AddressDto } from 'src/clients/clientDto/address.dto';
import { Client } from 'src/clients/schema/client.schema';
import { MailService } from 'src/mail/mail.service';
import { Booking } from 'src/booking/schema/booking.schema';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import uploadFile from 'src/helpers/upload-profile-pic';

@Injectable()
export class EaserService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private readonly bookingService: BookingService,
    private readonly mailService: MailService,
  ) {}

  AWS_S3_BUCKET = 'easers-profile';

  generateEaserId() {
    const id = [];
    for (let i = 0; i < 5; i++) {
      const val = Math.floor(Math.random() * (10 - 1)) + 1;
      id.push(val);
    }
    console.log(id.join(''));
    return id.join('');
  }

  async getAllEasers() {
    const easers = await this.easerModel.find().limit(20).populate({
      path: 'address',
      select: 'city state',
    });

    if (easers.length < 1) {
      throw new HttpException(
        'There are currently no easers available.',
        HttpStatus.NOT_FOUND,
      );
    }

    easers.forEach(async (easer) => {
      const result = await this.bookingModel.aggregate([
        { $match: { easer: easer._id, expired: false } },
        { $group: { _id: '$client', count: { $sum: 1 } } },
      ]);

      await this.easerModel.findByIdAndUpdate(
        easer._id,
        { clientsCount: result.length },
        { new: true, upsert: true },
      );
    });

    return await easers;
  }

  async getEaserBookings(id: string) {
    const easer_bookings = await this.bookingService.getAllEaserBookings(id);
    return easer_bookings;
  }

  async getOneEaser(id: string): Promise<Easer> {
    const easer = (await this.easerModel.findById({ _id: id })).populate({
      path: 'address',
    });
    console.log(easer);

    if (!easer) {
      throw new NotFoundException('Easer Not Found!');
    }

    return easer;
  }

  async createEaserAccount(easerDetails: NewEaserDto): Promise<Easer> {
    easerDetails.easerTag = 'EAS' + this.generateEaserId();
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
      $and: [{ easer: easer_id }],
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

  async uploadProfile(
    easer_id: string,
    filename: string,
    filetype: string,
    file: Buffer,
  ) {
    const easer = await this.easerModel.findById(easer_id);
    console.log(easer);
    if (!easer) {
      throw new HttpException(
        'Oops...resource not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    const upload_result = await uploadFile(
      //easer_id,
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
    await easer.updateOne(
      { profile_pic: upload_result },
      { upsert: true, new: true },
    );

    /* await this.clientModel.findByIdAndUpdate(
      client_id,
      {
        profile_pic: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
      },
      { upsert: true, new: true },
    ); */

    return {
      id: upload_result,
    };
  }
}
