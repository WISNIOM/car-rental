import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
export class CreateVehicleFormComponent implements OnInit, OnDestroy {
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  vehicleForm: FormGroup;
  vehicleBrands: VehicleBrandDto[] = [];
  currentPage = 1;

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
    this.loadVehicleBrands();
  }

  ngOnDestroy(): void {
    this.brandDropdown.panel.nativeElement.removeEventListener(
      'scroll',
      this.onScroll.bind(this)
    );
  }

  onDropdownOpened(isOpened: boolean): void {
    if (isOpened) {
      this.brandDropdown.panel.nativeElement.addEventListener(
        'scroll',
        this.onScroll.bind(this)
      );
    }
  }

  loadVehicleBrands(): void {
    this.vehiclesBrandService
      .getVehicleBrands({ sortField: 'name', take: 10, page: this.currentPage })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.currentPage++;
      });
  }

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    console.log('Scroll event triggered');
    console.log(
      `scrollTop: ${dropdown.scrollTop}, clientHeight: ${dropdown.clientHeight}, scrollHeight: ${dropdown.scrollHeight}`
    );
    if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight) {
      console.log('Loading more vehicle brands');
      this.loadVehicleBrands();
    }
  }

  onSubmit(): void {
    console.log(this.vehicleForm.value);
  }
}
