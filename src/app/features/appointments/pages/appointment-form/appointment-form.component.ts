import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule,
    SelectModule, DatePickerModule, TextareaModule, ButtonModule, PageHeaderComponent, TranslatePipe],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
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
    return `${String(h).padStart(2, '0')}:${m}`;
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
