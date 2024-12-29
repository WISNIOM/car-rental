import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(VehicleBrand)
    private vehicleBrandsRepository: Repository<VehicleBrand>
  ) {}

  async create(createVehicleBrandDto: CreateVehicleBrandDto): Promise<VehicleBrandDto> {
    const { name } = createVehicleBrandDto;
    const vehicleBrand = await this.vehicleBrandsRepository.find({
      where: { name },
    });
    if (vehicleBrand.length) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
        HttpStatus.CONFLICT
      );
    }
    return this.vehicleBrandsRepository.save(createVehicleBrandDto);
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
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  private async findByField(
    field: VehicleBrandField,
    value: VehicleBrandFieldValue
  ) {
    const vehicle = await this.vehicleBrandsRepository.findOneBy({
      [field]: value,
    });
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
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
    const vehicleBrand = await this.vehicleBrandsRepository.find({
      where: { name },
    });
    if (vehicleBrand.length) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
        HttpStatus.CONFLICT
      );
    }
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    await this.vehicleBrandsRepository.save({ id, name });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
        HttpStatus.NOT_FOUND
      );
    }
    await this.vehicleBrandsRepository.delete(id);
  }
}
