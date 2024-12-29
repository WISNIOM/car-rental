import { TestBed } from '@angular/core/testing';

import { VehicleBrandsService } from './vehicle-brands.service';

describe('VehicleBrandsService', () => {
  let service: VehicleBrandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleBrandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
