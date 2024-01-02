import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingMallsService } from './shopping-malls.service';

describe('ShoppingMallsService', () => {
  let service: ShoppingMallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingMallsService],
    }).compile();

    service = module.get<ShoppingMallsService>(ShoppingMallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
