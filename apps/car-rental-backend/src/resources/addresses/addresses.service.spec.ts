import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

const mockAddressRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AddressesService', () => {
  let service: AddressesService;
  let addressRepository: MockRepository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useFactory: mockAddressRepository,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    addressRepository = module.get<MockRepository<Address>>(
      getRepositoryToken(Address)
    );
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'ul. Marszałkowska 1',
        city: 'Warszawa',
        administrativeArea: 'Mazowieckie',
        postalCode: '00-001',
        country: 'Poland',
      };

      const savedAddress = { id: 1, ...createAddressDto };
      addressRepository.findOne.mockResolvedValue(null);
      addressRepository.save.mockResolvedValue(savedAddress);

      const result = await service.create(createAddressDto);
      expect(result).toEqual(savedAddress);
      expect(addressRepository.findOne).toHaveBeenCalledWith({
        where: {
          street: createAddressDto.street,
          city: createAddressDto.city,
          administrativeArea: createAddressDto.administrativeArea,
          postalCode: createAddressDto.postalCode,
          country: createAddressDto.country,
        },
      });
      expect(addressRepository.save).toHaveBeenCalledWith(createAddressDto);
    });

    it('should throw an error if address already exists', async () => {
      const createAddressDto: CreateAddressDto = {
        street: 'ul. Marszałkowska 1',
        city: 'Warszawa',
        administrativeArea: 'Mazowieckie',
        postalCode: '00-001',
        country: 'Poland',
      };

      addressRepository.findOne.mockResolvedValue(createAddressDto);

      await expect(service.create(createAddressDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Address already exists',
          },
          HttpStatus.CONFLICT
        )
      );
    });
  });

  describe('findOne', () => {
    it('should return an address if found', async () => {
      const address = {
        id: 1,
        street: 'ul. Marszałkowska 1',
        city: 'Warszawa',
        administrativeArea: 'Mazowieckie',
        postalCode: '00-001',
        country: 'Poland',
      };
      addressRepository.findOne.mockResolvedValue(address);

      const result = await service.findOne(1);
      expect(result).toEqual(address);
      expect(addressRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if address is not found', async () => {
      addressRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Address with id 1 not found`,
          },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });

  describe('update', () => {
    it('should update an address if found', async () => {
      const updateAddressDto: UpdateAddressDto = {
        street: 'ul. Marszałkowska 2',
        city: 'Warszawa',
        administrativeArea: 'Mazowieckie',
        postalCode: '00-002',
        country: 'Poland',
      };

      const address = { id: 1, ...updateAddressDto };
      addressRepository.findOne.mockResolvedValue(address);
      addressRepository.update.mockResolvedValue(address);

      const result = await service.update(1, updateAddressDto);
      expect(result).toEqual(address);
      expect(addressRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(addressRepository.update).toHaveBeenCalledWith(
        1,
        updateAddressDto
      );
    });

    it('should throw a NotFoundException if address is not found', async () => {
      addressRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(1, {} as UpdateAddressDto)
      ).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Address with id 1 not found`,
          },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });

  describe('remove', () => {
    it('should remove an address if found', async () => {
      const address = {
        id: 1,
        street: 'ul. Marszałkowska 1',
        city: 'Warszawa',
        administrativeArea: 'Mazowieckie',
        postalCode: '00-001',
        country: 'Poland',
      };
      addressRepository.findOne.mockResolvedValue(address);
      addressRepository.delete.mockResolvedValue(address);

      await service.remove(1);
      expect(addressRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(addressRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if address is not found', async () => {
      const id = 1;
      jest.spyOn(addressRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Address with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });
});
