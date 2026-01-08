import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 🔐 Profile (current logged-in user)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // 🔐 All users list (admin later)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }
}
