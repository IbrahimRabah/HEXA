import { MenuItem } from 'primeng/api';

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  { label: 'Patients', icon: 'pi pi-users', routerLink: '/patients' },
  { label: 'Appointments', icon: 'pi pi-calendar', routerLink: '/appointments' },
  { label: 'Reception', icon: 'pi pi-desktop', routerLink: '/reception' },
  { label: 'Nursing', icon: 'pi pi-heart', routerLink: '/nursing' },
  { label: 'Doctor', icon: 'pi pi-user', routerLink: '/doctor' },
  { label: 'Laboratory', icon: 'pi pi-filter', routerLink: '/laboratory' },
  { label: 'Radiology', icon: 'pi pi-camera', routerLink: '/radiology' },
  { label: 'Pharmacy', icon: 'pi pi-shop', routerLink: '/pharmacy' },
  { label: 'Billing', icon: 'pi pi-dollar', routerLink: '/billing' },
  { label: 'Operations', icon: 'pi pi-cog', routerLink: '/operations' },
  { label: 'Admissions', icon: 'pi pi-id-card', routerLink: '/admissions' },
  { label: 'Rooms', icon: 'pi pi-box', routerLink: '/rooms' },
  { label: 'Housekeeping', icon: 'pi pi-trash', routerLink: '/housekeeping' },
  { label: 'Ophthalmology', icon: 'pi pi-eye', routerLink: '/ophthalmology' },
  { label: 'Dental', icon: 'pi pi-face-smile', routerLink: '/dental' },
  { label: 'Audit', icon: 'pi pi-check-square', routerLink: '/audit' },
  { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/reports' },
  { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
  { label: 'User Management', icon: 'pi pi-users', routerLink: '/user-management' }
];
