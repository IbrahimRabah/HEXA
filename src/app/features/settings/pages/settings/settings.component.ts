import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../../core/services/toast.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, SelectModule, TabsModule, TranslatePipe, PageHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private toastService = inject(ToastService);

  settings = {
    hospitalName: 'Hexa Care Medical Center',
    licenseNumber: 'HC-2024-001',
    phone: '+1 (555) 000-0000',
    email: 'admin@hexacare.com',
    address: '123 Medical Boulevard, Healthcare City',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
  };

  currencies = [{ label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'SAR (﷼)', value: 'SAR' }];
  dateFormats = [{ label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' }, { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }, { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }];

  save() { this.toastService.showSuccess('Saved', 'Settings updated successfully.'); }
}
