import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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

  constructor(private readonly vehiclesBrandService: VehicleBrandsService) {
    this.vehicleForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(7),
        this.doesNotContainPolishLetters(),
        this.doesContainOnlyDigitsAndUppercaseLetters(),
        this.doesNotContainSpecificLetters(['B', 'D', 'I', 'O', 'Z'], 2),
      ]),
      vehicleIdentificationNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(17),
        Validators.maxLength(17),
        this.doesNotContainPolishLetters(),
        this.doesContainOnlyDigitsAndUppercaseLetters(),
        this.doesNotContainSpecificLetters(['I', 'O', 'Q']),
      ]),
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

  doesNotContainPolishLetters(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(value)) {
        return { doesNotContainPolishLetters: true };
      }
      return null;
    };
  }

  doesContainOnlyDigitsAndUppercaseLetters(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && !/^[A-Z0-9]+$/.test(value)) {
        return { doesContainOnlyDigitsAndUppercaseLetters: true };
      }
      return null;
    };
  }

  doesNotContainSpecificLetters(
    letters: string[],
    letterIndex = 0
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!letters) {
        return null;
      }
      if (letterIndex && value) {
        if (letterIndex > value.length) {
          return null;
        }
        const textFromIndex = value.slice(letterIndex);
        if (letters.some((letter: string) => textFromIndex.includes(letter))) {
          return { doesNotContainSpecificLetters: true };
        }
      }
      return null;
    };
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
    if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight) {
      this.loadVehicleBrands();
    }
  }

  onSubmit(): void {
    console.log(this.vehicleForm.value);
  }
}
