import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { Category } from '../categories/category.entity';
import { Booking } from '../bookings/booking.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  description: string;

  // ✅ MANY services → ONE vendor
  @ManyToOne(() => Vendor, (vendor) => vendor.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' }) // 🔥 VERY IMPORTANT
  vendor: Vendor;

  // ✅ MANY services → ONE category
  @ManyToOne(() => Category, (category) => category.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' }) // 🔥 VERY IMPORTANT
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];
}
