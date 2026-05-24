import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AuditService } from '../../services/audit.service';

const ACTION_SEVERITY: Record<string, string> = {
  CREATE: 'success', UPDATE: 'info', DELETE: 'danger', LOGIN: 'secondary', LOGOUT: 'secondary'
};

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, TranslatePipe, PageHeaderComponent],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;
  searchTerm = '';

  private auditService = inject(AuditService);

  ngOnInit() {
    this.loading = true;
    this.auditService.getLogs().subscribe(data => {
      this.all = data;
      this.filtered = data;
      this.loading = false;
    });
  }

  applyFilters() {
    const s = this.searchTerm.toLowerCase();
    this.filtered = !s ? this.all : this.all.filter(l =>
      l.userName?.toLowerCase().includes(s) || l.action?.toLowerCase().includes(s) ||
      l.module?.toLowerCase().includes(s) || l.description?.toLowerCase().includes(s)
    );
  }

  getActionSeverity(action: string) { return (ACTION_SEVERITY[action] || 'secondary') as any; }
}
