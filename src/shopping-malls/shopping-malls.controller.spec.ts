import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingMallsController } from './shopping-malls.controller';
import { ShoppingMallsService } from './shopping-malls.service';

describe('ShoppingMallsController', () => {
  let controller: ShoppingMallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingMallsController],
      providers: [ShoppingMallsService],
    }).compile();

    controller = module.get<ShoppingMallsController>(ShoppingMallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
