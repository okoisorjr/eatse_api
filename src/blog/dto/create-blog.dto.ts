/* eslint-disable prettier/prettier */
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  title: string;
  description: string;
  tags: Array<string>;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  author: string;

  /* @IsNotEmpty()
  @IsMongoId()
  last_modified_by: string; */
}
