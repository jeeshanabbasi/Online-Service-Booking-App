import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './service.entity';
import { Category } from '../categories/category.entity';
import { Vendor } from 'src/vendors/vendor.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Service, Category , Vendor])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
