import { IsNotEmpty } from "class-validator";

export class NewNotificationDto{
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  notice: string;

  
}