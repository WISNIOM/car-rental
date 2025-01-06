import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConfirmVehicleRemovalComponent } from './confirm-vehicle-removal.component';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehiclesService } from '../../../services/vehicles.service';
import { NotificationService } from '../../../../src/services/notification.service';
import { of, throwError } from 'rxjs';
import { VehicleDto } from '../../../dtos/vehicle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmVehicleRemovalComponent', () => {
  let component: ConfirmVehicleRemovalComponent;
  let fixture: ComponentFixture<ConfirmVehicleRemovalComponent>;
  let vehiclesService: jest.Mocked<VehiclesService>;
  let notificationService: jest.Mocked<NotificationService>;
  let dialogRef: jest.Mocked<MatDialogRef<ConfirmVehicleRemovalComponent>>;

  beforeEach(async () => {
    const vehiclesServiceMock = {
      removeVehicle: jest.fn(),
    };
    const notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };
    const dialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        ConfirmVehicleRemovalComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, registrationNumber: 'ABC123' } as VehicleDto,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmVehicleRemovalComponent);
    component = fixture.componentInstance;
    vehiclesService = TestBed.inject(
      VehiclesService
    ) as jest.Mocked<VehiclesService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jest.Mocked<NotificationService>;
    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<
      MatDialogRef<ConfirmVehicleRemovalComponent>
    >;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Potwierdź usunięcie pojazdu'
    );
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Czy na pewno chcesz usunąć pojazd o numerze rejestracyjnym: ABC123?'
    );
  });

  it('should call onCancel when the cancel button is clicked', () => {
    jest.spyOn(component, 'onCancel');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button#cancel'
    );
    button.click();
    expect(component.onCancel).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call onConfirm when the confirm button is clicked', () => {
    jest.spyOn(component, 'onConfirm');
    vehiclesService.removeVehicle.mockReturnValue(of(void 0));
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button#confirm');
    button.click();
    expect(component.onConfirm).toHaveBeenCalled();
    expect(vehiclesService.removeVehicle).toHaveBeenCalledWith(1);
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Pojazd został usunięty. 🚗'
    );
    expect(dialogRef.close).toHaveBeenCalledWith('vehicleRemoved');
  });

  it('should handle error when vehicle removal fails', () => {
    jest.spyOn(component, 'onConfirm');
    vehiclesService.removeVehicle.mockReturnValue(
      throwError(() => ({ error: { status: 404 } }))
    );
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button#confirm');
    button.click();
    expect(component.onConfirm).toHaveBeenCalled();
    expect(vehiclesService.removeVehicle).toHaveBeenCalledWith(1);
    expect(notificationService.showError).toHaveBeenCalledWith(
      'Nie znaleziono takiego pojazdu.😥'
    );
    expect(dialogRef.close).not.toHaveBeenCalledWith('vehicleRemoved');
  });
});
