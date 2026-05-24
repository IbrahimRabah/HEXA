import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BILLING_MOCK } from '../../../mock-data/billing.mock';
import { InvoiceStatus } from '../../../shared/enums/status.enums';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private invoices = [...BILLING_MOCK];

  getInvoices(): Observable<any[]> { return of(this.invoices); }

  updateStatus(id: string, status: InvoiceStatus): Observable<any> {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) inv.status = status;
    return of(inv);
  }
}
