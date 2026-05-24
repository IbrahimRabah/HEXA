import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { AppointmentService } from '../../services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Appointment } from '../../../../shared/models/appointment.model';
import { AppointmentStatus } from '../../../../shared/enums/status.enums';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterModule, TableModule, ButtonModule, TooltipModule,
    SelectModule, DatePickerModule, IconFieldModule, InputIconModule,
    InputTextModule, ConfirmDialogModule, PageHeaderComponent, StatusTagComponent, TranslatePipe],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  typeFilter = '';
  dateFilter: Date | null = null;

  statusOptions = Object.values(AppointmentStatus).map(v => ({ label: v, value: v }));
  typeOptions = [
    { label: 'New', value: 'New' },
    { label: 'Follow-Up', value: 'FollowUp' },
    { label: 'Emergency', value: 'Emergency' }
  ];

  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
      this.filteredAppointments = data;
      this.loading = false;
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    const dateStr = this.dateFilter ? new Date(this.dateFilter).toDateString() : null;
    this.filteredAppointments = this.appointments.filter(a => {
      const matchSearch = !term || a.patientName.toLowerCase().includes(term) || a.doctorName.toLowerCase().includes(term);
      const matchStatus = !this.statusFilter || a.status === this.statusFilter;
      const matchType = !this.typeFilter || a.type === this.typeFilter;
      const matchDate = !dateStr || new Date(a.appointmentDate).toDateString() === dateStr;
      return matchSearch && matchStatus && matchType && matchDate;
    });
  }

  checkIn(apt: Appointment) {
    this.appointmentService.updateStatus(apt.id, AppointmentStatus.CheckedIn).subscribe(() => {
      apt.status = AppointmentStatus.CheckedIn;
      this.toastService.showSuccess('Checked In', `${apt.patientName} has been checked in.`);
    });
  }

  editAppointment(apt: Appointment) {
    this.router.navigate(['/appointments', apt.id, 'edit']);
  }

  confirmDelete(apt: Appointment) {
    this.confirmationService.confirm({
      message: `Cancel appointment for <strong>${apt.patientName}</strong>?`,
      header: 'Cancel Appointment',
      icon: 'pi pi-calendar-times',
      acceptLabel: 'Yes, Cancel',
      accept: () => {
        this.appointmentService.updateStatus(apt.id, AppointmentStatus.Cancelled).subscribe(() => {
          apt.status = AppointmentStatus.Cancelled;
          this.toastService.showWarn('Cancelled', 'Appointment has been cancelled.');
        });
      }
    });
  }
}

