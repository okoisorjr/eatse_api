import * as mongoose from 'mongoose';
import { FumigationDto } from './fumigationDto/fumigation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Fumigation, FumigationSchema } from './schema/fumigation.schema';

export class FumigationService {
  constructor(
    @InjectModel(Fumigation.name)
    private fumigationModel: mongoose.Model<Fumigation>,
  ) {}

  async bookFumigation(booking: FumigationDto): Promise<any> {
    console.log(booking);
    const new_booking = await this.fumigationModel.create(booking);
    return new_booking;
  }

  async listAllFumigationBookings(): Promise<any> {
    const all_bookings = await this.fumigationModel.find();
    return all_bookings;
  }

  async listClientFumigationBookings(id: string): Promise<any> {
    const bookings = await this.fumigationModel.find({ client: id });
    return bookings;
  }
}
