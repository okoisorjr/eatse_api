import { Module } from '@nestjs/common';
import { EatseServicesService } from './eatse-services.service';
import { EatseServicesController } from './eatse-services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EatseService, ServicesSchema } from './entities/eatse-service.entity';
import {
  Employee,
  EmployeeSchema,
} from 'src/employee/entities/employee.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EatseService.name, schema: ServicesSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EatseServicesController],
  providers: [EatseServicesService],
})
export class EatseServicesModule {}
