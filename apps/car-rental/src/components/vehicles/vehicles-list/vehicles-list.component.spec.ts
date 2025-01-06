import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VehiclesListComponent } from './vehicles-list.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VehicleDto } from '../../../../src/dtos/vehicle';
import { NotificationService } from '../../../../src/services/notification.service';
import { VehicleBrandsService } from '../../../../src/services/vehicle-brands.service';
import { VehiclesService } from '../../../services/vehicles.service';
import { Page } from '../../../../src/dtos/page';
import { VehicleBrandDto } from '../../../../src/dtos/vehicle-brand';
import { appRoutes } from '../../../../src/app/app.routes';

describe('VehiclesListComponent', () => {
  let component: VehiclesListComponent;
  let fixture: ComponentFixture<VehiclesListComponent>;
  let vehiclesService: jest.Mocked<VehiclesService>;
  let vehicleBrandsService: jest.Mocked<VehicleBrandsService>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    const vehiclesServiceMock = {
      getVehicles: jest.fn(),
    };
    const vehicleBrandsServiceMock = {
      getVehicleBrands: jest.fn(),
    };
    const notificationServiceMock = {
      showError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        FormsModule,
        MatSelectModule,
        MatIconModule,
        MatPaginatorModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSortModule,
        BrowserAnimationsModule,
        VehiclesListComponent, // Import the standalone component
      ],
      providers: [
        provideRouter(appRoutes),
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: VehicleBrandsService, useValue: vehicleBrandsServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatSort, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclesListComponent);
    component = fixture.componentInstance;
    vehiclesService = TestBed.inject(VehiclesService) as jest.Mocked<VehiclesService>;
    vehicleBrandsService = TestBed.inject(VehicleBrandsService) as jest.Mocked<VehicleBrandsService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;

    vehiclesService.getVehicles.mockReturnValue(of({ data: [], meta: { itemCount: 0 } } as unknown as Page<VehicleDto>));
    vehicleBrandsService.getVehicleBrands.mockReturnValue(of({ data: [], meta: { itemCount: 0 } } as unknown as Page<VehicleBrandDto>));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicle brands on init', () => {
    component.ngOnInit();
    expect(vehicleBrandsService.getVehicleBrands).toHaveBeenCalled();
  });

  it('should load vehicles on init', () => {
    component.ngOnInit();
    expect(vehiclesService.getVehicles).toHaveBeenCalled();
  });

  it('should render the table with the correct columns', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compiled.querySelectorAll('th'));
    expect(headers.length).toBe(component.displayedColumns.length);
    expect(headers[0].textContent).toContain('Marka');
    expect(headers[1].textContent).toContain('Numer Rejestracyjny');
    expect(headers[2].textContent).toContain('Numer VIN');
    expect(headers[3].textContent).toContain('Email Klienta');
    expect(headers[4].textContent).toContain('Adres Klienta');
    expect(headers[5].textContent).toContain('Akcje');
  });

  it('should call openCreateVehicleFormDialog when add button is clicked', () => {
    jest.spyOn(component, 'openCreateVehicleFormDialog');
    const button = fixture.nativeElement.querySelector('button[matTooltip="Dodaj pojazd"]');
    button.click();
    expect(component.openCreateVehicleFormDialog).toHaveBeenCalled();
  });

  it('should call openConfirmRemoveVehicleDialog when add button is clicked', () => {
    const dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of('vehicleRemoved')),
    };
    const openDialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefMock as any);
    component.dataSource.data = [
      {
        brand: 'Toyota',
        registrationNumber: 'ABC123',
        vehicleIdentificationNumber: '1HGCM82633A123456',
        clientEmail: 'client@example.com',
        clientAddress: {
          city: 'City',
          street: 'Street',
          administrativeArea: 'Area',
          country: 'Country',
          postalCode: '12345',
        },
      } as VehicleDto,
    ];
    fixture.detectChanges();
    component.openConfirmRemoveVehicleDialog(component.dataSource.data[0]);
    fixture.detectChanges();
    expect(openDialogSpy).toHaveBeenCalled();
  });

  it('should call openEditVehicleFormDialog when add button is clicked', () => {
    const dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of('vehicleEdited')),
    };
    const openDialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefMock as any);
    component.dataSource.data = [
      {
        brand: 'Toyota',
        registrationNumber: 'ABC123',
        vehicleIdentificationNumber: '1HGCM82633A123456',
        clientEmail: 'client@example.com',
        clientAddress: {
          city: 'City',
          street: 'Street',
          administrativeArea: 'Area',
          country: 'Country',
          postalCode: '12345',
        },
      } as VehicleDto,
    ];
    fixture.detectChanges();
    component.openEditVehicleFormDialog(component.dataSource.data[0]);
    fixture.detectChanges();
    expect(openDialogSpy).toHaveBeenCalled();
  });
});
