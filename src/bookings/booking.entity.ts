import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';
import { Vendor } from '../vendors/vendor.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  bookingDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // 🔐 USER who booked
  @ManyToOne(() => User, (user) => user.bookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  // 🛠 SERVICE booked
  @ManyToOne(() => Service, (service) => service.bookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  service: Service;

  // 🏪 VENDOR who will fulfill booking
  @ManyToOne(() => Vendor, (vendor) => vendor.bookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;
}
