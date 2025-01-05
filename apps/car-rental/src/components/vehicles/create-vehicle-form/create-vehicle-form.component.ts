import {
  Component,
  OnInit,
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
import { NotificationService } from '../../../../src/services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { CustomValidators } from '../../../../src/validators/custom-validators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, finalize, fromEvent, Subscription } from 'rxjs';

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
  @ViewChild('createVehicleBrandDropdown') brandDropdown!: MatSelect;
  vehicleForm: FormGroup;
  vehicleBrands: VehicleBrandDto[] = [];
  vehicleBrandsCurrentPage = 1;
  isLoading = false;
  error: { error: string; status: number } | null = null;
  private scrollSubscription?: Subscription;

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService,
    private readonly dialogRef: MatDialogRef<CreateVehicleFormComponent>,
    private readonly notificationService: NotificationService
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
      this.scrollSubscription = fromEvent(
        this.brandDropdown.panel.nativeElement,
        'scroll'
      )
        .pipe(debounceTime(200))
        .subscribe(() => this.onScroll());
    } else if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  loadVehicleBrands(): void {
    this.vehiclesBrandService
      .getVehicleBrands({ sortField: 'name', take: 10, page: this.vehicleBrandsCurrentPage })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.vehicleBrandsCurrentPage++;
      });
  }

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    const isDropdownScrolledToBottom =
      dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 50;
    if (isDropdownScrolledToBottom) {
      this.loadVehicleBrands();
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.vehiclesService
      .createVehicle(this.vehicleForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Dodano pojazd.🥳');
          this.dialogRef.close('vehicleCreated');
        },
        error: (error) => {
          if (error.error.status === 409) {
            this.notificationService.showError(
              'Pojazd o podanym numerze rejestracyjnym lub numerze VIN już istnieje.😥'
            );
            return;
          }
          if (error.error.status === 404) {
            this.notificationService.showError(
              'Nie znaleziono takiej marki pojazdu.😥'
            );
            return;
          }
          this.notificationService.showError('Wysłano niepoprawne żądanie.😥');
        },
      });
  }
}
