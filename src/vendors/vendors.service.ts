import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
  ) {}

  // ✅ CREATE VENDOR
  async create(data: any) {
    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const vendor = this.vendorRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      user,
    });

    return this.vendorRepo.save(vendor);
  }

  // ✅ GET ALL VENDORS
  findAll() {
    return this.vendorRepo.find();
  }

  // ✅ ADD SERVICES TO VENDOR 🔥 (IMPORTANT)
  async addServices(vendorId: number, serviceIds: number[]) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: vendorId },
      relations: ['services'],
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const services = await this.serviceRepo.findByIds(serviceIds);

    vendor.services = services;

    return this.vendorRepo.save(vendor);
  }

  // ✅ GET VENDORS BY SERVICE ID 🔥
  async findByService(serviceId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException('Service not found');

    return this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.services', 'service')
      .where('service.id = :id', { id: serviceId })
      .getMany();
  }
}
