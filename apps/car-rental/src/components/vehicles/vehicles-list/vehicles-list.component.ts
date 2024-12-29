import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleBrandsService } from '../../../services/vehicle-brands.service';
import { VehicleDto } from '../../../../src/dto/vehicle';
import { VehicleBrandDto } from '../../../../src/dto/vehicle-brand';

@Component({
  selector: 'app-vehicles-list',
  imports: [CommonModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent implements OnInit {
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];

  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesBrandService: VehicleBrandsService
  ) {}

  ngOnInit(): void {
    this.vehiclesService.getVehicles().subscribe((response) => {
      this.vehicles = response.data;
    });
    this.vehiclesBrandService
      .getVehicleBrands()
      .subscribe((response) => {
        this.vehicleBrands = response.data;
      });
  }
}
