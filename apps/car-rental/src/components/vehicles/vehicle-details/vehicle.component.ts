import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehicleDto } from '../../../../src/dtos/vehicle';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmVehicleRemovalComponent } from '../confirm-vehicle-removal/confirm-vehicle-removal.component';
import { EditVehicleFormComponent } from '../edit-vehicle-form/edit-vehicle-form.component';

@Component({
  selector: 'app-vehicle',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatIconButton,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent implements OnInit {
  vehicleId: number;
  vehicle: VehicleDto | undefined;
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vehiclesService: VehiclesService,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadVehicle();
  }

  loadVehicle(): void {
    this.isLoading = true;
    this.vehiclesService
      .getVehicleById(this.vehicleId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (vehicle) => {
          this.vehicle = vehicle;
        },
        error: () => {
          this.notificationService.showError(
            `Nie udało się załadować pojazdu o id ${this.vehicleId}. 😢`
          );
        },
      });
  }

  goBackToTheVehiclesList(): void {
    this.router.navigate(['/vehicles']);
  }

  openConfirmVehicleRemovalDialog(): void {
    const dialogRef = this.dialog.open(ConfirmVehicleRemovalComponent, {
      width: '400px',
      height: '200px',
      data: this.vehicle,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'vehicleRemoved') {
        this.goBackToTheVehiclesList();
      }
    });
  }

  openEditVehicleFormDialog(): void {
    const dialogRef = this.dialog.open(EditVehicleFormComponent, {
      width: '800px',
      height: '600px',
      data: this.vehicle,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'vehicleEdited') {
        this.loadVehicle();
      }
    });
  }
}
