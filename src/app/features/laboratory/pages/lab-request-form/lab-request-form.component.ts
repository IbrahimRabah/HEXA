import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastService } from '../../../../core/services/toast.service';
import { LabRequestStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-lab-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule, TranslatePipe],
  templateUrl: './lab-request-form.component.html',
  styleUrl: './lab-request-form.component.css',
})
export class LabRequestFormComponent {
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

  readonly sampleTypes = [
    'Whole Blood', 'Serum', 'Plasma', 'Urine', 'Stool',
    'Swab', 'CSF', 'Sputum', 'Biopsy', 'Other',
  ].map(s => ({ label: s, value: s }));

  readonly testCategories = [
    'Hematology', 'Biochemistry', 'Microbiology', 'Serology',
    'Immunology', 'Coagulation', 'Urinalysis', 'Hormones',
    'Tumor Markers', 'Genetics', 'Other',
  ].map(c => ({ label: c, value: c }));

  form = this.fb.group({
    patientName: ['', Validators.required],
    patientId: [''],
    doctorName: ['', Validators.required],
    priority: ['Routine', Validators.required],
    sampleType: ['', Validators.required],
    clinicalNotes: [''],
    icdCode: [''],
    tests: this.fb.array([this.newTest()]),
  });

  get testsArray() { return this.form.get('tests') as FormArray; }

  newTest() {
    return this.fb.group({
      testName: ['', Validators.required],
      testCode: [''],
      category: [''],
    });
  }

  addTest() { this.testsArray.push(this.newTest()); }
  removeTest(i: number) { if (this.testsArray.length > 1) this.testsArray.removeAt(i); }

  close() { this.visibleChange.emit(false); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const primaryTest = (v.tests as any[])[0];
    const record = {
      id: `lab-${Date.now()}`,
      patientName: v.patientName,
      patientId: v.patientId,
      doctorName: v.doctorName,
      priority: v.priority,
      sampleType: v.sampleType,
      testName: primaryTest?.testName,
      testCode: primaryTest?.testCode,
      tests: v.tests,
      clinicalNotes: v.clinicalNotes,
      icdCode: v.icdCode,
      status: LabRequestStatus.Pending,
      requestDate: new Date(),
      createdAt: new Date(),
    };
    this.saved.emit(record);
    this.toastService.showSuccess('Request Submitted', `Lab request for ${record.patientName} created successfully.`);
    while (this.testsArray.length > 1) this.testsArray.removeAt(1);
    this.form.reset({ priority: 'Routine' });
    this.testsArray.at(0).reset();
    this.close();
  }
}
