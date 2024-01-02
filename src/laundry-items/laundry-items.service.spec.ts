import { Test, TestingModule } from '@nestjs/testing';
import { LaundryItemsService } from './laundry-items.service';

describe('LaundryItemsService', () => {
  let service: LaundryItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaundryItemsService],
    }).compile();

    service = module.get<LaundryItemsService>(LaundryItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
