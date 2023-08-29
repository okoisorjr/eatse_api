import { Test, TestingModule } from '@nestjs/testing';
import { AccountDetailsService } from './account-details.service';

describe('AccountDetailsService', () => {
  let service: AccountDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountDetailsService],
    }).compile();

    service = module.get<AccountDetailsService>(AccountDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
