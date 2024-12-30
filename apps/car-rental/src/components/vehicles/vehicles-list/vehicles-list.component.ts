import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    CreateVehicleFormComponent,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent implements OnInit {
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = [
    'brand',
    'registrationNumber',
    'vehicleIdentificationNumber',
  ];

  constructor(private readonly vehiclesService: VehiclesService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehiclesService.getVehicles().subscribe((response) => {
      this.vehicles = [...response.data];
    });
  }

  onVehicleCreated(): void {
    this.loadVehicles();
  }
}
