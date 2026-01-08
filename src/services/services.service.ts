import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { Category } from '../categories/category.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  // ================= CREATE SERVICE =================
  async create(data: any) {
    const category = await this.categoryRepo.findOne({
      where: { id: data.categoryId },
    });

    const vendor = await this.vendorRepo.findOne({
      where: { id: data.vendorId },
    });

    if (!category || !vendor) {
      throw new NotFoundException('Category or Vendor not found');
    }

    const service = this.serviceRepo.create({
      name: data.name,
      price: data.price,
      duration: data.duration,
      description: data.description,
      category,
      vendor,
    });

    return this.serviceRepo.save(service);
  }

  // ================= GET ALL SERVICES =================
  findAll() {
    return this.serviceRepo.find({
      relations: ['category', 'vendor'],
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        description: true,
        category: {
          id: true,
          name: true,
        },
        vendor: {
          id: true,
          name: true,
        },
      },
    });
  }

  // ================= GET SERVICE BY ID =================
  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      // relations: ['category', 'vendor'],
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        description: true,
        // category: {
        //   id: true,
        //   name: true,
        // },
        // vendor: {
        //   id: true,
        //   name: true,
        // },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  // ================= GET BY CATEGORY =================
  findByCategory(categoryId: number) {
    return this.serviceRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'vendor'],
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        description: true,
        category: {
          id: true,
          name: true,
        },
        vendor: {
          id: true,
          name: true,
        },
      },
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: any) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    Object.assign(service, data);
    return this.serviceRepo.save(service);
  }

  // ================= DELETE =================
  async remove(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.serviceRepo.remove(service);
  }
}
