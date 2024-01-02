import { Module } from '@nestjs/common';
import { ShoppingMallsService } from './shopping-malls.service';
import { ShoppingMallsController } from './shopping-malls.controller';

@Module({
  controllers: [ShoppingMallsController],
  providers: [ShoppingMallsService],
})
export class ShoppingMallsModule {}
