import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleBrandsService } from '../vehicle-brands/vehicle-brands.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private vehicleBrandsService: VehicleBrandsService
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const brand = await this.vehicleBrandsService.findByName(
      createVehicleDto.brand
    );
    const saveVehicleOpts = { ...createVehicleDto, brand: brand };
    return this.vehiclesRepository.save(saveVehicleOpts);
  }

  findAll() {
    return this.vehiclesRepository.find();
  }

  findOne(id: number) {
    return this.vehiclesRepository.findOneBy({ id });
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesRepository.update(id, updateVehicleDto);
  }

  remove(id: number) {
    return this.vehiclesRepository.delete(id);
  }
}
