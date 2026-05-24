import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

const REPORTS = [
  { icon: 'pi pi-users', title: 'Patient Statistics', description: 'New patients, demographics, registration trends', category: 'REPORTS.CATEGORY_CLINICAL' },
  { icon: 'pi pi-calendar', title: 'Appointment Report', description: 'Appointments by status, doctor, and specialty', category: 'REPORTS.CATEGORY_CLINICAL' },
  { icon: 'pi pi-heart', title: 'Nursing Activity', description: 'Vitals recorded, assessments, patient throughput', category: 'REPORTS.CATEGORY_CLINICAL' },
  { icon: 'pi pi-inbox', title: 'Laboratory Report', description: 'Test volumes, TAT, pending results', category: 'REPORTS.CATEGORY_CLINICAL' },
  { icon: 'pi pi-bolt', title: 'Radiology Report', description: 'Imaging volumes, modalities, turnaround', category: 'REPORTS.CATEGORY_CLINICAL' },
  { icon: 'pi pi-dollar', title: 'Revenue Report', description: 'Revenue by period, service, payer', category: 'REPORTS.CATEGORY_FINANCIAL' },
  { icon: 'pi pi-receipt', title: 'Invoice Summary', description: 'Outstanding balances, collection rates', category: 'REPORTS.CATEGORY_FINANCIAL' },
  { icon: 'pi pi-building', title: 'Room Occupancy', description: 'Bed utilization, ward capacity, turnover', category: 'REPORTS.CATEGORY_OPERATIONS' },
  { icon: 'pi pi-wrench', title: 'Maintenance Report', description: 'Open tickets, resolution times, costs', category: 'REPORTS.CATEGORY_OPERATIONS' },
  { icon: 'pi pi-shield', title: 'Audit Report', description: 'User activity, security events', category: 'REPORTS.CATEGORY_ADMINISTRATION' },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TranslatePipe, PageHeaderComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reports = REPORTS;
  categories = [...new Set(REPORTS.map(r => r.category))];
  getByCategory(cat: string) { return this.reports.filter(r => r.category === cat); }
}
