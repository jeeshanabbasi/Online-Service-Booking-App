import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  // ✅ CREATE VENDOR
  @Post()
  create(@Body() body: any) {
    return this.vendorsService.create(body);
  }

  // ✅ GET ALL VENDORS
  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  // ✅ LINK SERVICES TO VENDOR 🔥
  @Post(':vendorId/services')
  addServices(
    @Param('vendorId') vendorId: string,
    @Body('serviceIds') serviceIds: number[],
  ) {
    return this.vendorsService.addServices(+vendorId, serviceIds);
  }

  // ✅ GET VENDORS BY SERVICE ID 🔥
  @Get('service/:id')
  findByService(@Param('id') id: string) {
    return this.vendorsService.findByService(+id);
  }
}
