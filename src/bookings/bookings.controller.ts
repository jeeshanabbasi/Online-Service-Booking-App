import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BookingStatus } from './booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // ================= USER =================

  // ✅ CREATE BOOKING
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.bookingsService.create(req.user.userId, {
      serviceId: body.serviceId,
      bookingDate: body.bookingDate,
    });
  }

  // ✅ MY BOOKINGS
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyBookings(@Req() req) {
    return this.bookingsService.findByUser(req.user.userId);
  }

  // ================= VENDOR =================

  // ✅ VENDOR BOOKINGS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('vendor/me')
  getVendorBookings(@Req() req) {
    return this.bookingsService.findByVendorUserId(req.user.userId);
  }

  // ✅ UPDATE STATUS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingsService.updateStatus(+id, status);
  }
}
