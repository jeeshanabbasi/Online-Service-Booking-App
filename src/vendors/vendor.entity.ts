import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  // ✅ ONE vendor → MANY services
  @OneToMany(() => Service, (service) => service.vendor)
  services: Service[];

  

  @CreateDateColumn()
  createdAt: Date;
}
