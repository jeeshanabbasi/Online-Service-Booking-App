import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Service, Vendor])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
