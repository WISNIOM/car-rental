import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehiclesListComponent } from "../components/vehicles/vehicles-list/vehicles-list.component";

@Component({
  imports: [RouterModule, VehiclesListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'car-rental';
}
