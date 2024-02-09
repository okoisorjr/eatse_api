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
import { Client } from 'src/clients/schema/client.schema';
import uploadFile from 'src/helpers/upload-profile-pic';
import { Easer } from 'src/easers/schema/easer.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionsStatus } from 'src/shared/positions-status.enum';
import { ApplicantStatus } from 'src/shared/applicant-status.enum';

@Injectable()
export class ApplicationService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Client.name)
    private readonly clientModel: mongoose.Model<Client>,
    @InjectModel(Easer.name)
    private readonly easerModel: mongoose.Model<Easer>,
    @InjectModel(Application.name)
    private readonly applicationModel: mongoose.Model<Application>,
    @InjectModel(Position.name)
    private readonly positionModel: mongoose.Model<Position>,
  ) {}

  AWS_S3_BUCKET = 'eatse-cvs';

  async create(createApplicationDto: CreateApplicationDto) {
    const new_application = new this.applicationModel();
    new_application.fullname = createApplicationDto.fullname;
    new_application.email = createApplicationDto.email;
    new_application.phone = createApplicationDto.phone;
    new_application.role = createApplicationDto.position;
    new_application.portfolioUrl = createApplicationDto.portfolioURL;
    new_application.linkedInProfile = createApplicationDto.linkedInProfile;
    new_application.others = createApplicationDto.others;
    new_application.resumeURL = createApplicationDto.file;
    const saved_application = await new_application.save();

    /* const saved_application = await this.applicationModel.create(
      createApplicationDto,
    ); */
    return {
      id: saved_application.id,
      msg: 'application was saved successsfully',
      status: 200,
    };
  }

  async createNewPosition(createPositionDto: CreatePositionDto) {
    const position = await this.positionModel.create(createPositionDto);
    return { id: position.id };
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

  async getApplicationsPerRole(position_id: string) {
    const applications = await this.applicationModel
      .find({
        role: position_id,
      })
      .populate('role')
      .exec();
    return applications;
  }

  async findAllJobOpenings() {
    const current_openings = await this.positionModel.find({
      status: PositionsStatus.OPENED,
    });
    return current_openings;
  }

  async getApplicantsAnalysis() {
    let total_applicants = 0;
    let analysis = await this.applicationModel.aggregate([
      {
        $group: {
          _id: '$applicant_status',
          count: { $sum: 1 },
        },
      },
    ]);

    analysis.forEach((item) => {
      total_applicants += item.count;
    });

    analysis = [...analysis, { _id: 'TOTAL', count: total_applicants }];
    return analysis;
  }

  async findAllJobs() {
    const positions = await this.positionModel.find();
    return positions;
  }

  async getSinglePosition(position_id) {
    const position = await this.positionModel.findById(position_id);
    return position;
  }

  async getSingleApplicant(applicant_id) {
    const applicant = await this.applicationModel.findById(applicant_id);
    return applicant;
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

  async uploadCV(filename: string, filetype: string, file: Buffer) {
    const img_URL = await uploadFile(
      filename,
      filetype,
      file,
      this.AWS_S3_BUCKET,
    );

    return img_URL;
  }
}
