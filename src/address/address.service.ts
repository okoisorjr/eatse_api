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
import { ResourceCreated } from 'src/shared/resource-created';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
    @InjectModel(Easer.name) private readonly easerModel: Model<Easer>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    // check if the account belongs to an easer
    const found_easer = await this.easerModel.find({
      _id: createAddressDto.user,
    });

    if (found_easer) {
      // if account belongs to easer check if they have provided address before
      let found_easer_address = await this.addressModel.findOne({
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

    // if user is not easer create new address for client or if user is easer and has not provided address before then create new address
    const new_address = new this.addressModel();

    new_address.country = createAddressDto.country;
    new_address.state = createAddressDto.state;
    new_address.city = createAddressDto.city;
    new_address.street = createAddressDto.street;
    new_address.zip_code = createAddressDto.zip_code;
    new_address.user = createAddressDto.user;

    const saved_address = new_address.save();

    return saved_address;
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

    let address = await this.addressModel.findOneAndUpdate(
      { _id: address_id },
      updateAddressDto,
      { upsert: true, new: true },
    );
    return address;
  }

  async remove(address_id: string) {
    const content = await this.addressModel.findOneAndDelete({ _id: address_id });
    return new ResourceCreated;
  }
}
