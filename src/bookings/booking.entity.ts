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
  COMPLETED = 'COMPLETED', // ✅ THIS LINE FIXES ERROR
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Service)
  service: Service;

  @ManyToOne(() => Vendor)
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;
}
