import { Test, TestingModule } from '@nestjs/testing';
import { LaundryItemsController } from './laundry-items.controller';
import { LaundryItemsService } from './laundry-items.service';

describe('LaundryItemsController', () => {
  let controller: LaundryItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaundryItemsController],
      providers: [LaundryItemsService],
    }).compile();

    controller = module.get<LaundryItemsController>(LaundryItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
