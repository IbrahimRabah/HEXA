import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-dental',
  standalone: true,
  imports: [ComingSoonComponent],
  templateUrl: './dental.component.html',
  styleUrl: './dental.component.css'
})
export class DentalComponent {}
