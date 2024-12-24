import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleBrand } from './entities/vehicle-brand.entity';

@Injectable()
export class VehicleBrandsService {
  constructor(
    @InjectRepository(VehicleBrand)
    private vehicleBrandsRepository: Repository<VehicleBrand>
  ) {}

  async create(createVehicleBrandDto: CreateVehicleBrandDto) {
    const { name } = createVehicleBrandDto;
    const vehicleBrand = await this.findByName(name);
    if (vehicleBrand) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
        HttpStatus.CONFLICT
      );
    }
    return this.vehicleBrandsRepository.save(createVehicleBrandDto);
  }

  findAll() {
    return this.vehicleBrandsRepository.find();
  }

  findOne(id: number) {
    return this.vehicleBrandsRepository.findOneBy({ id });
  }

  findByName(name: string) {
    return this.vehicleBrandsRepository.findOneBy({ name });
  }

  update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    return this.vehicleBrandsRepository.update(id, updateVehicleBrandDto);
  }

  remove(id: number) {
    return this.vehicleBrandsRepository.delete(id);
  }
}
