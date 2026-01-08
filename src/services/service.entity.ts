import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Vendor } from '../vendors/vendor.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Category, category => category.services, {
    onDelete: 'CASCADE',
  })
  category: Category;

  // ✅ ONLY THIS RELATION
  @ManyToOne(() => Vendor, vendor => vendor.services)
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;
}
