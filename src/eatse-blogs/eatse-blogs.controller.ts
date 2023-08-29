import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EatseBlogsService } from './eatse-blogs.service';
import { CreateEatseBlogDto } from './dto/create-eatse-blog.dto';
import { UpdateEatseBlogDto } from './dto/update-eatse-blog.dto';

@Controller('eatse-blogs')
export class EatseBlogsController {
  constructor(private readonly eatseBlogsService: EatseBlogsService) {}

  @Post()
  create(@Body() createEatseBlogDto: CreateEatseBlogDto) {
    return this.eatseBlogsService.create(createEatseBlogDto);
  }

  @Get()
  findAll() {
    return this.eatseBlogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eatseBlogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEatseBlogDto: UpdateEatseBlogDto) {
    return this.eatseBlogsService.update(+id, updateEatseBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eatseBlogsService.remove(+id);
  }
}
