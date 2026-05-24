import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
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
  styleUrl: './lab-list.component.css'
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
