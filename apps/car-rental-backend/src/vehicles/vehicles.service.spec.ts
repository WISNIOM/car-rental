import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

const mockVehicleRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repository: Repository<Vehicle>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    repository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        name: 'Car',
        brand: 'Toyota',
      };
      mockVehicleRepository.save.mockResolvedValue(createVehicleDto);

      expect(await service.create(createVehicleDto)).toEqual(createVehicleDto);
      expect(mockVehicleRepository.save).toHaveBeenCalledWith(createVehicleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const result = [{ id: 1, name: 'Car', brand: 'Toyota' }];
      mockVehicleRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', async () => {
      const result = { id: 1, name: 'Car', brand: 'Toyota' };
      mockVehicleRepository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(mockVehicleRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateVehicleDto: UpdateVehicleDto = {
        name: 'Car',
        brand: 'Toyota',
      };
      const result = { affected: 1 };
      mockVehicleRepository.update.mockResolvedValue(result);

      expect(await service.update(1, updateVehicleDto)).toEqual(result);
      expect(mockVehicleRepository.update).toHaveBeenCalledWith(
        1,
        updateVehicleDto
      );
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      const result = { affected: 1 };
      mockVehicleRepository.delete.mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(mockVehicleRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
