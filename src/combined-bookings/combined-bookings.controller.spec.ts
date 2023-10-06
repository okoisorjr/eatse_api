import { Test, TestingModule } from '@nestjs/testing';
import { CombinedBookingsController } from './combined-bookings.controller';
import { CombinedBookingsService } from './combined-bookings.service';

describe('CombinedBookingsController', () => {
  let controller: CombinedBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombinedBookingsController],
      providers: [CombinedBookingsService],
    }).compile();

    controller = module.get<CombinedBookingsController>(CombinedBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
