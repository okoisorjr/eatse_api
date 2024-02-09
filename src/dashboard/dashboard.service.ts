/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from 'src/booking/schema/booking.schema';
import { Model } from 'mongoose';
import { Errand } from 'src/errands/schema/errand.schema';
import { Client } from 'src/clients/schema/client.schema';
import { Easer } from 'src/easers/schema/easer.schema';
import { Fumigation } from 'src/fumigation/schema/fumigation.schema';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Errand.name) private errandModel: Model<Errand>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Easer.name) private easerModel: Model<Easer>,
    @InjectModel(Fumigation.name) private fumigationModel: Model<Fumigation>,
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}
  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  async findAll() {
    const today = new Date();
    const last_days_ago = new Date(today.setDate(today.getDate() - 7));
    const totalClients = await this.clientModel.find().count();
    const totalEasers = await this.easerModel.find().count();
    const totalNewEasers = await this.easerModel
      .find({ createdAt: { $gte: last_days_ago.setHours(0, 0, 0, 0) } })
      .count()
      .sort({ createdAt: 'asc'});
    const totalNewClients = await this.clientModel
      .find({ createdAt: { $gte: last_days_ago.setHours(0, 0, 0, 0) } })
      .count()
      .sort({ createdAt: 'asc' });
    const totalFeedbacks = await this.feedbackModel.find().count();
    const totalBooking = await this.bookingModel.find().count();
    const totalErrands = await this.errandModel.find().count();
    const totalFumigations = await this.fumigationModel.find().count();

    return {
      totalClients,
      totalEasers,
      totalFeedbacks,
      totalBooking,
      totalErrands,
      totalFumigations,
      totalNewEasers,
      totalNewClients,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
