import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>
  ) {}
  async create(createAddressDto: CreateAddressDto): Promise<AddressDto> {
    this.logger.log('Checking if address already exists');
    const address = await this.addressesRepository.findOne({
      where: {
        street: createAddressDto.street,
        city: createAddressDto.city,
        administrativeArea: createAddressDto.administrativeArea,
        postalCode: createAddressDto.postalCode,
        country: createAddressDto.country,
      },
    });
    if (address) {
      this.logger.error('Address already exists');
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Address already exists',
        },
        HttpStatus.CONFLICT
      );
    }
    this.logger.log('Address does not exist');
    this.logger.log('Creating address');
    const savedAddress = await this.addressesRepository.save(createAddressDto);
    this.logger.log(`Address created with id ${savedAddress.id} created`);
    return savedAddress;
  }
  async findOne(id: number) {
    const result = await this.addressesRepository.findOne({ where: { id } });
    return result;
  }
  async update(id: number, updateAddressDto: UpdateAddressDto) {
    return this.addressesRepository.update(id, updateAddressDto);
  }
  async remove(id: number) {
    return this.addressesRepository.delete(id);
  }
}
