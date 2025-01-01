import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateVehicleFormComponent } from '../create-vehicle-form/create-vehicle-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '../../../../src/services/notification.service';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatIconButton,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.scss',
})
export class VehiclesListComponent implements OnInit, AfterViewInit {
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = [
    'brand',
    'registrationNumber',
    'vehicleIdentificationNumber',
    'clientEmail',
    'clientAddress',
    'actions',
  ];
  editedVehicle: VehicleDto | null = null;
  dataSource = new MatTableDataSource<VehicleDto>(this.vehicles);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('brandDropdown') brandDropdown!: MatSelect;
  currentPage = 1;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly vehiclesBrandService: VehicleBrandsService,
    private readonly vehiclesService: VehiclesService,
    private readonly notificationService: NotificationService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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
      .getVehicleBrands({ sortField: 'name', take: 10, page: this.currentPage })
      .subscribe((response) => {
        this.vehicleBrands = [...this.vehicleBrands, ...response.data];
        this.currentPage++;
      });
  }

  onDropdownOpened(isOpened: boolean): void {
    if (isOpened) {
      this.brandDropdown.panel.nativeElement.addEventListener(
        'scroll',
        this.onScroll.bind(this)
      );
    }
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

  cancelEditing(): void {
    this.editedVehicle = null;
  }

  loadVehicles(): void {
    this.vehiclesService.getVehicles().subscribe((response) => {
      this.vehicles = [...response.data];
      this.dataSource.data = this.vehicles;
    });
  }
}
