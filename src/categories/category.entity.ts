import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../services/service.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  // ✅ REQUIRED FOR SERVICE RELATION
  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;
}
