import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEatseServiceDto } from './dto/create-eatse-service.dto';
import { UpdateEatseServiceDto } from './dto/update-eatse-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { EatseService } from './entities/eatse-service.entity';
import { Model } from 'mongoose';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Employee } from 'src/employee/entities/employee.entity';
import { Role } from 'src/shared/roles.enum';

@Injectable()
export class EatseServicesService {
  AWS_S3_BUCKET = 'eatse-services';

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    private configService: ConfigService,
    @InjectModel(EatseService.name)
    private readonly eatseServicesModel: Model<EatseService>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  async create(
    filename: string,
    filetype: string,
    file: Buffer,
    createEatseServiceDto: CreateEatseServiceDto,
  ): Promise<EatseService> {
    // check if employee exists and has admin rights
    let employee: Employee;
    try {
      employee = await this.employeeModel.findOne({
        _id: createEatseServiceDto.employee,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // if employee is not found
    if (!employee) {
      throw new HttpException(
        'This admin user was not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    // if employee is admin
    if (employee.active === false || employee.role !== Role.ADMIN) {
      throw new HttpException(
        'This account does not have authorization to perform the intended action!',
        HttpStatus.UNAUTHORIZED,
      );
    }

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
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (fileURL.$metadata.httpStatusCode !== 200) {
      throw new HttpException(
        'IMAGE UPLOAD FAILED!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const new_service = await this.eatseServicesModel.create({
      ...createEatseServiceDto,
      photoURL: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
    });

    return new_service;
  }

  async findAll(): Promise<EatseService[]> {
    const services = await this.eatseServicesModel.find();
    return services;
  }

  findOne(id: number) {
    return `This action returns a #${id} eatseService`;
  }

  update(id: number, updateEatseServiceDto: UpdateEatseServiceDto) {
    return `This action updates a #${id} eatseService`;
  }

  remove(id: number) {
    return `This action removes a #${id} eatseService`;
  }
}
