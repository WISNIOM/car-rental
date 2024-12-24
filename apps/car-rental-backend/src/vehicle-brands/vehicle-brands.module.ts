import { Module } from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { VehicleBrandsController } from './vehicle-brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleBrand } from './entities/vehicle-brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleBrand])],
  controllers: [VehicleBrandsController],
  providers: [VehicleBrandsService],
})
export class VehicleBrandsModule {}
