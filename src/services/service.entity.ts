import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { Category } from '../categories/category.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ Service ka naam
  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  description: string;

  // ✅ MANY services → ONE vendor
  @ManyToOne(() => Vendor, vendor => vendor.services, {
    onDelete: 'CASCADE',
  })
  vendor: Vendor;

  // ✅ MANY services → ONE category
  @ManyToOne(() => Category, category => category.services, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
