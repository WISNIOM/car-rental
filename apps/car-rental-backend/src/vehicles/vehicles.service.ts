import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleBrandsService } from '../vehicle-brands/vehicle-brands.service';
import { VehicleDto } from './dto/vehicle.dto';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { PageDto } from '../common/pages/dto/page.dto';
import { PageMetaDto } from '../common/pages/dto/page-meta.dto';
import { VehicleBrand } from '../vehicle-brands/entities/vehicle-brand.entity';

type VehicleField = keyof VehicleDto;
type VehicleFieldValue = VehicleDto[VehicleField];
@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private vehicleBrandsService: VehicleBrandsService
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDto> {
    const brand = await this.vehicleBrandsService.findByName(
      createVehicleDto.brand
    );
    const vehicle = await this.vehiclesRepository.find({
      where: [
        { registrationNumber: createVehicleDto.registrationNumber },
        {
          vehicleIdentificationNumber:
            createVehicleDto.vehicleIdentificationNumber,
        },
      ],
    });
    if (vehicle.length) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error:
            'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists',
        },
        HttpStatus.CONFLICT
      );
    }
    const result = await this.vehiclesRepository.save({
      ...createVehicleDto,
      brand: brand,
    });
    return {
      ...result,
      brand: brand.name,
      clientAddress: '',
      clientEmail: '',
    };
  }

  private async findByField(field: VehicleField, value: VehicleFieldValue) {
    const vehicle = await this.vehiclesRepository.findOneBy({
      [field]: value,
    });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }
    return vehicle;
  }

  async findVehicles(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<VehicleDto>> {
    const { order, take, skip, sortField } = pageOptionsDto;
    const queryBuilder = this.vehiclesRepository.createQueryBuilder('vehicle');
    const vehicleSortField =
      sortField && sortField in VehicleDto
        ? `vehicle.${sortField}`
        : 'vehicle.id';
    queryBuilder.orderBy(vehicleSortField, order).skip(skip).take(take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const mappedEntities: Array<VehicleDto> = entities.map((entity) => {
      const { brand, ...rest } = entity;
      return { ...rest, brand: brand.name };
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(mappedEntities, pageMetaDto);
  }

  async findOne(id: number): Promise<VehicleDto> {
    const result = await this.findByField('id', id);
    return {
      ...result,
      brand: result.brand.name,
    };
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto
  ): Promise<VehicleDto> {
    const { registrationNumber, vehicleIdentificationNumber, brand } =
      updateVehicleDto;
    let vehicleBrand: VehicleBrand;
    if (brand) {
      vehicleBrand = await this.vehicleBrandsService.findByName(brand);
    }
    const vehicleToBeUpdated = await this.findOne(id);
    if (!vehicleToBeUpdated) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }

    const vehicle = await this.vehiclesRepository.find({
      where: [{ registrationNumber }, { vehicleIdentificationNumber }],
    });
    if (vehicle.length) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error:
            'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists',
        },
        HttpStatus.CONFLICT
      );
    }
    await this.vehiclesRepository.save({
      id,
      ...updateVehicleDto,
      brand: vehicleBrand,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }
    await this.vehiclesRepository.delete(id);
  }
}
