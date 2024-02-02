/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  title: string;
  description: string;
  tags: Array<string>;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  author: string;
}
