import { TestBed } from '@angular/core/testing';

import { VehicleBrandsService } from './vehicle-brands.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PageOptions } from '../dtos/page-options';
import { Order } from '../enums/order';
import { environment } from '../environment';

describe('VehicleBrandsService', () => {
  let service: VehicleBrandsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VehicleBrandsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(VehicleBrandsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

    describe('getVehicleBrands', () => {
      it('should return a page of vehicle brands', () => {
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
  
        service.getVehicleBrands(pageOptions).subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });
  
        const req = httpMock.expectOne(
          `${environment.API_URL}/vehicle-brands?sortField=name&order=ASC&page=1&take=10`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });
  
      it('should handle empty options', () => {
        const mockResponse = {
          data: [{ id: 1, brand: 'Toyota' }],
          total: 1,
        };
  
        service.getVehicleBrands().subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });
  
        const req = httpMock.expectOne(`${environment.API_URL}/vehicle-brands`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });
    });
});
