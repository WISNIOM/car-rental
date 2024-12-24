import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsController } from './vehicle-brands.controller';
import { VehicleBrandsService } from './vehicle-brands.service';

describe('VehicleBrandsController', () => {
  let controller: VehicleBrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleBrandsController],
      providers: [VehicleBrandsService],
    }).compile();

    controller = module.get<VehicleBrandsController>(VehicleBrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
