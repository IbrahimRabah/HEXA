import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/rooms-list/rooms-list.component').then(m => m.RoomsListComponent) }
];
