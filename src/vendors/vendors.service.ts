import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vendor } from './vendor.entity';
import { Service } from '../services/service.entity';
import { User } from '../users/user.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ================= CREATE VENDOR =================
  async create(userId: number, data: any) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 🔥 PREVENT DUPLICATE VENDOR
    const existingVendor = await this.vendorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (existingVendor) {
      throw new ConflictException('Vendor already exists for this user');
    }

    // 🔥 PREVENT EMAIL DUPLICATE
    if (data.email) {
      const emailExists = await this.vendorRepo.findOne({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ConflictException('Vendor email already exists');
      }
    }

    const vendor = this.vendorRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      description: data.description,
      user,
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

  // ================= ADD SERVICES (OWNER ONLY) =================
  async addServices(userId: number, vendorId: number, serviceIds: number[]) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: vendorId },
      relations: ['services', 'user'],
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    // 🔐 OWNER CHECK
    if (vendor.user.id !== userId) {
      throw new ForbiddenException('You cannot modify this vendor');
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

  // ================= GET VENDORS BY SERVICE =================
  async findByService(serviceId: number) {
    return this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.services', 'service')
      .where('service.id = :serviceId', { serviceId })
      .getMany();
  }
}
