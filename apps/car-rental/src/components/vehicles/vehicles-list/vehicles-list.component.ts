import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { merge, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { Order } from '../../../../src/enums/order';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatIconButton,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss',
})
export class VehiclesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  @ViewChild(MatSort) sort!: MatSort;
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

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog
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
  }

  onDropdownOpened(isOpened: boolean): void {
    if (isOpened) {
      this.brandDropdown.panel.nativeElement.addEventListener(
        'scroll',
        this.onScroll.bind(this)
      );
    }
  }

  onSortChange(sort: Sort): void {
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.activeSort = sort.active;
    this.directionSort = sort.direction.toUpperCase() as Order;
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

  confirmEditing(): void {
    // if (this.editedVehicle && this.vehicleCopy) {
    //   this.vehiclesService
    //     .updateVehicle(this.editedVehicle.id, this.vehicleCopy)
    //     .subscribe({
    //       next: () => {
    //         this.notificationService.showSuccess('Pojazd został zaktualizowany. 🚗');
    //         this.loadVehicles();
    //         this.editedVehicle = null;
    //         this.vehicleCopy = null;
    //       },
    //       error: (error) => {
    //         if (error.error.status === 404) {
    //           this.notificationService.showError(
    //             'Nie znaleziono takiego pojazdu. 😥'
    //           );
    //           return;
    //         }
    //         this.notificationService.showError(
    //           'Nie udało się zaktualizować pojazdu. 😢'
    //         );
    //       },
    //     });
    console.log('Confirm editing:', this.vehicleCopy);
    this.editedVehicle = null;
    this.vehicleCopy = null;
    this.notificationService.showSuccess('Pojazd został zaktualizowany. 🚗');
  }

  cancelEditing(): void {
    this.editedVehicle = null;
    this.vehicleCopy = null;
  }
}
