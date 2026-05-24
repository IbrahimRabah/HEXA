import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { ReceptionService } from '../../services/reception.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../../shared/models/appointment.model';
import { AppointmentStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-reception-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, CardModule, TagModule, DialogModule, InputTextModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './reception-queue.component.html',
  styleUrl: './reception-queue.component.css'
})
export class ReceptionQueueComponent implements OnInit {
  todayAppointments: Appointment[] = [];
  loading = false;

  get checkedInCount() { return this.todayAppointments.filter(a => a.status === AppointmentStatus.CheckedIn).length; }
  get pendingCount() { return this.todayAppointments.filter(a => a.status === AppointmentStatus.Pending || a.status === AppointmentStatus.Confirmed).length; }

  private appointmentService = inject(AppointmentService);
  private toastService = inject(ToastService);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.appointmentService.getTodayAppointments().subscribe(data => {
      this.todayAppointments = data;
      this.loading = false;
    });
  }

  checkIn(apt: Appointment) {
    this.appointmentService.updateStatus(apt.id, AppointmentStatus.CheckedIn).subscribe(() => {
      apt.status = AppointmentStatus.CheckedIn;
      this.toastService.showSuccess('Checked In', `${apt.patientName} has been checked in. Queue token: A${String(this.checkedInCount).padStart(3,'0')}`);
    });
  }

  openVisit(apt: Appointment) {
    this.toastService.showInfo('Visit Opened', `Visit opened for ${apt.patientName}. Transferred to nursing queue.`);
    this.appointmentService.updateStatus(apt.id, AppointmentStatus.Completed).subscribe(() => {
      apt.status = AppointmentStatus.Completed;
    });
  }
}

