import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleBrand } from './entities/vehicle-brand.entity';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { PageMetaDto } from '../common/pages/dto/page-meta.dto';
import { PageDto } from '../common/pages/dto/page.dto';

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

  async findVehicleBrands(pageOptionsDto: PageOptionsDto) {
    const { order, take, skip } = pageOptionsDto;
    const queryBuilder =
      this.vehicleBrandsRepository.createQueryBuilder('vehicleBrand');
    queryBuilder.orderBy('vehicleBrand.name', order).skip(skip).take(take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleBrandsRepository.findOneBy({ id });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    return vehicle;
  }

  async findByName(name: string) {
    const vehicle = await this.vehicleBrandsRepository.findOneBy({ name });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    return vehicle;
  }

  async update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    const vehicle = await this.vehicleBrandsRepository.findOneBy({ id });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    return this.vehicleBrandsRepository.update(id, updateVehicleBrandDto);
  }

  async remove(id: number) {
    const vehicle = await this.vehicleBrandsRepository.findOneBy({ id });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    return this.vehicleBrandsRepository.delete(id);
  }
}
