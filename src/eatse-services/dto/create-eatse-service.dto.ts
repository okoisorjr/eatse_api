import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateEatseServiceDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  position: number;

  file: any;

  @IsNotEmpty()
  @IsMongoId()
  employee: string;
}
