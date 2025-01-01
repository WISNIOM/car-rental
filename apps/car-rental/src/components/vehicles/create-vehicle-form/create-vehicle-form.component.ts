import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { MatButtonModule } from '@angular/material/button';
import { CustomValidators } from '../../../../src/validators/custom-validators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-vehicle-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-vehicle-form.component.html',
  styleUrl: './create-vehicle-form.component.scss',
})
export class CreateVehicleFormComponent implements OnInit {
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  @Output() vehicleCreated = new EventEmitter<void>();
  private _snackBar = inject(MatSnackBar);
  vehicleForm: FormGroup;
  vehicleBrands: VehicleBrandDto[] = [];
  currentPage = 1;
  isLoading = false;
  error: { error: string; status: number } | null = null;

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService,
    private dialogRef: MatDialogRef<CreateVehicleFormComponent>
  ) {
    this.vehicleForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(7),
        CustomValidators.doesNotContainPolishLetters(),
        CustomValidators.doesContainOnlyDigitsAndUppercaseLetters(),
        CustomValidators.doesNotContainSpecificLetters(
          ['B', 'D', 'I', 'O', 'Z'],
          2
        ),
      ]),
      vehicleIdentificationNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(17),
        Validators.maxLength(17),
        CustomValidators.doesNotContainPolishLetters(),
        CustomValidators.doesContainOnlyDigitsAndUppercaseLetters(),
        CustomValidators.doesNotContainSpecificLetters(['I', 'O', 'Q']),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadVehicleBrands();
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
    if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight) {
      this.loadVehicleBrands();
    }
  }

  onSubmit(): void {
    const { brand, registrationNumber, vehicleIdentificationNumber } =
      this.vehicleForm.value;
    this.isLoading = true;
    this.vehiclesService
      .createVehicle({ brand, registrationNumber, vehicleIdentificationNumber })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.vehicleCreated.emit();
          this._snackBar.open(
            'Stworzono samochód.🥳',
            'Zamknij',
            {
              duration: 3000,
            }
          );
          this.dialogRef.close('vehicleCreated');
        },
        error: (error) => {
          if (error.error.status === 409) {
            this._snackBar.open(
              'Samochód o podanym numerze rejestracyjnym lub numerze VIN już istnieje.😥',
              'Zamknij',
              {
                duration: 3000,
              }
            );
          }
        },
      });
  }
}
