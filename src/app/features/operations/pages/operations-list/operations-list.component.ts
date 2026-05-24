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
import { OperationsService } from '../../services/operations.service';
import { ToastService } from '../../../../core/services/toast.service';
import { OperationStatus } from '../../../../shared/enums/status.enums';

@Component({
  selector: 'app-operations-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, IconFieldModule, InputIconModule, TagModule, PageHeaderComponent, StatusTagComponent],
  templateUrl: './operations-list.component.html',
  styleUrl: './operations-list.component.css'
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
      this.toastService.showInfo('Started', `Operation for ${op.patientName} is in progress.`);
    });
  }

  completeOp(op: any) {
    this.opsService.updateStatus(op.id, OperationStatus.Completed).subscribe(() => {
      op.status = OperationStatus.Completed;
      this.toastService.showSuccess('Completed', `Operation for ${op.patientName} completed.`);
    });
  }
}
