import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Service } from 'src/shared/services.enum';

export class CreateRoomPriceDto {
  @IsNotEmpty()
  @IsEnum(Service)
  service: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  room_name: string;
}
