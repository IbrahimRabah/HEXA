import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
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
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, CardModule, SliderModule, PageHeaderComponent],
  templateUrl: './vitals-form.component.html',
  styleUrl: './vitals-form.component.css'
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
