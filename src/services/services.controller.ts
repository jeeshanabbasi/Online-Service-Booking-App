import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  // ================= CREATE SERVICE (VENDOR ONLY) =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.servicesService.create(req.user.userId, body);
  }

  // ================= 🔥 VENDOR: MY SERVICES =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Get('vendor/me')
  findMyServices(@Req() req) {
    return this.servicesService.findByVendorUserId(req.user.userId);
  }

  // ================= GET BY CATEGORY =================
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.servicesService.findByCategory(+id);
  }

  // ================= GET ALL SERVICES =================
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  // ================= GET SERVICE BY ID =================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  // ================= UPDATE SERVICE (VENDOR ONLY) =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() body: any) {
    return this.servicesService.update(+id, req.user.userId, body);
  }

  // ================= DELETE SERVICE (VENDOR ONLY) =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDOR')
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.servicesService.remove(+id, req.user.userId);
  }
}
