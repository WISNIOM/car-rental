import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>
  ) {}

  create(createVehicleDto: CreateVehicleDto) {
    return this.vehiclesRepository.save(createVehicleDto);
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
