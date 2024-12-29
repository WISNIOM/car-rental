import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleBrandsService } from '../../../services/vehicle-brands.service';
import { VehicleDto } from '../../../../src/dto/vehicle';
import { VehicleBrandDto } from '../../../../src/dto/vehicle-brand';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = ['brand', 'registrationNumber', 'vehicleIdentificationNumber'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesBrandService: VehicleBrandsService
  ) {
    this.vehicleForm = this.fb.group({
      brand: [''],
      registrationNumber: [''],
      vehicleIdentificationNumber: [''],
    });
  }

  ngOnInit(): void {
    this.vehiclesService.getVehicles().subscribe((response) => {
      this.vehicles = response.data;
    });
    this.vehiclesBrandService.getVehicleBrands().subscribe((response) => {
      this.vehicleBrands = response.data;
    });
  }

  onSubmit(): void {
    console.log(this.vehicleForm.value);
  }
}
