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
import { RadiologyRequestFormComponent } from '../radiology-request-form/radiology-request-form.component';
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
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, StatusTagComponent, RadiologyRequestFormComponent],
  templateUrl: './radiology-list.component.html',
  styleUrl: './radiology-list.component.css'
})
export class RadiologyListComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';
  selectedPriority: string | null = null;
  priorityOptions = PRIORITY_OPTIONS;
  showRadForm = false;

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

  onRadSaved(req: any) {
    this.all.unshift(req);
    this.applyFilters();
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
