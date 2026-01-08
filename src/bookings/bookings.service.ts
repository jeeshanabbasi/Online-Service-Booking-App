import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  // ================= CREATE =================
  async create(userId: number, data: any) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    const service = await this.serviceRepo.findOne({
      where: { id: data.serviceId },
    });

    const vendor = await this.vendorRepo.findOne({
      where: { id: data.vendorId },
      relations: ['services'],
    });

    if (!user || !service || !vendor) {
      throw new NotFoundException('User / Service / Vendor not found');
    }

    // ✅ Check vendor provides this service
    const vendorHasService = vendor.services.some(
      (s) => s.id === service.id,
    );

    if (!vendorHasService) {
      throw new NotFoundException(
        'This vendor does not provide selected service',
      );
    }

    const booking = this.bookingRepo.create({
      bookingDate: new Date(data.bookingDate),
      user,
      service,
      vendor,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  // ================= USER BOOKINGS =================
  findByUser(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['service', 'vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  // ================= VENDOR BOOKINGS =================
  async findByVendorUserId(userId: number) {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.vendor', 'vendor')
      .leftJoin('vendor.user', 'vendorUser')
      .where('vendorUser.id = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  // ================= UPDATE STATUS =================
  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}
