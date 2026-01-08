import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  // ✅ CREATE SERVICE
  @Post()
  create(@Body() body: any) {
    return this.servicesService.create(body);
  }

  // ✅ GET ALL SERVICES
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  // ✅ 🔥 GET SERVICE BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(Number(id));
  }

  // ✅ GET SERVICES BY CATEGORY
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.servicesService.findByCategory(Number(id));
  }

  // ✅ UPDATE SERVICE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.servicesService.update(Number(id), body);
  }

  // ✅ DELETE SERVICE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(Number(id));
  }
}
