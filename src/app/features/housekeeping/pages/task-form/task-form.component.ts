import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly taskTypes = [
    'Cleaning', 'Sanitizing', 'Terminal Cleaning', 'Deep Cleaning',
    'Linen Change', 'Waste Disposal', 'Bathroom Cleaning',
    'Window Cleaning', 'Corridor Cleaning', 'Maintenance Check',
  ].map(t => ({ label: t, value: t }));

  readonly priorities = [
    { label: 'High', value: 'High' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Low', value: 'Low' },
  ];

  readonly today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    roomNumber: ['', Validators.required],
    floorWing: [''],
    assignedTo: ['', Validators.required],
    taskType: ['Cleaning', Validators.required],
    priority: ['Normal', Validators.required],
    scheduledDate: [this.today, Validators.required],
    scheduledTime: [''],
    estimatedDuration: [30],
    notes: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const record = {
      id: `hk-${Date.now()}`,
      roomNumber: v.roomNumber,
      floorWing: v.floorWing,
      taskType: v.taskType,
      assignedTo: v.assignedTo,
      priority: v.priority,
      scheduledDate: new Date(v.scheduledDate!),
      scheduledTime: v.scheduledTime,
      estimatedDuration: v.estimatedDuration,
      notes: v.notes,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Task Created', `${record.taskType} task for Room ${record.roomNumber} assigned to ${record.assignedTo}.`);
    this.form.reset({ taskType: 'Cleaning', priority: 'Normal', scheduledDate: this.today, estimatedDuration: 30 });
    this.close();
  }
}
