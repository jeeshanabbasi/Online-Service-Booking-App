import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  // ================= CREATE VENDOR =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.vendorsService.create(req.user.userId, body);
  }

  // ================= GET ALL VENDORS =================
  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  // ================= ADD SERVICES =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post(':vendorId/services')
  addServices(
    @Req() req,
    @Param('vendorId') vendorId: string,
    @Body('serviceIds') serviceIds: number[],
  ) {
    return this.vendorsService.addServices(
      req.user.userId,
      +vendorId,
      serviceIds,
    );
  }

  // ================= GET VENDORS BY SERVICE =================
  @Get('service/:id')
  findByService(@Param('id') id: string) {
    return this.vendorsService.findByService(+id);
  }
}
