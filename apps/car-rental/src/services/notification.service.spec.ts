import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NoopAnimationsModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('showSuccess', () => {
    it('should open a success snack bar with default parameters', () => {
      const spy = jest.spyOn(snackBar, 'open');
      service.showSuccess('Success message');

      expect(spy).toHaveBeenCalledWith('Success message', 'Zamknij', {
        duration: 3000,
        panelClass: ['snack-bar-success'],
      });
    });

    it('should open a success snack bar with custom parameters', () => {
      const spy = jest.spyOn(snackBar, 'open');
      service.showSuccess('Success message', 'Close', 5000);

      expect(spy).toHaveBeenCalledWith('Success message', 'Close', {
        duration: 5000,
        panelClass: ['snack-bar-success'],
      });
    });
  });

  describe('showError', () => {
    it('should open an error snack bar with default parameters', () => {
      const spy = jest.spyOn(snackBar, 'open');
      service.showError('Error message');

      expect(spy).toHaveBeenCalledWith('Error message', 'Zamknij', {
        duration: 3000,
        panelClass: ['snack-bar-error'],
      });
    });

    it('should open an error snack bar with custom parameters', () => {
      const spy = jest.spyOn(snackBar, 'open');
      service.showError('Error message', 'Close', 5000);

      expect(spy).toHaveBeenCalledWith('Error message', 'Close', {
        duration: 5000,
        panelClass: ['snack-bar-error'],
      });
    });
  });
});
