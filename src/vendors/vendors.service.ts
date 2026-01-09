import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vendor } from './vendor.entity';
import { Service } from '../services/service.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
  ) {}

  // ================= CREATE =================
  async create(data: any) {
    const vendor = this.vendorRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description,
    });

    return this.vendorRepo.save(vendor);
  }

  // ================= GET ALL =================
  findAll() {
    return this.vendorRepo.find({
      relations: ['services'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        services: {
          id: true,
          title: true,
          price: true,
        },
      },
    });
  }

  // ================= ADD SERVICES TO VENDOR =================
  async addServices(vendorId: number, serviceIds: number[]) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: vendorId },
      relations: ['services'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const services = await this.serviceRepo.find({
      where: { id: In(serviceIds) },
    });

    if (!services.length) {
      throw new NotFoundException('Services not found');
    }

    vendor.services = services;
    return this.vendorRepo.save(vendor);
  }

  // ================= FIND VENDORS BY SERVICE =================
  async findByService(serviceId: number) {
    return this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.services', 'service')
      .where('service.id = :serviceId', { serviceId })
      .getMany();
  }
}
