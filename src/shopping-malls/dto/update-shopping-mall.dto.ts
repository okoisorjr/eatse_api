import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingMallDto } from './create-shopping-mall.dto';

export class UpdateShoppingMallDto extends PartialType(CreateShoppingMallDto) {}
