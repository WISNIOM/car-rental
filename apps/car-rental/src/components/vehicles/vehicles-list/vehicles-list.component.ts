import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleBrandsService } from '../../../services/vehicle-brands.service';

@Component({
  selector: 'app-vehicles-list',
  imports: [CommonModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent implements OnInit {
  vehicles: any[] = [];
  vehicleBrands: string[] = [];

  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesBrandService: VehicleBrandsService
  ) {}

  ngOnInit(): void {
    this.vehiclesService.getVehicles().subscribe((data) => {
      this.vehicles = data;
    });
    this.vehiclesBrandService.getVehicleBrands().subscribe((data: string[]) => {
      this.vehicleBrands = data;
    });
  }
}
