"""All remaining component separations."""
import os

BASE = r"d:\HEXA\Hexa\src\app"

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {os.path.relpath(path, BASE)}")

# ──────────────────────────────────────────────
# PATIENT FORM
# ──────────────────────────────────────────────
p = BASE + r"\features\patients\pages\patient-form"
w(p + r"\patient-form.component.html", """\
<app-page-header [title]="isEdit ? 'Edit Patient' : 'New Patient'">
  <p-button label="Cancel" icon="pi pi-times" severity="secondary" routerLink="/patients"></p-button>
</app-page-header>

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <p-card header="Personal Information" styleClass="mb-3">
    <div class="form-grid">
      <div class="field">
        <label>First Name <span class="required">*</span></label>
        <input pInputText formControlName="firstName" placeholder="First name" />
        <small class="error" *ngIf="isInvalid('firstName')">First name is required.</small>
      </div>
      <div class="field">
        <label>Last Name <span class="required">*</span></label>
        <input pInputText formControlName="lastName" placeholder="Last name" />
        <small class="error" *ngIf="isInvalid('lastName')">Last name is required.</small>
      </div>
      <div class="field">
        <label>Date of Birth <span class="required">*</span></label>
        <p-datepicker formControlName="dateOfBirth" [showIcon]="true" dateFormat="dd/mm/yy" [maxDate]="today"></p-datepicker>
        <small class="error" *ngIf="isInvalid('dateOfBirth')">Date of birth is required.</small>
      </div>
      <div class="field">
        <label>Gender <span class="required">*</span></label>
        <p-select formControlName="gender" [options]="genderOptions" optionLabel="label" optionValue="value" placeholder="Select gender"></p-select>
        <small class="error" *ngIf="isInvalid('gender')">Gender is required.</small>
      </div>
      <div class="field">
        <label>Nationality</label>
        <input pInputText formControlName="nationality" placeholder="e.g. US" />
      </div>
      <div class="field">
        <label>National ID</label>
        <input pInputText formControlName="nationalId" placeholder="National ID number" />
      </div>
      <div class="field">
        <label>Blood Type</label>
        <p-select formControlName="bloodType" [options]="bloodTypeOptions" placeholder="Select blood type"></p-select>
      </div>
    </div>
  </p-card>

  <p-card header="Contact Information" styleClass="mb-3">
    <div class="form-grid">
      <div class="field">
        <label>Phone <span class="required">*</span></label>
        <input pInputText formControlName="phone" placeholder="+1 555-0000" />
        <small class="error" *ngIf="isInvalid('phone')">Phone is required.</small>
      </div>
      <div class="field">
        <label>Email</label>
        <input pInputText formControlName="email" placeholder="email@example.com" type="email" />
        <small class="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Enter a valid email.</small>
      </div>
      <div class="field col-span-2">
        <label>Address</label>
        <input pInputText formControlName="address" placeholder="Full address" />
      </div>
    </div>
  </p-card>

  <p-card header="Emergency Contact" styleClass="mb-3">
    <div class="form-grid">
      <div class="field">
        <label>Contact Name</label>
        <input pInputText formControlName="emergencyContactName" placeholder="Full name" />
      </div>
      <div class="field">
        <label>Contact Phone</label>
        <input pInputText formControlName="emergencyContactPhone" placeholder="+1 555-0000" />
      </div>
    </div>
  </p-card>

  <p-card header="Insurance" styleClass="mb-3">
    <div class="form-grid">
      <div class="field">
        <label>Insurance Provider</label>
        <input pInputText formControlName="insuranceProvider" placeholder="Provider name" />
      </div>
      <div class="field">
        <label>Insurance Number</label>
        <input pInputText formControlName="insuranceNumber" placeholder="Policy/member number" />
      </div>
    </div>
  </p-card>

  <p-card header="Medical Information" styleClass="mb-3">
    <div class="form-grid">
      <div class="field col-span-2">
        <label>Allergies</label>
        <p-autocomplete formControlName="allergies" [multiple]="true" placeholder="Type and press Enter"></p-autocomplete>
      </div>
      <div class="field col-span-2">
        <label>Chronic Diseases</label>
        <p-autocomplete formControlName="chronicDiseases" [multiple]="true" placeholder="Type and press Enter"></p-autocomplete>
      </div>
      <div class="field col-span-2">
        <label>Fixed Medications</label>
        <p-autocomplete formControlName="fixedMedications" [multiple]="true" placeholder="Type and press Enter"></p-autocomplete>
      </div>
      <div class="field col-span-2">
        <label>Notes</label>
        <textarea pTextarea formControlName="notes" rows="3" placeholder="Additional notes..." style="width:100%"></textarea>
      </div>
    </div>
  </p-card>

  <div class="form-actions">
    <p-button label="Cancel" icon="pi pi-times" severity="secondary" type="button" routerLink="/patients"></p-button>
    <p-button [label]="isEdit ? 'Update Patient' : 'Save Patient'" icon="pi pi-check" type="submit"
      [disabled]="form.invalid || saving" [loading]="saving"></p-button>
  </div>
</form>
""")

w(p + r"\patient-form.component.css", """\
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field input, .field p-select, .field p-datepicker { width: 100%; }
.col-span-2 { grid-column: span 2; }
.required { color: #e53935; }
.error { color: #e53935; font-size: 0.8rem; }
.mb-3 { margin-bottom: 1rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 0; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .col-span-2 { grid-column: span 1; } }
""")

w(p + r"\patient-form.component.ts", """\
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
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, CardModule, InputTextModule,
    SelectModule, DatePickerModule, TextareaModule, ButtonModule, AutoCompleteModule,
    DividerModule, PageHeaderComponent
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
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
""")
print("patient-form DONE")

# ──────────────────────────────────────────────
# PATIENT PROFILE
# ──────────────────────────────────────────────
p = BASE + r"\features\patients\pages\patient-profile"
w(p + r"\patient-profile.component.html", """\
<app-page-header [title]="patient?.fullName || 'Patient Profile'">
  <p-button label="Back" icon="pi pi-arrow-left" severity="secondary" routerLink="/patients" size="small"></p-button>
  <p-button label="Edit" icon="pi pi-pencil" [routerLink]="['/patients', patient?.id, 'edit']" size="small" styleClass="ml-2"></p-button>
</app-page-header>

@if (loading) {
  <div class="loading-state">Loading patient profile...</div>
}

@if (!loading && patient) {
  <p-card styleClass="mb-3">
    <div class="profile-header">
      <div class="avatar-placeholder">
        <i class="pi pi-user"></i>
      </div>
      <div class="profile-info">
        <h2 class="patient-name">{{ patient.fullName }}</h2>
        <div class="profile-meta">
          <span class="meta-item"><i class="pi pi-id-card"></i> {{ patient.mrn }}</span>
          <span class="meta-item"><i class="pi pi-calendar"></i> {{ patient.dateOfBirth | date:'dd MMM yyyy' }}</span>
          <span class="meta-item"><i class="pi pi-user"></i> {{ patient.gender }}</span>
          <span class="meta-item"><i class="pi pi-phone"></i> {{ patient.phone }}</span>
        </div>
        <div class="profile-badges">
          <app-status-tag [status]="patient.status"></app-status-tag>
          @if (patient.bloodType) {
            <span class="blood-badge">{{ patient.bloodType }}</span>
          }
          @if (patient.insuranceProvider) {
            <span class="insurance-badge"><i class="pi pi-shield"></i> {{ patient.insuranceProvider }}</span>
          }
        </div>
      </div>
    </div>
  </p-card>

  <p-tabs value="0">
    <p-tabpanel header="Overview" value="0">
      <div class="detail-grid">
        <p-card header="Contact Information">
          <div class="detail-list">
            <div class="detail-row"><span class="label">Phone</span><span>{{ patient.phone }}</span></div>
            <div class="detail-row"><span class="label">Email</span><span>{{ patient.email || 'N/A' }}</span></div>
            <div class="detail-row"><span class="label">Address</span><span>{{ patient.address || 'N/A' }}</span></div>
            <div class="detail-row"><span class="label">Nationality</span><span>{{ patient.nationality || 'N/A' }}</span></div>
            <div class="detail-row"><span class="label">National ID</span><span>{{ patient.nationalId || 'N/A' }}</span></div>
          </div>
        </p-card>
        <p-card header="Emergency Contact">
          <div class="detail-list">
            <div class="detail-row"><span class="label">Name</span><span>{{ patient.emergencyContactName || 'N/A' }}</span></div>
            <div class="detail-row"><span class="label">Phone</span><span>{{ patient.emergencyContactPhone || 'N/A' }}</span></div>
          </div>
        </p-card>
        <p-card header="Insurance">
          <div class="detail-list">
            <div class="detail-row"><span class="label">Provider</span><span>{{ patient.insuranceProvider || 'Self-pay' }}</span></div>
            <div class="detail-row"><span class="label">Number</span><span>{{ patient.insuranceNumber || 'N/A' }}</span></div>
          </div>
        </p-card>
      </div>
    </p-tabpanel>

    <p-tabpanel header="Medical History" value="1">
      <div class="detail-grid">
        <p-card header="Allergies">
          @if (patient.allergies.length) {
            <div class="chip-list">
              @for (a of patient.allergies; track a) {
                <span class="chip chip-danger">{{ a }}</span>
              }
            </div>
          } @else {
            <p class="text-muted">No known allergies.</p>
          }
        </p-card>
        <p-card header="Chronic Diseases">
          @if (patient.chronicDiseases.length) {
            <div class="chip-list">
              @for (d of patient.chronicDiseases; track d) {
                <span class="chip chip-warning">{{ d }}</span>
              }
            </div>
          } @else {
            <p class="text-muted">No chronic diseases.</p>
          }
        </p-card>
        <p-card header="Fixed Medications">
          @if (patient.fixedMedications.length) {
            <div class="chip-list">
              @for (m of patient.fixedMedications; track m) {
                <span class="chip chip-info">{{ m }}</span>
              }
            </div>
          } @else {
            <p class="text-muted">No fixed medications.</p>
          }
        </p-card>
        @if (patient.notes) {
          <p-card header="Notes">
            <p>{{ patient.notes }}</p>
          </p-card>
        }
      </div>
    </p-tabpanel>

    <p-tabpanel header="Activity" value="2">
      <div class="detail-list">
        <div class="detail-row"><span class="label">Created At</span><span>{{ patient.createdAt | date:'dd MMM yyyy HH:mm' }}</span></div>
        <div class="detail-row"><span class="label">Last Updated</span><span>{{ patient.updatedAt | date:'dd MMM yyyy HH:mm' }}</span></div>
        <div class="detail-row"><span class="label">Created By</span><span>{{ patient.createdBy }}</span></div>
      </div>
    </p-tabpanel>
  </p-tabs>
}

@if (!loading && !patient) {
  <div class="empty-state">
    <i class="pi pi-user-minus"></i>
    <p>Patient not found.</p>
    <p-button label="Back to Patients" routerLink="/patients"></p-button>
  </div>
}
""")

w(p + r"\patient-profile.component.css", """\
.loading-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.mb-3 { margin-bottom: 1rem; }
.ml-2 { margin-left: 0.5rem; }
.profile-header { display: flex; align-items: center; gap: 1.5rem; }
.avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: var(--p-primary-100); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--p-primary-color); flex-shrink: 0; }
.patient-name { margin: 0 0 0.5rem 0; font-size: 1.4rem; }
.profile-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.875rem; color: var(--p-text-muted-color); }
.meta-item { display: flex; align-items: center; gap: 0.3rem; }
.profile-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.blood-badge { background: #FFEBEE; color: #C62828; padding: 2px 10px; border-radius: 12px; font-weight: 700; font-size: 0.8rem; }
.insurance-badge { background: var(--p-surface-100); color: var(--p-text-color); padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.detail-list { display: flex; flex-direction: column; gap: 0.75rem; }
.detail-row { display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--p-surface-100); }
.label { font-weight: 600; color: var(--p-text-muted-color); font-size: 0.875rem; }
.chip-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip { padding: 3px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
.chip-danger { background: #FFEBEE; color: #C62828; }
.chip-warning { background: #FFF3E0; color: #E65100; }
.chip-info { background: #E3F2FD; color: #1565C0; }
.text-muted { color: var(--p-text-muted-color); font-size: 0.875rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state i { font-size: 3rem; }
.empty-state p { margin: 0.5rem 0; }
""")

w(p + r"\patient-profile.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule, RouterModule, CardModule, TabsModule, TagModule,
    ButtonModule, BadgeModule, DividerModule, PageHeaderComponent, StatusTagComponent
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | null = null;
  loading = true;

  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatientById(id).subscribe(p => {
      this.patient = p || null;
      this.loading = false;
    });
  }
}
""")
print("patient-profile DONE")
