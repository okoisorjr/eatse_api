import { PartialType } from '@nestjs/mapped-types';
import { CreateEatseServiceDto } from './create-eatse-service.dto';

export class UpdateEatseServiceDto extends PartialType(CreateEatseServiceDto) {}
