import { Test, TestingModule } from '@nestjs/testing';
import { EatseBlogsService } from './eatse-blogs.service';

describe('EatseBlogsService', () => {
  let service: EatseBlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatseBlogsService],
    }).compile();

    service = module.get<EatseBlogsService>(EatseBlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
