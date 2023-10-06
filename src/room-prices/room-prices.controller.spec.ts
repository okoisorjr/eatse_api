import { Test, TestingModule } from '@nestjs/testing';
import { RoomPricesController } from './room-prices.controller';
import { RoomPricesService } from './room-prices.service';

describe('RoomPricesController', () => {
  let controller: RoomPricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomPricesController],
      providers: [RoomPricesService],
    }).compile();

    controller = module.get<RoomPricesController>(RoomPricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
