import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.css',
})
export class AdmissionFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly admissionTypes = [
    { label: 'Emergency', value: 'Emergency' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Elective', value: 'Elective' },
    { label: 'Referral', value: 'Referral' },
  ];

  readonly genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  readonly wards = [
    'Surgical Ward', 'Medical Ward', 'ICU', 'Pediatric Ward',
    'Maternity Ward', 'Orthopedic Ward', 'Cardiology Ward',
    'Neurology Ward', 'Oncology Ward', 'Emergency Department',
  ].map(w => ({ label: w, value: w }));

  readonly today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    patientName: ['', Validators.required],
    patientId: [''],
    gender: [''],
    dateOfBirth: [''],
    doctorName: ['', Validators.required],
    diagnosis: ['', Validators.required],
    admissionType: ['Emergency', Validators.required],
    wardName: ['', Validators.required],
    roomNumber: ['', Validators.required],
    admissionDate: [this.today, Validators.required],
    expectedDischarge: [''],
    insuranceProvider: [''],
    policyNumber: [''],
    notes: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const record = {
      id: `adm-${Date.now()}`,
      admissionNumber: `ADM-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      patientName: v.patientName,
      patientId: v.patientId,
      gender: v.gender,
      dateOfBirth: v.dateOfBirth ? new Date(v.dateOfBirth) : null,
      admittingDoctorName: v.doctorName,
      diagnosis: v.diagnosis,
      admissionType: v.admissionType,
      wardName: v.wardName,
      roomNumber: v.roomNumber,
      admissionDate: new Date(v.admissionDate!),
      expectedDischarge: v.expectedDischarge ? new Date(v.expectedDischarge) : null,
      insuranceProvider: v.insuranceProvider,
      policyNumber: v.policyNumber,
      notes: v.notes,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Patient Admitted', `${record.admissionNumber} — ${record.patientName} admitted successfully.`);
    this.form.reset({ admissionType: 'Emergency', admissionDate: this.today });
    this.close();
  }
}
