import { IsNotEmpty } from 'class-validator';
import { NewClientDto } from 'src/clients/clientDto/newClient.dto';
import { NewEaserDto } from 'src/easers/easerDto/newEaser.dto';

export class AddressDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  addressLineOne: string;

  addressLineTwo: string;
  zipCode: string;
}
