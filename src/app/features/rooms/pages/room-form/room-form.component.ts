import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';
import { RoomStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css',
})
export class RoomFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly wards = [
    'Surgical Ward', 'Medical Ward', 'ICU', 'Pediatric Ward',
    'Maternity Ward', 'Orthopedic Ward', 'Cardiology Ward',
    'Neurology Ward', 'Oncology Ward', 'Emergency Department',
  ].map(w => ({ label: w, value: w }));

  readonly roomTypes = [
    'Single', 'Double', 'Triple', 'Suite', 'ICU',
    'HDU', 'NICU', 'Emergency Bay', 'Operating Room',
  ].map(t => ({ label: t, value: t }));

  form = this.fb.group({
    roomNumber: ['', Validators.required],
    floor: ['', Validators.required],
    wing: [''],
    wardName: ['', Validators.required],
    type: ['', Validators.required],
    capacity: [1, [Validators.required, Validators.min(1)]],
    dailyRate: [0, [Validators.required, Validators.min(0)]],
    telephoneExt: [''],
    hasPrivateBathroom: [false],
    hasTv: [false],
    hasAc: [true],
    hasRefrigerator: [false],
    hasWifi: [false],
    hasRecliner: [false],
    notes: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const record = {
      id: `room-${Date.now()}`,
      roomNumber: v.roomNumber,
      floor: v.floor,
      wing: v.wing,
      wardName: v.wardName,
      type: v.type,
      capacity: v.capacity,
      currentOccupancy: 0,
      dailyRate: v.dailyRate,
      telephoneExt: v.telephoneExt,
      status: RoomStatus.Available,
      amenities: {
        privateBathroom: v.hasPrivateBathroom,
        tv: v.hasTv,
        ac: v.hasAc,
        refrigerator: v.hasRefrigerator,
        wifi: v.hasWifi,
        recliner: v.hasRecliner,
      },
      notes: v.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Room Added', `Room ${record.roomNumber} (${record.wardName}) added successfully.`);
    this.form.reset({ capacity: 1, dailyRate: 0, hasAc: true });
    this.close();
  }
}
