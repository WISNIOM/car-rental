import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { PageDto } from '../../common/pages/dto/page.dto';
import { PageOptionsDto } from '../../common/pages/dto/page-options.dto';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: {
            create: jest.fn(),
            findVehicles: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createVehicleDto: CreateVehicleDto = {
        brand: 'Toyota',
        registrationNumber: 'SB33221',
        vehicleIdentificationNumber: '1FAFP34N55W122943',
      };
      const result = new VehicleDto();
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createVehicleDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createVehicleDto);
    });
  });

  describe('findVehicles', () => {
    it('should call service.findAll with correct parameters', async () => {
      const result = [
        { id: 1, name: 'Car', brand: 'Toyota' },
      ] as unknown as PageDto<VehicleDto>;
      jest.spyOn(service, 'findVehicles').mockResolvedValue(result);

      expect(
        await controller.findVehicles({ page: 1, take: 10 } as PageOptionsDto)
      ).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const result = {
        id: 1,
        name: 'Car',
        brand: 'Toyota',
      } as unknown as VehicleDto;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateVehicleDto: UpdateVehicleDto = {
        brand: 'Toyota',
      };
      const result = {
        id: 1,
        name: 'Car',
        brand: 'Toyota',
      } as unknown as VehicleDto;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateVehicleDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await controller.remove(1)).toEqual(undefined);
    });
  });
});
