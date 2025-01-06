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
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { Order } from '../../../../src/enums/order';
import { ConfirmVehicleRemovalComponent } from '../confirm-vehicle-removal/confirm-vehicle-removal.component';
import { EditVehicleFormComponent } from '../edit-vehicle-form/edit-vehicle-form.component';

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

  openConfirmRemoveVehicleDialog(vehicle: VehicleDto): void {
    const dialogRef = this.dialog.open(ConfirmVehicleRemovalComponent, {
      width: '400px',
      height: '200px',
      data: vehicle,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'vehicleRemoved') {
        this.loadVehicles();
      }
    });
  }

  openEditVehicleFormDialog(vehicle: VehicleDto): void {
      const dialogRef = this.dialog.open(EditVehicleFormComponent, {
        width: '800px',
        height: '600px',
        data: vehicle,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'vehicleEdited') {
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
  }

  onScroll(): void {
    const dropdown = this.brandDropdown.panel.nativeElement;
    const isDropdownScrolledToBottom =
      dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 50;
    if (isDropdownScrolledToBottom) {
      this.loadVehicleBrands();
    }
  }

  openDetails(id: number): void {
    this.router.navigate(['/vehicles', id]);
  }
}
