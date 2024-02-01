/* eslint-disable prettier/prettier */
import {
  Injectable,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Application } from './entities/application.entity';
import { Position } from './entities/position.entity';

@Injectable()
export class ApplicationService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Application.name)
    private readonly applicationModel: mongoose.Model<Application>,
    @InjectModel(Position.name) private readonly positionModel: mongoose.Model<Position>
  ) {}

  AWS_S3_BUCKET = 'eatse';

  async create(
    filename: string,
    filetype: string,
    file: Buffer,
    createApplicationDto: CreateApplicationDto,
  ) {
    const key = filename + Date.now();
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

    const new_application = new this.applicationModel();
    new_application.fullname = createApplicationDto.fullname;
    new_application.email = createApplicationDto.email;
    new_application.phone = createApplicationDto.phone;
    new_application.portfolioUrl = createApplicationDto.portfolioURL;
    new_application.linkedInProfile = createApplicationDto.linkedInProfile;
    new_application.others = createApplicationDto.others;
    new_application.resumeURL = `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
    new_application.user = createApplicationDto.user;
    let saved_application = await new_application.save();
    return saved_application;
  }

  async createNewPosition() {
    const position = await this.positionModel.create()
    return;
  }

  async findAll() {
    const applications = await this.applicationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .populate('user', 'id email phone referralCode')
      .exec();

    if (!applications) {
      throw new HttpException(
        'No job application was found',
        HttpStatus.NOT_FOUND,
      );
    }
    return applications;
  }

  findOne(id: number) {
    return `This action returns a #${id} application`;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
