import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleBrandsService {
  private apiUrl = 'http://localhost:3000/api/vehicle-brands';
  constructor(private readonly http: HttpClient) { }

  getVehicleBrands(): any {
    return this.http.get(this.apiUrl);
  }
}
