import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-ophthalmology',
  standalone: true,
  imports: [ComingSoonComponent],
  templateUrl: './ophthalmology.component.html',
  styleUrl: './ophthalmology.component.css'
})
export class OphthalmologyComponent {}
