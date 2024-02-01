/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './entities/employee.entity';
import { Model } from 'mongoose';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const referral_link = `https://eatse.ng/?email=${createEmployeeDto.email}&phone=${createEmployeeDto.phone}`;
    try {
      const new_employee = this.employeeModel.create({
        ...createEmployeeDto,
        referral_link: referral_link,
      });
      return new_employee;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.employeeModel.find();
    return employees;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
