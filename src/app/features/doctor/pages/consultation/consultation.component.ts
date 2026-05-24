import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { DoctorService } from '../../services/doctor.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Visit } from '../../../../shared/models/visit.model';
import { VisitStatus } from '../../../../shared/enums/status.enums';

const ROUTE_OPTIONS = [
  { label: 'Oral', value: 'Oral' },
  { label: 'IV', value: 'IV' },
  { label: 'IM', value: 'IM' },
  { label: 'Topical', value: 'Topical' },
  { label: 'Inhaled', value: 'Inhaled' },
];

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TabsModule, CardModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css'
})
export class ConsultationComponent implements OnInit {
  visit: Visit | undefined;
  routeOptions = ROUTE_OPTIONS;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private toastService = inject(ToastService);

  form: FormGroup = this.fb.group({
    chiefComplaint: [''],
    hpiNotes: [''],
    physicalExamNotes: [''],
    clinicalNotes: [''],
    labOrders: [''],
    radiologyOrders: [''],
    followUpNotes: [''],
    diagnoses: this.fb.array([]),
    prescriptions: this.fb.array([]),
  });

  get diagnosesArray() { return this.form.get('diagnoses') as FormArray; }
  get prescriptionsArray() { return this.form.get('prescriptions') as FormArray; }

  ngOnInit() {
    const id = this.route.snapshot.params['visitId'];
    this.doctorService.getVisitById(id).subscribe(v => {
      this.visit = v;
      if (v) {
        this.form.patchValue({
          chiefComplaint: v.chiefComplaint || '',
          hpiNotes: v.hpiNotes || '',
          physicalExamNotes: v.physicalExamNotes || '',
          clinicalNotes: v.clinicalNotes || '',
        });
      }
    });
  }

  addDiagnosis() {
    this.diagnosesArray.push(this.fb.group({ code: [''], description: [''], type: ['Primary'] }));
  }

  removeDiagnosis(i: number) { this.diagnosesArray.removeAt(i); }

  addRx() {
    this.prescriptionsArray.push(this.fb.group({ medicationName: [''], dosage: [''], frequency: [''], duration: [''], route: ['Oral'], instructions: [''] }));
  }

  removeRx(i: number) { this.prescriptionsArray.removeAt(i); }

  onSubmit(complete = false) {
    if (!this.visit) return;
    const v = this.form.value;
    const updates: Partial<Visit> = {
      chiefComplaint: v.chiefComplaint,
      hpiNotes: v.hpiNotes,
      physicalExamNotes: v.physicalExamNotes,
      clinicalNotes: v.clinicalNotes,
      status: complete ? VisitStatus.Completed : VisitStatus.InProgress,
    };
    this.doctorService.updateVisit(this.visit.id, updates).subscribe(() => {
      this.toastService.showSuccess('Saved', complete ? 'Consultation completed.' : 'Consultation notes saved.');
      if (complete) this.router.navigate(['/doctor']);
    });
  }

  cancel() { this.router.navigate(['/doctor']); }
}
