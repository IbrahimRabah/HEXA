"""Appointments + Reception + Nursing separation."""
import os

BASE = r"d:\HEXA\Hexa\src\app"

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {os.path.relpath(path, BASE)}")

# ──────────────────────────────────────────────
# APPOINTMENT LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\appointments\pages\appointment-list"
w(p + r"\appointment-list.component.html", """\
<app-page-header title="Appointments">
  <p-button label="New Appointment" icon="pi pi-plus" routerLink="new"></p-button>
</app-page-header>

<div class="card">
  <div class="filters-bar">
    <p-iconfield>
      <p-inputicon styleClass="pi pi-search"></p-inputicon>
      <input pInputText [(ngModel)]="searchTerm" placeholder="Search by patient or doctor..." (input)="applyFilter()" />
    </p-iconfield>
    <p-select [options]="statusOptions" [(ngModel)]="statusFilter" placeholder="All Statuses"
      (onChange)="applyFilter()" [showClear]="true" optionLabel="label" optionValue="value"></p-select>
    <p-select [options]="typeOptions" [(ngModel)]="typeFilter" placeholder="All Types"
      (onChange)="applyFilter()" [showClear]="true" optionLabel="label" optionValue="value"></p-select>
    <p-datepicker [(ngModel)]="dateFilter" [showIcon]="true" placeholder="Filter by date"
      (onSelect)="applyFilter()" [showClear]="true" dateFormat="dd/mm/yy"></p-datepicker>
  </div>

  <p-table [value]="filteredAppointments" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]"
    [loading]="loading" dataKey="id" [tableStyle]="{'min-width':'100%'}">
    <ng-template #header>
      <tr>
        <th pSortableColumn="appointmentDate">Date <p-sortIcon field="appointmentDate"></p-sortIcon></th>
        <th>Time</th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName"></p-sortIcon></th>
        <th pSortableColumn="specialtyName">Specialty <p-sortIcon field="specialtyName"></p-sortIcon></th>
        <th>Type</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:140px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-apt>
      <tr>
        <td><strong>{{ apt.appointmentDate | date:'dd MMM yyyy' }}</strong></td>
        <td>{{ apt.startTime }} – {{ apt.endTime }}</td>
        <td><div>{{ apt.patientName }}</div></td>
        <td>{{ apt.doctorName }}</td>
        <td>{{ apt.specialtyName }}</td>
        <td><span class="type-badge">{{ apt.type }}</span></td>
        <td><app-status-tag [status]="apt.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-check-circle" [text]="true" [rounded]="true" severity="success" size="small"
            (onClick)="checkIn(apt)" pTooltip="Check In"
            [disabled]="apt.status !== 'Confirmed' && apt.status !== 'Pending'"></p-button>
          <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" severity="secondary" size="small"
            (onClick)="editAppointment(apt)" pTooltip="Edit"></p-button>
          <p-button icon="pi pi-trash" [text]="true" [rounded]="true" severity="danger" size="small"
            (onClick)="confirmDelete(apt)" pTooltip="Cancel"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr>
        <td colspan="8" class="empty-state">
          <i class="pi pi-calendar" style="font-size:2rem"></i>
          <p>No appointments found.</p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\appointment-list.component.css", """\
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
.filters-bar { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.filters-bar input { width: 260px; }
.type-badge { background: var(--p-surface-100); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
""")

w(p + r"\appointment-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
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

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule, DatePipe, FormsModule, RouterModule, TableModule, ButtonModule, TooltipModule,
    SelectModule, DatePickerModule, IconFieldModule, InputIconModule,
    InputTextModule, ConfirmDialogModule, PageHeaderComponent, StatusTagComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
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
""")
print("appointment-list DONE")

# ──────────────────────────────────────────────
# APPOINTMENT FORM
# ──────────────────────────────────────────────
p = BASE + r"\features\appointments\pages\appointment-form"
w(p + r"\appointment-form.component.html", """\
<app-page-header [title]="isEdit ? 'Edit Appointment' : 'New Appointment'">
  <p-button label="Back" icon="pi pi-arrow-left" severity="secondary" routerLink="/appointments"></p-button>
</app-page-header>

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <p-card styleClass="mb-3">
    <div class="form-grid">
      <div class="field">
        <label>Patient <span class="required">*</span></label>
        <p-select formControlName="patientId" [options]="patientOptions" optionLabel="label" optionValue="value"
          placeholder="Select patient" [filter]="true" filterBy="label" (onChange)="onPatientChange($event)"></p-select>
        <small class="error" *ngIf="isInvalid('patientId')">Patient is required.</small>
      </div>
      <div class="field">
        <label>Doctor <span class="required">*</span></label>
        <p-select formControlName="doctorId" [options]="doctorOptions" optionLabel="label" optionValue="value"
          placeholder="Select doctor" [filter]="true" (onChange)="onDoctorChange($event)"></p-select>
        <small class="error" *ngIf="isInvalid('doctorId')">Doctor is required.</small>
      </div>
      <div class="field">
        <label>Date <span class="required">*</span></label>
        <p-datepicker formControlName="appointmentDate" [showIcon]="true" dateFormat="dd/mm/yy" [minDate]="today"></p-datepicker>
        <small class="error" *ngIf="isInvalid('appointmentDate')">Date is required.</small>
      </div>
      <div class="field">
        <label>Start Time <span class="required">*</span></label>
        <p-select formControlName="startTime" [options]="timeSlots" placeholder="Select time"></p-select>
        <small class="error" *ngIf="isInvalid('startTime')">Start time is required.</small>
      </div>
      <div class="field">
        <label>End Time</label>
        <p-select formControlName="endTime" [options]="timeSlots" placeholder="Select time"></p-select>
      </div>
      <div class="field">
        <label>Type <span class="required">*</span></label>
        <p-select formControlName="type" [options]="typeOptions" optionLabel="label" optionValue="value" placeholder="Select type"></p-select>
        <small class="error" *ngIf="isInvalid('type')">Type is required.</small>
      </div>
      <div class="field col-span-2">
        <label>Reason for Visit</label>
        <input pInputText formControlName="reason" placeholder="Brief reason for visit" />
      </div>
      <div class="field col-span-2">
        <label>Notes</label>
        <textarea pTextarea formControlName="notes" rows="3" placeholder="Additional notes..." style="width:100%"></textarea>
      </div>
    </div>
  </p-card>

  <div class="form-actions">
    <p-button label="Cancel" icon="pi pi-times" severity="secondary" type="button" routerLink="/appointments"></p-button>
    <p-button [label]="isEdit ? 'Update' : 'Schedule Appointment'" icon="pi pi-check" type="submit"
      [disabled]="form.invalid || saving" [loading]="saving"></p-button>
  </div>
</form>
""")

w(p + r"\appointment-form.component.css", """\
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.col-span-2 { grid-column: span 2; }
.required { color: #e53935; }
.error { color: #e53935; font-size: 0.8rem; }
.mb-3 { margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 0; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .col-span-2 { grid-column: span 1; } }
""")

w(p + r"\appointment-form.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DOCTORS_MOCK } from '../../../../mock-data/doctors.mock';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule,
    SelectModule, DatePickerModule, TextareaModule, ButtonModule, PageHeaderComponent
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  today = new Date();

  patientOptions: { label: string; value: string }[] = [];
  doctorOptions = DOCTORS_MOCK.map(d => ({ label: d.name, value: d.id, ...d }));
  typeOptions = [
    { label: 'New Visit', value: 'New' },
    { label: 'Follow-Up', value: 'FollowUp' },
    { label: 'Emergency', value: 'Emergency' }
  ];
  timeSlots = Array.from({ length: 26 }, (_, i) => {
    const h = Math.floor(i / 2) + 8;
    const m = i % 2 === 0 ? '00' : '30';
    return String(h).padStart(2, '0') + ':' + m;
  });

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);

  form = this.fb.group({
    patientId: ['', Validators.required],
    patientName: [''],
    doctorId: ['', Validators.required],
    doctorName: [''],
    specialtyId: [''],
    specialtyName: [''],
    appointmentDate: [null as Date | null, Validators.required],
    startTime: ['', Validators.required],
    endTime: [''],
    type: ['New', Validators.required],
    reason: [''],
    notes: ['']
  });

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      this.patientOptions = patients.map(p => ({ label: p.fullName, value: p.id }));
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.appointmentService.getAppointmentById(id).subscribe(apt => {
        if (apt) {
          this.form.patchValue({ ...apt, appointmentDate: new Date(apt.appointmentDate) });
        }
      });
    }
  }

  onPatientChange(event: any) {
    const patient = this.patientOptions.find(p => p.value === event.value);
    this.form.patchValue({ patientName: patient?.label || '' });
  }

  onDoctorChange(event: any) {
    const doctor = this.doctorOptions.find(d => d.value === event.value) as any;
    if (doctor) {
      this.form.patchValue({ doctorName: doctor.name, specialtyId: doctor.specialtyId, specialtyName: doctor.specialtyName });
    }
  }

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const val = this.form.value as any;
    const id = this.route.snapshot.paramMap.get('id');

    const action = id
      ? this.appointmentService.updateAppointment(id, val)
      : this.appointmentService.createAppointment(val);

    action.subscribe(() => {
      this.saving = false;
      this.toastService.showSuccess('Success', id ? 'Appointment updated.' : 'Appointment scheduled.');
      this.router.navigate(['/appointments']);
    });
  }
}
""")
print("appointment-form DONE")

# ──────────────────────────────────────────────
# RECEPTION QUEUE
# ──────────────────────────────────────────────
p = BASE + r"\features\reception\pages\reception-queue"
w(p + r"\reception-queue.component.html", """\
<app-page-header title="Reception &amp; Check-in">
  <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" (onClick)="load()"></p-button>
</app-page-header>

<div class="summary-bar">
  <div class="summary-item">
    <span class="count">{{ todayAppointments.length }}</span>
    <span class="label">Today's Appointments</span>
  </div>
  <div class="summary-item">
    <span class="count text-green">{{ checkedInCount }}</span>
    <span class="label">Checked In</span>
  </div>
  <div class="summary-item">
    <span class="count text-orange">{{ pendingCount }}</span>
    <span class="label">Waiting</span>
  </div>
</div>

<div class="card">
  <p-table [value]="todayAppointments" [paginator]="true" [rows]="15" [loading]="loading" dataKey="id">
    <ng-template #header>
      <tr>
        <th>Time</th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName"></p-sortIcon></th>
        <th>Specialty</th>
        <th>Type</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:160px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-apt>
      <tr>
        <td><strong>{{ apt.startTime }}</strong></td>
        <td><div class="patient-name">{{ apt.patientName }}</div></td>
        <td>{{ apt.doctorName }}</td>
        <td>{{ apt.specialtyName }}</td>
        <td><span class="type-tag">{{ apt.type }}</span></td>
        <td><app-status-tag [status]="apt.status"></app-status-tag></td>
        <td>
          @if (apt.status === 'Pending' || apt.status === 'Confirmed') {
            <p-button label="Check In" icon="pi pi-check" size="small" severity="success" (onClick)="checkIn(apt)"></p-button>
          }
          @if (apt.status === 'CheckedIn') {
            <p-button label="Open Visit" icon="pi pi-external-link" size="small" severity="info" (onClick)="openVisit(apt)"></p-button>
          }
          @if (apt.status === 'NoShow') {
            <span class="no-show">No Show</span>
          }
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr>
        <td colspan="7" class="empty-state">
          <i class="pi pi-calendar-times" style="font-size:2rem"></i>
          <p>No appointments for today.</p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\reception-queue.component.css", """\
.summary-bar { display: flex; gap: 1rem; margin-bottom: 1rem; }
.summary-item { flex: 1; background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; text-align: center; }
.count { display: block; font-size: 2rem; font-weight: 700; }
.label { font-size: 0.8rem; color: var(--p-text-muted-color); }
.text-green { color: #2E7D32; }
.text-orange { color: #E65100; }
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
.patient-name { font-weight: 600; }
.type-tag { background: var(--p-surface-100); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
.no-show { color: #999; font-size: 0.8rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
""")

w(p + r"\reception-queue.component.ts", """\
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
import { ToastService } from '../../../../core/services/toast.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../../shared/models/appointment.model';
import { AppointmentStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-reception-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, CardModule, TagModule, DialogModule, InputTextModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './reception-queue.component.html',
  styleUrls: ['./reception-queue.component.css']
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
      this.toastService.showSuccess('Checked In', apt.patientName + ' has been checked in. Queue token: A' + String(this.checkedInCount).padStart(3, '0'));
    });
  }

  openVisit(apt: Appointment) {
    this.toastService.showInfo('Visit Opened', 'Visit opened for ' + apt.patientName + '. Transferred to nursing queue.');
    this.appointmentService.updateStatus(apt.id, AppointmentStatus.Completed).subscribe(() => {
      apt.status = AppointmentStatus.Completed;
    });
  }
}
""")
print("reception-queue DONE")

# ──────────────────────────────────────────────
# NURSING QUEUE
# ──────────────────────────────────────────────
p = BASE + r"\features\nursing\pages\nursing-queue"
w(p + r"\nursing-queue.component.html", """\
<app-page-header title="Nursing Queue">
  <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" (onClick)="load()"></p-button>
</app-page-header>

<div class="summary-bar">
  <div class="summary-item"><span class="count">{{ assessments.length }}</span><span class="label">In Queue</span></div>
  <div class="summary-item"><span class="count text-orange">{{ waitingCount }}</span><span class="label">Waiting</span></div>
  <div class="summary-item"><span class="count text-blue">{{ assessingCount }}</span><span class="label">Under Assessment</span></div>
  <div class="summary-item"><span class="count text-green">{{ readyCount }}</span><span class="label">Ready for Doctor</span></div>
</div>

<div class="card">
  <p-table [value]="assessments" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th>Date/Time</th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th>Nurse</th>
        <th>Vitals</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:140px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-a>
      <tr>
        <td>{{ a.assessmentDate | date:'HH:mm' }}</td>
        <td><strong>{{ a.patientName }}</strong></td>
        <td>{{ a.nurseName || '—' }}</td>
        <td>
          @if (a.vitalSigns) {
            <span class="vitals-summary">
              BP {{ a.vitalSigns.bloodPressureSystolic }}/{{ a.vitalSigns.bloodPressureDiastolic }} &bull;
              T {{ a.vitalSigns.temperature }}°C &bull;
              HR {{ a.vitalSigns.pulse }} &bull;
              SpO₂ {{ a.vitalSigns.spO2 }}%
            </span>
          } @else {
            <span class="text-muted">No vitals recorded</span>
          }
        </td>
        <td><app-status-tag [status]="a.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-heart" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="Record Vitals" (onClick)="recordVitals(a)"></p-button>
          <p-button icon="pi pi-send" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Mark Ready for Doctor" (onClick)="markReady(a)"
            [disabled]="a.status === 'ReadyForDoctor' || a.status === 'Completed'"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr>
        <td colspan="6" class="empty-state">
          <i class="pi pi-heart" style="font-size:2rem"></i>
          <p>No patients in nursing queue.</p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\nursing-queue.component.css", """\
.summary-bar { display: flex; gap: 1rem; margin-bottom: 1rem; }
.summary-item { flex: 1; background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; text-align: center; }
.count { display: block; font-size: 2rem; font-weight: 700; }
.label { font-size: 0.8rem; color: var(--p-text-muted-color); }
.text-orange { color: #E65100; }
.text-blue { color: #1565C0; }
.text-green { color: #2E7D32; }
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
.vitals-summary { font-size: 0.8rem; }
.text-muted { color: var(--p-text-muted-color); font-size: 0.8rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
""")

w(p + r"\nursing-queue.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { NursingService } from '../../services/nursing.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NursingAssessment } from '../../../../shared/models/nursing.model';

@Component({
  selector: 'app-nursing-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, TooltipModule, CardModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './nursing-queue.component.html',
  styleUrls: ['./nursing-queue.component.css']
})
export class NursingQueueComponent implements OnInit {
  assessments: NursingAssessment[] = [];
  loading = false;

  get waitingCount() { return this.assessments.filter(a => a.status === 'Waiting').length; }
  get assessingCount() { return this.assessments.filter(a => a.status === 'UnderAssessment').length; }
  get readyCount() { return this.assessments.filter(a => a.status === 'ReadyForDoctor').length; }

  private nursingService = inject(NursingService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.nursingService.getNursingAssessments().subscribe(data => {
      this.assessments = data;
      this.loading = false;
    });
  }

  recordVitals(a: NursingAssessment) {
    this.router.navigate(['/nursing/vitals', a.visitId]);
  }

  markReady(a: NursingAssessment) {
    this.nursingService.updateStatus(a.id, 'ReadyForDoctor').subscribe(() => {
      a.status = 'ReadyForDoctor';
      this.toastService.showSuccess('Updated', a.patientName + ' is ready for the doctor.');
    });
  }
}
""")
print("nursing-queue DONE")

# ──────────────────────────────────────────────
# VITALS FORM
# ──────────────────────────────────────────────
p = BASE + r"\features\nursing\pages\vitals-form"
w(p + r"\vitals-form.component.html", """\
<app-page-header [title]="'Record Vitals — ' + visitId">
  <p-button label="Back to Queue" icon="pi pi-arrow-left" severity="secondary" (onClick)="cancel()"></p-button>
</app-page-header>

<div class="form-wrapper">
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="section-card">
      <h3 class="section-title">Vital Signs</h3>
      <div class="form-grid">
        <div class="form-field">
          <label>Systolic BP (mmHg)</label>
          <input pInputText formControlName="bloodPressureSystolic" type="number" placeholder="120" />
        </div>
        <div class="form-field">
          <label>Diastolic BP (mmHg)</label>
          <input pInputText formControlName="bloodPressureDiastolic" type="number" placeholder="80" />
        </div>
        <div class="form-field">
          <label>Temperature (°C)</label>
          <input pInputText formControlName="temperature" type="number" step="0.1" placeholder="36.6" />
        </div>
        <div class="form-field">
          <label>Pulse (bpm)</label>
          <input pInputText formControlName="pulse" type="number" placeholder="75" />
        </div>
        <div class="form-field">
          <label>SpO₂ (%)</label>
          <input pInputText formControlName="spO2" type="number" placeholder="98" />
        </div>
        <div class="form-field">
          <label>Respiratory Rate (/min)</label>
          <input pInputText formControlName="respiratoryRate" type="number" placeholder="16" />
        </div>
        <div class="form-field">
          <label>Weight (kg)</label>
          <input pInputText formControlName="weight" type="number" step="0.1" placeholder="70" (input)="calcBmi()" />
        </div>
        <div class="form-field">
          <label>Height (cm)</label>
          <input pInputText formControlName="height" type="number" placeholder="170" (input)="calcBmi()" />
        </div>
        <div class="form-field">
          <label>BMI</label>
          <input pInputText formControlName="bmi" type="number" readonly placeholder="Auto-calculated" />
        </div>
        <div class="form-field full-width">
          <label>Pain Scale: {{ form.get('painScale')?.value }} / 10</label>
          <p-slider formControlName="painScale" [min]="0" [max]="10" [step]="1"></p-slider>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h3 class="section-title">Assessment</h3>
      <div class="form-grid">
        <div class="form-field full-width">
          <label>Nursing Notes</label>
          <textarea pTextarea formControlName="nursingNotes" rows="4" placeholder="Enter nursing observations..."></textarea>
        </div>
        <div class="form-field">
          <label>Status</label>
          <p-select formControlName="status" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status"></p-select>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <p-button label="Cancel" severity="secondary" (onClick)="cancel()"></p-button>
      <p-button label="Save Vitals" icon="pi pi-save" type="submit" [disabled]="form.invalid"></p-button>
    </div>
  </form>
</div>
""")

w(p + r"\vitals-form.component.css", """\
.form-wrapper { max-width: 860px; }
.section-card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
.section-title { margin: 0 0 1rem; font-size: 1rem; font-weight: 600; color: var(--p-text-color); border-bottom: 1px solid var(--p-content-border-color); padding-bottom: 0.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
.form-field.full-width { grid-column: 1 / -1; }
label { font-size: 0.85rem; font-weight: 500; color: var(--p-text-muted-color); }
input, textarea { width: 100%; }
.form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 0; }
""")

w(p + r"\vitals-form.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { TextareaModule } from 'primeng/textarea';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NursingService } from '../../services/nursing.service';
import { ToastService } from '../../../../core/services/toast.service';

const STATUS_OPTIONS = [
  { label: 'Waiting', value: 'Waiting' },
  { label: 'Under Assessment', value: 'UnderAssessment' },
  { label: 'Ready for Doctor', value: 'ReadyForDoctor' },
];

@Component({
  selector: 'app-vitals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, CardModule, SliderModule, TextareaModule, PageHeaderComponent],
  templateUrl: './vitals-form.component.html',
  styleUrls: ['./vitals-form.component.css']
})
export class VitalsFormComponent implements OnInit {
  visitId = '';
  statusOptions = STATUS_OPTIONS;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private nursingService = inject(NursingService);
  private toastService = inject(ToastService);

  form: FormGroup = this.fb.group({
    bloodPressureSystolic: [null, Validators.required],
    bloodPressureDiastolic: [null, Validators.required],
    temperature: [null, Validators.required],
    pulse: [null, Validators.required],
    spO2: [null, Validators.required],
    respiratoryRate: [null],
    weight: [null, Validators.required],
    height: [null, Validators.required],
    bmi: [{ value: null, disabled: true }],
    painScale: [0],
    nursingNotes: [''],
    status: ['ReadyForDoctor', Validators.required],
  });

  ngOnInit() {
    this.visitId = this.route.snapshot.params['visitId'];
    this.nursingService.getAssessmentByVisitId(this.visitId).subscribe(a => {
      if (a?.vitalSigns) {
        this.form.patchValue({ ...a.vitalSigns, nursingNotes: a.nursingNotes, status: (a as any).status });
      }
    });
  }

  calcBmi() {
    const w = this.form.get('weight')?.value;
    const h = this.form.get('height')?.value;
    if (w && h) {
      const bmi = +(w / ((h / 100) ** 2)).toFixed(1);
      this.form.get('bmi')?.setValue(bmi);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const vitals = {
      bloodPressureSystolic: v.bloodPressureSystolic,
      bloodPressureDiastolic: v.bloodPressureDiastolic,
      temperature: v.temperature,
      pulse: v.pulse,
      spO2: v.spO2,
      respiratoryRate: v.respiratoryRate,
      weight: v.weight,
      height: v.height,
      bmi: v.bmi,
      painScale: v.painScale,
    };
    this.nursingService.saveVitals(this.visitId, vitals, v.nursingNotes, v.status).subscribe(() => {
      this.toastService.showSuccess('Saved', 'Vital signs recorded successfully.');
      this.router.navigate(['/nursing']);
    });
  }

  cancel() { this.router.navigate(['/nursing']); }
}
""")
print("vitals-form DONE")
