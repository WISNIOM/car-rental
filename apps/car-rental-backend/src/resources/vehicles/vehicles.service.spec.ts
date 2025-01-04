import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { VehicleBrandsService } from '../vehicle-brands/vehicle-brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleBrandDto } from '../vehicle-brands/dto/vehicle-brand.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { VehicleBrand } from '../vehicle-brands/entities/vehicle-brand.entity';
import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../addresses/entities/address.entity';
import { AddressDto } from '../addresses/dto/address.dto';
import { UpdateAddressDto } from '../addresses/dto/update-address.dto';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehiclesRepository: Repository<Vehicle>;
  let vehicleBrandsService: VehicleBrandsService;
  let addressesService: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useClass: Repository,
        },
        {
          provide: VehicleBrandsService,
          useValue: {
            findByName: jest.fn(),
          },
        },
        {
          provide: AddressesService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    vehiclesRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle)
    );
    vehicleBrandsService =
      module.get<VehicleBrandsService>(VehicleBrandsService);

    addressesService = module.get<AddressesService>(AddressesService);
  });

  describe('create', () => {
    const brand = { id: 1, name: 'Toyota' } as unknown as VehicleBrandDto;

    it('should create a vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        brand: 'Toyota',
        registrationNumber: 'ABC123',
        vehicleIdentificationNumber: '1HGCM82633A123456',
      };
      const vehicle = new Vehicle();
      vehicle.registrationNumber = createVehicleDto.registrationNumber;
      vehicle.vehicleIdentificationNumber =
        createVehicleDto.vehicleIdentificationNumber;

      jest.spyOn(vehicleBrandsService, 'findByName').mockResolvedValue(brand);
      jest.spyOn(vehiclesRepository, 'find').mockResolvedValue([]);
      jest.spyOn(vehiclesRepository, 'save').mockResolvedValue(vehicle);

      await service.create(createVehicleDto);

      expect(vehicleBrandsService.findByName).toHaveBeenCalledWith(
        createVehicleDto.brand
      );
      expect(vehiclesRepository.find).toHaveBeenCalledWith({
        where: [
          { registrationNumber: createVehicleDto.registrationNumber },
          {
            vehicleIdentificationNumber:
              createVehicleDto.vehicleIdentificationNumber,
          },
        ],
      });
      expect(vehiclesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          registrationNumber: createVehicleDto.registrationNumber,
          vehicleIdentificationNumber:
            createVehicleDto.vehicleIdentificationNumber,
        })
      );
    });

    it('should throw an error if vehicle already exists', async () => {
      const createVehicleDto: CreateVehicleDto = {
        brand: 'Toyota',
        registrationNumber: 'ABC123',
        vehicleIdentificationNumber: '1HGCM82633A123456',
      };
      const existingVehicle = new Vehicle();
      existingVehicle.registrationNumber = createVehicleDto.registrationNumber;
      existingVehicle.vehicleIdentificationNumber =
        createVehicleDto.vehicleIdentificationNumber;

      jest.spyOn(vehicleBrandsService, 'findByName').mockResolvedValue(brand);
      jest
        .spyOn(vehiclesRepository, 'find')
        .mockResolvedValue([existingVehicle]);

      await expect(service.create(createVehicleDto)).rejects.toThrow(
        HttpException
      );

      expect(vehicleBrandsService.findByName).toHaveBeenCalledWith(
        createVehicleDto.brand
      );
      expect(vehiclesRepository.find).toHaveBeenCalledWith({
        where: [
          { registrationNumber: createVehicleDto.registrationNumber },
          {
            vehicleIdentificationNumber:
              createVehicleDto.vehicleIdentificationNumber,
          },
        ],
      });
    });
  });

  describe('findByField', () => {
    it('should return a vehicle based on a specific field', async () => {
      const field = 'registrationNumber';
      const value = 'ABC123';
      const vehicle = new Vehicle();
      jest.spyOn(vehiclesRepository, 'findOne').mockResolvedValue(vehicle);

      const result = await service['findByField'](field, value);
      expect(result).toEqual(vehicle);
    });

    it('should throw an error if vehicle not found', async () => {
      const field = 'registrationNumber';
      const value = 'ABC123';
      jest.spyOn(vehiclesRepository, 'findOne').mockResolvedValue(null);

      await expect(service['findByField'](field, value)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });

  describe('findOne', () => {
    it('should return a vehicle based on id', async () => {
      const id = 1;
      const vehicle = new Vehicle();
      const brand = new VehicleBrand();
      brand.name = 'Toyota';
      vehicle.brand = brand;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(service as any, 'findByField').mockResolvedValue(vehicle);

      const result = await service.findOne(id);
      expect(result.brand).toEqual(vehicle.brand.name);
      expect(service['findByField']).toHaveBeenCalledWith('id', id);
    });
  });

  describe('update', () => {
    const mockVehicleDto: VehicleDto = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      brand: 'Toyota',
      registrationNumber: 'XYZ789',
      vehicleIdentificationNumber: 'ASWFETD2144325231',
      clientEmail: 'example@example.com',
      clientAddress: {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        city: 'Bielsko-Biała',
        administrativeArea: 'Śląskie',
        postalCode: '43-300',
        country: 'Poland',
        street: 'ul. 3 Maja 2',
      },
    };
    const vehicleBrand = { id: 1, name: 'Toyota' } as VehicleBrandDto;
    it('should update a vehicle and update the address', async () => {
      const id = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        registrationNumber: 'XYZ789',
        brand: 'Toyota',
        clientAddress: {
          id: 1,
          createdAt: new Date('2021-09-01T00:00:00.000Z'),
          updatedAt: new Date('2021-09-01T00:00:00.000Z'),
          city: 'Bielsko-Biała',
          administrativeArea: 'Śląskie',
          postalCode: '43-300',
          country: 'Poland',
          street: 'ul. Cieszyńska 12',
        },
      };

      const { id: addressId, ...addressData } =
        updateVehicleDto.clientAddress as UpdateAddressDto;
      const vehicleClientAddress = new Address();
      vehicleClientAddress.id = 1;
      const vehicle = new Vehicle();
      vehicle.id = id;
      vehicle.registrationNumber = 'ABC123';
      vehicle.vehicleIdentificationNumber = 'ASDFGH1234567890';
      vehicle.clientAddress = vehicleClientAddress;

      const vehicleBrand = new VehicleBrand();
      vehicleBrand.name = 'Toyota';

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(vehicle as unknown as VehicleDto)
        .mockResolvedValueOnce(mockVehicleDto);
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest
        .spyOn(addressesService, 'findOne')
        .mockResolvedValue(vehicle.clientAddress);
      jest
        .spyOn(addressesService, 'update')
        .mockResolvedValue(vehicle.clientAddress);
      jest
        .spyOn(addressesService, 'create')
        .mockResolvedValue(vehicle.clientAddress);
      jest.spyOn(addressesService, 'remove').mockResolvedValue(undefined);
      jest.spyOn(vehiclesRepository, 'find').mockResolvedValue([]);
      jest.spyOn(vehiclesRepository, 'save').mockResolvedValue(vehicle);

      const result = await service.update(id, updateVehicleDto);
      expect(result).toEqual(mockVehicleDto);
      expect(vehicleBrandsService.findByName).toHaveBeenCalledWith(
        updateVehicleDto.brand
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(addressesService.findOne).toHaveBeenCalledWith(
        (updateVehicleDto.clientAddress as UpdateAddressDto).id
      );
      expect(addressesService.update).toHaveBeenCalledWith(
        (updateVehicleDto.clientAddress as UpdateAddressDto).id,
        addressData
      );
      expect(addressesService.create).not.toHaveBeenCalled();
      expect(addressesService.remove).not.toHaveBeenCalled();
    });

    it('should update a vehicle and create the address', async () => {
      const id = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        registrationNumber: 'XYZ789',
        clientAddress: {
          city: 'Bielsko-Biała',
          administrativeArea: 'Śląskie',
          postalCode: '43-300',
          country: 'Poland',
          street: 'ul. Cieszyńska 12',
        },
      };
      const vehicle = new Vehicle();
      vehicle.id = id;
      vehicle.registrationNumber = 'ABC123';
      vehicle.vehicleIdentificationNumber = 'ASDFGH1234567890';

      const clientAddress = new Address();
      clientAddress.id = 1;

      const vehicleBrand = new VehicleBrand();
      vehicleBrand.name = 'Toyota';

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(vehicle as unknown as VehicleDto);
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest.spyOn(addressesService, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(addressesService, 'update')
        .mockResolvedValue(vehicle.clientAddress);
      jest
        .spyOn(addressesService, 'create')
        .mockResolvedValue(clientAddress);
      jest.spyOn(addressesService, 'remove').mockResolvedValue(undefined);
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockVehicleDto);
      jest.spyOn(vehiclesRepository, 'find').mockResolvedValue([]);
      jest.spyOn(vehiclesRepository, 'save').mockResolvedValue(vehicle);

      const result = await service.update(id, updateVehicleDto);
      expect(result).toEqual(mockVehicleDto);
      expect(vehicleBrandsService.findByName).not.toHaveBeenCalledWith();
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(addressesService.findOne).not.toHaveBeenCalled();
      expect(addressesService.update).not.toHaveBeenCalled();
      expect(addressesService.create).toHaveBeenCalledWith(
        updateVehicleDto.clientAddress
      );
      expect(addressesService.remove).not.toHaveBeenCalled();
    });

    it('should update a vehicle and remove the address', async () => {
      const id = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        registrationNumber: 'XYZ789',
      };
      const vehicleClientAddress = new Address();
      vehicleClientAddress.id = 1;
      const vehicle = new Vehicle();
      vehicle.id = id;
      vehicle.registrationNumber = 'ABC123';
      vehicle.vehicleIdentificationNumber = 'ASDFGH1234567890';
      vehicle.clientAddress = vehicleClientAddress;

      const vehicleBrand = new VehicleBrand();
      vehicleBrand.name = 'Toyota';

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(vehicle as unknown as VehicleDto);
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest
        .spyOn(addressesService, 'findOne')
        .mockResolvedValue(vehicle.clientAddress);
      jest
        .spyOn(addressesService, 'update')
        .mockResolvedValue(vehicle.clientAddress);
      jest
        .spyOn(addressesService, 'create')
        .mockResolvedValue(vehicle.clientAddress);
      jest.spyOn(addressesService, 'remove').mockResolvedValue(undefined);
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockVehicleDto);
      jest.spyOn(vehiclesRepository, 'find').mockResolvedValue([vehicle]);
      jest.spyOn(vehiclesRepository, 'save').mockResolvedValue(vehicle);

      const result = await service.update(id, updateVehicleDto);
      expect(result).toEqual(mockVehicleDto);
      expect(vehicleBrandsService.findByName).not.toHaveBeenCalledWith();
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(addressesService.findOne).not.toHaveBeenCalled();
      expect(addressesService.update).not.toHaveBeenCalled();
      expect(addressesService.create).not.toHaveBeenCalled();
      expect(addressesService.remove).toHaveBeenCalledWith(
        vehicle.clientAddress.id
      );
    });

    it('should throw an error if vehicle not found', async () => {
      const id = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        registrationNumber: 'XYZ789',
      };

      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, updateVehicleDto)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should throw an error if vehicle with the same registration number exists', async () => {
      const id = 1;
      const updateVehicleDto: UpdateVehicleDto = {
        registrationNumber: 'XYZ789',
      };

      const vehicle = new Vehicle();
      jest
        .spyOn(vehicleBrandsService, 'findByName')
        .mockResolvedValue(vehicleBrand);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockVehicleDto);
      jest.spyOn(vehiclesRepository, 'find').mockResolvedValue([vehicle]);

      await expect(service.update(id, updateVehicleDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error:
              'Vehicle with such registrationNumber/vehicleIdentificationNumber already exists',
          },
          HttpStatus.CONFLICT
        )
      );
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      const id = 1;
      const vehicle = new VehicleDto();
      vehicle.clientAddress = { id: 1 } as AddressDto;
      jest.spyOn(service, 'findOne').mockResolvedValue(vehicle);
      jest.spyOn(vehiclesRepository, 'delete').mockResolvedValue(undefined);
      jest.spyOn(addressesService, 'remove').mockResolvedValue();

      await service.remove(id);
      expect(addressesService.remove).toHaveBeenCalledWith(
        vehicle.clientAddress.id
      );
      expect(vehiclesRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if vehicle not found', async () => {
      const id = 1;
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });
});
