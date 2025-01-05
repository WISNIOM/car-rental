import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, fromEvent, merge, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { Order } from '../../../../src/enums/order';
import {
  DoesContainOnlyDigitsAndUppercaseLettersDirective,
  DoesNotContainPolishLettersDirective,
  DoesNotContainSpecificLettersDirective,
} from '../../../../src/validators/custom-validators';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatIconButton,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    DoesContainOnlyDigitsAndUppercaseLettersDirective,
    DoesNotContainPolishLettersDirective,
    DoesNotContainSpecificLettersDirective,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss',
})
export class VehiclesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('registrationNumberInput') registrationNumberInput!: NgModel;
  @ViewChild('vehicleIdentificationNumberInput')
  vehicleIdentificationNumberInput!: NgModel;
  @ViewChild('clientEmailInput') clientEmailInput!: NgModel;
  @ViewChild('clientAddressInput') clientAddressInput!: NgModel;

  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = [
    'brandName',
    'registrationNumber',
    'vehicleIdentificationNumber',
    'clientEmail',
    'clientAddress',
    'actions',
  ];
  editedVehicle: VehicleDto | null = null;
  vehicleCopy: VehicleDto | null = null;
  dataSource = new MatTableDataSource<VehicleDto>([]);
  currentBrandPage = 1;
  pageSize = 10;
  pageBrandsSize = 10;
  totalRecords = 0;
  pageIndex = 0;
  activeSort = 'brandName';
  directionSort = Order.ASC;

  private scrollSubscription?: Subscription;

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((sort: Sort) => this.onSortChange(sort));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadVehicles()))
      .subscribe();
  }

  ngOnInit(): void {
    this.loadVehicleBrands();
    this.loadVehicles();
  }

  openCreateVehicleFormDialog(): void {
    const dialogRef = this.dialog.open(CreateVehicleFormComponent, {
      width: '800px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'vehicleCreated') {
        this.loadVehicles();
      }
    });
  }

  loadVehicleBrands(): void {
    this.vehiclesBrandService
      .getVehicleBrands({
        sortField: 'name',
        take: this.pageBrandsSize,
        page: this.currentBrandPage,
      })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.currentBrandPage++;
      });
  }

  loadVehicles(): void {
    this.vehiclesService
      .getVehicles({
        sortField: this.activeSort,
        take: this.pageSize,
        page: this.pageIndex + 1,
        order: this.directionSort,
      })
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.totalRecords = response.meta.itemCount;
        },
        error: () => {
          this.notificationService.showError(
            'Nie udało się załadować pojazdów. 😢'
          );
        },
      });
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cancelEditing();
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

  onSortChange(sort: Sort): void {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.activeSort = sort.active;
    this.directionSort = sort.direction.toUpperCase() as Order;
    this.cancelEditing();
  }

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    const isDropdownScrolledToBottom =
      dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 50;
    if (isDropdownScrolledToBottom) {
      this.loadVehicleBrands();
    }
  }

  editVehicle(vehicle: VehicleDto): void {
    this.editedVehicle = vehicle;
    this.vehicleCopy = { ...vehicle };
  }

  removeVehicle(vehicle: VehicleDto): void {
    this.vehiclesService.removeVehicle(vehicle.id).subscribe({
      next: () => {
        this.loadVehicles();
        this.notificationService.showSuccess('Pojazd został usunięty. 🚗');
      },
      error: (error) => {
        if (error.error.status === 404) {
          this.notificationService.showError(
            'Nie znaleziono takiego pojazdu.😥'
          );
          return;
        }
        this.notificationService.showError('Nie udało się usunąć pojazdu. 😢');
      },
    });
  }

  openDetails(id: number): void {
    this.router.navigate(['/vehicles', id]);
  }

  checkRegistrationNumberInput(): boolean {
    if (this.registrationNumberInput.errors) {
      if (
        this.registrationNumberInput.errors[
          'doesContainOnlyDigitsAndUppercaseLetters'
        ]
      ) {
        this.notificationService.showError(
          'Numer rejestracyjny musi składać się tylko z wielkich liter i cyfr. 😥'
        );
        return false;
      }
      if (this.registrationNumberInput.errors['required']) {
        this.notificationService.showError(
          'Numer rejestracyjny jest wymagany. 😥'
        );
        return false;
      }
      if (this.registrationNumberInput.errors['minlength']) {
        this.notificationService.showError(
          'Numer rejestracyjny musi mieć co najmniej 6 znaków. 😥'
        );
        return false;
      }
      if (this.registrationNumberInput.errors['maxlength']) {
        this.notificationService.showError(
          'Numer rejestracyjny może mieć maksymalnie 7 znaków. 😥'
        );
        return false;
      }
      if (
        this.registrationNumberInput.errors[
          'doesContainOnlyDigitsAndUppercaseLetters'
        ]
      ) {
        this.notificationService.showError(
          'Numer rejestracyjny może składać się tylko z wielkich liter i cyfr. 😥'
        );
        return false;
      }
      if (this.registrationNumberInput.errors['doesNotContainPolishLetters']) {
        this.notificationService.showError(
          'Numer rejestracyjny może składać się tylko z polskich znaków. 😥'
        );
        return false;
      }
      if (
        this.registrationNumberInput.errors['doesNotContainSpecificLetters']
      ) {
        this.notificationService.showError(
          'Numer nie może zawierać liter I, O, Q. 😥'
        );
        return false;
      }
    }
    return true;
  }

  checkVehicleIdentificationNumberInput(): boolean {
    if (this.vehicleIdentificationNumberInput.errors) {
      if (
        this.vehicleIdentificationNumberInput.errors[
          'doesContainOnlyDigitsAndUppercaseLetters'
        ]
      ) {
        this.notificationService.showError(
          'Numer VIN musi składać się tylko z wielkich liter i cyfr. 😥'
        );
        return false;
      }
      if (this.vehicleIdentificationNumberInput.errors['required']) {
        this.notificationService.showError('Numer VIN jest wymagany. 😥');
        return false;
      }
      if (this.vehicleIdentificationNumberInput.errors['minlength']) {
        this.notificationService.showError(
          'Numer VIN musi mieć dokładnie 17 znaków. 😥'
        );
        return false;
      }
      if (this.vehicleIdentificationNumberInput.errors['maxlength']) {
        this.notificationService.showError(
          'Numer VIN musi mieć dokładnie 17 znaków. 😥'
        );
        return false;
      }
      if (
        this.vehicleIdentificationNumberInput.errors[
          'doesNotContainPolishLetters'
        ]
      ) {
        this.notificationService.showError(
          'Numer VIN nie może zawierać polskich znaków. 😥'
        );
        return false;
      }
      if (
        this.vehicleIdentificationNumberInput.errors[
          'doesNotContainSpecificLetters'
        ]
      ) {
        this.notificationService.showError(
          'Numer VIN nie może zawierać liter I, O, Q. 😥'
        );
        return false;
      }
    }
    return true;
  }

  checkClientEmailInput(): boolean {
    if (this.clientEmailInput.errors) {
      if (this.clientEmailInput.errors['email']) {
        this.notificationService.showError(
          'Email klienta jest niepoprawny. 😥'
        );
        return false;
      }
    }
    return true;
  }

  checkClientAddressInput(): boolean {
    if (this.clientAddressInput.errors) {
      if (this.clientAddressInput.errors['maxlength']) {
        this.notificationService.showError(
          'Adres klienta może mieć maksymalnie 100 znaków. 😥'
        );
        return false;
      }
    }
    return true;
  }

  confirmEditing(): void {
    if (
      !this.checkRegistrationNumberInput() ||
      !this.checkVehicleIdentificationNumberInput() ||
      !this.checkClientEmailInput() ||
      !this.checkClientAddressInput()
    ) {
      return;
    }
    if (this.editedVehicle && this.vehicleCopy) {
      this.vehiclesService
        .updateVehicle(this.editedVehicle.id, this.vehicleCopy)
        .subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Pojazd został zaktualizowany. 🚗'
            );
            this.editedVehicle = null;
            this.vehicleCopy = null;
            this.loadVehicles();
          },
          error: (error) => {
            if (error.error.status === 404) {
              this.notificationService.showError(
                'Nie znaleziono takiego pojazdu. 😥'
              );
              return;
            }
            this.notificationService.showError(
              'Nie udało się zaktualizować pojazdu. 😢'
            );
          },
        });
    }
  }

  cancelEditing(): void {
    this.editedVehicle = null;
    this.vehicleCopy = null;
  }
}
