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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Gender } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule,
    SelectModule, DatePickerModule, TextareaModule, ButtonModule, AutoCompleteModule,
    DividerModule, PageHeaderComponent],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit {
  isEdit = false;
  saving = false;
  today = new Date();

  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female },
    { label: 'Other', value: Gender.Other }
  ];

  bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: [null as Date | null, Validators.required],
    gender: ['', Validators.required],
    nationality: [''],
    nationalId: [''],
    bloodType: [''],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    address: [''],
    emergencyContactName: [''],
    emergencyContactPhone: [''],
    insuranceProvider: [''],
    insuranceNumber: [''],
    allergies: [[] as string[]],
    chronicDiseases: [[] as string[]],
    fixedMedications: [[] as string[]],
    notes: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.patientService.getPatientById(id).subscribe(patient => {
        if (patient) {
          this.form.patchValue({
            ...patient,
            dateOfBirth: new Date(patient.dateOfBirth)
          });
        }
      });
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
      ? this.patientService.updatePatient(id, val)
      : this.patientService.createPatient(val);

    action.subscribe(() => {
      this.saving = false;
      this.toastService.showSuccess('Success', id ? 'Patient updated successfully.' : 'Patient created successfully.');
      this.router.navigate(['/patients']);
    });
  }
}
