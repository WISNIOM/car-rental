import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

const mockVehiclesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('VehiclesController', () => {
  let controller: VehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        name: 'Car',
        brand: 'Toyota',
      };
      mockVehiclesService.create.mockResolvedValue(createVehicleDto);

      expect(await controller.create(createVehicleDto)).toEqual(
        createVehicleDto
      );
      expect(mockVehiclesService.create).toHaveBeenCalledWith(createVehicleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const result = [{ id: 1, name: 'Car', brand: 'Toyota' }];
      mockVehiclesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', async () => {
      const result = { id: 1, name: 'Car', brand: 'Toyota' };
      mockVehiclesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockVehiclesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateVehicleDto: UpdateVehicleDto = {
        name: 'Car',
        brand: 'Toyota',
      };
      const result = { id: 1, name: 'Car', brand: 'Toyota' };
      mockVehiclesService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateVehicleDto)).toEqual(result);
      expect(mockVehiclesService.update).toHaveBeenCalledWith(
        1,
        updateVehicleDto
      );
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      const result = { id: 1, name: 'Car', brand: 'Toyota' };
      mockVehiclesService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockVehiclesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
