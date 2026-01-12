import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔐 LOGIN
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // 🔒 Safety check (prevents 500)
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return this.authService.login(email, password);
  }

  // 📝 REGISTER
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // 👤 PROFILE (PROTECTED)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
