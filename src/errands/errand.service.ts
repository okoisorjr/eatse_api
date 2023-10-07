import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Errand, ErrandSchema } from './schema/errand.schema';
import { Model } from 'mongoose';
import { ErrandDto } from './errandDto/errand.dto';

@Injectable()
export class ErrandService {
  constructor(@InjectModel(Errand.name) private errandModel: Model<Errand>) {}

  async fetchAllErrands(): Promise<Errand[]> {
    const errands = await this.errandModel.find();

    if (!errands) {
      throw new HttpException('Not Found!', HttpStatus.NO_CONTENT);
    }

    return errands;
  }

  async saveNewErrand(errand: ErrandDto): Promise<Errand> {
    const new_errand = await this.errandModel.create(errand);

    if (!new_errand) {
      throw new HttpException(
        'operation timed out!',
        HttpStatus.REQUEST_TIMEOUT,
      );
    }

    return new_errand;
  }
}
