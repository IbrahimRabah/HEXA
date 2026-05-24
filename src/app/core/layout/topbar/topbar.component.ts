import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

const ROLE_COLORS: Record<string, string> = {
  Admin:           '#2563eb',
  Reception:       '#7c3aed',
  Nurse:           '#db2777',
  Doctor:          '#0d9488',
  'Lab Technician':'#d97706',
  Pharmacist:      '#16a34a',
  Accountant:      '#dc2626',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('userMenu') userMenu!: Menu;

  private authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  readonly userMenuItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
    { separator: true },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      styleClass: 'danger-item',
      command: () => this.authService.logout(),
    },
  ];

  getUserInitials(): string {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getRoleColor(): string {
    return ROLE_COLORS[this.currentUser()?.role ?? ''] ?? '#64748b';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }
}

