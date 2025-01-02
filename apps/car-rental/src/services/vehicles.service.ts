import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from '../dtos/vehicle';
import { Page } from '../dtos/page';
import { PageOptions } from '../dtos/page-options';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private apiUrl = 'http://localhost:3000/api/vehicles';
  constructor(private readonly http: HttpClient) {}

  getVehicles(opts: PageOptions = {}): Observable<Page<VehicleDto>> {
    let params = new HttpParams();
    if (opts.sortField) {
      params = params.set('sortField', opts.sortField);
    }
    if (opts.order) {
      params = params.set('order', opts.order);
    }
    if (opts.page) {
      params = params.set('page', opts.page.toString());
    }
    if (opts.take) {
      params = params.set('take', opts.take.toString());
    }
    return this.http.get<Page<VehicleDto>>(this.apiUrl, { params });
  }

  updateVehicle(id: number, vehicle: UpdateVehicleDto): Observable<VehicleDto> {
    return this.http.patch<VehicleDto>(`${this.apiUrl}/${id}`, vehicle);
  }

  createVehicle(vehicle: CreateVehicleDto): Observable<VehicleDto> {
    return this.http.post<VehicleDto>(this.apiUrl, vehicle);
  }

  removeVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
