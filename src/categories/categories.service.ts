import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  // ✅ CREATE
  create(data: any) {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  // ✅ READ ALL
  findAll() {
    return this.repo.find();
  }

  // ✅ UPDATE
  async update(id: number, data: any) {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, data);
    return this.repo.save(category);
  }

  // ✅ DELETE
  async remove(id: number) {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.repo.remove(category);
  }
}
