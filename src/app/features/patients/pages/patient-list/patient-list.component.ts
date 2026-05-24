import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, TooltipModule,
    InputTextModule, SelectModule, TagModule, IconFieldModule, InputIconModule,
    ConfirmDialogModule, PageHeaderComponent, StatusTagComponent, TranslatePipe
  ],
  templateUrl: './patient-list.component.html',
  styles: [`
    .card { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: 8px; padding: 1rem; }
    .filters-bar { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .filters-bar input { width: 280px; }
    .mrn-badge { font-family: monospace; font-size: 0.8rem; background: var(--p-surface-100); padding: 2px 6px; border-radius: 4px; }
    .patient-name { font-weight: 600; }
    .patient-sub { font-size: 0.8rem; color: var(--p-text-muted-color); }
    .blood-type { font-weight: 600; color: #c62828; }
    .empty-state { text-align: center; padding: 3rem; color: var(--p-text-muted-color); }
    .empty-state p { margin-top: 0.5rem; }
  `]
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

