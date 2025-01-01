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
import { FormsModule } from '@angular/forms';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
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
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  currentPage = 1;

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicleBrands(): void {
    this.vehiclesBrandService
      .getVehicleBrands({ sortField: 'name', take: 10, page: this.currentPage })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.currentPage++;
      });
  }

  onDropdownOpened(isOpened: boolean): void {
    if (isOpened) {
      this.brandDropdown.panel.nativeElement.addEventListener(
        'scroll',
        this.onScroll.bind(this)
      );
    }
  }

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight) {
      this.loadVehicleBrands();
    }
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
