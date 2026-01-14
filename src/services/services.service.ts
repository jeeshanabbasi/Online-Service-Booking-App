import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  // ================= CREATE =================
  async create(userId: number, data: any) {
    const vendor = await this.vendorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const category = await this.categoryRepo.findOne({
      where: { id: data.categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    const service = this.serviceRepo.create({
      title: data.title,
      price: data.price,
      duration: data.duration,
      description: data.description,
      vendor,
      category,
    });

    return this.serviceRepo.save(service);
  }

  // ================= GET ALL =================
  findAll() {
    return this.serviceRepo.find({
      relations: ['category', 'vendor'],
      select: {
        id: true,
        title: true,
        price: true,
        duration: true,
        description: true,
        category: { id: true, name: true },
        vendor: { id: true, name: true },
      },
    });
  }

  // ================= GET ONE =================
  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['category', 'vendor'],
    });

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  // ================= GET BY CATEGORY =================
  findByCategory(categoryId: number) {
    return this.serviceRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'vendor'],
      select: {
        id: true,
        title: true,
        price: true,
        duration: true,
        description: true,
        category: { id: true, name: true },
        vendor: { id: true, name: true },
      },
    });
  }

  // ================= 🔥 VENDOR: MY SERVICES =================
  async findByVendorUserId(userId: number) {
    return this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.vendor', 'vendor')
      .leftJoin('vendor.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  // ================= UPDATE =================
  async update(id: number, userId: number, data: any) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['vendor', 'vendor.user'],
    });

    if (!service) throw new NotFoundException('Service not found');

    if (service.vendor.user.id !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    Object.assign(service, data);
    return this.serviceRepo.save(service);
  }

  // ================= DELETE =================
  async remove(id: number, userId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['vendor', 'vendor.user'],
    });

    if (!service) throw new NotFoundException('Service not found');

    if (service.vendor.user.id !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    return this.serviceRepo.remove(service);
  }
}
