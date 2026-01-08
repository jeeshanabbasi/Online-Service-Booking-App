import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  // 🟢 Create user (register)
async create(data: Partial<User>): Promise<User> {
  const user = this.repo.create(data);
  return this.repo.save(user);
}

  // 🔎 Find user by email (login)
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
    });
  }

  // 📃 Get all users (password hidden)
  async findAll(): Promise<Partial<User>[]> {
    return this.repo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }
}
