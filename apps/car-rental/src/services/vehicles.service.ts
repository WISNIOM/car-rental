import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVehicleDto, VehicleDto } from '../dtos/vehicle';
import { Page } from '../dtos/page';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private apiUrl = 'http://localhost:3000/api/vehicles';
  constructor(private readonly http: HttpClient) {}

  getVehicles(): Observable<Page<VehicleDto>> {
    return this.http.get<Page<VehicleDto>>(this.apiUrl);
  }

  createVehicle(vehicle: CreateVehicleDto): Observable<VehicleDto> {
    return this.http.post<VehicleDto>(this.apiUrl, vehicle);
  }
}
