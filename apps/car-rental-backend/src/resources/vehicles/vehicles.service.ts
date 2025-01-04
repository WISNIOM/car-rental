import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleBrandsService } from '../vehicle-brands/vehicle-brands.service';
import { VehicleDto } from './dto/vehicle.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { PageMetaDto } from '../../common/pages/dto/page-meta.dto';
import { VehicleBrand } from '../vehicle-brands/entities/vehicle-brand.entity';
import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../addresses/entities/address.entity';
import { UpdateAddressDto } from '../addresses/dto/update-address.dto';
import { CreateAddressDto } from '../addresses/dto/create-address.dto';

type VehicleField = keyof VehicleDto;
type VehicleFieldValue = VehicleDto[VehicleField];
@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly vehicleBrandsService: VehicleBrandsService,
    private readonly addressesService: AddressesService
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDto> {
    const brand = await this.vehicleBrandsService.findByName(
      createVehicleDto.brand
    );
    this.logger.log(
      'Checking if vehicle with such registrationNumber/vehicleIdentificationNumber already exists'
    );
    const vehicles = await this.vehiclesRepository.find({
      where: [
        { registrationNumber: createVehicleDto.registrationNumber },
        {
          vehicleIdentificationNumber:
            createVehicleDto.vehicleIdentificationNumber,
        },
      ],
    });
    if (vehicles.length) {
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
    this.logger.log(
      'Vehicle with such registrationNumber/vehicleIdentificationNumber does not exist'
    );
    this.logger.log('Creating vehicle');
    const result = await this.vehiclesRepository.save({
      ...createVehicleDto,
      brand: brand,
      clientAddress: null,
      clientEmail: '',
    });

    this.logger.log(`Vehicle with id ${result.id} created`);

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
    queryBuilder.leftJoinAndSelect('vehicle.clientAddress', 'clientAddress');
    let vehicleSortField = 'vehicle.id';
    const allowedSortFields: Array<VehicleField> = [
      'clientAddress',
      'clientEmail',
      'registrationNumber',
      'vehicleIdentificationNumber',
      'id',
      'createdAt',
      'updatedAt',
    ];
    if (sortField) {
      if (sortField === 'brandName') {
        vehicleSortField = 'brand.name';
      } else if (allowedSortFields.includes(sortField as VehicleField)) {
        vehicleSortField = `vehicle.${sortField}`;
      }
    }
    queryBuilder.orderBy(vehicleSortField, order).skip(skip).take(take);
    this.logger.log(
      `Finding vehicles with page options ${JSON.stringify(pageOptionsDto)}`
    );
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    this.logger.log(`Found ${entities.length} vehicles`);
    const mappedEntities: Array<VehicleDto> = entities.map((entity) => {
      const { brand, ...rest } = entity;
      return { ...rest, brand: brand.name };
    });
    const pageMetaDto = new PageMetaDto({
      itemCount,
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
    const [vehicle] = await this.vehiclesRepository.find({
      where: [{ registrationNumber }, { vehicleIdentificationNumber }],
    });
    if (vehicle && vehicle.id !== id) {
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
    let clientAddress: Address;
    if (updateVehicleDto.clientAddress) {
      this.logger.log('Checking if client address exists');
      const { id, ...addressData } =
        updateVehicleDto.clientAddress as UpdateAddressDto;
      if (id) {
        clientAddress = await this.addressesService.findOne(id);
      }
      if (clientAddress) {
        this.logger.log(
          `Client address exists. Updating client address with id ${id}`
        );
        await this.addressesService.update(id, addressData);
        this.logger.log(`Client address with id ${id} updated`);
      } else {
        this.logger.log(
          'Client address does not exist. Creating client address'
        );
        clientAddress = await this.addressesService.create(
          addressData as CreateAddressDto
        );
        this.logger.log(`Client address created with id ${clientAddress.id}`);
      }
    } else if (vehicle.clientAddress) {
      this.logger.log(
        'Client address is not provided. Removing client address'
      );
      await this.addressesService.remove(vehicle.clientAddress.id);
      this.logger.log(
        `Client address with id ${vehicle.clientAddress.id} removed`
      );
    }

    this.logger.log(`Updating vehicle with id ${id}`);
    await this.vehiclesRepository.save({
      id,
      ...updateVehicleDto,
      brand: vehicleBrand,
      clientAddress,
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
