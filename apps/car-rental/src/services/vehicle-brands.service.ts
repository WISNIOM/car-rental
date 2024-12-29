import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleBrandDto } from '../dtos/vehicle-brand';
import { Page } from '../dtos/page';
import { PageOptions } from '../dtos/page-options';

@Injectable({
  providedIn: 'root',
})
export class VehicleBrandsService {
  private apiUrl = 'http://localhost:3000/api/vehicle-brands';
  constructor(private readonly http: HttpClient) {}

  getVehicleBrands(opts: PageOptions = {}): Observable<Page<VehicleBrandDto>> {
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
    return this.http.get<Page<VehicleBrandDto>>(this.apiUrl, { params });
  }
}
