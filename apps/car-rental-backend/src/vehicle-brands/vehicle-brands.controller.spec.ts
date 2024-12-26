import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsController } from './vehicle-brands.controller';
import { VehicleBrandsService } from './vehicle-brands.service';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';

const mockVehicleBrandsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('VehicleBrandsController', () => {
  let controller: VehicleBrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleBrandsController],
      providers: [
        {
          provide: VehicleBrandsService,
          useValue: mockVehicleBrandsService,
        },
      ],
    }).compile();

    controller = module.get<VehicleBrandsController>(VehicleBrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle brand', async () => {
      const createVehicleBrandDto: CreateVehicleBrandDto = { name: 'Toyota' };
      mockVehicleBrandsService.create.mockResolvedValue(createVehicleBrandDto);

      expect(await controller.create(createVehicleBrandDto)).toEqual(
        createVehicleBrandDto
      );
      expect(mockVehicleBrandsService.create).toHaveBeenCalledWith(
        createVehicleBrandDto
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicle brands', async () => {
      const result = [{ id: 1, name: 'Toyota' }];
      mockVehicleBrandsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle brand by id', async () => {
      const result = { id: 1, name: 'Toyota' };
      mockVehicleBrandsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockVehicleBrandsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a vehicle brand', async () => {
      const updateVehicleBrandDto: UpdateVehicleBrandDto = { name: 'Toyota' };
      const result = { id: 1, name: 'Toyota' };
      mockVehicleBrandsService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateVehicleBrandDto)).toEqual(
        result
      );
      expect(mockVehicleBrandsService.update).toHaveBeenCalledWith(
        1,
        updateVehicleBrandDto
      );
    });
  });

  describe('remove', () => {
    it('should remove a vehicle brand', async () => {
      const result = { id: 1, name: 'Toyota' };
      mockVehicleBrandsService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockVehicleBrandsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
