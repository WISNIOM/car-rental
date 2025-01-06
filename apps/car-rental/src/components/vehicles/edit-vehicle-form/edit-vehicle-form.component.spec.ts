import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditVehicleFormComponent } from './edit-vehicle-form.component';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { NotificationService } from '../../../../src/services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { VehicleDto } from '../../../dtos/vehicle';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { Page } from '../../../dtos/page';

describe('EditVehicleFormComponent', () => {
  let component: EditVehicleFormComponent;
  let fixture: ComponentFixture<EditVehicleFormComponent>;
  let vehiclesService: jest.Mocked<VehiclesService>;
  let vehicleBrandsService: jest.Mocked<VehicleBrandsService>;
  let notificationService: jest.Mocked<NotificationService>;
  let dialogRef: jest.Mocked<MatDialogRef<EditVehicleFormComponent>>;

  beforeEach(async () => {
    const vehiclesServiceMock = {
      updateVehicle: jest.fn(),
    };
    const vehicleBrandsServiceMock = {
      getVehicleBrands: jest.fn().mockReturnValue(
        of({
          data: [
            { name: 'Toyota' } as VehicleBrandDto,
            { name: 'Honda' } as VehicleBrandDto,
          ],
          meta: { itemCount: 2 },
        } as Page<VehicleBrandDto>)
      ),
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
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        EditVehicleFormComponent,
      ],
      providers: [
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: VehicleBrandsService, useValue: vehicleBrandsServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            brand: 'Toyota',
            registrationNumber: 'ABC123',
            vehicleIdentificationNumber: '1FAFP34N55W122943',
            clientEmail: 'client@example.com',
            clientAddress: {
              country: 'Poland',
              administrativeArea: 'Mazowieckie',
              city: 'Warsaw',
              postalCode: '00-001',
              street: 'Main Street',
            },
          } as VehicleDto,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditVehicleFormComponent);
    component = fixture.componentInstance;
    vehiclesService = TestBed.inject(
      VehiclesService
    ) as jest.Mocked<VehiclesService>;
    vehicleBrandsService = TestBed.inject(
      VehicleBrandsService
    ) as jest.Mocked<VehicleBrandsService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jest.Mocked<NotificationService>;
    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<
      MatDialogRef<EditVehicleFormComponent>
    >;

    // Initialize the brandDropdown property
    component.brandDropdown = {
      panel: {
        nativeElement: document.createElement('div'),
      },
    } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct content when vehicle data is loaded', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Edytuj pojazd'
    );
    const registrationNumberInput = compiled.querySelector(
      'input[formControlName="registrationNumber"]'
    ) as HTMLInputElement;
    expect(registrationNumberInput.value).toBe('ABC123');
  });

  it('should handle loading state correctly', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
    component.isLoading = false;
    fixture.detectChanges();
    expect(compiled.querySelector('mat-spinner')).toBeFalsy();
  });

  it('should call onSubmit when the form is submitted', () => {
    vehiclesService.updateVehicle.mockReturnValue(of({} as VehicleDto));
    fixture.detectChanges();
    component.onSubmit()
    expect(vehiclesService.updateVehicle).toHaveBeenCalledWith(
      1,
      component.vehicleForm.value
    );
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Pojazd został zaktualizowany. 🚗'
    );
    expect(dialogRef.close).toHaveBeenCalledWith('vehicleEdited');
  });

  it('should handle error when vehicle creation fails', () => {
    vehiclesService.updateVehicle.mockReturnValue(
      throwError(() => ({ error: { status: 404 } }))
    );
    component.onSubmit();
    fixture.detectChanges();
    expect(vehiclesService.updateVehicle).toHaveBeenCalledWith(
      1,
      component.vehicleForm.value
    );
    expect(notificationService.showError).toHaveBeenCalledWith(
      'Nie znaleziono takiego pojazdu. 😥'
    );
    expect(dialogRef.close).not.toHaveBeenCalledWith('vehicleUpdated');
  });

  it('should call onCancel when the cancel button is clicked', () => {
    jest.spyOn(component, 'onCancel');
    fixture.detectChanges();
    const cancelButton = fixture.nativeElement.querySelector(
      'button[mat-flat-button]'
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(component.onCancel).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should load vehicle brands on init', () => {
    component.ngOnInit();
    expect(vehicleBrandsService.getVehicleBrands).toHaveBeenCalled();
    expect(component.vehicleBrands).toEqual([
      { name: 'Honda' } as VehicleBrandDto,
      { name: 'Toyota' } as VehicleBrandDto,
    ]);
  });

  it('should ensure selected brand is visible', () => {
    component.vehicleBrands = [
      { name: 'Toyota' } as VehicleBrandDto,
      { name: 'Honda' } as VehicleBrandDto,
    ];
    component.vehicle.brand = 'Opel';
    component.ensureSelectedBrandIsVisible();
    expect(component.vehicleBrands).toEqual([
      { name: 'Toyota' } as VehicleBrandDto,
      { name: 'Honda' } as VehicleBrandDto,
      { name: 'Opel' } as VehicleBrandDto,
    ]);
    expect(component.vehicleForm.get('brand')?.value).toBe('Opel');
  });

});
