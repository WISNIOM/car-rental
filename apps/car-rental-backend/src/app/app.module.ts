import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VehicleBrand } from '../vehicle-brands/entities/vehicle-brand.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'car_rental',
      entities: [Vehicle, VehicleBrand],
      synchronize: true,
    }),
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
