import { Test, TestingModule } from '@nestjs/testing';
import { EatseBlogsController } from './eatse-blogs.controller';
import { EatseBlogsService } from './eatse-blogs.service';

describe('EatseBlogsController', () => {
  let controller: EatseBlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatseBlogsController],
      providers: [EatseBlogsService],
    }).compile();

    controller = module.get<EatseBlogsController>(EatseBlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
