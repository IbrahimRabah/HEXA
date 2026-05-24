import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css'],
})
export class ComingSoonComponent {
  /** Display name of the upcoming module / feature */
  @Input() title = 'Module';

  /** Short description of what is being built */
  @Input() description = 'This module is currently under active development and will be available soon.';

  /** PrimeIcons class for the feature icon (e.g. "pi pi-heart") */
  @Input() icon = 'pi pi-clock';

  /** Optional list of bullet points describing planned features */
  @Input() features: string[] = [];

  /** Optional target quarter / date string shown as a badge */
  @Input() eta = '';

  private router = inject(Router);

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
