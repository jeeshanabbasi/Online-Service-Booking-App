import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';
import {  OneToOne, JoinColumn } from 'typeorm';
import { Booking } from '../bookings/booking.entity';
import { User } from '../users/user.entity';
@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ Vendor ka naam
  @Column()
  name: string;

  // ✅ Vendor email
  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  // ✅ ONE vendor → MANY services
  @OneToMany(() => Service, service => service.vendor)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, { eager: true })
@JoinColumn()
user: User;

@OneToMany(() => Booking, (booking) => booking.vendor)
bookings: Booking[];
}
