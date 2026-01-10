import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';
import { Booking } from '../bookings/booking.entity';
import { User } from '../users/user.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Service, (service) => service.vendor)
  services: Service[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Booking, (booking) => booking.vendor)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;
}
