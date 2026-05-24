import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
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
  styleUrl: './invoice-list.component.css'
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
      this.toastService.showSuccess('Paid', `Invoice ${inv.invoiceNumber} marked as paid.`);
    });
  }
}
