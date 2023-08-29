import { Test, TestingModule } from '@nestjs/testing';
import { EatsePoliciesService } from './eatse-policies.service';

describe('EatsePoliciesService', () => {
  let service: EatsePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatsePoliciesService],
    }).compile();

    service = module.get<EatsePoliciesService>(EatsePoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
