import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { VehiclesService } from './vehicles.service';
import { PageOptions } from '../dtos/page-options';
import { environment } from '../environment';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleDto,
} from '../dtos/vehicle';
import { Order } from '../enums/order';
import { provideHttpClient } from '@angular/common/http';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VehiclesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(VehiclesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getVehicles', () => {
    it('should return a page of vehicles', () => {
      const mockResponse = {
        data: [{ id: 1, brand: 'Toyota' }],
        total: 1,
      };
      const pageOptions: PageOptions = {
        sortField: 'name',
        order: Order.ASC,
        page: 1,
        take: 10,
      };

      service.getVehicles(pageOptions).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.API_URL}/vehicles?sortField=name&order=ASC&page=1&take=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty options', () => {
      const mockResponse = {
        data: [{ id: 1, brand: 'Toyota' }],
        total: 1,
      };

      service.getVehicles().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/vehicles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle', () => {
      const mockVehicle: UpdateVehicleDto = { brand: 'Toyota' };
      const mockResponse: VehicleDto = { id: 1, brand: 'Toyota' } as VehicleDto;

      service.updateVehicle(1, mockVehicle).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/vehicles/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockVehicle);
      req.flush(mockResponse);
    });
  });

  describe('createVehicle', () => {
    it('should create a vehicle', () => {
      const mockVehicle: CreateVehicleDto = {
        brand: 'Toyota',
      } as CreateVehicleDto;
      const mockResponse: VehicleDto = { id: 1, brand: 'Toyota' } as VehicleDto;

      service.createVehicle(mockVehicle).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/vehicles`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockVehicle);
      req.flush(mockResponse);
    });
  });

  describe('removeVehicle', () => {
    it('should remove a vehicle', () => {
      service.removeVehicle(1).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.API_URL}/vehicles/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle by id', () => {
      const mockResponse: VehicleDto = { id: 1, brand: 'Toyota' } as VehicleDto;

      service.getVehicleById(1).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/vehicles/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
