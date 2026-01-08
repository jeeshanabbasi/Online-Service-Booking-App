import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';
import { Vendor } from '../vendors/vendor.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('reviews')
@Unique(['booking'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number; // 1–5

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  service: Service;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  vendor: Vendor;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  booking: Booking;

  @CreateDateColumn()
  createdAt: Date;
}
