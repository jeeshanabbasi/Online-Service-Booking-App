import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // ✅ USER: Create review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.reviewsService.create({
      rating: body.rating,
      comment: body.comment,
      bookingId: body.bookingId,
      userId: req.user.userId, // 🔥 token se
    });
  }

  // ✅ USER: My Reviews  🔥🔥 (THIS FIXES /reviews/me)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyReviews(@Req() req) {
    return this.reviewsService.findByUser(req.user.userId);
  }

  // ⭐ Public: reviews by service
  @Get('service/:id')
  findByService(@Param('id') id: string) {
    return this.reviewsService.findByService(+id);
  }

  // ⭐ Public: reviews by vendor
  @Get('vendor/:id')
  findByVendor(@Param('id') id: string) {
    return this.reviewsService.findByVendor(+id);
  }
}
