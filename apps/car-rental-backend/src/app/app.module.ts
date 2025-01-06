import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from '../resources/vehicles/vehicles.module';
import { Vehicle } from '../resources/vehicles/entities/vehicle.entity';
import { VehicleBrand } from '../resources/vehicle-brands/entities/vehicle-brand.entity';
import { Address } from '../resources/addresses/entities/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // Use it when you run the app in Docker
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        // Use it when you run the app locally
        // host: 'localhost',
        // port: 3306,
        // username: 'root',
        // password: 'root',
        // database: 'car_rental',
        entities: [Vehicle, VehicleBrand, Address],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
