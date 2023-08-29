import { Injectable } from '@nestjs/common';
import { CreateEatsePolicyDto } from './dto/create-eatse-policy.dto';
import { UpdateEatsePolicyDto } from './dto/update-eatse-policy.dto';

@Injectable()
export class EatsePoliciesService {
  create(createEatsePolicyDto: CreateEatsePolicyDto) {
    return 'This action adds a new eatsePolicy';
  }

  findAll() {
    return `This action returns all eatsePolicies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eatsePolicy`;
  }

  update(id: number, updateEatsePolicyDto: UpdateEatsePolicyDto) {
    return `This action updates a #${id} eatsePolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} eatsePolicy`;
  }
}
