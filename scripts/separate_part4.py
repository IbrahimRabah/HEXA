"""Doctor queue, consultation, lab, radiology, pharmacy, billing, ops, admissions."""
import os

BASE = r"d:\HEXA\Hexa\src\app"

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {os.path.relpath(path, BASE)}")

SUMMARY_CSS = """\
.summary-bar { display: flex; gap: 1rem; margin-bottom: 1rem; }
.summary-item { flex: 1; background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; text-align: center; }
.count { display: block; font-size: 2rem; font-weight: 700; }
.label { font-size: 0.8rem; color: var(--p-text-muted-color); }
.text-orange { color: #E65100; }
.text-blue { color: #1565C0; }
.text-green { color: #2E7D32; }
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
"""

SIMPLE_CSS = """\
.filters-bar { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
"""

# ──────────────────────────────────────────────
# DOCTOR QUEUE
# ──────────────────────────────────────────────
p = BASE + r"\features\doctor\pages\doctor-queue"
w(p + r"\doctor-queue.component.html", """\
<app-page-header title="Doctor Consultation Queue">
  <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" (onClick)="load()"></p-button>
</app-page-header>

<div class="summary-bar">
  <div class="summary-item"><span class="count">{{ queue.length }}</span><span class="label">Total Today</span></div>
  <div class="summary-item"><span class="count text-orange">{{ waitingCount }}</span><span class="label">Waiting</span></div>
  <div class="summary-item"><span class="count text-blue">{{ inProgressCount }}</span><span class="label">In Consultation</span></div>
  <div class="summary-item"><span class="count text-green">{{ completedCount }}</span><span class="label">Completed</span></div>
</div>

<div class="card">
  <p-table [value]="queue" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th>Token</th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName"></p-sortIcon></th>
        <th pSortableColumn="visitDate">Time <p-sortIcon field="visitDate"></p-sortIcon></th>
        <th>Chief Complaint</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:150px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-v>
      <tr>
        <td><strong>{{ v.queueToken || '—' }}</strong></td>
        <td><strong>{{ v.patientName }}</strong></td>
        <td>{{ v.doctorName }}</td>
        <td>{{ v.visitDate | date:'HH:mm' }}</td>
        <td>{{ v.chiefComplaint || 'Not specified' }}</td>
        <td><app-status-tag [status]="v.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-stethoscope" [text]="true" [rounded]="true" severity="primary" size="small"
            pTooltip="Open Consultation" (onClick)="openConsultation(v)"></p-button>
          <p-button icon="pi pi-check" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Mark Complete" (onClick)="markComplete(v)" [disabled]="v.status === 'Completed'"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr>
        <td colspan="7" class="empty-state">
          <i class="pi pi-inbox" style="font-size:2rem"></i>
          <p>No patients in the consultation queue.</p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\doctor-queue.component.css", SUMMARY_CSS)

w(p + r"\doctor-queue.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { DoctorService } from '../../services/doctor.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Visit } from '../../../../shared/models/visit.model';
import { VisitStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-doctor-queue',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TableModule, ButtonModule, TooltipModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './doctor-queue.component.html',
  styleUrls: ['./doctor-queue.component.css']
})
export class DoctorQueueComponent implements OnInit {
  queue: Visit[] = [];
  loading = false;

  get waitingCount() { return this.queue.filter(v => v.status === VisitStatus.ReadyForDoctor).length; }
  get inProgressCount() { return this.queue.filter(v => v.status === VisitStatus.InProgress).length; }
  get completedCount() { return this.queue.filter(v => v.status === VisitStatus.Completed).length; }

  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.doctorService.getDoctorQueue().subscribe(data => {
      this.queue = data;
      this.loading = false;
    });
  }

  openConsultation(v: Visit) {
    this.router.navigate(['/doctor/consultation', v.id]);
  }

  markComplete(v: Visit) {
    this.doctorService.updateStatus(v.id, VisitStatus.Completed).subscribe(() => {
      v.status = VisitStatus.Completed;
      this.toastService.showSuccess('Completed', 'Consultation for ' + v.patientName + ' marked as complete.');
    });
  }
}
""")
print("doctor-queue DONE")

# ──────────────────────────────────────────────
# CONSULTATION
# ──────────────────────────────────────────────
p = BASE + r"\features\doctor\pages\consultation"
w(p + r"\consultation.component.html", """\
<app-page-header [title]="visit ? 'Consultation — ' + visit.patientName : 'Consultation'">
  <p-button label="Back" icon="pi pi-arrow-left" severity="secondary" (onClick)="cancel()"></p-button>
</app-page-header>

@if (visit) {
  <div class="patient-banner">
    <div class="info-row">
      <span class="label">Patient:</span><strong>{{ visit.patientName }}</strong>
      <span class="label">Visit #:</span><span>{{ visit.visitNumber }}</span>
      <span class="label">Token:</span><span>{{ visit.queueToken || '—' }}</span>
      <span class="label">Doctor:</span><span>{{ visit.doctorName }}</span>
      <span class="label">Status:</span><app-status-tag [status]="visit.status"></app-status-tag>
    </div>
  </div>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <p-tabs value="0">
      <p-tablist>
        <p-tab value="0">Presenting Complaint</p-tab>
        <p-tab value="1">Physical Exam</p-tab>
        <p-tab value="2">Diagnosis</p-tab>
        <p-tab value="3">Prescription</p-tab>
        <p-tab value="4">Orders</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="0">
          <div class="tab-content">
            <div class="form-field">
              <label>Chief Complaint</label>
              <textarea pTextarea formControlName="chiefComplaint" rows="3" placeholder="Patient's main complaint..."></textarea>
            </div>
            <div class="form-field">
              <label>History of Present Illness (HPI)</label>
              <textarea pTextarea formControlName="hpiNotes" rows="5" placeholder="Detailed history..."></textarea>
            </div>
          </div>
        </p-tabpanel>
        <p-tabpanel value="1">
          <div class="tab-content">
            <div class="form-field">
              <label>Physical Examination Notes</label>
              <textarea pTextarea formControlName="physicalExamNotes" rows="8" placeholder="Document physical exam findings..."></textarea>
            </div>
          </div>
        </p-tabpanel>
        <p-tabpanel value="2">
          <div class="tab-content">
            <div formArrayName="diagnoses">
              @for (diag of diagnosesArray.controls; track $index) {
                <div [formGroupName]="$index" class="array-row">
                  <input pInputText formControlName="code" placeholder="ICD Code (e.g. J06.9)" />
                  <input pInputText formControlName="description" placeholder="Description" class="flex-grow" />
                  <p-select formControlName="type" [options]="[{label:'Primary',value:'Primary'},{label:'Secondary',value:'Secondary'}]" optionLabel="label" optionValue="value"></p-select>
                  <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="removeDiagnosis($index)"></p-button>
                </div>
              }
            </div>
            <p-button label="Add Diagnosis" icon="pi pi-plus" severity="secondary" size="small" (onClick)="addDiagnosis()"></p-button>
            <div class="form-field" style="margin-top:1rem">
              <label>Clinical Notes</label>
              <textarea pTextarea formControlName="clinicalNotes" rows="4" placeholder="Additional clinical notes..."></textarea>
            </div>
          </div>
        </p-tabpanel>
        <p-tabpanel value="3">
          <div class="tab-content">
            <div formArrayName="prescriptions">
              @for (rx of prescriptionsArray.controls; track $index) {
                <div [formGroupName]="$index" class="rx-row">
                  <div class="rx-grid">
                    <input pInputText formControlName="medicationName" placeholder="Medication name" />
                    <input pInputText formControlName="dosage" placeholder="Dosage (e.g. 500mg)" />
                    <input pInputText formControlName="frequency" placeholder="Frequency (e.g. TID)" />
                    <input pInputText formControlName="duration" placeholder="Duration (e.g. 7 days)" />
                    <p-select formControlName="route" [options]="routeOptions" optionLabel="label" optionValue="value" placeholder="Route"></p-select>
                    <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="removeRx($index)"></p-button>
                  </div>
                  <input pInputText formControlName="instructions" placeholder="Special instructions (optional)" class="full-width" />
                </div>
              }
            </div>
            <p-button label="Add Medication" icon="pi pi-plus" severity="secondary" size="small" (onClick)="addRx()"></p-button>
          </div>
        </p-tabpanel>
        <p-tabpanel value="4">
          <div class="tab-content">
            <div class="form-field">
              <label>Lab Orders</label>
              <textarea pTextarea formControlName="labOrders" rows="3" placeholder="e.g. CBC, BMP, HbA1c..."></textarea>
            </div>
            <div class="form-field">
              <label>Radiology Orders</label>
              <textarea pTextarea formControlName="radiologyOrders" rows="3" placeholder="e.g. Chest X-Ray PA, CT Head without contrast..."></textarea>
            </div>
            <div class="form-field">
              <label>Follow-up Instructions</label>
              <textarea pTextarea formControlName="followUpNotes" rows="3" placeholder="Follow-up plan, referrals..."></textarea>
            </div>
          </div>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>

    <div class="form-actions">
      <p-button label="Cancel" severity="secondary" (onClick)="cancel()"></p-button>
      <p-button label="Save &amp; Keep Open" icon="pi pi-save" severity="info" type="button" (onClick)="onSubmit(false)"></p-button>
      <p-button label="Save &amp; Complete" icon="pi pi-check" type="button" (onClick)="onSubmit(true)"></p-button>
    </div>
  </form>
} @else {
  <div class="empty-state">
    <i class="pi pi-exclamation-circle" style="font-size:2rem"></i>
    <p>Visit not found.</p>
  </div>
}
""")

w(p + r"\consultation.component.css", """\
.patient-banner { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 1rem; }
.info-row { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
.info-row .label { color: var(--p-text-muted-color); font-size: 0.85rem; }
.tab-content { padding: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem; }
.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
label { font-size: 0.85rem; font-weight: 500; color: var(--p-text-muted-color); }
textarea, input { width: 100%; }
.array-row { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem; }
.rx-row { background: var(--p-surface-50); border: 1px solid var(--p-content-border-color); border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.rx-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto; gap: 0.5rem; align-items: center; }
.full-width { width: 100%; }
.flex-grow { flex: 1; }
.form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1.5rem 0; }
.empty-state { text-align: center; padding: 4rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
""")

w(p + r"\consultation.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
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
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TabsModule, CardModule, TextareaModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
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
""")
print("consultation DONE")

# ──────────────────────────────────────────────
# LAB LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\laboratory\pages\lab-list"
w(p + r"\lab-list.component.html", """\
<app-page-header title="Laboratory Requests">
  <p-button label="New Request" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Lab request form coming soon.')"></p-button>
</app-page-header>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search patient, test..." (input)="applyFilters()" />
  </p-iconfield>
  <p-select [(ngModel)]="selectedPriority" [options]="priorityOptions" optionLabel="label" optionValue="value" placeholder="Priority" (onChange)="applyFilters()"></p-select>
  <p-select [(ngModel)]="selectedStatus" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Status" (onChange)="applyFilters()"></p-select>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="requestDate">Date <p-sortIcon field="requestDate"></p-sortIcon></th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName"></p-sortIcon></th>
        <th pSortableColumn="testName">Test <p-sortIcon field="testName"></p-sortIcon></th>
        <th>Code</th>
        <th pSortableColumn="priority">Priority <p-sortIcon field="priority"></p-sortIcon></th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:120px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-r>
      <tr>
        <td>{{ r.requestDate | date:'dd MMM HH:mm' }}</td>
        <td><strong>{{ r.patientName }}</strong></td>
        <td>{{ r.doctorName }}</td>
        <td>{{ r.testName }}</td>
        <td><code>{{ r.testCode }}</code></td>
        <td>
          <p-tag [value]="r.priority" [severity]="r.priority === 'STAT' ? 'danger' : r.priority === 'Urgent' ? 'warn' : 'info'"></p-tag>
        </td>
        <td><app-status-tag [status]="r.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-check-circle" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Mark Result Ready" (onClick)="markReady(r)"></p-button>
          <p-button icon="pi pi-eye" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="View Results" (onClick)="toastService.showInfo('Info', 'Results view coming soon.')"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No lab requests found.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\lab-list.component.css", SIMPLE_CSS)

w(p + r"\lab-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { LabService } from '../../services/lab.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LabRequestStatus } from '../../../../shared/enums/status.enums';

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: null },
  { label: 'STAT', value: 'STAT' },
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Routine', value: 'Routine' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: null },
  ...Object.values(LabRequestStatus).map(s => ({ label: s, value: s })),
];

@Component({
  selector: 'app-lab-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  selectedPriority: string | null = null;
  selectedStatus: string | null = null;
  priorityOptions = PRIORITY_OPTIONS;
  statusOptions = STATUS_OPTIONS;

  private labService = inject(LabService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.labService.getLabRequests().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    this.filtered = this.all.filter(r => {
      const s = this.searchTerm.toLowerCase();
      const matchSearch = !s || r.patientName?.toLowerCase().includes(s) || r.testName?.toLowerCase().includes(s) || r.testCode?.toLowerCase().includes(s);
      const matchPriority = !this.selectedPriority || r.priority === this.selectedPriority;
      const matchStatus = !this.selectedStatus || r.status === this.selectedStatus;
      return matchSearch && matchPriority && matchStatus;
    });
  }

  markReady(r: any) {
    this.labService.updateStatus(r.id, LabRequestStatus.ResultReady).subscribe(() => {
      r.status = LabRequestStatus.ResultReady;
      this.toastService.showSuccess('Updated', 'Lab result marked as ready.');
    });
  }
}
""")
print("lab-list DONE")

# ──────────────────────────────────────────────
# RADIOLOGY LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\radiology\pages\radiology-list"
w(p + r"\radiology-list.component.html", """\
<app-page-header title="Radiology Requests">
  <p-button label="New Request" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Radiology request form coming soon.')"></p-button>
</app-page-header>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search patient, imaging type..." (input)="applyFilters()" />
  </p-iconfield>
  <p-select [(ngModel)]="selectedPriority" [options]="priorityOptions" optionLabel="label" optionValue="value" placeholder="Priority" (onChange)="applyFilters()"></p-select>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="requestDate">Date <p-sortIcon field="requestDate"></p-sortIcon></th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName"></p-sortIcon></th>
        <th pSortableColumn="imagingType">Imaging Type <p-sortIcon field="imagingType"></p-sortIcon></th>
        <th pSortableColumn="bodyPart">Body Part <p-sortIcon field="bodyPart"></p-sortIcon></th>
        <th pSortableColumn="priority">Priority <p-sortIcon field="priority"></p-sortIcon></th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:120px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-r>
      <tr>
        <td>{{ r.requestDate | date:'dd MMM HH:mm' }}</td>
        <td><strong>{{ r.patientName }}</strong></td>
        <td>{{ r.doctorName }}</td>
        <td>{{ r.imagingType }}</td>
        <td>{{ r.bodyPart }}</td>
        <td>
          <p-tag [value]="r.priority" [severity]="r.priority === 'STAT' ? 'danger' : r.priority === 'Urgent' ? 'warn' : 'info'"></p-tag>
        </td>
        <td><app-status-tag [status]="r.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-image" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="Mark Imaging In Progress" (onClick)="markImaging(r)"></p-button>
          <p-button icon="pi pi-check-circle" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Mark Result Ready" (onClick)="markReady(r)"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No radiology requests found.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\radiology-list.component.css", SIMPLE_CSS)

w(p + r"\radiology-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { RadiologyService } from '../../services/radiology.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RadiologyRequestStatus } from '../../../../shared/enums/status.enums';

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: null },
  { label: 'STAT', value: 'STAT' },
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Routine', value: 'Routine' },
];

@Component({
  selector: 'app-radiology-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './radiology-list.component.html',
  styleUrls: ['./radiology-list.component.css']
})
export class RadiologyListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  selectedPriority: string | null = null;
  priorityOptions = PRIORITY_OPTIONS;

  private radiologyService = inject(RadiologyService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.radiologyService.getRadiologyRequests().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    this.filtered = this.all.filter(r => {
      const s = this.searchTerm.toLowerCase();
      const matchSearch = !s || r.patientName?.toLowerCase().includes(s) || r.imagingType?.toLowerCase().includes(s) || r.bodyPart?.toLowerCase().includes(s);
      const matchPriority = !this.selectedPriority || r.priority === this.selectedPriority;
      return matchSearch && matchPriority;
    });
  }

  markImaging(r: any) {
    this.radiologyService.updateStatus(r.id, RadiologyRequestStatus.Imaging).subscribe(() => {
      r.status = RadiologyRequestStatus.Imaging;
      this.toastService.showInfo('Updated', 'Imaging in progress.');
    });
  }

  markReady(r: any) {
    this.radiologyService.updateStatus(r.id, RadiologyRequestStatus.ResultReady).subscribe(() => {
      r.status = RadiologyRequestStatus.ResultReady;
      this.toastService.showSuccess('Updated', 'Result marked as ready.');
    });
  }
}
""")
print("radiology-list DONE")

# ──────────────────────────────────────────────
# PHARMACY LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\pharmacy\pages\pharmacy-list"
w(p + r"\pharmacy-list.component.html", """\
<app-page-header title="Pharmacy — Medication Inventory">
  <p-button label="Add Medication" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Medication form coming soon.')"></p-button>
</app-page-header>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search medications..." (input)="applyFilters()" />
  </p-iconfield>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="name">Medication <p-sortIcon field="name"></p-sortIcon></th>
        <th pSortableColumn="genericName">Generic Name <p-sortIcon field="genericName"></p-sortIcon></th>
        <th pSortableColumn="category">Category <p-sortIcon field="category"></p-sortIcon></th>
        <th pSortableColumn="form">Form <p-sortIcon field="form"></p-sortIcon></th>
        <th pSortableColumn="strength">Strength <p-sortIcon field="strength"></p-sortIcon></th>
        <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
        <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
        <th style="width:100px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-m>
      <tr>
        <td><strong>{{ m.name }}</strong></td>
        <td>{{ m.genericName }}</td>
        <td>{{ m.category }}</td>
        <td>{{ m.form }}</td>
        <td>{{ m.strength }}</td>
        <td>
          <p-tag [value]="m.stock + ' units'"
            [severity]="m.stock < 100 ? 'danger' : m.stock < 500 ? 'warn' : 'success'"></p-tag>
        </td>
        <td>{{ m.price | currency }}</td>
        <td>
          <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="Edit" (onClick)="toastService.showInfo('Info', 'Edit coming soon.')"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No medications found.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\pharmacy-list.component.css", SIMPLE_CSS)

w(p + r"\pharmacy-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PharmacyService } from '../../services/pharmacy.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-pharmacy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent],
  templateUrl: './pharmacy-list.component.html',
  styleUrls: ['./pharmacy-list.component.css']
})
export class PharmacyListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';

  private pharmacyService = inject(PharmacyService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.pharmacyService.getMedications().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(m =>
      m.name?.toLowerCase().includes(s) || m.genericName?.toLowerCase().includes(s) || m.category?.toLowerCase().includes(s)
    );
  }
}
""")
print("pharmacy-list DONE")

# ──────────────────────────────────────────────
# INVOICE LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\billing\pages\invoice-list"
w(p + r"\invoice-list.component.html", """\
<app-page-header title="Billing &amp; Invoices">
  <p-button label="New Invoice" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Invoice form coming soon.')"></p-button>
</app-page-header>

<div class="summary-bar">
  <div class="summary-item"><span class="count">{{ total.length }}</span><span class="label">Total Invoices</span></div>
  <div class="summary-item"><span class="count text-green">{{ paidCount }}</span><span class="label">Paid</span></div>
  <div class="summary-item"><span class="count text-orange">{{ pendingCount }}</span><span class="label">Pending</span></div>
  <div class="summary-item"><span class="count text-blue">{{ totalRevenue | currency }}</span><span class="label">Total Revenue</span></div>
</div>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search patient, invoice #..." (input)="applyFilters()" />
  </p-iconfield>
  <p-select [(ngModel)]="selectedStatus" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Status" (onChange)="applyFilters()"></p-select>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="invoiceNumber">Invoice # <p-sortIcon field="invoiceNumber"></p-sortIcon></th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="total">Total <p-sortIcon field="total"></p-sortIcon></th>
        <th pSortableColumn="paidAmount">Paid <p-sortIcon field="paidAmount"></p-sortIcon></th>
        <th pSortableColumn="balanceDue">Balance <p-sortIcon field="balanceDue"></p-sortIcon></th>
        <th pSortableColumn="dueDate">Due Date <p-sortIcon field="dueDate"></p-sortIcon></th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:120px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-inv>
      <tr>
        <td><strong>{{ inv.invoiceNumber }}</strong></td>
        <td>{{ inv.patientName }}</td>
        <td>{{ inv.total | currency }}</td>
        <td>{{ inv.paidAmount | currency }}</td>
        <td [style.color]="inv.balanceDue > 0 ? '#E53935' : 'inherit'">{{ inv.balanceDue | currency }}</td>
        <td>{{ inv.dueDate | date:'dd MMM yyyy' }}</td>
        <td><app-status-tag [status]="inv.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-dollar" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Record Payment" (onClick)="markPaid(inv)" [disabled]="inv.status === 'Paid'"></p-button>
          <p-button icon="pi pi-eye" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="View Invoice" (onClick)="toastService.showInfo('Info', 'Invoice view coming soon.')"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No invoices found.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\invoice-list.component.css", """\
.summary-bar { display: flex; gap: 1rem; margin-bottom: 1rem; }
.summary-item { flex: 1; background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; text-align: center; }
.count { display: block; font-size: 1.5rem; font-weight: 700; }
.label { font-size: 0.8rem; color: var(--p-text-muted-color); }
.text-green { color: #2E7D32; }
.text-orange { color: #E65100; }
.text-blue { color: #1565C0; }
.filters-bar { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
""")

w(p + r"\invoice-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { BillingService } from '../../services/billing.service';
import { ToastService } from '../../../../core/services/toast.service';
import { InvoiceStatus } from '../../../../shared/enums/status.enums';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: null },
  ...Object.values(InvoiceStatus).map(s => ({ label: s, value: s })),
];

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  total: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus: string | null = null;
  statusOptions = STATUS_OPTIONS;

  get paidCount() { return this.total.filter(i => i.status === InvoiceStatus.Paid).length; }
  get pendingCount() { return this.total.filter(i => i.status !== InvoiceStatus.Paid && i.status !== InvoiceStatus.Cancelled).length; }
  get totalRevenue() { return this.total.reduce((sum, i) => sum + (i.paidAmount || 0), 0); }

  private billingService = inject(BillingService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.billingService.getInvoices().subscribe(data => {
      this.total = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    this.filtered = this.total.filter(i => {
      const s = this.searchTerm.toLowerCase();
      const matchSearch = !s || i.patientName?.toLowerCase().includes(s) || i.invoiceNumber?.toLowerCase().includes(s);
      const matchStatus = !this.selectedStatus || i.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  markPaid(inv: any) {
    this.billingService.updateStatus(inv.id, InvoiceStatus.Paid).subscribe(() => {
      inv.status = InvoiceStatus.Paid;
      inv.paidAmount = inv.total;
      inv.balanceDue = 0;
      this.toastService.showSuccess('Paid', 'Invoice ' + inv.invoiceNumber + ' marked as paid.');
    });
  }
}
""")
print("invoice-list DONE")

# ──────────────────────────────────────────────
# OPERATIONS LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\operations\pages\operations-list"
w(p + r"\operations-list.component.html", """\
<app-page-header title="Surgical Operations">
  <p-button label="Schedule Operation" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Operation form coming soon.')"></p-button>
</app-page-header>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search patient, procedure..." (input)="applyFilters()" />
  </p-iconfield>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="scheduledDate">Date <p-sortIcon field="scheduledDate"></p-sortIcon></th>
        <th>Time</th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="procedureName">Procedure <p-sortIcon field="procedureName"></p-sortIcon></th>
        <th pSortableColumn="surgeonName">Surgeon <p-sortIcon field="surgeonName"></p-sortIcon></th>
        <th>OR</th>
        <th>Duration</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:120px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-op>
      <tr>
        <td>{{ op.scheduledDate | date:'dd MMM yyyy' }}</td>
        <td>{{ op.scheduledTime }}</td>
        <td><strong>{{ op.patientName }}</strong></td>
        <td>{{ op.procedureName }}</td>
        <td>{{ op.surgeonName }}</td>
        <td>{{ op.operationRoomName }}</td>
        <td>{{ op.estimatedDuration }} min</td>
        <td><app-status-tag [status]="op.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-play" [text]="true" [rounded]="true" severity="success" size="small"
            pTooltip="Start Operation" (onClick)="startOp(op)" [disabled]="op.status !== 'Scheduled'"></p-button>
          <p-button icon="pi pi-check" [text]="true" [rounded]="true" severity="info" size="small"
            pTooltip="Mark Complete" (onClick)="completeOp(op)" [disabled]="op.status !== 'InProgress'"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No operations scheduled.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\operations-list.component.css", SIMPLE_CSS)

w(p + r"\operations-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { OperationsService } from '../../services/operations.service';
import { ToastService } from '../../../../core/services/toast.service';
import { OperationStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-operations-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './operations-list.component.html',
  styleUrls: ['./operations-list.component.css']
})
export class OperationsListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';

  private opsService = inject(OperationsService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.opsService.getOperations().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(op =>
      op.patientName?.toLowerCase().includes(s) || op.procedureName?.toLowerCase().includes(s)
    );
  }

  startOp(op: any) {
    this.opsService.updateStatus(op.id, OperationStatus.InProgress).subscribe(() => {
      op.status = OperationStatus.InProgress;
      this.toastService.showInfo('Started', 'Operation for ' + op.patientName + ' is in progress.');
    });
  }

  completeOp(op: any) {
    this.opsService.updateStatus(op.id, OperationStatus.Completed).subscribe(() => {
      op.status = OperationStatus.Completed;
      this.toastService.showSuccess('Completed', 'Operation for ' + op.patientName + ' completed.');
    });
  }
}
""")
print("operations-list DONE")

# ──────────────────────────────────────────────
# ADMISSION LIST
# ──────────────────────────────────────────────
p = BASE + r"\features\admissions\pages\admission-list"
w(p + r"\admission-list.component.html", """\
<app-page-header title="Admissions">
  <p-button label="New Admission" icon="pi pi-plus" (onClick)="toastService.showInfo('Info', 'Admission form coming soon.')"></p-button>
</app-page-header>

<div class="filters-bar">
  <p-iconfield>
    <p-inputicon styleClass="pi pi-search"></p-inputicon>
    <input pInputText [(ngModel)]="searchTerm" placeholder="Search patient, room..." (input)="applyFilters()" />
  </p-iconfield>
</div>

<div class="card">
  <p-table [value]="filtered" [loading]="loading" [paginator]="true" [rows]="15" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="admissionNumber">Admission # <p-sortIcon field="admissionNumber"></p-sortIcon></th>
        <th pSortableColumn="patientName">Patient <p-sortIcon field="patientName"></p-sortIcon></th>
        <th pSortableColumn="admittingDoctorName">Doctor <p-sortIcon field="admittingDoctorName"></p-sortIcon></th>
        <th>Room</th>
        <th pSortableColumn="admissionDate">Admitted <p-sortIcon field="admissionDate"></p-sortIcon></th>
        <th pSortableColumn="expectedDischarge">Expected Discharge <p-sortIcon field="expectedDischarge"></p-sortIcon></th>
        <th>Diagnosis</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th>Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-a>
      <tr>
        <td><strong>{{ a.admissionNumber }}</strong></td>
        <td>{{ a.patientName }}</td>
        <td>{{ a.admittingDoctorName }}</td>
        <td>{{ a.roomNumber }} — {{ a.wardName }}</td>
        <td>{{ a.admissionDate | date:'dd MMM yyyy' }}</td>
        <td>{{ a.expectedDischarge | date:'dd MMM yyyy' }}</td>
        <td>{{ a.diagnosis }}</td>
        <td><app-status-tag [status]="a.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-sign-out" [text]="true" [rounded]="true" severity="warn" size="small"
            pTooltip="Discharge" (onClick)="toastService.showInfo('Info', 'Discharge form coming soon.')"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--p-text-muted-color)">No admissions found.</td></tr>
    </ng-template>
  </p-table>
</div>
""")

w(p + r"\admission-list.component.css", SIMPLE_CSS)

w(p + r"\admission-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { AdmissionService } from '../../services/admission.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, IconFieldModule, InputIconModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css']
})
export class AdmissionListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';

  private admissionService = inject(AdmissionService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.loading = true;
    this.admissionService.getAdmissions().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(a =>
      a.patientName?.toLowerCase().includes(s) || a.roomNumber?.toLowerCase().includes(s) || a.admissionNumber?.toLowerCase().includes(s)
    );
  }
}
""")
print("admission-list DONE")
