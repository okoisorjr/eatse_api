import { Test, TestingModule } from '@nestjs/testing';
import { CombinedBookingsService } from './combined-bookings.service';

describe('CombinedBookingsService', () => {
  let service: CombinedBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CombinedBookingsService],
    }).compile();

    service = module.get<CombinedBookingsService>(CombinedBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
