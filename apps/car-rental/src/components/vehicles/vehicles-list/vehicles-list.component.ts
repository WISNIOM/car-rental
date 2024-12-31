import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatIconButton,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    CreateVehicleFormComponent,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss',
})
export class VehiclesListComponent implements OnInit, AfterViewInit {
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = [
    'brand',
    'registrationNumber',
    'vehicleIdentificationNumber',
    'customerEmail',
    'customerAddress',
    'actions',
  ];
  editedVehicle: VehicleDto | null = null;
  dataSource = new MatTableDataSource<VehicleDto>(this.vehicles);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly vehiclesService: VehiclesService) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  editVehicle(vehicle: VehicleDto): void {
    // Implement edit vehicle logic here
    console.log('Edit vehicle:', vehicle);
    this.editedVehicle = vehicle;
  }

  removeVehicle(vehicle: any): void {
    // Implement remove vehicle logic here
    console.log('Delete vehicle:', vehicle);
  }

  cancelEditing(): void {
    this.editedVehicle = null;
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
