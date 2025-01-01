import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(VehiclesService.name);
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly vehicleBrandsService: VehicleBrandsService
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
      this.logger.error(
        'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists'
      );
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
      clientAddress: '',
      clientEmail: '',
    });
    return {
      ...result,
      brand: brand.name,
    };
  }

  private async findByField(field: VehicleField, value: VehicleFieldValue) {
    this.logger.log(`Finding vehicle by ${field} with value ${value}`);
    const vehicle = await this.vehiclesRepository.findOne({
      where: { [field]: value },
      relations: ['brand'],
      select: [
        'id',
        'registrationNumber',
        'vehicleIdentificationNumber',
        'brand',
        'clientEmail',
        'clientAddress',
      ],
    });
    if (!vehicle) {
      this.logger.error('Vehicle not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(`Vehicle found by ${field} with value ${value}`);
    return vehicle;
  }

  async findVehicles(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<VehicleDto>> {
    const { order, take, skip, sortField } = pageOptionsDto;
    const queryBuilder = this.vehiclesRepository.createQueryBuilder('vehicle');
    queryBuilder.leftJoinAndSelect('vehicle.brand', 'brand');
    const vehicleSortField =
      sortField && sortField in VehicleDto
        ? `vehicle.${sortField}`
        : 'vehicle.id';
    queryBuilder.orderBy(vehicleSortField, order).skip(skip).take(take);
    this.logger.log(
      `Finding vehicles with page options ${JSON.stringify(pageOptionsDto)}`
    );
    const { entities } = await queryBuilder.getRawAndEntities();
    this.logger.log(`Found ${entities.length} vehicles`);
    const mappedEntities: Array<VehicleDto> = entities.map((entity) => {
      const { brand, ...rest } = entity;
      return { ...rest, brand: brand.name };
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: entities.length,
      pageOptionsDto,
    });
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
      this.logger.error('Vehicle not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(
      `Checking if vehicle with such registrationNumber/vehicleIdentificationNumber already exists`
    );
    const vehicle = await this.vehiclesRepository.find({
      where: [{ registrationNumber }, { vehicleIdentificationNumber }],
    });
    if (vehicle.length) {
      this.logger.error(
        'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists'
      );
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error:
            'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists',
        },
        HttpStatus.CONFLICT
      );
    }
    this.logger.log(`Updating vehicle with ${id}`);
    await this.vehiclesRepository.save({
      id,
      ...updateVehicleDto,
      brand: vehicleBrand,
    });
    this.logger.log(`Vehicle with id ${id} updated`);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      this.logger.error('Vehicle not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(`Removing vehicle with ${id}`);
    await this.vehiclesRepository.delete(id);
    this.logger.log(`Vehicle with id ${id} removed`);
  }
}
