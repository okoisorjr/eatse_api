import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDetailDto } from './create-account-detail.dto';

export class UpdateAccountDetailDto extends PartialType(CreateAccountDetailDto) {}
