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

  // ================= REGISTER =================
  async register(body: any) {
    const email = body.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.create({
      name: body.name,
      email,
      password: hashedPassword,
      role: body.role || 'USER',
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  // ================= LOGIN =================
  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id, // 🔥 jwt standard
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
