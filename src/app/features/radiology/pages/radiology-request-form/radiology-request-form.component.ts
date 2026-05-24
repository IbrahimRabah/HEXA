import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';
import { RadiologyRequestStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-radiology-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './radiology-request-form.component.html',
  styleUrl: './radiology-request-form.component.css',
})
export class RadiologyRequestFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly priorities = [
    { label: 'STAT — Immediate', value: 'STAT' },
    { label: 'Urgent — Within 4h', value: 'Urgent' },
    { label: 'Routine — Standard', value: 'Routine' },
  ];

  readonly imagingTypes = [
    'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography',
    'OCT', 'Fundus Photography', 'PET Scan', 'Fluoroscopy', 'DEXA Scan',
  ].map(t => ({ label: t, value: t }));

  readonly commonBodyParts = [
    'Chest', 'Abdomen', 'Pelvis', 'Head', 'Brain', 'Spine',
    'Lumbar', 'Cervical', 'Thoracic', 'Knee', 'Hip', 'Shoulder',
    'Wrist', 'Ankle', 'Hand', 'Foot', 'Neck', 'Whole Body',
  ].map(p => ({ label: p, value: p }));

  form = this.fb.group({
    patientName: ['', Validators.required],
    patientId: [''],
    doctorName: ['', Validators.required],
    imagingType: ['', Validators.required],
    bodyPart: ['', Validators.required],
    priority: ['Routine', Validators.required],
    clinicalIndication: ['', Validators.required],
    icdCode: [''],
    contrastRequired: [false],
    previousImagingAvailable: [false],
    specialInstructions: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const record = {
      id: `rad-${Date.now()}`,
      patientName: v.patientName,
      patientId: v.patientId,
      doctorName: v.doctorName,
      imagingType: v.imagingType,
      bodyPart: v.bodyPart,
      priority: v.priority,
      clinicalIndication: v.clinicalIndication,
      icdCode: v.icdCode,
      contrastRequired: v.contrastRequired,
      previousImagingAvailable: v.previousImagingAvailable,
      specialInstructions: v.specialInstructions,
      status: RadiologyRequestStatus.Pending,
      requestDate: new Date(),
      createdAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Request Submitted', `Radiology request for ${record.patientName} submitted successfully.`);
    this.form.reset({ priority: 'Routine', contrastRequired: false, previousImagingAvailable: false });
    this.close();
  }
}
