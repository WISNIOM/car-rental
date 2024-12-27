import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsService } from './vehicle-brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
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
    repository = module.get<Repository<VehicleBrand>>(
      getRepositoryToken(VehicleBrand)
    );
  });

  describe('findByField', () => {
    it('should return a vehicle brand if found', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' } as VehicleBrand;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(vehicleBrand);

      expect(await service['findByField']('id', 1)).toEqual(vehicleBrand);
    });

    it('should throw an exception if vehicle brand not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service['findByField']('id', 1)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
          HttpStatus.NOT_FOUND
        )
      );
    });
  });

  describe('findOne', () => {
    it('should call findByField with id', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' };
      jest.spyOn(service as any, 'findByField').mockResolvedValue(vehicleBrand);

      expect(await service.findOne(1)).toEqual(vehicleBrand);
      expect(service['findByField']).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('findByName', () => {
    it('should call findByField with name', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' };
      jest.spyOn(service as any, 'findByField').mockResolvedValue(vehicleBrand);

      expect(await service.findByName('Toyota')).toEqual(vehicleBrand);
      expect(service['findByField']).toHaveBeenCalledWith('name', 'Toyota');
    });
  });

  describe('update', () => {
    it('should update a vehicle brand if it exists, but there is no brand with such name', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' } as VehicleBrand;
      const updateVehicleBrandDto = { name: 'Mercedes' };
      const updatedVehicleBrand = { id: 1, name: 'Mercedes' } as VehicleBrand;
      jest
        .spyOn(service, 'findByName')
        .mockRejectedValue(
          new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
            HttpStatus.NOT_FOUND
          )
        );
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(vehicleBrand)
        .mockResolvedValueOnce(updatedVehicleBrand);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedVehicleBrand);

      expect(await service.update(1, updateVehicleBrandDto)).toEqual(
        updatedVehicleBrand
      );
      expect(service.findByName).toHaveBeenCalledWith(updatedVehicleBrand.name);
      expect(service.findOne).toHaveBeenCalledWith(vehicleBrand.id);
      expect(repository.save).toHaveBeenCalledWith({
        ...vehicleBrand,
        ...updateVehicleBrandDto,
      });
    });

    it('should throw an exception if vehicle brand not found', async () => {
      const updateVehicleBrandDto = { name: 'Toyota' };
      jest
        .spyOn(service, 'findByName')
        .mockRejectedValue(
          new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
            HttpStatus.NOT_FOUND
          )
        );

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
            HttpStatus.NOT_FOUND
          )
        );

      await expect(service.update(1, updateVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
          HttpStatus.NOT_FOUND
        )
      );
      expect(service.findByName).toHaveBeenCalledWith(
        updateVehicleBrandDto.name
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if vehicle brand to be updated already exists', async () => {
      const updateVehicleBrandDto = { name: 'Toyota' };
      jest
        .spyOn(service, 'findByName')
        .mockResolvedValue({ id: 2, name: 'Toyota' } as VehicleBrand);

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: 1, name: 'Mercedes' } as VehicleBrand);

      await expect(service.update(1, updateVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Vehicle brand already exists',
          },
          HttpStatus.CONFLICT
        )
      );
      expect(service.findByName).toHaveBeenCalledWith(
        updateVehicleBrandDto.name
      );
      expect(service.findOne).not.toHaveBeenCalledWith(1);
    });
  });
});
