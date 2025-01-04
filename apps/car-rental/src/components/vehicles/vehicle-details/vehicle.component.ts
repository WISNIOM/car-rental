import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  imports: [CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {

  constructor(private readonly route: ActivatedRoute) {
    console.log(this.route.snapshot.paramMap.get('id'));
  }
}
