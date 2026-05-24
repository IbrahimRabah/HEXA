import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dental',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './dental.component.html',
  styleUrl: './dental.component.css'
})
export class DentalComponent {}
