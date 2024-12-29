import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleBrandDto } from '../dto/vehicle-brand';
import { Page } from '../dto/page';

@Injectable({
  providedIn: 'root',
})
export class VehicleBrandsService {
  private apiUrl = 'http://localhost:3000/api/vehicle-brands';
  constructor(private readonly http: HttpClient) {}

  getVehicleBrands(): Observable<Page<VehicleBrandDto>> {
    return this.http.get<Page<VehicleBrandDto>>(this.apiUrl);
  }
}
