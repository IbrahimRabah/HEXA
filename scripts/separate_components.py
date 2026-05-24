"""
Script to separate all Angular components into HTML, CSS, and TS files.
Run with: python scripts/separate_components.py
"""
import os, re

BASE = r"d:\HEXA\Hexa\src\app"

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  wrote: {os.path.relpath(path, BASE)}")

def rewrite_ts(path, imports_block, decorator_meta, class_body):
    """Write clean TS file with templateUrl/styleUrls"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(imports_block + '\n\n' + decorator_meta + '\n' + class_body)
    print(f"  TS:    {os.path.relpath(path, BASE)}")

# ─────────────────────────────────────────────────────────────
# PATIENT LIST
# ─────────────────────────────────────────────────────────────
write(BASE + r"\features\patients\pages\patient-list\patient-list.component.html", """\
<app-page-header title="Patients">
  <p-button label="New Patient" icon="pi pi-plus" routerLink="new"></p-button>
</app-page-header>

<div class="card">
  <div class="filters-bar">
    <p-iconfield>
      <p-inputicon styleClass="pi pi-search"></p-inputicon>
      <input pInputText [(ngModel)]="searchTerm" placeholder="Search by name, MRN, phone..." (input)="applyFilter()" />
    </p-iconfield>
    <p-select [options]="statusOptions" [(ngModel)]="statusFilter" placeholder="All Statuses"
      (onChange)="applyFilter()" [showClear]="true" optionLabel="label" optionValue="value"></p-select>
  </div>

  <p-table [value]="filteredPatients" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]"
    [tableStyle]="{'min-width': '100%'}" [loading]="loading" dataKey="id">
    <ng-template #header>
      <tr>
        <th pSortableColumn="mrn" style="width:100px">MRN <p-sortIcon field="mrn"></p-sortIcon></th>
        <th pSortableColumn="fullName">Name <p-sortIcon field="fullName"></p-sortIcon></th>
        <th>Gender</th>
        <th>Phone</th>
        <th>Blood Type</th>
        <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
        <th style="width:130px">Actions</th>
      </tr>
    </ng-template>
    <ng-template #body let-patient>
      <tr>
        <td><span class="mrn-badge">{{ patient.mrn }}</span></td>
        <td>
          <div class="patient-name">{{ patient.fullName }}</div>
          <div class="patient-sub">{{ patient.email }}</div>
        </td>
        <td>{{ patient.gender }}</td>
        <td>{{ patient.phone }}</td>
        <td><span class="blood-type">{{ patient.bloodType }}</span></td>
        <td><app-status-tag [status]="patient.status"></app-status-tag></td>
        <td>
          <p-button icon="pi pi-eye" [text]="true" [rounded]="true" severity="info" size="small"
            (onClick)="viewPatient(patient)" pTooltip="View Profile"></p-button>
          <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" severity="secondary" size="small"
            (onClick)="editPatient(patient)" pTooltip="Edit"></p-button>
          <p-button icon="pi pi-trash" [text]="true" [rounded]="true" severity="danger" size="small"
            (onClick)="confirmDelete(patient)" pTooltip="Delete"></p-button>
        </td>
      </tr>
    </ng-template>
    <ng-template #emptymessage>
      <tr>
        <td colspan="7" class="empty-state">
          <i class="pi pi-users" style="font-size:2rem;color:var(--p-text-muted-color)"></i>
          <p>No patients found.</p>
        </td>
      </tr>
    </ng-template>
  </p-table>
</div>
""")

write(BASE + r"\features\patients\pages\patient-list\patient-list.component.css", """\
.card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
.filters-bar { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.filters-bar input { width: 280px; }
.mrn-badge { font-family: monospace; font-size: 0.8rem; background: var(--p-surface-100); padding: 2px 6px; border-radius: 4px; }
.patient-name { font-weight: 600; }
.patient-sub { font-size: 0.8rem; color: var(--p-text-muted-color); }
.blood-type { font-weight: 600; color: #c62828; }
.empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
.empty-state p { margin-top: 0.5rem; }
""")

write(BASE + r"\features\patients\pages\patient-list\patient-list.component.ts", """\
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusTagComponent } from '../../../../shared/components/status-tag/status-tag.component';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, TooltipModule,
    InputTextModule, SelectModule, TagModule, IconFieldModule, InputIconModule,
    ConfirmDialogModule, PageHeaderComponent, StatusTagComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  private router = inject(Router);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.loading = true;
    this.patientService.getPatients().subscribe(data => {
      this.patients = data;
      this.filteredPatients = data;
      this.loading = false;
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(p => {
      const matchesSearch = !term || p.fullName.toLowerCase().includes(term)
        || p.mrn.toLowerCase().includes(term) || p.phone.includes(term);
      const matchesStatus = !this.statusFilter || p.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  viewPatient(patient: Patient) {
    this.router.navigate(['/patients', patient.id]);
  }

  editPatient(patient: Patient) {
    this.router.navigate(['/patients', patient.id, 'edit']);
  }

  confirmDelete(patient: Patient) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete patient <strong>${patient.fullName}</strong>?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      accept: () => {
        this.patientService.deletePatient(patient.id).subscribe(() => {
          this.patients = this.patients.filter(p => p.id !== patient.id);
          this.applyFilter();
          this.toastService.showSuccess('Deleted', 'Patient removed successfully.');
        });
      }
    });
  }
}
""")

print("patient-list DONE")
