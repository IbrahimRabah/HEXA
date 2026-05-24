import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';
import { OperationStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-operation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './operation-form.component.html',
  styleUrl: './operation-form.component.css',
})
export class OperationFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly priorities = [
    { label: 'Elective', value: 'Elective' },
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Emergency', value: 'Emergency' },
  ];

  readonly operationRooms = [
    'OR 1', 'OR 2', 'OR 3', 'OR 4', 'OR 5',
    'Minor OR', 'Endoscopy Suite', 'Catheterization Lab',
  ].map(r => ({ label: r, value: r }));

  readonly anesthesiaTypes = [
    'General', 'Local', 'Regional', 'Epidural', 'Spinal', 'Sedation / MAC',
  ].map(a => ({ label: a, value: a }));

  readonly today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    patientName: ['', Validators.required],
    patientId: [''],
    surgeonName: ['', Validators.required],
    anesthesiologist: [''],
    procedureName: ['', Validators.required],
    diagnosis: ['', Validators.required],
    operationRoom: ['', Validators.required],
    anesthesiaType: ['General', Validators.required],
    priority: ['Elective', Validators.required],
    scheduledDate: [this.today, Validators.required],
    scheduledTime: ['08:00', Validators.required],
    estimatedDuration: [60, [Validators.required, Validators.min(5)]],
    notes: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const record = {
      id: `op-${Date.now()}`,
      patientName: v.patientName,
      patientId: v.patientId,
      procedureName: v.procedureName,
      diagnosisDescription: v.diagnosis,
      surgeonName: v.surgeonName,
      anesthesiologist: v.anesthesiologist,
      anesthesiaType: v.anesthesiaType,
      operationRoomName: v.operationRoom,
      scheduledDate: new Date(v.scheduledDate!),
      scheduledTime: v.scheduledTime,
      estimatedDuration: v.estimatedDuration,
      priority: v.priority,
      notes: v.notes,
      status: OperationStatus.Scheduled,
      assistants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Operation Scheduled', `${record.procedureName} for ${record.patientName} has been scheduled.`);
    this.form.reset({
      anesthesiaType: 'General', priority: 'Elective',
      scheduledDate: this.today, scheduledTime: '08:00', estimatedDuration: 60,
    });
    this.close();
  }
}
