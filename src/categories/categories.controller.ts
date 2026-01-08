import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // ✅ CREATE CATEGORY
  @Post()
  create(@Body() body: any) {
    return this.categoriesService.create(body);
  }

  // ✅ GET ALL CATEGORIES
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // ✅ UPDATE CATEGORY
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(Number(id), body);
  }

  // ✅ DELETE CATEGORY
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(Number(id));
  }
}
