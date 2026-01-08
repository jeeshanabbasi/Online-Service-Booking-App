import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ================= LOGIN =================
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔥 IMPORTANT: role included
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role, // ✅ THIS FIXES 403
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ================= REGISTER =================
  async register(body: any) {
    const existingUser = await this.usersService.findByEmail(body.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.create({
      name: body.name,
      email: body.email,
      password: hash,
      role: body.role || 'USER',
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }
}
