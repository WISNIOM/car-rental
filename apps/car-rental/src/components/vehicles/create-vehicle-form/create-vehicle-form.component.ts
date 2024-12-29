import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';

@Component({
  selector: 'app-create-vehicle-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-vehicle-form.component.html',
  styleUrl: './create-vehicle-form.component.css',
})
export class CreateVehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleBrands: VehicleBrandDto[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly vehiclesBrandService: VehicleBrandsService
  ) {
    this.vehicleForm = this.fb.group({
      brand: [''],
      registrationNumber: [''],
      vehicleIdentificationNumber: [''],
    });
  }

  ngOnInit(): void {
    this.vehiclesBrandService
      .getVehicleBrands({ sortField: 'name', take: 5 })
      .subscribe((response) => {
        this.vehicleBrands = response.data;
      });
  }

  onSubmit(): void {
    console.log(this.vehicleForm.value);
  }
}
