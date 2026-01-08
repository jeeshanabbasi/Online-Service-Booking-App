import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Booking, BookingStatus } from '../bookings/booking.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  // ✅ Create Review
  async create(data: {
    rating: number;
    comment?: string;
    bookingId: number;
    userId: number;
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const booking = await this.bookingRepo.findOne({
      where: { id: data.bookingId },
      relations: ['user', 'service', 'vendor'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Review allowed only after booking completion',
      );
    }

    if (booking.user.id !== data.userId) {
      throw new BadRequestException('Not allowed to review this booking');
    }

    const review = this.reviewRepo.create({
      rating: data.rating,
      comment: data.comment,
      booking,
      user: booking.user,
      service: booking.service,
      vendor: booking.vendor,
    });

    return this.reviewRepo.save(review);
  }

  // ✅ USER: My Reviews
  findByUser(userId: number) {
    return this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: ['service', 'vendor'],
      order: { id: 'DESC' },
    });
  }

  // ⭐ Reviews by service
  findByService(serviceId: number) {
    return this.reviewRepo.find({
      where: { service: { id: serviceId } },
      relations: ['user'],
    });
  }

  // ⭐ Reviews by vendor
  findByVendor(vendorId: number) {
    return this.reviewRepo.find({
      where: { vendor: { id: vendorId } },
      relations: ['user', 'service'],
    });
  }
}
