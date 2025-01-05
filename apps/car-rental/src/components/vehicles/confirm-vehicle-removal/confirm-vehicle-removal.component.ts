import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { VehicleDto } from '../../../dtos/vehicle';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehiclesService } from '../../../services/vehicles.service';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-vehicle-removal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './confirm-vehicle-removal.component.html',
  styleUrl: './confirm-vehicle-removal.component.scss',
})
export class ConfirmVehicleRemovalComponent {
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmVehicleRemovalComponent>,
    @Inject(MAT_DIALOG_DATA) public vehicle: VehicleDto,
    private readonly vehiclesService: VehiclesService,
    private readonly notificationService: NotificationService
  ) {}

  onConfirm(): void {
    this.isLoading = true;
    this.vehiclesService
      .removeVehicle(this.vehicle.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Pojazd został usunięty. 🚗');
          this.dialogRef.close('vehicleRemoved');
        },
        error: (error) => {
          if (error.error.status === 404) {
            this.notificationService.showError(
              'Nie znaleziono takiego pojazdu.😥'
            );
            return;
          }
          this.notificationService.showError(
            'Nie udało się usunąć pojazdu. 😢'
          );
          this.dialogRef.close();
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
