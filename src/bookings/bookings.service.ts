import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}

  // ================= CREATE BOOKING =================
 async create(userId: number, data: any) {
  // 1️⃣ User check
  const user = await this.userRepo.findOne({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // 2️⃣ Service check (WITH vendor)
  const service = await this.serviceRepo.findOne({
    where: { id: data.serviceId },
    relations: ['vendor'],
  });
  if (!service) {
    throw new NotFoundException('Service not found');
  }

  // 3️⃣ Vendor auto resolve from service
  const vendor = service.vendor;
  if (!vendor) {
    throw new NotFoundException('Vendor not found for this service');
  }

  // 4️⃣ Create booking
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
  async findByUser(userId: number) {
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
  async updateStatus(
    bookingId: number,
    status: BookingStatus,
    vendorUserId: number,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['vendor', 'vendor.user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 🔐 ONLY vendor owner can update
    if (booking.vendor.user.id !== vendorUserId) {
      throw new ForbiddenException(
        'You are not allowed to update this booking',
      );
    }

    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}
