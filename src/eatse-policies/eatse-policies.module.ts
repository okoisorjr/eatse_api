import { Module } from '@nestjs/common';
import { EatsePoliciesService } from './eatse-policies.service';
import { EatsePoliciesController } from './eatse-policies.controller';

@Module({
  controllers: [EatsePoliciesController],
  providers: [EatsePoliciesService]
})
export class EatsePoliciesModule {}
