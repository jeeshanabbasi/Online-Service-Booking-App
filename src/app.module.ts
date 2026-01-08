import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { VendorsModule } from './vendors/vendors.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // 🌱 env variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🗄️ database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '7890',
      database: 'service_booking',
      autoLoadEntities: true, // 🔥 main fix
      synchronize: true,      // ❗ dev only
    }),

    // 📦 feature modules
    AuthModule,
    UsersModule,
    CategoriesModule,
    ServicesModule,
    VendorsModule,
    BookingsModule,
    ReviewsModule, // ✅ ONLY this
  ],
  
})
export class AppModule {}
