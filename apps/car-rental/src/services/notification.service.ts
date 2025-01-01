import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(
    message: string,
    action = 'Zamknij',
    duration = 3000
  ) {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snack-bar-success'],
    });
  }

  showError(
    message: string,
    action = 'Zamknij',
    duration = 3000
  ) {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snack-bar-error'],
    });
  }
}
