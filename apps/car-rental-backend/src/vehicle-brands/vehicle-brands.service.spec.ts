import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsService } from './vehicle-brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleBrand } from './entities/vehicle-brand.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockVehicleBrandRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
};

describe('VehicleBrandsService', () => {
  let service: VehicleBrandsService;
  let repository: Repository<VehicleBrand>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleBrandsService,
        {
          provide: getRepositoryToken(VehicleBrand),
          useValue: mockVehicleBrandRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleBrandsService>(VehicleBrandsService);
    repository = module.get<Repository<VehicleBrand>>(
      getRepositoryToken(VehicleBrand)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if vehicle brand already exists', async () => {
      const createVehicleBrandDto = { name: 'Toyota' };
      jest
        .spyOn(service, 'findByName')
        .mockResolvedValue({ id: 1, name: 'Toyota' } as VehicleBrand);

      await expect(service.create(createVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Vehicle brand already exists',
          },
          HttpStatus.CONFLICT
        )
      );
    });

    it('should save a new vehicle brand', async () => {
      const createVehicleBrandDto = { name: 'Toyota' };
      jest.spyOn(service, 'findByName').mockResolvedValue(null);
      mockVehicleBrandRepository.save.mockResolvedValue(createVehicleBrandDto);

      expect(await service.create(createVehicleBrandDto)).toEqual(
        createVehicleBrandDto
      );
      expect(mockVehicleBrandRepository.save).toHaveBeenCalledWith(
        createVehicleBrandDto
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicle brands', async () => {
      const result = [{ id: 1, name: 'Toyota' }];
      mockVehicleBrandRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle brand by id', async () => {
      const result = { id: 1, name: 'Toyota' };
      mockVehicleBrandRepository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('should return null if vehicle brand not found', async () => {
      mockVehicleBrandRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });
});
