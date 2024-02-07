/* eslint-disable prettier/prettier */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './entities/address.entity';
import { Model } from 'mongoose';
import { Easer } from 'src/easers/schema/easer.schema';
import { Client } from 'src/clients/schema/client.schema';
//import { ResourceCreated } from 'src/shared/resource-created';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
    @InjectModel(Easer.name) private readonly easerModel: Model<Easer>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    // varaible declaration for client account
    let found_client;
    // check if the account belongs to an easer
    const found_easer = await this.easerModel.find({
      _id: createAddressDto.user,
    });

    console.log(found_easer);

    if (found_easer) {
      // if account belongs to easer check if they have provided address before
      const found_easer_address = await this.addressModel.findOne({
        user: found_easer,
      });
      // if address found for easer throw error
      if (found_easer_address) {
        throw new HttpException(
          'This easer account already provided their address information!',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (!found_easer) {
      try {
        found_client = await this.clientModel.findById(createAddressDto.user);
        console.log(found_client);
        // if account is not client account throw error
        if (!found_client) {
          throw new HttpException(
            'Oops....resource not found!',
            HttpStatus.NOT_FOUND,
          );
        }
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // if user is not easer create new address for client 
    // if user is easer and has no saved address then create new easer address
    const new_address = new this.addressModel();

    new_address.country = createAddressDto.country;
    new_address.state = createAddressDto.state;
    new_address.city = createAddressDto.city;
    new_address.street = createAddressDto.street;
    new_address.zip_code = createAddressDto.zip_code;
    new_address.user = createAddressDto.user;

    const saved_address = await new_address.save();

    if (saved_address && found_client) {
      await this.clientModel.findByIdAndUpdate(
        createAddressDto.user,
        {
          $push: { address: saved_address._id },
        },
        { upsert: true, new: true },
      );
    } else if (saved_address && found_easer) {
      await this.easerModel.findByIdAndUpdate(
        createAddressDto.user,
        { address: saved_address._id },
        { upsert: true, new: true },
      );
    }

    return new_address;
  }

  async findAll(): Promise<Address[]> {
    const addresses = await this.addressModel.find().sort({ createdAt: -1 });
    return addresses;
  }

  async findOne(address_id: string): Promise<Address> {
    const address = await this.addressModel.findOne({ _id: address_id });
    if (!address) {
      throw new HttpException('No address was found!', HttpStatus.NOT_FOUND);
    }
    return address;
  }

  async getUserAddresses(user_id): Promise<Address[]> {
    const addresses = await this.addressModel
      .find({ user: user_id })
      .sort({ createdAt: -1 });
    return addresses;
  }

  async update(address_id: string, updateAddressDto: UpdateAddressDto) {
    const client = await this.clientModel.findById({
      _id: updateAddressDto.user,
    });

    if (!client) {
      const easer = await this.easerModel.findById({
        _id: updateAddressDto.user,
      });

      if (!easer) {
        throw new NotFoundException('User not found!');
      }
    }

    const address = await this.addressModel.findOneAndUpdate(
      { _id: address_id },
      updateAddressDto,
      { upsert: true, new: true },
    );
    return address;
  }

  async remove(address_id: string) {
    const content = await this.addressModel.findOneAndDelete({
      _id: address_id,
    });
    return content;
    //return new ResourceCreated().id;
  }
}
