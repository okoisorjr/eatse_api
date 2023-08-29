import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EatsePoliciesService } from './eatse-policies.service';
import { CreateEatsePolicyDto } from './dto/create-eatse-policy.dto';
import { UpdateEatsePolicyDto } from './dto/update-eatse-policy.dto';

@Controller('eatse-policies')
export class EatsePoliciesController {
  constructor(private readonly eatsePoliciesService: EatsePoliciesService) {}

  @Post()
  create(@Body() createEatsePolicyDto: CreateEatsePolicyDto) {
    return this.eatsePoliciesService.create(createEatsePolicyDto);
  }

  @Get()
  findAll() {
    return this.eatsePoliciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eatsePoliciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEatsePolicyDto: UpdateEatsePolicyDto) {
    return this.eatsePoliciesService.update(+id, updateEatsePolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eatsePoliciesService.remove(+id);
  }
}
