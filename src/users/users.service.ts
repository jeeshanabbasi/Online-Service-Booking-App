import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // 🟢 Create user (register)
  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  // 🔎 Find user by email (LOGIN – password required)
  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password') // 🔥 VERY IMPORTANT
      .where('user.email = :email', { email })
      .getOne();
  }

  // 📃 Get all users (password hidden)
  async findAll(): Promise<Partial<User>[]> {
    return this.repo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }
}
