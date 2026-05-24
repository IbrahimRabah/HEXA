import { Routes } from '@angular/router';

export const RECEPTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reception-queue/reception-queue.component').then(m => m.ReceptionQueueComponent)
  }
];

