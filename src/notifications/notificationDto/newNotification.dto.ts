import { IsEnum, IsMongoId, IsNotEmpty } from "class-validator";
import { Role } from '../../shared/roles.enum';

export class NewNotificationDto{
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  notice: string;

  @IsNotEmpty()
  @IsMongoId()
  postedBy: string;

  @IsNotEmpty()
  target: string;
}