import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 🔐 LOGIN
@Post('login')
login(@Body() body: { email: string; password: string }) {
  return this.authService.login(body.email, body.password);
}

  // 📝 REGISTER
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  // 👤 PROFILE (PROTECTED)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return req.user;
  }
}
