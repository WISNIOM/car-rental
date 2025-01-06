import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VehicleComponent } from './vehicle.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../../../src/services/vehicles.service';
import { NotificationService } from '../../../../src/services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { VehicleDto } from '../../../../src/dtos/vehicle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmVehicleRemovalComponent } from '../confirm-vehicle-removal/confirm-vehicle-removal.component';
import { EditVehicleFormComponent } from '../edit-vehicle-form/edit-vehicle-form.component';

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;
  let vehiclesService: jest.Mocked<VehiclesService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const vehiclesServiceMock = {
      getVehicleById: jest.fn(),
    };
    const notificationServiceMock = {
      showError: jest.fn(),
    };
    const dialogMock = {
      open: jest.fn(),
    };
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatDividerModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule,
        VehicleComponent,
      ],
      providers: [
        { provide: VehiclesService, useValue: vehiclesServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    vehiclesService = TestBed.inject(
      VehiclesService
    ) as jest.Mocked<VehiclesService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct content when vehicle data is loaded', () => {
    const vehicle: VehicleDto = {
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
    } as VehicleDto;
    vehiclesService.getVehicleById.mockReturnValue(of(vehicle));
    fixture.detectChanges();
    expect(component.vehicle).toEqual(vehicle);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Dane pojazdu');
    expect(compiled.querySelector('p')?.textContent).toContain('Toyota');
  });

  it('should navigate back to the vehicles list when the back button is clicked', () => {
    jest.spyOn(component, 'goBackToTheVehiclesList');
    const vehicle: VehicleDto = {
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
    } as VehicleDto;
    vehiclesService.getVehicleById.mockReturnValue(of(vehicle));
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector(
      'button[matTooltip="Wróć do listy"]'
    );
    backButton.click();
    expect(component.goBackToTheVehiclesList).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
  });

  it('should open the edit vehicle form dialog and handle the result', () => {
    const vehicle: VehicleDto = {
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
    } as VehicleDto;
    const dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of('vehicleEdited')),
    };
    const openDialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefMock as any);
    vehiclesService.getVehicleById.mockReturnValue(of(vehicle));
    fixture.detectChanges();
    const editButton = fixture.nativeElement.querySelector(
      'button[matTooltip="Edytuj pojazd"]'
    );
    editButton.click();
    fixture.detectChanges();
    expect(openDialogSpy).toHaveBeenCalledWith(EditVehicleFormComponent, {
      width: '800px',
      height: '600px',
      data: vehicle,
    });
    expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    expect(vehiclesService.getVehicleById).toHaveBeenCalledWith(1);
  });

  it('should open the confirm vehicle removal dialog and handle the result', () => {
    const vehicle: VehicleDto = {
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
    } as VehicleDto;
    const dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of('vehicleRemoved')),
    };
    const openDialogSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRefMock as any);
    vehiclesService.getVehicleById.mockReturnValue(of(vehicle));
    fixture.detectChanges();
    const deleteButton = fixture.nativeElement.querySelector(
      'button[matTooltip="Usuń pojazd"]'
    );
    deleteButton.click();
    fixture.detectChanges();
    expect(openDialogSpy).toHaveBeenCalledWith(ConfirmVehicleRemovalComponent, {
      width: '400px',
      height: '200px',
      data: vehicle,
    });
    expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
  });
});
