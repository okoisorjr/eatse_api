import { Test, TestingModule } from '@nestjs/testing';
import { RoomPricesService } from './room-prices.service';

describe('RoomPricesService', () => {
  let service: RoomPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomPricesService],
    }).compile();

    service = module.get<RoomPricesService>(RoomPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
