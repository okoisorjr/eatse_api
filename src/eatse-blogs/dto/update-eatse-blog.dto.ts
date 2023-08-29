import { PartialType } from '@nestjs/mapped-types';
import { CreateEatseBlogDto } from './create-eatse-blog.dto';

export class UpdateEatseBlogDto extends PartialType(CreateEatseBlogDto) {}
