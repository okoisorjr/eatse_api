import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  /* @IsNotEmpty()
  @IsMongoId()
  id: string; */

  country: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  zip_code: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
