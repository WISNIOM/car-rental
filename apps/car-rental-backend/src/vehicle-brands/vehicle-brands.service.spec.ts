import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsService } from './vehicle-brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateVehicleBrandDto } from './dto/update-vehicle-brand.dto';
import { VehicleBrand } from './entities/vehicle-brand.entity';

describe('VehicleBrandsService', () => {
  let service: VehicleBrandsService;
  let repository: Repository<VehicleBrand>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleBrandsService,
        {
          provide: getRepositoryToken(VehicleBrand),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VehicleBrandsService>(VehicleBrandsService);
    repository = module.get<Repository<VehicleBrand>>(getRepositoryToken(VehicleBrand));
  });

  describe('update', () => {
    it('should throw conflict exception if vehicle brand name already exists', async () => {
      const updateVehicleBrandDto: UpdateVehicleBrandDto = { name: 'Toyota' };
      jest.spyOn(service, 'findByName').mockResolvedValue(new VehicleBrand());

      await expect(service.update(1, updateVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.CONFLICT, error: 'Vehicle brand already exists' },
          HttpStatus.CONFLICT
        )
      );
    });

    it('should throw not found exception if vehicle brand is not found by ID', async () => {
      const updateVehicleBrandDto: UpdateVehicleBrandDto = { name: 'Toyota' };
      jest.spyOn(service, 'findByName').mockRejectedValue({ status: HttpStatus.NOT_FOUND });
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, updateVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should update and return the vehicle brand', async () => {
      const updateVehicleBrandDto: UpdateVehicleBrandDto = { name: 'Toyota' };
      const vehicleBrand = new VehicleBrand();
      jest.spyOn(service, 'findByName').mockRejectedValue({ status: HttpStatus.NOT_FOUND });
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(vehicleBrand);
      jest.spyOn(repository, 'save').mockResolvedValue(vehicleBrand);

      const result = await service.update(1, updateVehicleBrandDto);
      expect(result).toBe(vehicleBrand);
      expect(repository.save).toHaveBeenCalledWith({ id: 1, name: 'Toyota' });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should throw not found exception if vehicle brand is not found by ID', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should remove the vehicle brand', async () => {
      const vehicleBrand = new VehicleBrand();
      const deleteResult = { affected: 1, raw: [] };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(vehicleBrand);
      jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

      const result = await service.remove(1);
      expect(result).toBe(deleteResult);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});