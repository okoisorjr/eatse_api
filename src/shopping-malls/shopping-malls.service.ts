import { Injectable } from '@nestjs/common';
import { CreateShoppingMallDto } from './dto/create-shopping-mall.dto';
import { UpdateShoppingMallDto } from './dto/update-shopping-mall.dto';

@Injectable()
export class ShoppingMallsService {
  create(createShoppingMallDto: CreateShoppingMallDto) {
    return 'This action adds a new shoppingMall';
  }

  findAll() {
    return `This action returns all shoppingMalls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingMall`;
  }

  update(id: number, updateShoppingMallDto: UpdateShoppingMallDto) {
    return `This action updates a #${id} shoppingMall`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingMall`;
  }
}
