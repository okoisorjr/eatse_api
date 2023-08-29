import { Test, TestingModule } from '@nestjs/testing';
import { EatsePoliciesController } from './eatse-policies.controller';
import { EatsePoliciesService } from './eatse-policies.service';

describe('EatsePoliciesController', () => {
  let controller: EatsePoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatsePoliciesController],
      providers: [EatsePoliciesService],
    }).compile();

    controller = module.get<EatsePoliciesController>(EatsePoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
