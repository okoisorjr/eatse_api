import { IsNotEmpty } from "class-validator";

export class updateAssignedEaserDto{
  @IsNotEmpty()
  easer: string;
}