import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-medication-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule, TranslatePipe],
  templateUrl: './medication-form.component.html',
  styleUrl: './medication-form.component.css',
})
export class MedicationFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  readonly categories = [
    'Antibiotic', 'Analgesic', 'Antiviral', 'Antihistamine',
    'Anticoagulant', 'Antidiabetic', 'Antihypertensive', 'Antifungal',
    'Cardiovascular', 'Respiratory', 'Gastrointestinal',
    'Hormonal', 'Vitamin & Supplement', 'Neurological', 'Other',
  ].map(c => ({ label: c, value: c }));

  readonly dosageForms = [
    'Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection',
    'Cream', 'Ointment', 'Eye Drops', 'Ear Drops',
    'Inhaler', 'Suppository', 'Patch', 'Powder', 'Solution',
  ].map(f => ({ label: f, value: f }));

  form = this.fb.group({
    name: ['', Validators.required],
    genericName: ['', Validators.required],
    category: ['', Validators.required],
    form: ['', Validators.required],
    strength: ['', Validators.required],
    manufacturer: [''],
    barcode: [''],
    shelfLocation: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    minStock: [100, Validators.min(0)],
    notes: [''],
  });

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const med = {
      id: `med-${Date.now()}`,
      name: v.name,
      genericName: v.genericName,
      category: v.category,
      form: v.form,
      strength: v.strength,
      manufacturer: v.manufacturer,
      barcode: v.barcode,
      shelfLocation: v.shelfLocation,
      price: v.price,
      stock: v.stock,
      minStock: v.minStock,
      notes: v.notes,
      createdAt: new Date(),
    };
    this.saved.emit(med);
    this.toastService.showSuccess('Medication Added', `${med.name} has been added to inventory.`);
    this.form.reset({ price: 0, stock: 0, minStock: 100 });
    this.close();
  }
}
