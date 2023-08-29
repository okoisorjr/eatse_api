import { Injectable } from '@nestjs/common';
import { CreateEatseBlogDto } from './dto/create-eatse-blog.dto';
import { UpdateEatseBlogDto } from './dto/update-eatse-blog.dto';

@Injectable()
export class EatseBlogsService {
  create(createEatseBlogDto: CreateEatseBlogDto) {
    return 'This action adds a new eatseBlog';
  }

  findAll() {
    return `This action returns all eatseBlogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eatseBlog`;
  }

  update(id: number, updateEatseBlogDto: UpdateEatseBlogDto) {
    return `This action updates a #${id} eatseBlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} eatseBlog`;
  }
}
