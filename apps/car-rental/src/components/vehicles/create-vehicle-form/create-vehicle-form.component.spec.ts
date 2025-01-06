import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateVehicleFormComponent } from './create-vehicle-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { NotificationService } from '../../../../src/services/notification.service';
import { of, throwError } from 'rxjs';
import { VehicleBrandDto } from '../../../dtos/vehicle-brand';
import { VehicleDto } from '../../../dtos/vehicle';
import { Page } from '../../../dtos/page';
import { MatSelect } from '@angular/material/select';

describe('CreateVehicleFormComponent', () => {
  let component: CreateVehicleFormComponent;
  let fixture: ComponentFixture<CreateVehicleFormComponent>;
  let vehicleBrandsService: jest.Mocked<VehicleBrandsService>;
  let vehiclesService: jest.Mocked<VehiclesService>;
  let notificationService: jest.Mocked<NotificationService>;
  let dialogRef: jest.Mocked<MatDialogRef<CreateVehicleFormComponent>>;

  beforeEach(async () => {
    const vehicleBrandsServiceMock = {
      getVehicleBrands: jest.fn().mockReturnValue(
        of({
          data: [],
          meta: { itemCount: 0 },
        } as unknown as Page<VehicleBrandDto>)
      ),
    };
    const vehiclesServiceMock = {
      createVehicle: jest.fn().mockReturnValue(of({} as VehicleDto)),
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
        CreateVehicleFormComponent, // Import the standalone component
      ],
      providers: [
        { provide: VehicleBrandsService, useValue: vehicleBrandsServiceMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVehicleFormComponent);
    component = fixture.componentInstance;
    vehicleBrandsService = TestBed.inject(
      VehicleBrandsService
    ) as jest.Mocked<VehicleBrandsService>;
    vehiclesService = TestBed.inject(
      VehiclesService
    ) as jest.Mocked<VehiclesService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jest.Mocked<NotificationService>;
    dialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<
      MatDialogRef<CreateVehicleFormComponent>
    >;
    fixture.detectChanges();

    // Initialize the brandDropdown element
    component.brandDropdown = {
      panel: {
        nativeElement: document.createElement('div'),
      },
    } as MatSelect;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Dodaj pojazd');
    expect(
      compiled.querySelector('button[type="submit"]')?.textContent
    ).toContain('DODAJ');
  });

  it('should call onSubmit when the form is submitted', () => {
    jest.spyOn(component, 'onSubmit');
    vehiclesService.createVehicle.mockReturnValue(of({} as VehicleDto));
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
    expect(vehiclesService.createVehicle).toHaveBeenCalledWith(
      component.vehicleForm.value
    );
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Dodano pojazd.🥳'
    );
    expect(dialogRef.close).toHaveBeenCalledWith('vehicleCreated');
  });

  it('should handle error when vehicle creation fails', () => {
    jest.spyOn(component, 'onSubmit');
    vehiclesService.createVehicle.mockReturnValue(
      throwError(() => ({ error: { status: 409 } }))
    );
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
    expect(vehiclesService.createVehicle).toHaveBeenCalledWith(
      component.vehicleForm.value
    );
    expect(notificationService.showError).toHaveBeenCalledWith(
      'Pojazd o podanym numerze rejestracyjnym lub numerze VIN już istnieje.😥'
    );
    expect(dialogRef.close).not.toHaveBeenCalledWith('vehicleCreated');
  });

  it('should load vehicle brands on init', () => {
    const vehicleBrands: VehicleBrandDto[] = [
      { name: 'Toyota' } as VehicleBrandDto,
      { name: 'Honda' } as VehicleBrandDto,
    ];
    vehicleBrandsService.getVehicleBrands.mockReturnValue(
      of({
        data: vehicleBrands,
        meta: { itemCount: 2 },
      } as Page<VehicleBrandDto>)
    );
    component.ngOnInit();
    expect(vehicleBrandsService.getVehicleBrands).toHaveBeenCalled();
    expect(component.vehicleBrands).toEqual(vehicleBrands);
  });

  it('should call onDropdownOpened when the dropdown is opened', () => {
    jest.spyOn(component, 'onDropdownOpened');
    fixture.detectChanges();
    const dropdown = fixture.nativeElement.querySelector('mat-select');
    dropdown.dispatchEvent(new Event('openedChange'));
    expect(component.onDropdownOpened).toHaveBeenCalled();
  });

  it('should call loadVehicleBrands on scroll', () => {
    jest.spyOn(component, 'loadVehicleBrands');
    component.vehicleBrandsCurrentPage = 1;
    component.vehicleBrands = [{ name: 'Toyota' } as VehicleBrandDto];
    fixture.detectChanges();
    component.onScroll();
    expect(component.loadVehicleBrands).toHaveBeenCalled();
  });
});
