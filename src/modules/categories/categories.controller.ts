import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';
import { CategoriesDto } from '@/modules/categories/dto/categories.dto';
import { Public } from '@/decorators/customize';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() categoriesDto: CategoriesDto) {
    return this.categoriesService.create(categoriesDto);
  }

  @Get('all')
  @Public()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() categories: CategoriesDto) {
    return this.categoriesService.update(id, categories);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
