import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

const REPORTS = [
  { icon: 'pi pi-users', title: 'Patient Statistics', description: 'New patients, demographics, registration trends', category: 'Clinical' },
  { icon: 'pi pi-calendar', title: 'Appointment Report', description: 'Appointments by status, doctor, and specialty', category: 'Clinical' },
  { icon: 'pi pi-heart', title: 'Nursing Activity', description: 'Vitals recorded, assessments, patient throughput', category: 'Clinical' },
  { icon: 'pi pi-inbox', title: 'Laboratory Report', description: 'Test volumes, TAT, pending results', category: 'Clinical' },
  { icon: 'pi pi-bolt', title: 'Radiology Report', description: 'Imaging volumes, modalities, turnaround', category: 'Clinical' },
  { icon: 'pi pi-dollar', title: 'Revenue Report', description: 'Revenue by period, service, payer', category: 'Financial' },
  { icon: 'pi pi-receipt', title: 'Invoice Summary', description: 'Outstanding balances, collection rates', category: 'Financial' },
  { icon: 'pi pi-building', title: 'Room Occupancy', description: 'Bed utilization, ward capacity, turnover', category: 'Operations' },
  { icon: 'pi pi-wrench', title: 'Maintenance Report', description: 'Open tickets, resolution times, costs', category: 'Operations' },
  { icon: 'pi pi-shield', title: 'Audit Report', description: 'User activity, security events', category: 'Administration' },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, PageHeaderComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reports = REPORTS;
  categories = [...new Set(REPORTS.map(r => r.category))];
  getByCategory(cat: string) { return this.reports.filter(r => r.category === cat); }
}
