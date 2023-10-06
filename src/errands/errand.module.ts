import { Module } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { ErrandController } from './errand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Errand, ErrandSchema } from './schema/errand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Errand.name, schema: ErrandSchema },
    ]),
  ],
  controllers: [ErrandController],
  providers: [ErrandService],
  exports: [ErrandService],
})
export class ErrandModule {}
