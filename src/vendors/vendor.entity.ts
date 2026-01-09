import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Service } from '../services/service.entity';

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
}
