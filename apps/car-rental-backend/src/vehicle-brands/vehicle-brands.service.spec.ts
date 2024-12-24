import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsService } from './vehicle-brands.service';

describe('VehicleBrandsService', () => {
  let service: VehicleBrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleBrandsService],
    }).compile();

    service = module.get<VehicleBrandsService>(VehicleBrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
