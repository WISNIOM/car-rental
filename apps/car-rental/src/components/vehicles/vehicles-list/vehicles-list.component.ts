import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesService } from '../../../services/vehicles.service';
import { VehicleBrandsService } from '../../../services/vehicle-brands.service';
import { VehicleDto } from '../../../../src/dto/vehicle';
import { VehicleBrandDto } from '../../../../src/dto/vehicle-brand';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltip,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent implements OnInit {
  vehicles: VehicleDto[] = [];
  vehicleBrands: VehicleBrandDto[] = [];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesBrandService: VehicleBrandsService
  ) {}

  ngOnInit(): void {
    this.vehiclesService.getVehicles().subscribe((response) => {
      this.vehicles = response.data;
    });
    this.vehiclesBrandService.getVehicleBrands().subscribe((response) => {
      this.vehicleBrands = response.data;
    });
  }

  openDialog(): void {
    this.dialog.open(CreateVehicleDialogComponent, {
      width: '250px',
    });
  }
}

@Component({
  selector: 'app-create-vehicle-dialog',
  template: ` <h2 mat-dialog-title>Delete file</h2>
    <mat-dialog-content>
      Would you like to delete cat.jpeg?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      <button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
    </mat-dialog-actions>`,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class CreateVehicleDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateVehicleDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
