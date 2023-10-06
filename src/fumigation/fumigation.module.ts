import { Module } from '@nestjs/common';
import { FumigationService } from './fumigation.service';
import { FumigationController } from './fumigation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fumigation, FumigationSchema } from './schema/fumigation.schema';

@Module({
  controllers: [FumigationController],
  imports: [
    MongooseModule.forFeature([
      { name: Fumigation.name, schema: FumigationSchema },
    ]),
  ],
  providers: [FumigationService],
})
export class FumigationModule {}
