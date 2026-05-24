import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [TagModule],
  templateUrl: './status-tag.component.html',
  styleUrl: './status-tag.component.css'
})
export class StatusTagComponent {
  status = input.required<string>();

  getSeverity() {
    const s = this.status().toLowerCase();
    if (['active', 'completed', 'success', 'paid'].includes(s)) return 'success';
    if (['pending', 'waiting', 'in progress'].includes(s)) return 'warn';
    if (['cancelled', 'error', 'failed', 'critical'].includes(s)) return 'danger';
    if (['scheduled', 'info'].includes(s)) return 'info';
    return 'secondary';
  }
}
