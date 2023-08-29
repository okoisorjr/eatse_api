import { Module } from '@nestjs/common';
import { EatseBlogsService } from './eatse-blogs.service';
import { EatseBlogsController } from './eatse-blogs.controller';

@Module({
  controllers: [EatseBlogsController],
  providers: [EatseBlogsService]
})
export class EatseBlogsModule {}
