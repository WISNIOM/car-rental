import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleBrandsModule } from '../vehicle-brands/vehicle-brands.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), VehicleBrandsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
