import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmVehicleRemovalComponent } from './confirm-vehicle-removal.component';

describe('ConfirmVehicleRemovalComponent', () => {
  let component: ConfirmVehicleRemovalComponent;
  let fixture: ComponentFixture<ConfirmVehicleRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmVehicleRemovalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmVehicleRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
