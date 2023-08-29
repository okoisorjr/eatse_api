import { Test, TestingModule } from '@nestjs/testing';
import { EatseServicesService } from './eatse-services.service';

describe('EatseServicesService', () => {
  let service: EatseServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatseServicesService],
    }).compile();

    service = module.get<EatseServicesService>(EatseServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
