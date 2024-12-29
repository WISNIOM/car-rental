import { Test, TestingModule } from '@nestjs/testing';
import { VehicleBrandsService } from './vehicle-brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleBrand } from './entities/vehicle-brand.entity';
import { Order } from '../common/constants';

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

  describe('create', () => {
    it('should create a vehicle brand if it does not exist', async () => {
      const createVehicleBrandDto = { name: 'Toyota' };
      const vehicleBrand = { id: 1, name: 'Toyota' } as VehicleBrand;
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      jest.spyOn(repository, 'save').mockResolvedValue(vehicleBrand);

      expect(await service.create(createVehicleBrandDto)).toEqual(vehicleBrand);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: 'Toyota' },
      });
      expect(repository.save).toHaveBeenCalledWith(createVehicleBrandDto);
    });

    it('should throw an exception if vehicle brand already exists', async () => {
      const createVehicleBrandDto = { name: 'Toyota' };
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([{ id: 1, name: 'Toyota' } as VehicleBrand]);

      await expect(service.create(createVehicleBrandDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Vehicle brand already exists',
          },
          HttpStatus.CONFLICT
        )
      );
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: 'Toyota' },
      });
    });
  });

  describe('findVehicleBrands', () => {
    it('should return a list of vehicle brands', async () => {
      const pageOptionsDto = {
        order: Order.ASC,
        take: 10,
        skip: 0,
        sortField: 'name',
      };
      const vehicleBrands = [
        { id: 2, name: 'Mercedes' } as VehicleBrand,
        { id: 1, name: 'Toyota' } as VehicleBrand,
      ];
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest
          .fn()
          .mockResolvedValue({ entities: vehicleBrands }),
      } as unknown as SelectQueryBuilder<VehicleBrand>);

      const result = await service.findVehicleBrands(pageOptionsDto);
      expect(result.data[0]).toEqual(vehicleBrands[0]);
      expect(result.data[1]).toEqual(vehicleBrands[1]);
      expect(result.meta.itemCount).toEqual(2);
    });

    it('should return a list of vehicle brands sorted by id if sortField is not provided', async () => {
      const pageOptionsDto = {
        order: Order.ASC,
        take: 10,
        skip: 0,
      };
      const vehicleBrands = [
        { id: 1, name: 'Toyota' } as VehicleBrand,
        { id: 2, name: 'Mercedes' } as VehicleBrand,
      ];
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest
          .fn()
          .mockResolvedValue({ entities: vehicleBrands }),
      } as unknown as SelectQueryBuilder<VehicleBrand>);

      const result = await service.findVehicleBrands(pageOptionsDto);
      expect(result.data[0]).toEqual(vehicleBrands[0]);
      expect(result.data[1]).toEqual(vehicleBrands[1]);
      expect(result.meta.itemCount).toEqual(2);
    });

    it('should return an empty list if no vehicle brands found', async () => {
      const pageOptionsDto = {
        order: Order.ASC,
        take: 10,
        skip: 0,
        sortField: 'name',
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: [] }),
      } as unknown as SelectQueryBuilder<VehicleBrand>);

      const result = await service.findVehicleBrands(pageOptionsDto);
      expect(result.data).toEqual([]);
      expect(result.meta.itemCount).toEqual(0);
    });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(service as any, 'findByField').mockResolvedValue(vehicleBrand);

      expect(await service.findOne(1)).toEqual(vehicleBrand);
      expect(service['findByField']).toHaveBeenCalledWith('id', 1);
    });
  });

  describe('findByName', () => {
    it('should call findByField with name', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(vehicleBrand)
        .mockResolvedValueOnce(updatedVehicleBrand);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedVehicleBrand);

      expect(await service.update(1, updateVehicleBrandDto)).toEqual(
        updatedVehicleBrand
      );
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: updatedVehicleBrand.name },
      });
      expect(service.findOne).toHaveBeenCalledWith(vehicleBrand.id);
      expect(repository.save).toHaveBeenCalledWith({
        ...vehicleBrand,
        ...updateVehicleBrandDto,
      });
    });

    it('should throw an exception if vehicle brand not found', async () => {
      const updateVehicleBrandDto = { name: 'Toyota' };
      jest.spyOn(repository, 'find').mockResolvedValue([]);

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
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: updateVehicleBrandDto.name },
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if vehicle brand to be updated already exists', async () => {
      const updateVehicleBrandDto = { name: 'Toyota' };
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([{ id: 2, name: 'Toyota' } as VehicleBrand]);

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
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: updateVehicleBrandDto.name },
      });
      expect(service.findOne).not.toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle brand if it exists', async () => {
      const vehicleBrand = { id: 1, name: 'Toyota' } as VehicleBrand;
      jest.spyOn(service, 'findOne').mockResolvedValue(vehicleBrand);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(undefined);

      expect(await service.remove(1)).toEqual(undefined);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if vehicle brand not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
            HttpStatus.NOT_FOUND
          )
        );
      jest.spyOn(repository, 'delete');

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Vehicle brand not found' },
          HttpStatus.NOT_FOUND
        )
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
