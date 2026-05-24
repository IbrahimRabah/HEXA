import { Routes } from '@angular/router';

export const BILLING_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent) }
];
