import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './vendor.entity';
import { User } from '../users/user.entity';
import { Service } from '../services/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, User, Service])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
