import { Test, TestingModule } from '@nestjs/testing';
import { EatseServicesController } from './eatse-services.controller';
import { EatseServicesService } from './eatse-services.service';

describe('EatseServicesController', () => {
  let controller: EatseServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatseServicesController],
      providers: [EatseServicesService],
    }).compile();

    controller = module.get<EatseServicesController>(EatseServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
