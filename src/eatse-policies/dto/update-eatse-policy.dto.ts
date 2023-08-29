import { PartialType } from '@nestjs/mapped-types';
import { CreateEatsePolicyDto } from './create-eatse-policy.dto';

export class UpdateEatsePolicyDto extends PartialType(CreateEatsePolicyDto) {}
