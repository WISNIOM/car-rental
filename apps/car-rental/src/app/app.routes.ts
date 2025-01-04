import { Route } from '@angular/router';
import { VehiclesListComponent } from '../components/vehicles/vehicles-list/vehicles-list.component';
import { PageNotFoundComponent } from '../components/common/page-not-found.component';
import { VehicleComponent } from '../components/vehicles/vehicle-details/vehicle.component';

export const appRoutes: Route[] = [
  { path: 'vehicles-list', component: VehiclesListComponent },
  {path: 'vehicles/:id', component: VehicleComponent },
  { path: '', redirectTo: '/vehicles-list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
