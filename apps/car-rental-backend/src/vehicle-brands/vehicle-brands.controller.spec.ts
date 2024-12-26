import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsController } from './vehicle-brands.controller';
import { VehicleBrandsService } from './vehicle-brands.service';
import { PageDto } from '../common/pages/dto/page.dto';
import { PageOptionsDto } from '../common/pages/dto/page-options.dto';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { VehicleBrandDto } from './dto/vehicle-brand.dto';

describe('VehicleBrandsController', () => {
  let controller: VehicleBrandsController;
  let service: VehicleBrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleBrandsController],
      providers: [
        {
          provide: VehicleBrandsService,
          useValue: {
            create: jest.fn(),
            findVehicleBrands: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleBrandsController>(VehicleBrandsController);
    service = module.get<VehicleBrandsService>(VehicleBrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createVehicleBrandDto: CreateVehicleBrandDto = { name: 'Toyota' };
      const result = new VehicleBrandDto();
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createVehicleBrandDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createVehicleBrandDto);
    });
  });

  describe('findVehicleBrands', () => {
    it('should call service.findVehicleBrands with correct parameters', async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: 1,
        take: 10,
        skip: 0,
      };
      const result = { data: [], meta: {} };
      jest
        .spyOn(service, 'findVehicleBrands')
        .mockResolvedValue(result as PageDto<VehicleBrandDto>);

      expect(await controller.findVehicleBrands(pageOptionsDto)).toBe(result);
      expect(service.findVehicleBrands).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameters', async () => {
      const id = 1;
      const result = new VehicleBrandDto();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = 1;
      const updateVehicleBrandDto: UpdateVehicleBrandDto = { name: 'Honda' };
      const result = new VehicleBrandDto();
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateVehicleBrandDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(id, updateVehicleBrandDto);
    });
  });
});
