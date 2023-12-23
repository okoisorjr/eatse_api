import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: mongoose.Model<Feedback>,
    @InjectModel(Client.name) private clientModel: mongoose.Model<Client>,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    if (createFeedbackDto.client) {
      try {
        await this.clientModel.findById(createFeedbackDto.client);
      } catch (error) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
    }

    const new_feedback = await this.feedbackModel.create(createFeedbackDto);
    return new_feedback;
  }

  async findAll() {
    let feedbacksToDisplay = [];
    const feedbacks = await this.feedbackModel
      .find()
      .populate({ path: 'client', select: 'firstname lastname' });

    if(!feedbacks){
      throw new NotFoundException('Ooops!...No Testimonies yet!');
    }
    
    let shuffled = this.shuffleFeedbacks(feedbacks);
    for (let i = 0; i < 6; i++) {
      feedbacksToDisplay.push(shuffled[i]);
    }

    return feedbacksToDisplay;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }

  shuffleFeedbacks(feedbacks: any[]) {
    for (let i = feedbacks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = feedbacks[i];

      feedbacks[i] = feedbacks[j];
      feedbacks[j] = temp;
    }
    return feedbacks;
  }
}
