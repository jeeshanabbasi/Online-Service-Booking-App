import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';
import { Vendor } from '../vendors/vendor.entity';

export enum Role {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // 🔐 Password hidden by default
  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // 🧾 USER → BOOKINGS
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  // 🏪 USER → VENDOR (only if role = VENDOR)
  @OneToOne(() => Vendor, (vendor) => vendor.user)
  vendor: Vendor;
}
