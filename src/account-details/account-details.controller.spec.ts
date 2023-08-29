import { Test, TestingModule } from '@nestjs/testing';
import { AccountDetailsController } from './account-details.controller';
import { AccountDetailsService } from './account-details.service';

describe('AccountDetailsController', () => {
  let controller: AccountDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountDetailsController],
      providers: [AccountDetailsService],
    }).compile();

    controller = module.get<AccountDetailsController>(AccountDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
