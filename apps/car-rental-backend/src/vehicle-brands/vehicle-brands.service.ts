import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleBrand } from './entities/vehicle-brand.entity';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { PageMetaDto } from '../common/pages/dto/page-meta.dto';
import { PageDto } from '../common/pages/dto/page.dto';
import { VehicleBrandDto } from './dto/vehicle-brand.dto';

type VehicleBrandField = keyof VehicleBrandDto;
type VehicleBrandFieldValue = VehicleBrandDto[VehicleBrandField];
@Injectable()
export class VehicleBrandsService {
  private readonly logger = new Logger(VehicleBrandsService.name);
  constructor(
    @InjectRepository(VehicleBrand)
    private readonly vehicleBrandsRepository: Repository<VehicleBrand>
  ) {}

  async create(createVehicleBrandDto: CreateVehicleBrandDto): Promise<VehicleBrandDto> {
    const { name } = createVehicleBrandDto;
    this.logger.log(`Checking if vehicle brand with name: ${name} exists`);
    const vehicleBrand = await this.vehicleBrandsRepository.find({
      where: { name },
    });
    if (vehicleBrand.length) {
      this.logger.error('Vehicle brand already exists');
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
        HttpStatus.CONFLICT
      );
    }
    this.logger.log(`Creating vehicle brand with name: ${name}`);
    const result = await this.vehicleBrandsRepository.save(createVehicleBrandDto);
    this.logger.log(`Vehicle brand with name: ${name} created`);
    return result;
  }

  async findVehicleBrands(pageOptionsDto: PageOptionsDto): Promise<PageDto<VehicleBrandDto>> {
    const { order, take, skip, sortField } = pageOptionsDto;
    const queryBuilder =
      this.vehicleBrandsRepository.createQueryBuilder('vehicleBrand');
    const vehicleBrandSortField =
      sortField && sortField in VehicleBrandDto
        ? `vehicleBrand.${sortField}`
        : 'vehicleBrand.id';
    queryBuilder.orderBy(vehicleBrandSortField, order).skip(skip).take(take);
    this.logger.log(`Finding vehicle brands with page options: ${JSON.stringify(pageOptionsDto)}`);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    this.logger.log(`Found ${entities.length} vehicle brands`);
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  private async findByField(
    field: VehicleBrandField,
    value: VehicleBrandFieldValue
  ) {
    this.logger.log(`Finding vehicle brand by ${field} with value ${value}`);
    const vehicle = await this.vehicleBrandsRepository.findOneBy({
      [field]: value,
    });
    if (!vehicle) {
      this.logger.error('Vehicle brand not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(`Vehicle brand found by ${field} with value ${value}`);
    return vehicle;
  }

  async findOne(id: number): Promise<VehicleBrandDto> {
    return this.findByField('id', id);
  }

  async findByName(name: string): Promise<VehicleBrandDto> {
    return this.findByField('name', name);
  }

  async update(id: number, updateVehicleBrandDto: UpdateVehicleBrandDto): Promise<VehicleBrandDto> {
    const { name } = updateVehicleBrandDto;
    this.logger.log(`Checking if vehicle brand with name: ${name} exists`);
    const vehicleBrand = await this.vehicleBrandsRepository.find({
      where: { name },
    });
    if (vehicleBrand.length) {
      this.logger.error('Vehicle brand already exists');
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
        HttpStatus.CONFLICT
      );
    }
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      this.logger.error('Vehicle brand not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(`Updating vehicle brand with id: ${id}`);
    await this.vehicleBrandsRepository.save({ id, name });
    this.logger.log(`Vehicle brand with id: ${id} updated`);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      this.logger.error('Vehicle brand not found');
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    this.logger.log(`Removing vehicle brand with id: ${id}`);
    await this.vehicleBrandsRepository.delete(id);
    this.logger.log(`Vehicle brand with id: ${id} removed`);
  }
}
