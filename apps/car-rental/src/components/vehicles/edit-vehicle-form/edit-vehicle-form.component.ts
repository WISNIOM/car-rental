import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { NotificationService } from '../../../../src/services/notification.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { CustomValidators } from '../../../../src/validators/custom-validators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { AddressDto } from '../../../dtos/address';

@Component({
  selector: 'app-edit-vehicle-form',
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
  templateUrl: './edit-vehicle-form.component.html',
  styleUrl: './edit-vehicle-form.component.scss',
})
export class EditVehicleFormComponent implements OnInit {
  @ViewChild('editVehicleBrandDropdown') brandDropdown!: MatSelect;
  isLoading = false;
  vehicleCopy: VehicleDto;
  vehicleForm: FormGroup;
  vehicleBrands: VehicleBrandDto[] = [];
  vehicleBrandsCurrentPage = 1;
  private scrollSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditVehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public vehicle: VehicleDto,
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly notificationService: NotificationService
  ) {
    this.vehicleCopy = { ...vehicle };
    this.vehicleForm = new FormGroup({
      brand: new FormControl(this.vehicleCopy.brand, [Validators.required]),
      registrationNumber: new FormControl(this.vehicleCopy.registrationNumber, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        CustomValidators.doesNotContainPolishLetters(),
        CustomValidators.doesContainOnlyDigitsAndUppercaseLetters(),
        CustomValidators.doesNotContainSpecificLetters(
          ['B', 'D', 'I', 'O', 'Z'],
          2
        ),
      ]),
      vehicleIdentificationNumber: new FormControl(
        this.vehicleCopy.vehicleIdentificationNumber,
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
          CustomValidators.doesNotContainPolishLetters(),
          CustomValidators.doesContainOnlyDigitsAndUppercaseLetters(),
          CustomValidators.doesNotContainSpecificLetters(['I', 'O', 'Q']),
        ]
      ),
      clientEmail: new FormControl(this.vehicleCopy.clientEmail, [
        Validators.email,
      ]),
      clientAddress: new FormGroup({
        country: new FormControl(
          (this.vehicleCopy.clientAddress as AddressDto).country || '',
          [Validators.minLength(2), Validators.maxLength(100)]
        ),
        administrativeArea: new FormControl(
          this.vehicleCopy.clientAddress?.administrativeArea || '',
          [Validators.minLength(2), Validators.maxLength(100)]
        ),
        city: new FormControl(this.vehicleCopy.clientAddress?.city || '', [
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        postalCode: new FormControl(
          this.vehicleCopy.clientAddress?.postalCode || '',
          [Validators.minLength(2), Validators.maxLength(100)]
        ),
        street: new FormControl(this.vehicleCopy.clientAddress?.street || '', [
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
      }),
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

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    const isDropdownScrolledToBottom =
      dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 50;
    if (isDropdownScrolledToBottom) {
      this.loadVehicleBrands();
    }
  }

  loadVehicleBrands(): void {
    this.vehiclesBrandService
      .getVehicleBrands({
        sortField: 'name',
        take: 10,
        page: this.vehicleBrandsCurrentPage,
      })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.vehicleBrandsCurrentPage++;
      });
  }

  onSubmit(): void {
    this.isLoading = true;
    const { clientAddress, ...vehicleData } = this.vehicleForm.value;
    if(this.vehicleCopy.clientAddress) {
      if((this.vehicleCopy.clientAddress as AddressDto).id) {
        clientAddress.id = (this.vehicleCopy.clientAddress as AddressDto).id;
      }
    }
    this.vehiclesService
      .updateVehicle(this.vehicleCopy.id, {...vehicleData, clientAddress})
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Pojazd został zaktualizowany. 🚗'
          );
          this.dialogRef.close('vehicleEdited');
        },
        error: (error) => {
          if (error.error.status === 404) {
            this.notificationService.showError(
              'Nie znaleziono takiego pojazdu. 😥'
            );
            this.dialogRef.close();
          }
          this.notificationService.showError(
            'Nie udało się zaktualizować pojazdu. 😢'
          );
          this.dialogRef.close();
        },
        complete: () => (this.isLoading = false),
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
